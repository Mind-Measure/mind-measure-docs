---
name: cursor-dev-handoff
description: Create clean development handoff briefs for Mind Measure sessions. Covers what changed, current state, deployment status, and next steps. Use when ending a development session or handing off work.
---

## Canonical platform context

Point the next session at the **[Platform handbook](https://docs.mindmeasure.co.uk/architecture/platform-handbook)** if platform facts or constraints changed.

**Before handing off, update the shared brain so the next agent is not ignorant of this work:**
- Commit with a clear conventional-commit message (`feat:`/`fix:` + scope). Commits are the signal of record: they feed `mm-recent.sh`, the session-start hook, the Ops "Recently shipped" board, and the weekly docs run. Lowest-friction, always do it.
- Move the relevant **Ops board card to Done** with any docs-worthy detail / spec link in its notes. That is the intent layer the weekly docs run (Monday 02:00) reads alongside commits to open a docs PR.
- Add a 1-3 line entry to the **Recent work log** in `AGENTS.md` at the workspace root (newest first).
- If a repo, domain, feature status, or roadmap item changed, update the handbook repo map, `.cursor/rules/mind-measure-platform.mdc`, and `.cursor/rules/current-goals.mdc` to match.
- The next session reads `AGENTS.md` and runs `./mm-recent.sh` (git ground truth) first, so an `AGENTS.md` entry plus committed code is the reliable handoff.

# Development Handoff Brief

## Purpose
Create a clean handoff describing what changed, the current state, and what comes next. Used between development sessions or when context-switching.

## Structure

### Required sections
1. **Goal**: one sentence on what the session set out to achieve
2. **Summary**: bullet list of what was done
3. **Files touched**: grouped by repo
4. **Deployment status**: what was pushed, what is still local
5. **How to test**: specific steps to verify the changes
6. **Open issues**: anything broken, incomplete, or needing follow-up
7. **Next steps**: checkboxes for remaining work

### Format rules
- Be explicit, avoid philosophy
- Use checkboxes for TODOs: `- [ ] Task description`
- Group files by repo name
- Note which repos were pushed and which have local-only changes
- Include git commit hashes where relevant

## Template

```markdown
# Handoff — [Date]

## Goal
[One sentence]

## Summary
- [Change 1]
- [Change 2]

## Files touched

### [repo-name]
- `path/to/file.tsx` — [what changed]

## Deployment status
| Repo | Status | Commit |
|------|--------|--------|
| repo-name | Pushed | abc1234 |

## How to test
1. [Step]
2. [Step]

## Open issues
- [Issue if any]

## Next steps
- [ ] [Task]
- [ ] [Task]
```

## References
- knowledge/architecture.md for repo map
- skills/mm-deploy for deployment workflow
