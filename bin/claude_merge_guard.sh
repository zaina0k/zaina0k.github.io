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
#   1. a `git merge` whose TARGET is main and which either
#        - lacks --no-ff (docs/git-workflow.md: every merge is --no-ff), or
#        - brings no changelog entry (bin/check_changelog.sh decides, not this file);
#   2. a `git merge` into dev that lacks --no-ff;
#   3. any command that writes a non-merge commit or moves the ref while main or dev is the
#      current branch: git commit (incl. --amend, --no-verify), cherry-pick, revert, am,
#      rebase, `git branch -f main|dev`, `git update-ref refs/heads/main|dev`.
#      Finishing a conflicted merge with `git commit` is allowed (MERGE_HEAD present).
#      Escape for 3 only: SKIP_BRANCH_GUARD=1. Same rule as .githooks/pre-commit, which
#      cannot see most of these (--no-verify, cherry-pick, revert, rebase, fast-forward).
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
# Escapes, as env prefixes on the segment: SKIP_CHANGELOG_CHECK=1 (item 1),
# SKIP_BRANCH_GUARD=1 (items 2 and 3; bootstrap and genuine emergencies only).
set -uo pipefail

payload="$(cat)"

# Cheapest rejection first: nearly every Bash call has nothing to do with merges.
case "$payload" in
    *merge*|*commit*|*cherry-pick*|*revert*|*rebase*|*"git am"*|*update-ref*|*"branch -f"*|*"branch --force"*) ;;
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
KEYS = ("merge", "commit", "cherry-pick", "revert", "rebase", "am", "update-ref", "branch")
if not isinstance(cmd, str) or not any(k in cmd for k in KEYS):
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

    def branch_here():
        return current if (current and not gcwd) else current_branch(gcwd)

    # ---- branch guard: no non-merge commit, and no ref move, on main or dev -----
    if "SKIP_BRANCH_GUARD=1" not in env:
        writes = False
        if sub == "commit" and "--dry-run" not in args:
            writes = True
        elif sub in ("cherry-pick", "revert", "am", "rebase") and not any(
                a in ("--abort", "--quit") for a in args):
            writes = True
        if writes:
            b = branch_here()
            if b in ("main", "dev"):
                # Finishing a conflicted merge is a merge commit: allowed.
                if sub == "commit" and git_out(["rev-parse", "-q", "--verify", "MERGE_HEAD"], gcwd or work_dir):
                    continue
                deny("`git %s` on %s. Nothing is committed directly to main or dev (docs/git-workflow.md); "
                     "both only receive --no-ff merges. Put the work on a branch (git switch -c cp/<n>-<slug> dev, "
                     "or use a worktree) and commit there. For the one-time bootstrap or a genuine emergency only, "
                     "prefix SKIP_BRANCH_GUARD=1 and tell the owner." % (sub, b))
        branch_pos = [a for a in args if not a.startswith("-")]   # first positional = the branch moved
        if sub == "branch" and any(a in ("-f", "--force") for a in args) and \
                branch_pos and branch_pos[0] in ("main", "dev"):
            deny("`git branch --force` would move main or dev without a merge. Use a --no-ff merge. "
                 "SKIP_BRANCH_GUARD=1 only for the bootstrap or a genuine emergency.")
        if sub == "update-ref" and any(a in ("refs/heads/main", "refs/heads/dev") for a in args):
            deny("`git update-ref` on refs/heads/main or dev would move it without a merge. "
                 "SKIP_BRANCH_GUARD=1 only for the bootstrap or a genuine emergency.")

    if sub != "merge":
        continue
    if any(a in ("--abort", "--continue", "--quit") for a in args):
        continue

    target = branch_here()

    # A merge into dev must be --no-ff too (a fast-forward moves dev with no merge commit).
    if target == "dev" and "--no-ff" not in args and "SKIP_BRANCH_GUARD=1" not in env:
        deny("This merge targets dev without --no-ff. dev only receives --no-ff merges "
             "(docs/git-workflow.md); the merge commit is the marker. Re-run with --no-ff.")

    if "SKIP_CHANGELOG_CHECK=1" in env:
        continue
    if target != "main":
        continue                          # a merge into a feature branch is not guarded

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
