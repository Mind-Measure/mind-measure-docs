#!/usr/bin/env bash
#
# mm-recent — ground-truth cross-repo activity for the Mind Measure workspace.
#
# Prints every git repo under the workspace root with its last-commit date and
# recent commit subjects. This is the "what is actually happening" view that an
# agent reads at session start, BEFORE trusting any hand-written repo map. Git
# cannot drift, so this catches work that the docs/rules have not caught up with.
#
# Usage:
#   ./mm-recent.sh            # last 5 commits per repo, sorted newest-active first
#   ./mm-recent.sh 10         # last 10 commits per repo
#   ./mm-recent.sh 5 14       # last 5 commits, only repos touched in the last 14 days

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMITS="${1:-5}"
SINCE_DAYS="${2:-0}"   # 0 = no cutoff

# Collect "epoch<TAB>block" lines so we can sort by most-recently-active repo.
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

for dir in "$ROOT"/*/; do
  [ -d "${dir}.git" ] || continue
  name="$(basename "$dir")"

  last_epoch="$(git -C "$dir" log -1 --format='%ct' 2>/dev/null || echo 0)"
  [ "$last_epoch" = "0" ] && continue

  if [ "$SINCE_DAYS" -gt 0 ]; then
    cutoff=$(( $(date +%s) - SINCE_DAYS * 86400 ))
    [ "$last_epoch" -lt "$cutoff" ] && continue
  fi

  last_date="$(git -C "$dir" log -1 --format='%cs' 2>/dev/null)"
  branch="$(git -C "$dir" rev-parse --abbrev-ref HEAD 2>/dev/null)"
  dirty=""
  if [ -n "$(git -C "$dir" status --porcelain 2>/dev/null)" ]; then
    dirty="  [uncommitted changes]"
  fi

  {
    printf '### %s  (last commit %s, branch %s)%s\n' "$name" "$last_date" "$branch" "$dirty"
    git -C "$dir" log -n "$COMMITS" --format='    %cs  %s' 2>/dev/null
    printf '\n'
  } > "$tmp.block"

  printf '%s\t%s\n' "$last_epoch" "$(base64 < "$tmp.block" | tr -d '\n')" >> "$tmp"
done

echo "# Mind Measure — cross-repo recent activity (ground truth from git)"
echo "# Generated $(date '+%Y-%m-%d %H:%M %Z') · last ${COMMITS} commits/repo${SINCE_DAYS:+ · cutoff ${SINCE_DAYS}d}"
echo

# Sort by epoch descending (most recently active repo first), then decode blocks.
sort -t$'\t' -k1,1nr "$tmp" | while IFS=$'\t' read -r _epoch b64; do
  printf '%s' "$b64" | base64 --decode
done
