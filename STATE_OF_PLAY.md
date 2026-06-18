# State of play -- mind-measure-docs

## Where things stand now

The documentation site (`docs.mindmeasure.co.uk`, Next.js 14, auth-gated) is live and substantially up to date following a major June 2026 reconciliation pass. Key additions: `pages/security/sub-processors.mdx` (legal source of truth for sub-processors), `pages/legal/` (privacy policies + terms, customer agreements), `pages/operations/sop-*.md` (three SOPs), platform-handbook rewritten with accurate 4-touchpoint AI model table, k-anonymity CI guard documented, `scripts/generate-stack-facts.mjs` anti-drift tripwire. Whisper legal row corrected to ElevenLabs in the sub-processors page; the legal privacy-policy copies (`/legal/privacy-policy*`) still carry a stale Whisper row -- flagged for deliberate legal review before editing.

## Active workstreams

- Legal review of `/legal/privacy-policy*` Whisper→ElevenLabs correction (human review required before editing published policy).
- Ongoing docs maintenance: update with each shipped feature per AGENTS.md convention.

## Latest handover

- `session-logs/2026-06-18-bootstrap.md` -- handover discipline established.

## Standing context

- User-facing copy and all writing is British English. No em-dashes.
- Solo project; no team review process.
