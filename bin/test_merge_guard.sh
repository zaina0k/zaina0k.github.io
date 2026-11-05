#!/usr/bin/env bash
#
# Tests bin/claude_merge_guard.sh by feeding it tool-call payloads in a
# throwaway repository and asserting allow / deny.
#
# Usage:
#   bin/test_merge_guard.sh                  run the suite against bin/claude_merge_guard.sh
#   GUARD=/path/to/other.sh bin/test_merge_guard.sh
#   bin/test_merge_guard.sh --self-check     also prove the suite can fail: runs it against a
#                                            deliberately broken guard and requires failures
#
# Cases include the one the reference project's guard got wrong: a merge into
# dev issued in the same command as a commit whose message mentions main.
set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
GUARD="${GUARD:-$HERE/claude_merge_guard.sh}"

run_suite() {
    local guard="$1" pass=0 fail=0
    local scratch; scratch="$(mktemp -d "${TMPDIR:-/tmp}/merge-guard.XXXXXX")"

    (
        cd "$scratch" || exit 1
        git init -q -b main
        git config user.email test@example.invalid
        git config user.name test
        mkdir -p docs bin
        cp "$HERE/check_changelog.sh" bin/ && chmod +x bin/check_changelog.sh
        printf '# Changelog\n\n## [Unreleased]\n' > docs/CHANGELOG.md
        echo base > f && git add . && git commit -qm base
        git branch dev
        # dev + feature branch with NO entry
        git switch -qc cp/noentry dev && echo a >> f && git commit -qam noentry
        # a branch WITH an entry
        git switch -qc cp/entry dev && echo b >> f && printf -- '- Added a thing\n' >> docs/CHANGELOG.md && git commit -qam entry
        git switch -q dev
    ) >/dev/null 2>&1

    verdict() { # command, branch-to-be-on -> prints allow|deny
        local command="$1" branch="$2" out
        git -C "$scratch" switch -q "$branch" 2>/dev/null
        out="$(printf '%s' "$(python3 -c 'import json,sys; print(json.dumps({"tool_input":{"command":sys.argv[1]}}))' "$command")" \
              | (cd "$scratch" && CLAUDE_PROJECT_DIR="$scratch" "$guard") 2>/dev/null)"
        case "$out" in *'"deny"'*) echo deny ;; *) echo allow ;; esac
    }
    check() { # name, want, command, branch
        local got; got="$(verdict "$3" "$4")"
        if [ "$got" = "$2" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"
        else fail=$((fail+1)); printf '  FAIL %s  (wanted %s, got %s)\n' "$1" "$2" "$got"; fi
    }

    echo "-- merges into main"
    check "no-ff merge into main, no entry"                 deny  'git merge --no-ff cp/noentry'                       main
    check "no-ff merge into main, with entry"               allow 'git merge --no-ff cp/entry'                         main
    check "merge into main without --no-ff"                 deny  'git merge cp/entry'                                 main
    check "switch main then merge, no entry"                deny  'git switch main && git merge --no-ff cp/noentry'    dev
    check "checkout main then merge, no entry"              deny  'git checkout main && git merge --no-ff cp/noentry'  dev
    check "semicolon-separated switch main then merge"      deny  'git switch main; git merge --no-ff cp/noentry'      dev
    check "newline-separated switch main then merge"        deny  $'git switch main\ngit merge --no-ff cp/noentry'     dev
    check "git -C <repo> merge while on main"               deny  "git -C $scratch merge --no-ff cp/noentry"           main
    check "env-prefix escape SKIP_CHANGELOG_CHECK=1"        allow 'SKIP_CHANGELOG_CHECK=1 git merge --no-ff cp/noentry' main
    check "merge --abort on main"                           allow 'git merge --abort'                                  main
    check "unresolvable incoming ref fails open"            allow 'git merge --no-ff no-such-branch'                   main

    echo "-- merges that are NOT into main"
    check "plain no-ff merge into dev"                      allow 'git merge --no-ff cp/noentry'                       dev
    check "REFERENCE BUG: commit mentioning main, then merge into dev" \
                                                             allow 'git commit -m "docs: say git checkout main first" && git merge --no-ff cp/noentry' dev
    check "commit with 'git checkout main' in heredoc, merge dev" \
                                                             allow $'git commit -F - <<\'EOF\'\nnote: git checkout main\nEOF\ngit merge --no-ff cp/noentry' dev
    check "switch main then back to dev, then merge"        allow 'git switch main; git switch dev; git merge --no-ff cp/noentry' main
    check "checkout main -- file restores a file, still dev" allow 'git checkout main -- f && git merge --no-ff cp/noentry' dev
    check "heredoc body mentioning git merge, on main"      allow $'git commit -F - <<\'EOF\'\ngit merge --no-ff cp/noentry\nEOF' main
    check "echo of a merge command, on main"                allow 'echo "git merge cp/noentry"'                        main
    check "create-and-switch to a new branch, then merge"   allow 'git switch -c feat/x && git merge --no-ff cp/noentry' main

    echo "-- fail open"
    check "non-git command"                                 allow 'ls -la'                                             main
    check "unbalanced quote"                                allow 'git merge --no-ff "cp/noentry'                      main
    check "empty command"                                   allow ''                                                   main

    git -C "$scratch" switch -q dev 2>/dev/null
    rm -rf "$scratch"
    printf '\n  %s passed, %s failed\n' "$pass" "$fail"
    RESULT_FAIL=$fail
}

if [ "${1:-}" = "--self-check" ]; then
    echo "== real guard =="
    run_suite "$GUARD"; real_fail=$RESULT_FAIL
    # A broken guard: it matches the string "checkout main" anywhere in the command,
    # like the reference project's did, and denies on that alone.
    broken="$(mktemp "${TMPDIR:-/tmp}/broken-guard.XXXXXX")"
    cat > "$broken" <<'EOF'
#!/usr/bin/env bash
payload="$(cat)"
case "$payload" in
  *"git merge"*) case "$payload" in *"checkout main"*|*"switch main"*) echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny"}}' ;; esac ;;
esac
exit 0
EOF
    chmod +x "$broken"
    echo; echo "== deliberately broken guard (must FAIL) =="
    run_suite "$broken"; broken_fail=$RESULT_FAIL
    rm -f "$broken"
    echo
    if [ "$real_fail" = 0 ] && [ "$broken_fail" -gt 0 ]; then
        echo "self-check OK: real guard passes everything; broken guard failed $broken_fail case(s), so the suite can fail."
        exit 0
    fi
    echo "self-check FAILED: real guard failures=$real_fail, broken guard failures=$broken_fail"
    exit 1
fi

run_suite "$GUARD"
[ "$RESULT_FAIL" = 0 ]
