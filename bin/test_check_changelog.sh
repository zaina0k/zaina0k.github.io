#!/usr/bin/env bash
#
# Tests bin/check_changelog.sh against a throwaway repository.
# Run from anywhere: bin/test_check_changelog.sh
#
# Each case builds a branch off main in a scratch repo and asserts the checker's
# exit code. Cases include the ones a lazy checker gets wrong: a whitespace-only
# edit, and an entry that already existed on main.
set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
CHECK="$HERE/check_changelog.sh"
SCRATCH="$(mktemp -d "${TMPDIR:-/tmp}/check-changelog.XXXXXX")"
pass=0; fail=0

ok()   { pass=$((pass+1)); printf '  ok   %s\n' "$1"; }
bad()  { fail=$((fail+1)); printf '  FAIL %s (wanted exit %s, got %s)\n' "$1" "$2" "$3"; }
expect() { # name wanted-exit command...
    local name="$1" want="$2"; shift 2
    "$@" >/dev/null 2>&1; local got=$?
    [ "$got" = "$want" ] && ok "$name" || bad "$name" "$want" "$got"
}

cd "$SCRATCH" || exit 1
git init -q -b main
git config user.email test@example.invalid
git config user.name test
mkdir docs
printf '# Changelog\n\n## [Unreleased]\n\n- Existing entry already on main\n' > docs/CHANGELOG.md
git add . && git commit -qm base

# 1. code change, changelog untouched -> refuse
git switch -qc no-entry main
echo x > a.txt && git add a.txt && git commit -qm "code only"
expect "refuses a branch that does not touch the changelog" 1 "$CHECK" --base main --incoming no-entry

# 2. whitespace-only edit -> refuse
git switch -qc whitespace main
printf '\n  \n' >> docs/CHANGELOG.md && git commit -qam "whitespace"
expect "refuses a whitespace-only changelog edit" 1 "$CHECK" --base main --incoming whitespace

# 3. KNOWN LIMIT, pinned on purpose: rewording an existing entry adds a "- " line, so it counts.
#    The checker cannot judge prose; the test records that rather than pretending otherwise.
git switch -qc reflow main
sed -i.bak 's/Existing entry already on main/Existing entry already on main, reworded/' docs/CHANGELOG.md
rm -f docs/CHANGELOG.md.bak
git commit -qam "reword"
expect "known limit: a reworded entry counts as an entry" 0 "$CHECK" --base main --incoming reflow

# 4. genuine new entry -> allow
git switch -qc with-entry main
printf -- '- Added a new thing\n' >> docs/CHANGELOG.md && git commit -qam "entry"
expect "allows a branch that adds an entry" 0 "$CHECK" --base main --incoming with-entry

# 5. escape hatch
expect "SKIP_CHANGELOG_CHECK=1 lets a no-entry branch through" 0 env SKIP_CHANGELOG_CHECK=1 "$CHECK" --base main --incoming no-entry

# 6. bad usage
expect "unknown option is exit 2" 2 "$CHECK" --nonsense

# 7. staged-merge mode (what the git hook uses): staged entry present / absent
git switch -q main
git switch -qc staged-no main
expect "staged mode refuses when nothing is staged" 1 "$CHECK"
printf -- '- Staged entry\n' >> docs/CHANGELOG.md && git add docs/CHANGELOG.md
expect "staged mode allows a staged entry" 0 "$CHECK"

printf '\n%s passed, %s failed\n' "$pass" "$fail"
cd / && rm -rf "$SCRATCH"
[ "$fail" = 0 ]
