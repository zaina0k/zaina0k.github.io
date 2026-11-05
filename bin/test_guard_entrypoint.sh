#!/usr/bin/env bash
#
# Tests the PreToolUse hook *command* registered in .claude/settings.json - the
# shell snippet that locates bin/claude_merge_guard.sh and runs it. That snippet
# used to be `[ -x "$g" ] && "$g" || true`: if $CLAUDE_PROJECT_DIR did not point
# at the repo root (for example, Claude was launched from the parent folder that
# holds several worktrees), "$g" did not exist, the guard silently never ran,
# and no commit/merge was ever refused for the rest of the session.
#
# This extracts the literal "command" string from settings.json (via python's
# json module) and runs it with `bash -c`, so it tests what Claude Code will
# actually execute, not a re-implementation of it.
set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
SETTINGS="${SETTINGS:-$ROOT/.claude/settings.json}"

CMD="$(python3 -c '
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
print(data["hooks"]["PreToolUse"][0]["hooks"][0]["command"])
' "$SETTINGS")"

pass=0
fail=0

run() { # payload-command-string, CLAUDE_PROJECT_DIR value, cwd
    local payload="$1" project_dir="$2" cwd="$3"
    printf '%s' "$(python3 -c 'import json,sys; print(json.dumps({"tool_input":{"command":sys.argv[1]}}))' "$payload")" \
        | (cd "$cwd" && CLAUDE_PROJECT_DIR="$project_dir" bash -c "$CMD") 2>/dev/null
}

check() { # name, want(deny|allow), payload, project_dir, cwd
    local name="$1" want="$2" out got
    out="$(run "$3" "$4" "$5")"
    case "$out" in *'"deny"'*) got=deny ;; *) got=allow ;; esac
    if [ "$got" = "$want" ]; then
        pass=$((pass + 1)); printf '  ok   %s\n' "$name"
    else
        fail=$((fail + 1)); printf '  FAIL %s  (wanted %s, got %s)\n' "$name" "$want" "$got"
    fi
}

# A repo with "dev" checked out, and a copy of the real guard at bin/claude_merge_guard.sh.
scratch="$(mktemp -d "${TMPDIR:-/tmp}/guard-entry.XXXXXX")"
(
    cd "$scratch" || exit 1
    git init -q -b main
    git config user.email test@example.invalid
    git config user.name test
    mkdir -p bin
    cp "$HERE/claude_merge_guard.sh" bin/claude_merge_guard.sh
    chmod +x bin/claude_merge_guard.sh
    echo base > f
    git add .
    git commit -qm base
    git switch -qc dev
) >/dev/null 2>&1

# A directory that is neither the repo nor inside any git repo at all.
wrongdir="$(mktemp -d "${TMPDIR:-/tmp}/guard-entry-empty.XXXXXX")"

echo "-- CLAUDE_PROJECT_DIR correct"
check "commit on dev, CLAUDE_PROJECT_DIR = repo root" deny "git commit -m x" "$scratch" "$scratch"

echo "-- CLAUDE_PROJECT_DIR wrong, but cwd is inside the repo: git fallback finds the script"
check "commit on dev, CLAUDE_PROJECT_DIR = parent folder" deny "git commit -m x" "$(dirname "$scratch")" "$scratch"

echo "-- neither CLAUDE_PROJECT_DIR nor cwd resolves to the repo"
check "commit/merge-like command is denied loudly, not silently allowed" deny "git commit -m x" "$wrongdir" "$wrongdir"
check "an unrelated command still runs (it was never guarded anyway)" allow "ls -la" "$wrongdir" "$wrongdir"

python3 -c "import shutil, sys; [shutil.rmtree(p, ignore_errors=True) for p in sys.argv[1:]]" "$scratch" "$wrongdir"

printf '\n  %s passed, %s failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
