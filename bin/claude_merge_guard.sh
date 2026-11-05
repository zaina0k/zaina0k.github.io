#!/usr/bin/env bash
#
# Claude Code PreToolUse guard for a merge into `main`.
# Registered on Bash in .claude/settings.json. Reads the tool call as JSON on
# stdin and answers with a permission decision on stdout.
#
# Why it exists next to .githooks/pre-merge-commit: git has no hook that runs
# BEFORE a merge starts, so the git hook can only abort a half-done merge. This
# one fires first, and its message says to write the entry rather than to clean
# up. It also catches a fast-forward merge, which skips the git hook entirely.
#
# What it refuses, and only this:
#   a `git merge` whose TARGET is main and which either
#     - lacks --no-ff (docs/git-workflow.md: every merge is --no-ff), or
#     - brings no changelog entry (bin/check_changelog.sh decides, not this file).
#
# How the target is decided (the part the reference project got wrong, by
# matching strings anywhere in the command): the command is split into
# segments on && || ; | and newlines, heredoc bodies and quoted text are dropped
# from consideration, and the segments are walked in order tracking which branch
# is current. `git switch main` / `git checkout main` change it; `git commit`
# does not; `git checkout main -- file` does not (it restores a file). A merge is
# judged only against the branch current at ITS segment. So
#   git commit -m "mention checkout main" && git merge --no-ff cp/x     (on dev)
# is a merge into dev and is allowed.
#
# Failing open is deliberate. This runs on every Bash call; a guard that blocks
# work whenever it cannot parse something would be switched off within a day.
# Anything unreadable is allowed, and the git hook is the backstop.
#
# Escape: SKIP_CHANGELOG_CHECK=1 as an env prefix on the merge segment.
set -uo pipefail

payload="$(cat)"

# Cheapest rejection first: nearly every Bash call has nothing to do with merges.
case "$payload" in
    *merge*) ;;
    *) exit 0 ;;
esac

command -v python3 >/dev/null 2>&1 || exit 0

GUARD_PAYLOAD="$payload" python3 - <<'PY'
import json, os, re, shlex, subprocess, sys

def allow():
    sys.exit(0)

try:
    cmd = json.loads(os.environ.get("GUARD_PAYLOAD", "")).get("tool_input", {}).get("command", "")
except Exception:
    allow()
if not isinstance(cmd, str) or "merge" not in cmd:
    allow()

# ---- 1. Drop heredoc bodies, turn unquoted newlines into ';' -----------------
def strip_heredocs(s):
    out, lines, i = [], s.split("\n"), 0
    while i < len(lines):
        line = lines[i]
        out.append(line)
        m = re.search(r"<<-?\s*(['\"]?)([A-Za-z_][A-Za-z0-9_]*)\1", line)
        if m:
            tag = m.group(2)
            i += 1
            while i < len(lines) and lines[i].strip() != tag:
                i += 1
        i += 1
    return "\n".join(out)

def newlines_to_semicolons(s):
    out, quote = [], None
    for ch in s:
        if quote:
            out.append(ch)
            if ch == quote:
                quote = None
        elif ch in ("'", '"'):
            quote = ch
            out.append(ch)
        elif ch == "\n":
            out.append(" ; ")
        else:
            out.append(ch)
    return "".join(out)

try:
    text = newlines_to_semicolons(strip_heredocs(cmd))
    lex = shlex.shlex(text, posix=True, punctuation_chars=True)
    lex.whitespace_split = True
    tokens = list(lex)
except Exception:
    allow()  # unparseable (unbalanced quote, etc.): fail open

# ---- 2. Split into segments on control operators -----------------------------
SEPS = {"&&", "||", ";", "|", "&", ";;", "|&"}
segments, cur = [], []
for t in tokens:
    if t in SEPS or (t and set(t) <= set("&|;")):
        if cur:
            segments.append(cur)
        cur = []
    else:
        cur.append(t)
if cur:
    segments.append(cur)

# ---- 3. Helpers --------------------------------------------------------------
def git_out(args, cwd):
    try:
        r = subprocess.run(["git"] + args, cwd=cwd, capture_output=True, text=True, timeout=10)
        return r.stdout.strip() if r.returncode == 0 else ""
    except Exception:
        return ""

