#!/usr/bin/env bash
#
# Sync the live workspace-coherence files into this version-controlled backup.
#
# These files are load-bearing for every agent session but live OUTSIDE any git
# repo (the workspace root and ~/.cursor are not repos). This folder is their
# only version history. Run this before committing so the backup matches what is
# actually live, then commit mind-measure-docs.
#
# Paths are derived from this script's location, so it works wherever the
# workspace is checked out. The ~/.cursor files are user-global (they apply to
# all of Keith's projects, not just Mind Measure) but the hook is
# Mind-Measure-specific in content, so we snapshot it here too.
#
#   ./agent-workspace/sync.sh        # copy live -> backup
#   ./agent-workspace/sync.sh check  # report drift without copying (exit 1 if any)

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # .../mind-measure-docs/agent-workspace
WS="$(cd "$DIR/../.." && pwd)"                         # workspace root (parent of all repos)
CURSOR="$HOME/.cursor"
MODE="${1:-copy}"

# src::dest pairs (dest is relative to this folder)
PAIRS=(
  "$WS/AGENTS.md::AGENTS.md"
  "$WS/mm-recent.sh::mm-recent.sh"
  "$WS/mind-measure.code-workspace::mind-measure.code-workspace"
  "$WS/.cursor/rules/session-start-protocol.mdc::cursor-rules/session-start-protocol.mdc"
  "$WS/.cursor/rules/mind-measure-platform.mdc::cursor-rules/mind-measure-platform.mdc"
  "$WS/.cursor/rules/current-goals.mdc::cursor-rules/current-goals.mdc"
  "$CURSOR/hooks.json::cursor-user/hooks.json"
  "$CURSOR/hooks/mm-session-context.sh::cursor-user/hooks/mm-session-context.sh"
  "$CURSOR/skills/cursor-dev-handoff/SKILL.md::cursor-user/skills/cursor-dev-handoff/SKILL.md"
)

drift=0
for pair in "${PAIRS[@]}"; do
  src="${pair%%::*}"
  dest="$DIR/${pair##*::}"
  if [ ! -f "$src" ]; then
    echo "MISS (live file gone): $src"
    drift=1
    continue
  fi
  if [ "$MODE" = "check" ]; then
    if [ ! -f "$dest" ] || ! cmp -s "$src" "$dest"; then
      echo "DRIFT: ${pair##*::}"
      drift=1
    fi
  else
    mkdir -p "$(dirname "$dest")"
    cp -p "$src" "$dest"
    echo "synced: ${pair##*::}"
  fi
done

if [ "$MODE" = "check" ]; then
  [ "$drift" -eq 0 ] && echo "in sync" || echo "drift detected (run ./agent-workspace/sync.sh to fix)"
  exit "$drift"
fi
echo "done. review with: git -C \"$DIR/..\" status"
