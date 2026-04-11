# Cursor rules (mirrored)

These files are **copies** of the always-applied Cursor rules from the Mind Measure workspace:

`.cursor/rules/` → same filenames as here.

## Why this folder exists

The local workspace folder is not a single git repository, so rules live here for **version history and sharing**. After you pull `mind-measure-docs`, copy (or symlink) these files into your workspace:

```bash
# Example: from the repo root, with workspace alongside
cp cursor-rules/*.mdc "../Mind Measure local /.cursor/rules/"
```

## Which file does what

| File | Role |
|------|------|
| `current-goals.mdc` | Roadmap, active streams, technical debt, **Reference** links including Platform handbook |
| `mind-measure-platform.mdc` | Repo map, constraints, deploy, Jodie IDs |
| `session-start-protocol.mdc` | Mandatory reading order before coding |

Edit the **workspace** `.cursor/rules/` copies when working; then copy back here before committing, or edit here and copy out.

## Canonical technical content

Product facts and constraints are maintained in the **[Platform handbook](https://docs.mindmeasure.co.uk/architecture/platform-handbook)** (`pages/architecture/platform-handbook.mdx`). If a rule disagrees with the handbook, update the handbook first, then align these files.
