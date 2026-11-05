#!/usr/bin/env bash
#
# Tests the two branch/merge guards in a throwaway repository:
#   1. bin/claude_merge_guard.sh  - the Claude PreToolUse guard, fed tool-call payloads
#   2. .githooks/pre-commit       - the git hook, exercised with real git commands
#
# Usage:
#   bin/test_merge_guard.sh                 run both suites
#   GUARD=/path HOOK=/path bin/test_merge_guard.sh   run against other implementations
#   bin/test_merge_guard.sh --self-check    also prove the suites can fail: runs each against a
#                                           deliberately broken implementation and requires failures
#
# The Claude-guard suite includes the case the reference project's guard got wrong: a merge into
# dev issued in the same command as a commit whose message mentions main. The hook suite pins
# the commit paths the hook CANNOT see as "KNOWN GAP" so a change in git's behaviour is noticed.
set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
GUARD="${GUARD:-$HERE/claude_merge_guard.sh}"
HOOK="${HOOK:-$ROOT/.githooks/pre-commit}"

# ============================ suite 1: Claude guard ===========================
run_guard_suite() {
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
        git switch -qc cp/noentry dev && echo a >> f && git commit -qam noentry
        git switch -qc cp/entry dev && echo b >> f && printf -- '- Added a thing\n' >> docs/CHANGELOG.md && git commit -qam entry
        git switch -qc cp/work dev
        git switch -q dev
    ) >/dev/null 2>&1

    verdict() { # command, branch-to-be-on, [merge-head]
        local command="$1" branch="$2" out
        git -C "$scratch" switch -q "$branch" 2>/dev/null
        [ -n "${3:-}" ] && git -C "$scratch" rev-parse HEAD > "$scratch/.git/MERGE_HEAD"
        out="$(printf '%s' "$(python3 -c 'import json,sys; print(json.dumps({"tool_input":{"command":sys.argv[1]}}))' "$command")" \
              | (cd "$scratch" && CLAUDE_PROJECT_DIR="$scratch" "$guard") 2>/dev/null)"
        rm -f "$scratch/.git/MERGE_HEAD"
        case "$out" in *'"deny"'*) echo deny ;; *) echo allow ;; esac
    }
    check() { # name, want, command, branch, [merge-head]
        local got; got="$(verdict "$3" "$4" "${5:-}")"
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
    check "no-ff merge into dev"                            allow 'git merge --no-ff cp/noentry'                       dev
    check "merge into dev WITHOUT --no-ff"                  deny  'git merge cp/noentry'                               dev
    check "merge into dev without --no-ff, SKIP_BRANCH_GUARD=1" allow 'SKIP_BRANCH_GUARD=1 git merge cp/noentry'       dev
    check "REFERENCE BUG: commit mentioning main, then merge into dev" \
                                                             allow 'git commit -m "docs: say git checkout main first" && git switch dev && git merge --no-ff cp/noentry' cp/work
    check "commit with 'git checkout main' in heredoc, then merge dev" \
                                                             allow $'git commit -F - <<\'EOF\'\nnote: git checkout main\nEOF\ngit switch dev\ngit merge --no-ff cp/noentry' cp/work
    check "switch main then back to dev, then merge"        allow 'git switch main; git switch dev; git merge --no-ff cp/noentry' main
    check "checkout main -- file restores a file, still dev" allow 'git checkout main -- f && git merge --no-ff cp/noentry' dev
    check "heredoc body mentioning git merge, on main"      allow $'cat <<\'EOF\' > /dev/null\ngit merge cp/noentry\nEOF' main
    check "echo of a merge command, on main"                allow 'echo "git merge cp/noentry"'                        main
    check "create-and-switch to a new branch, then merge"   allow 'git switch -c feat/x && git merge --no-ff cp/noentry' main

    echo "-- branch guard: no non-merge commit on main or dev"
    check "git commit on dev"                               deny  'git commit -m x'                                    dev
    check "git commit on main"                              deny  'git commit -m x'                                    main
    check "git commit on a cp/ branch"                      allow 'git commit -m x'                                    cp/work
    check "git add && git commit on main"                   deny  'git add docs/a.md && git commit -m x'               main
    check "git commit --amend on dev"                       deny  'git commit --amend -m x'                            dev
    check "git commit --no-verify on dev"                   deny  'git commit --no-verify -m x'                        dev
    check "git cherry-pick on main"                         deny  'git cherry-pick abc123'                             main
    check "git revert on dev"                               deny  'git revert --no-edit HEAD'                          dev
    check "git rebase on dev"                               deny  'git rebase cp/work'                                 dev
    check "git am on main"                                  deny  'git am patch.mbox'                                  main
    check "switch main then commit (from a cp/ branch)"     deny  'git switch main && git commit -m x'                 cp/work
    check "switch dev then commit"                          deny  'git switch dev; git commit -m x'                    cp/work
    check "switch to a cp/ branch then commit (from main)"  allow 'git switch cp/work && git commit -m x'              main
    check "git -C <repo> commit while on dev"               deny  "git -C $scratch commit -m x"                        dev
    check "SKIP_BRANCH_GUARD=1 commit on dev"               allow 'SKIP_BRANCH_GUARD=1 git commit -m x'                dev
    check "commit --dry-run on dev"                         allow 'git commit --dry-run'                               dev
    check "finishing a conflicted merge (MERGE_HEAD) on dev" allow 'git commit -m resolved'                            dev  merge-head
    check "rebase --abort on dev"                           allow 'git rebase --abort'                                 dev
    check "git branch --force dev"                          deny  'git branch -f dev cp/work'                          cp/work
    check "git branch --force of a cp/ branch"              allow 'git branch -f cp/work dev'                          cp/work
    check "git update-ref refs/heads/main"                  deny  'git update-ref refs/heads/main abc123'              cp/work
    check "'git commit' only inside an echo, on main"       allow 'echo "git commit -m x"'                             main
    check "'git commit' only inside a heredoc, on main"     allow $'cat <<\'EOF\' > /dev/null\ngit commit -m x\nEOF'    main

    echo "-- fail open"
    check "non-git command"                                 allow 'ls -la'                                             main
    check "unbalanced quote"                                allow 'git merge --no-ff "cp/noentry'                      main
    check "empty command"                                   allow ''                                                   main

    git -C "$scratch" switch -q dev 2>/dev/null
    rm -rf "$scratch"
    printf '\n  %s passed, %s failed\n' "$pass" "$fail"
    RESULT_FAIL=$fail
}

