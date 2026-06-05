#!/usr/bin/env bash
#
# mm-session-context — Cursor sessionStart hook.
#
# When an agent session starts inside the Mind Measure workspace, inject a fresh,
# git-derived cross-repo activity summary into the agent's context. This makes
# "what shipped recently across all repos" impossible to miss, regardless of
# whether the hand-written docs/rules have caught up.
#
# User-level hook (~/.cursor/hooks.json). It self-guards on workspace_roots so it
# only fires for the Mind Measure workspace and stays silent everywhere else.
#
# Output contract (sessionStart): { "additional_context": "<string>" }

set -uo pipefail

WS="/Users/keithduddy/Desktop/Mind Measure local "
SCRIPT="${WS}/mm-recent.sh"

emit_empty() { printf '{}'; exit 0; }

input="$(cat 2>/dev/null || true)"

# Collect candidate paths: workspace_roots[], workspace_root, cwd, plus pwd.
roots="$(printf '%s' "$input" | jq -r '
  ([.workspace_roots // []] | flatten)[]?,
  (.workspace_root // empty),
  (.cwd // empty)
' 2>/dev/null || true)"

in_mm=0
while IFS= read -r r; do
  [ -z "$r" ] && continue
  case "$r" in
    "$WS"*) in_mm=1 ;;
  esac
done <<EOF
$roots
EOF

# Only fall back to cwd when NO workspace roots were provided at all. If roots
# were given and none are under the Mind Measure workspace, respect that and
# stay silent (do not let an incidental cwd override an explicit non-MM root).
if [ "$in_mm" -eq 0 ] && [ -z "$(printf '%s' "$roots" | tr -d '[:space:]')" ]; then
  case "$(pwd)" in
    "$WS"*) in_mm=1 ;;
  esac
fi

# Not the Mind Measure workspace, or the ground-truth script is missing: stay silent.
[ "$in_mm" -eq 0 ] && emit_empty
[ -x "$SCRIPT" ] || emit_empty

recent="$("$SCRIPT" 5 21 2>/dev/null || true)"
[ -z "$recent" ] && emit_empty

ctx="$(cat <<EOF
You are in the Mind Measure multi-root workspace. The canonical index is AGENTS.md
at the workspace root (${WS}); read it before trusting any repo map. Per the
session-start protocol, trust git over hand-written docs.

Below is the live cross-repo activity: the last 5 commits per repo for repos
touched in the last 21 days. This is the same commit signal that powers the Ops
"Recently shipped" board (business.mindmeasure.co.uk/board). Read it to know what
exists and what shipped recently before planning any work. Human intent and
in-flight plans live on the Ops planning board.

${recent}
EOF
)"

jq -n --arg c "$ctx" '{ additional_context: $c }'
exit 0
