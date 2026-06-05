# Mind Measure workspace — agent index

**Read this first.** This is the canonical, low-friction index for the whole Mind Measure ecosystem. The deep architecture lives in the [Platform handbook](https://docs.mindmeasure.co.uk/architecture/platform-handbook) (`mind-measure-docs/pages/architecture/platform-handbook.mdx`); this file exists so an agent never starts a session ignorant of what exists or what shipped recently.

## Ground truth before trusting any map

Hand-written maps drift. The signal of record for "what shipped" is **git commits**, and the `sessionStart` hook injects them automatically so a session starts current:

```bash
"./mm-recent.sh"        # last 5 commits per repo, most-recently-active first
"./mm-recent.sh" 10 7   # last 10 commits, only repos touched in the last 7 days
```

This is the same commit signal that powers the Ops "Recently shipped" board (`business.mindmeasure.co.uk/board`). **Human intent and in-flight plans** live on that Ops planning board (Build Now / Blocked / Upcoming / Done cards, with notes and spec links), not in a separate file. If this index disagrees with `mm-recent.sh`, **git wins** — update this file.

> Keeping agents current relies only on commits (the hook). The weekly docs run (Monday 02:00) is a separate, human-facing job: it reads the week's commits and the Ops "Done" cards and opens a PR to keep docs.mindmeasure.co.uk coherent. Public-facing doc work (handbook rewrites, new sections) is done deliberately in-session, not left to the weekly run.

## Live repos (multi-root workspace)

Open via `mind-measure.code-workspace`. Eighteen active roots:

| Repo | Domain | Role |
|---|---|---|
| `mind-measure-core` | admin.mindmeasure.co.uk | University admin + all `/api/*` (incl. uni insight endpoints) |
| `mind-measure-mobile-final` | mobile.mindmeasure.app | Student native app |
| `mind-measure-university-hub` | hub.mindmeasure.co.uk | University content hub |
| `mind-measure-university-insight-hub` | insight.mindmeasure.co.uk | University Conversational Insight hub (shipped) |
| `mind-measure-university-site` | mindmeasure.co.uk | University marketing |
| `mind-measure-pro-core` | admin.mindmeasurepro.com | Company admin + `/api/companies/*` |
| `mind-measure-pro-mobile` | mobile.mindmeasurepro.app | Employee native app |
| `mind-measure-pro-hub` | hub.mindmeasurepro.com | Company content hub |
| `mind-measure-pro-insight-hub` | insight.mindmeasurepro.com | Pro Conversational Insight hub (shipped) |
| `mindmeasurepro` | mindmeasurepro.com | Corporate marketing |
| `mind-measure-marketing-cms` | marketing.mindmeasure.co.uk | Internal CMS, uploads |
| `mind-measure-docs` | docs.mindmeasure.co.uk | This documentation site |
| `mind-measure-student` | mindmeasure.app | Student marketing (current) |
| `mind-measure-ops` | business.mindmeasure.co.uk | Founder ops (private) |
| `mindmeasure-shared-types` | npm | `@mindmeasure/shared-types` |
| `mindmeasure-shared-services` | npm | `@mindmeasure/shared-services` |
| `mindmeasure-shared-ui` | npm | `@mindmeasure/shared-ui` |
| `mindmeasure-api-lib` | npm | `@mindmeasure/api-lib` |

**Excluded from the workspace** (dead/legacy/dupe, do not assume current): `_archive`, `mind-measure-student-site` (legacy Astro), `mind-measure-pro-employee` + `mindmeasure-pro-employee-main` (superseded), `mindmeasure-ai`, `mind-measure_investors_new`.

## Recent work log (newest first)

Append a 1-3 line entry here whenever a feature ships. This is the narrative companion to `mm-recent.sh` (which gives the raw commits).

- **2026-06 — Insight Hub (Conversational Insight) shipped on both lines.** Standalone Next.js hubs: Pro (`mind-measure-pro-insight-hub` → insight.mindmeasurepro.com) and University (`mind-measure-university-insight-hub` → insight.mindmeasure.co.uk). Thin UI proxies onto `/api/companies/*` (pro-core) and `/api/universities/*` (core). SSO handoff from admin, gated by `conversational_insight_enabled`, k-anonymity floor of five. Docs: `mind-measure-docs/pages/insight-hub/`.
- **2026-06 — Per-institution agent personalisation + memory.** Live session context injected into institutional Jodie prompts; custom check-in questions now replace an exchange rather than extend length; 4-6 default pacing (core + pro-core).
- **2026-06 — Pro: mental health advocates per office + structured EAP programmes** feeding Jodie's signposting knowledge (pro-core, documented in handbook-pro section 12).
- **2026-06 — Pro marketing site refresh.** New "The Platform" page and Conversational Insight marketing page (`mindmeasurepro`).
- **2026-06 — Workspace coherence tooling.** Multi-root `mind-measure.code-workspace`, this `AGENTS.md`, `mm-recent.sh`, and a session-start hook so agents see the whole ecosystem.

## Hard constraints (see handbook for full list)

1. Do not modify the ElevenLabs check-in/assessment pipeline without an approved plan.
2. No hardcoded DB credentials (`getSecureDbConfig()` / repo standard).
3. No partial commits: commit all related files in a repo together.
4. Deploy by pushing to `main` → Vercel auto-builds. Never `npx vercel --prod`.
5. British English; no em-dashes or en-dashes.

## When you finish work

Before ending a session where something shipped: add a Recent work log entry above, and update the relevant handbook section + repo map if a repo/domain/feature changed. Drift is the enemy.