# ============================ suite 2: git pre-commit hook ====================
run_hook_suite() {
    local hook="$1" pass=0 fail=0
    local base; base="$(mktemp -d "${TMPDIR:-/tmp}/branch-hook.XXXXXX")"

    fresh() { # build a fresh repo with main, dev, and a feature branch "feat" with two commits
        S="$base/$1"; rm -rf "$S"; mkdir -p "$S"; cd "$S" || return 1
        git init -q -b main; git config user.email test@example.invalid; git config user.name test
        mkdir .githooks; cp "$hook" .githooks/pre-commit; chmod +x .githooks/pre-commit
        echo a > f; git add .; git commit -qm base --no-verify
        git config core.hooksPath .githooks
        git branch dev
        git switch -qc feat dev; echo b >> f; git commit -qam feat1; echo c > g; git add g; git commit -qm feat2
        FEAT="$(git rev-parse HEAD)"
        git switch -q dev
    }
    tip() { git rev-parse dev; }
    # result: did dev's tip move?  want = blocked | lands
    expect() { # name, want, tip-before
        local moved=lands; [ "$(tip)" = "$3" ] && moved=blocked
        if [ "$moved" = "$2" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"
        else fail=$((fail+1)); printf '  FAIL %s  (wanted %s, got %s)\n' "$1" "$2" "$moved"; fi
    }

    echo "-- blocked by the hook"
    fresh a; b="$(tip)"; echo x > h; git add h; git commit -qm x >/dev/null 2>&1;                       expect "git commit on dev" blocked "$b"
    fresh a2; git switch -q main; b="$(git rev-parse main)"; echo x > h; git add h; git commit -qm x >/dev/null 2>&1
    [ "$(git rev-parse main)" = "$b" ] && { pass=$((pass+1)); echo "  ok   git commit on main"; } || { fail=$((fail+1)); echo "  FAIL git commit on main"; }
    fresh b; b="$(tip)"; git commit -q --amend -m y >/dev/null 2>&1;                                     expect "git commit --amend on dev" blocked "$b"
    fresh c; b="$(tip)"; git merge --squash feat >/dev/null 2>&1; git commit -qm sq >/dev/null 2>&1;     expect "git merge --squash, then git commit on dev" blocked "$b"
    fresh d; git switch -q feat; git worktree add -q "$base/d-wt" dev; ( cd "$base/d-wt" && b="$(git rev-parse dev)" && echo z > z && git add z && git commit -qm wt >/dev/null 2>&1; echo "$b" > "$base/d.tip" )
    [ "$(git rev-parse dev)" = "$(cat "$base/d.tip")" ] && { pass=$((pass+1)); echo "  ok   git commit from a worktree that has dev checked out"; } || { fail=$((fail+1)); echo "  FAIL git commit from a worktree that has dev checked out"; }

    echo "-- allowed"
    fresh e; git switch -q feat; echo q >> f; git commit -qam q >/dev/null 2>&1; r=$?
    [ "$r" = 0 ] && { pass=$((pass+1)); echo "  ok   git commit on a feature branch"; } || { fail=$((fail+1)); echo "  FAIL git commit on a feature branch"; }
    fresh f; b="$(tip)"; git merge --no-ff feat -m m >/dev/null 2>&1;                                    expect "git merge --no-ff into dev (merge commit)" lands "$b"
    fresh g; git switch -q feat; git switch -qc feat2 dev; echo other >> f; git commit -qam featedit --no-verify
    git switch -q dev; echo dev >> f; git commit -qam devedit --no-verify; git merge --no-ff feat2 -m cm >/dev/null 2>&1
    echo resolved > f; git add f; git commit -qm resolved >/dev/null 2>&1
    [ "$(git rev-list --parents -n1 HEAD | wc -w | tr -d " ")" = 3 ] && { pass=$((pass+1)); echo "  ok   conflicted merge finished with git commit (merge commit)"; } || { fail=$((fail+1)); echo "  FAIL conflicted merge finished with git commit"; }
    fresh h; b="$(tip)"; echo x > h; git add h; SKIP_BRANCH_GUARD=1 git commit -qm x >/dev/null 2>&1;     expect "SKIP_BRANCH_GUARD=1 git commit on dev" lands "$b"

    echo "-- KNOWN GAPS: the hook cannot see these (pinned so a change in git is noticed)"
    fresh i; b="$(tip)"; echo x > h; git add h; git commit -q --no-verify -m nv >/dev/null 2>&1;         expect "KNOWN GAP: git commit --no-verify" lands "$b"
    fresh j; b="$(tip)"; git cherry-pick "$FEAT" >/dev/null 2>&1;                                        expect "KNOWN GAP: git cherry-pick" lands "$b"
    fresh k; b="$(tip)"; git revert --no-edit HEAD >/dev/null 2>&1;                                      expect "KNOWN GAP: git revert" lands "$b"
    fresh l; b="$(tip)"; git rebase feat >/dev/null 2>&1;                                                expect "KNOWN GAP: git rebase onto a feature branch" lands "$b"
    fresh m; git switch -q dev; git switch -q feat; git branch -qf dev "$(git rev-parse feat~1)" 2>/dev/null; git switch -q dev; b="$(tip)"; git merge --ff-only feat >/dev/null 2>&1; expect "KNOWN GAP: git merge --ff-only" lands "$b"
    fresh n; b="$(tip)"; git switch -q feat; c="$(git commit-tree "$(git rev-parse feat^{tree})" -p dev -m plumbing)"; git update-ref refs/heads/dev "$c"; expect "KNOWN GAP: commit-tree + update-ref" lands "$b"

    cd /; rm -rf "$base"
    printf '\n  %s passed, %s failed\n' "$pass" "$fail"
    RESULT_FAIL=$fail
}

# ================================== driver ====================================
if [ "${1:-}" = "--self-check" ]; then
    echo "== real Claude guard =="; run_guard_suite "$GUARD"; g_fail=$RESULT_FAIL
    echo; echo "== real pre-commit hook =="; run_hook_suite "$HOOK"; h_fail=$RESULT_FAIL

    # Broken Claude guard 1: matches "checkout main" anywhere (the reference project's mistake)
    # and never looks at commits at all.
    broken_g="$(mktemp "${TMPDIR:-/tmp}/broken-guard.XXXXXX")"
    cat > "$broken_g" <<'EOF'
#!/usr/bin/env bash
payload="$(cat)"
case "$payload" in
  *"git merge"*) case "$payload" in *"checkout main"*|*"switch main"*) echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny"}}' ;; esac ;;
