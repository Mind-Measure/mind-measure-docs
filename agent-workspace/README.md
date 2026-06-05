# Agent workspace tooling (version-controlled backup)

These files make every agent session in the Mind Measure workspace coherent and
current. They live **outside any git repo** in normal use: the workspace root
(`/Users/keithduddy/Desktop/Mind Measure local /`) and `~/.cursor/` are not
repositories. This folder is their **only version history and backup**.

It is not part of the docs site. Nextra builds from `pages/`, so nothing here is
published; it is purely a snapshot.

## What is backed up

| Backup path | Live location | Purpose |
|---|---|---|
| `AGENTS.md` | workspace root | Canonical agent index + recent-work log |
| `mm-recent.sh` | workspace root | Cross-repo git ground-truth script |
| `mind-measure.code-workspace` | workspace root | Multi-root workspace definition |
| `cursor-rules/session-start-protocol.mdc` | `<root>/.cursor/rules/` | Session-start protocol (ground truth + ship discipline) |
| `cursor-rules/mind-measure-platform.mdc` | `<root>/.cursor/rules/` | Platform map workspace rule |
| `cursor-rules/current-goals.mdc` | `<root>/.cursor/rules/` | Roadmap / current goals |
| `cursor-user/hooks.json` | `~/.cursor/` | Hook registration (sessionStart) |
| `cursor-user/hooks/mm-session-context.sh` | `~/.cursor/hooks/` | Injects cross-repo commit activity at session start |
| `cursor-user/skills/cursor-dev-handoff/SKILL.md` | `~/.cursor/skills/` | Dev handoff skill |

The `cursor-user/*` files are user-global (they apply to all of Keith's
projects), but the hook is Mind-Measure-specific in content, so it is snapshotted
here too.

## Keeping it from drifting

The live files are the source of truth; this folder is a copy, so it can drift.
Keep it honest:

```bash
./agent-workspace/sync.sh         # copy live -> backup, then commit mind-measure-docs
./agent-workspace/sync.sh check   # report drift (exit 1 if any), copies nothing
```

Run `sync.sh` whenever you change any of these files, then commit. Paths are
derived from the script's own location, so it works wherever the workspace is
checked out.

## Restoring after a loss

If a live file is lost, copy it back from here to the matching live location in
the table above (mirror, since `sync.sh` only copies live -> backup), then
restore the executable bit on the scripts:

```bash
chmod +x "<root>/mm-recent.sh" "~/.cursor/hooks/mm-session-context.sh"
```
