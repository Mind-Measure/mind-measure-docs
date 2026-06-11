#!/usr/bin/env node
/**
 * Generate pages/architecture/stack-facts.mdx from the actual code
 * constants across the workspace repos.
 *
 * Why this exists: the architecture docs repeatedly drifted from the code
 * (the AI model map being the worst offender). This script is the
 * single tripwire: each "fact" is pulled live from a named constant in a
 * named source file. If a constant is renamed or moved, the matching regex
 * misses and the script EXITS NON-ZERO with the offending fact, so the
 * drift surfaces loudly instead of silently rotting in prose.
 *
 * Usage (run from a full multi-root checkout, sibling repos present):
 *   node scripts/generate-stack-facts.mjs          # regenerate the page
 *   node scripts/generate-stack-facts.mjs --check   # fail if page is stale
 *
 * It reads sibling repos relative to this docs repo (../<repo>), so it only
 * works in a local/CI checkout that has the whole workspace, NOT in the
 * docs-only Vercel build. Re-run it whenever a stack constant changes.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(HERE, '..');
const WORKSPACE_ROOT = path.resolve(DOCS_ROOT, '..');
const OUT = path.join(DOCS_ROOT, 'pages', 'architecture', 'stack-facts.mdx');

/**
 * Each fact names a workspace-relative source file, a regex with one or
 * more capture groups, and how to render the captured value(s). `format`
 * receives the array of capture groups.
 */
const FACTS = [
  {
    section: 'AI models',
    label: 'Conversation model (Jodie voice agent default)',
    src: 'mind-measure-core/src/services/InstitutionalAgentService.ts',
    re: /DEFAULT_AGENT_LLM\s*=\s*['"]([^'"]+)['"]/,
    note: 'ElevenLabs agent LLM; default for newly created institutional agents',
  },
  {
    section: 'AI models',
    label: 'Check-in text analysis model (70% weight)',
    src: 'mind-measure-mobile-final/api/bedrock/analyze-text.ts',
    re: /MODEL_ID\s*=\s*['"]([^'"]+)['"]/,
    note: 'AWS Bedrock, called from the mobile app during a check-in',
  },
  {
    section: 'AI models',
    label: 'Back-office text model',
    src: 'mind-measure-core/api/_lib/bedrock-models.ts',
    re: /BEDROCK_TEXT_MODEL\s*=\s*['"]([^'"]+)['"]/,
    note: 'AI insights, weekly reflections, cohort insight, report narratives, SEO',
  },
  {
    section: 'AI models',
    label: 'Back-office text model label (DB metadata)',
    src: 'mind-measure-core/api/_lib/bedrock-models.ts',
    re: /BEDROCK_TEXT_MODEL_LABEL\s*=\s*['"]([^'"]+)['"]/,
    note: 'short label written to cost_tracking / provenance rows',
  },
  {
    section: 'AI models',
    label: 'Bedrock region',
    src: 'mind-measure-core/api/_lib/bedrock-models.ts',
    re: /BEDROCK_REGION\s*=\s*['"]([^'"]+)['"]/,
  },
  {
    section: 'Scoring',
    label: 'Check-in fusion weights (text / audio / visual)',
    src: 'mind-measure-mobile-final/src/services/multimodal/checkin/enrichmentService.ts',
    re: /text_score \* ([\d.]+) \+ audioScore! \* ([\d.]+) \+ visualScore! \* ([\d.]+)/,
    format: (g) => `${g[0]} / ${g[1]} / ${g[2]}`,
    note: 'all-modalities fusion; scored entirely client-side',
  },
  {
    section: 'Privacy',
    label: 'k-anonymity floor (cohort suppression)',
    src: 'mind-measure-core/api/_lib/audience.ts',
    re: /AUDIENCE_MIN_FLOOR\s*=\s*(\d+)/,
    note: 'cohorts smaller than this are reported as belowFloor, never an exact count',
  },
  {
    section: 'Database',
    label: 'TLS verification opt-in flag',
    src: 'mindmeasure-api-lib/src/db-config.ts',
    re: /process\.env\.(DB_SSL_VERIFY)\s*===/,
    note: 'set to 1 per project to enable rejectUnauthorized:true; DB_SSL_INSECURE=1 is the escape hatch',
  },
  {
    section: 'Database',
    label: 'Bundled RDS certificate authority',
    src: 'mindmeasure-api-lib/src/rds-ca.ts',
    re: /export const (RDS_CA_[A-Z0-9_]+)\s*=/,
    format: (g) => g[0].replace('RDS_CA_', '').toLowerCase().replace(/_/g, '-'),
    note: 'Amazon RDS regional root bundle inlined for serverless TLS verification',
  },
];

function extract(fact) {
  const abs = path.join(WORKSPACE_ROOT, fact.src);
  let source;
  try {
    source = readFileSync(abs, 'utf8');
  } catch {
    throw new Error(`stack-facts: source file not found for "${fact.label}": ${fact.src}`);
  }
  const m = fact.re.exec(source);
  if (!m) {
    throw new Error(
      `stack-facts: constant for "${fact.label}" no longer matches in ${fact.src} ` +
        `(pattern ${fact.re}). A constant was renamed or moved; update generate-stack-facts.mjs.`
    );
  }
  const groups = m.slice(1);
  const value = fact.format ? fact.format(groups) : groups[0];
  return { ...fact, value };
}

function render(rows) {
  const generatedAt = new Date().toISOString().slice(0, 10);
  const sections = [...new Set(rows.map((r) => r.section))];
  let body = '';
  for (const section of sections) {
    body += `\n## ${section}\n\n`;
    body += '| Fact | Value | Source | Notes |\n';
    body += '| --- | --- | --- | --- |\n';
    for (const r of rows.filter((x) => x.section === section)) {
      body += `| ${r.label} | \`${r.value}\` | \`${r.src}\` | ${r.note ?? ''} |\n`;
    }
  }

  return `import { Callout } from 'nextra/components'

# Stack facts

<Callout type="warning">
  **Generated file. Do not edit by hand.** Every value below is pulled live
  from a named constant in the codebase by \`scripts/generate-stack-facts.mjs\`.
  Re-run \`npm run generate:stack-facts\` after changing a stack constant; the
  script fails loudly if a constant is renamed or moved, which is the whole
  point: these are the facts other architecture pages must agree with.
</Callout>

Last generated: **${generatedAt}** (from workspace code constants).
${body}`;
}

const rows = FACTS.map(extract);
const output = render(rows);

const isCheck = process.argv.includes('--check');
if (isCheck) {
  let current = '';
  try {
    current = readFileSync(OUT, 'utf8');
  } catch {
    /* missing -> stale */
  }
  // Ignore the "Last generated" date line when comparing.
  const strip = (s) => s.replace(/Last generated: \*\*[\d-]+\*\*/, 'Last generated: **DATE**');
  if (strip(current) !== strip(output)) {
    console.error('stack-facts: pages/architecture/stack-facts.mdx is stale. Run: npm run generate:stack-facts');
    process.exit(1);
  }
  console.log('stack-facts: up to date.');
} else {
  writeFileSync(OUT, output);
  console.log(`stack-facts: wrote ${path.relative(DOCS_ROOT, OUT)} (${rows.length} facts).`);
}
