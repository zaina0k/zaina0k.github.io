#!/usr/bin/env bash
#
# Does a merge into main carry a changelog entry?
#
# The one implementation of that question. Both guards call it - the git
# pre-merge-commit hook (any merge, any terminal) and the Claude Code
# PreToolUse guard (a merge Claude is about to run) - so there is no second
# copy of "what counts as an entry" to drift.
#
# What it checks: the incoming side adds at least one entry line (a line that
# starts with "- ") to docs/CHANGELOG.md, compared with the merge base. That is
# weaker than "the entry is any good" (no script can judge prose) and stronger
# than "the file changed", which a whitespace edit would satisfy.
#
# Usage:
#   bin/check_changelog.sh --incoming dev            incoming ref vs its merge base with HEAD
#   bin/check_changelog.sh --base main --incoming dev
#   bin/check_changelog.sh                           staged merge (index) vs HEAD, for the git hook
#   SKIP_CHANGELOG_CHECK=1 bin/check_changelog.sh    allow, and say so out loud
#
# Exit 0 = an entry is present (or deliberately skipped). Exit 1 = it is not.
# Exit 2 = bad usage.
set -uo pipefail

CHANGELOG="docs/CHANGELOG.md"
BASE="HEAD"
INCOMING=""

while [ $# -gt 0 ]; do
    case "$1" in
        --base)     BASE="${2:-HEAD}"; shift 2 ;;
        --incoming) INCOMING="${2:-}"; shift 2 ;;
        --help|-h)  sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *)          echo "check_changelog: unknown option '$1'" >&2; exit 2 ;;
    esac
done

if [ "${SKIP_CHANGELOG_CHECK:-}" = "1" ]; then
    echo "check_changelog: SKIP_CHANGELOG_CHECK=1 - merging with no changelog entry, on purpose."
    exit 0
fi

# Lines added to the changelog that look like entries. Context-free diff so only
# additions are seen; "+++" is the file header, not an addition.
if [ -n "$INCOMING" ]; then
    label="$INCOMING"
    added="$(git diff --unified=0 "$BASE"..."$INCOMING" -- "$CHANGELOG" 2>/dev/null)" || added=""
else
    # The staged merge: what the index holds versus HEAD.
    label="the staged merge"
    added="$(git diff --cached --unified=0 "$BASE" -- "$CHANGELOG" 2>/dev/null)" || added=""
fi

count="$(printf '%s\n' "$added" | grep -c '^+- ' || true)"

if [ "${count:-0}" -gt 0 ]; then
    echo "check_changelog: $count new changelog entr$([ "$count" = 1 ] && echo y || echo ies) in $label."
    exit 0
fi

cat >&2 <<MSG

  ------------------------------------------------------------------------
  No changelog entry for this merge into main.

  $CHANGELOG gained no new "- " entry line on $label
  compared with $BASE. A merge into main deploys the public site, so the
  change is written down first.

  To fix: on the branch being merged, add an entry under [Unreleased]
  (the changelog-entry skill does this), commit it there, then merge again.

  If this merge genuinely changes nothing a visitor would notice:

      SKIP_CHANGELOG_CHECK=1 <your merge command>
  ------------------------------------------------------------------------

MSG
exit 1