esac
exit 0
EOF
    chmod +x "$broken_g"
    echo; echo "== deliberately broken Claude guard (must FAIL) =="; run_guard_suite "$broken_g"; bg_fail=$RESULT_FAIL
    rm -f "$broken_g"

    # Broken hook: never refuses anything.
    broken_h="$(mktemp "${TMPDIR:-/tmp}/broken-hook.XXXXXX")"
    printf '#!/usr/bin/env bash\nexit 0\n' > "$broken_h"; chmod +x "$broken_h"
    echo; echo "== deliberately broken pre-commit hook (must FAIL) =="; run_hook_suite "$broken_h"; bh_fail=$RESULT_FAIL
    rm -f "$broken_h"

    echo
    if [ "$g_fail" = 0 ] && [ "$h_fail" = 0 ] && [ "$bg_fail" -gt 0 ] && [ "$bh_fail" -gt 0 ]; then
        echo "self-check OK: real guard and hook pass everything; broken guard failed $bg_fail case(s), broken hook failed $bh_fail case(s)."
        exit 0
    fi
    echo "self-check FAILED: real guard=$g_fail hook=$h_fail | broken guard=$bg_fail broken hook=$bh_fail (broken ones must be > 0)"
    exit 1
fi

echo "== Claude guard =="; run_guard_suite "$GUARD"; g_fail=$RESULT_FAIL
echo; echo "== pre-commit hook =="; run_hook_suite "$HOOK"; h_fail=$RESULT_FAIL
[ "$g_fail" = 0 ] && [ "$h_fail" = 0 ]
