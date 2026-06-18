# mind-measure-docs -- project guide for Claude Code

This file is loaded automatically at the start of every session. Read the
"Context protocol" section below before doing anything else, every time.

See `../AGENTS.md` for the workspace index, repo map, hard constraints, and
recent work log. This file adds only the session-handover protocol and the
stack detail specific to this repo.

---

## Stack and structure

- Framework: Next.js 14, React 18, TypeScript. Documentation site at `docs.mindmeasure.co.uk`.
- Tests: none (run `tsc --noEmit`; build is the gate -- `npm run build`).
- Deploy: push to `main` -- Vercel auto-builds. Auth-gated via `middleware.ts` (platform handoff JWT).
- Key directories: `pages/` (MDX content -- architecture, security, legal, ops), `components/` (shared UI), `middleware.ts` (SSO auth), `scripts/generate-stack-facts.mjs` (anti-drift tripwire -- run via `npm run generate:stack-facts`).
- Do not touch without asking: `pages/security/sub-processors.mdx` (legal accuracy -- any sub-processor change needs deliberate review); `pages/legal/` (published policy text -- legal review required before editing); `middleware.ts` (SSO).

---

## Context protocol (read first, every session)

State and history live in three layers. Do not collapse them into one.

1. **Section docs / living docs** are the single source of truth for *current
   state*. They are updated in place. When the truth changes, change the doc.

2. **`session-logs/`** holds dated, append-only handovers. One short entry per
   session recording the *delta and the reasoning*: what changed, what was
   decided and why, what is still open. These are never edited after the fact.
   They are the narrative the living docs cannot hold.

3. **`STATE_OF_PLAY.md`** is the distilled entry point. It points into the
   section docs and the latest handover. It is the first thing to read to get current.

### At the start of a session

1. Read `STATE_OF_PLAY.md`.
2. Read the most recent one or two files in `session-logs/` (sort by filename;
   they are dated, so the latest sorts last).
3. Only then dive into specific section docs as the task requires.

### At the end of a session

When I signal the session is wrapping up (I will say "handover", "wrap up", or
similar), do two things:

1. **Write a new handover** to `session-logs/YYYY-MM-DD-topic.md` using today's
   date and a short topic slug, in the exact format below. Append-only: never
   overwrite an existing log.
2. **Update `STATE_OF_PLAY.md`** so it reflects the new current state and points
   to the handover you just wrote.

The discipline that keeps this useful: the handover records the *delta and the
why*, and points to the section docs rather than repeating them. The moment a
handover restates the docs it becomes noise and a second source of truth that
will drift. Keep it short.

---

## Handover format

Write each `session-logs/YYYY-MM-DD-topic.md` file exactly like this:

```markdown
# 2026-06-18 -- <short topic>

## What changed
- <bullet per meaningful change; point to the section doc, do not restate it>

## Decisions and why
- <decision> -- because <reasoning>. Alternative considered: <if any>.

## Open threads
- <anything left unresolved or deliberately parked>

## Next session should
- <concrete first action for whoever picks this up next>
```

Keep it to what would otherwise evaporate by morning: the reasoning in your
head at the end of the session, not a re-description of the system.

---

## STATE_OF_PLAY maintenance

`STATE_OF_PLAY.md` stays short. Each session, update:

- the one-paragraph "where things stand now" summary,
- the "active workstreams" list,
- the pointer to the latest handover.

It is a map, not a record. The record lives in `session-logs/`.