def parse_git(seg):
    """-> (env_tokens, git_cwd_override, subcommand, args) or None if not a git call."""
    i, env = 0, []
    while i < len(seg) and re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", seg[i]):
        env.append(seg[i]); i += 1
    if i < len(seg) and seg[i] == "env":
        i += 1
        while i < len(seg) and (re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", seg[i]) or seg[i].startswith("-")):
            if "=" in seg[i]:
                env.append(seg[i])
            i += 1
    if i >= len(seg) or os.path.basename(seg[i]) != "git":
        return None
    i += 1
    cwd = None
    while i < len(seg) and seg[i].startswith("-"):
        if seg[i] == "-C" and i + 1 < len(seg):
            cwd = seg[i + 1]; i += 2
        elif seg[i] in ("-c", "--git-dir", "--work-tree", "--namespace") and i + 1 < len(seg):
            i += 2
        else:
            i += 1
    if i >= len(seg):
        return None
    return env, cwd, seg[i], seg[i + 1:]

VALUE_FLAGS = {"-m", "-F", "-s", "-X", "--message", "--file", "--strategy",
               "--strategy-option", "--into-name", "-S", "--gpg-sign"}

def positionals(args):
    out, skip = [], False
    for a in args:
        if skip:
            skip = False; continue
        if a in VALUE_FLAGS:
            skip = True; continue
        if a.startswith("-"):
            continue
        out.append(a)
    return out

def deny(reason):
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason}}))
    sys.exit(0)

# ---- 4. Walk the segments, tracking the current branch -----------------------
work_dir = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
current = None   # resolved lazily; None = not yet asked

def current_branch(cwd):
    return git_out(["rev-parse", "--abbrev-ref", "HEAD"], cwd or work_dir)

for seg in segments:
    if seg and seg[0] == "cd" and len(seg) > 1:
        work_dir = os.path.join(work_dir, seg[1]) if not os.path.isabs(seg[1]) else seg[1]
        current = None
        continue

    parsed = parse_git(seg)
    if parsed is None:
        continue
    env, gcwd, sub, args = parsed
    if gcwd:
        gcwd = gcwd if os.path.isabs(gcwd) else os.path.join(work_dir, gcwd)

    if sub in ("switch", "checkout"):
        if "--" in args and sub == "checkout":
            continue                      # restores files; the branch does not change
        new = None
        flags_make = [a for a in args if a in ("-b", "-B", "-c", "-C", "--orphan")]
        pos = [a for a in args if not a.startswith("-")]
        if flags_make:
            idx = next(i for i, a in enumerate(args) if a in ("-b", "-B", "-c", "-C", "--orphan"))
            new = args[idx + 1] if idx + 1 < len(args) else None
        elif pos:
            new = pos[0]
        if new:
            current = new
        continue

    if sub != "merge":
        continue
    if any(a in ("--abort", "--continue", "--quit") for a in args):
        continue
    if "SKIP_CHANGELOG_CHECK=1" in env:
        continue

    target = current if (current and not gcwd) else current_branch(gcwd)
    if target != "main":
        continue                          # a merge into dev or a feature branch is not guarded

    # Judged only here: the target really is main.
    if "--no-ff" not in args:
        deny("This merge targets main without --no-ff. Every merge in this repo is --no-ff "
             "(docs/git-workflow.md); a fast-forward also skips the git pre-merge-commit hook. "
             "Re-run with --no-ff.")
    pos = positionals(args)
    incoming = pos[-1] if pos else ""
    repo = gcwd or work_dir
    if not incoming or not git_out(["rev-parse", "--verify", "--quiet", incoming], repo):
        continue                          # cannot resolve the ref: fail open
    root = git_out(["rev-parse", "--show-toplevel"], repo)
    checker = os.path.join(root, "bin", "check_changelog.sh") if root else ""
    if not (checker and os.access(checker, os.X_OK)):
        continue
    try:
        r = subprocess.run([checker, "--base", "main", "--incoming", incoming],
                           cwd=root, capture_output=True, text=True, timeout=15)
    except Exception:
        continue
    if r.returncode == 1:
        deny("This merge into main has no changelog entry. Invoke the `changelog-entry` skill, "
             "add the entry to docs/CHANGELOG.md on the branch being merged, commit it there, "
             "then merge. If this release changes nothing a visitor would notice, re-run with "
             "SKIP_CHANGELOG_CHECK=1 prefixed. A merge into main deploys the public site.\n\n"
             + r.stderr.strip())
allow()
PY
exit 0
