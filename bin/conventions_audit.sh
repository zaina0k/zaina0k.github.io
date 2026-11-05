#!/usr/bin/env bash
#
# Conventions audit: greps the working tree for violations of the rules in CLAUDE.md
# that grep can catch. Read-only. Run from anywhere inside the repo.
#
# This repo and its host are PUBLIC, so the checks that matter most are the first two:
# a secret or a personal detail committed here is published.
#
# Checks (stack-agnostic):
#   1. secrets / .env in the tree          FAIL
#   2. personal details in text files      FAIL for phone / date-of-birth / postcode patterns,
#                                          WARN for an email other than the allowlist
#   3. changelog entry on this branch      FAIL if absent (skipped on main and dev)
#   4. TODO / FIXME with no issue ref      FAIL
#   5. files over the size limit           FAIL for a new one, listed as "known" if baselined
#
# Stack-specific checks (Astro / React / Tailwind) are NOT enabled. They are proposed in
# .claude/skills/conventions-audit/SKILL.md and need the owner's say-so.
#
# Exit 0 = no FAIL. Exit 1 = at least one FAIL. WARN never fails.
#
# This audit reads TEXT. It cannot read images or PDFs, so a detail inside one passes.
# A clean run is evidence the patterns are absent, not that the repo is safe.
set -uo pipefail

cd "$(git rev-parse --show-toplevel)" || exit 2

BASELINE="bin/conventions_audit.baseline"
TEXT_LIMIT=$((512 * 1024))         # 512 KB for anything that is not an image or PDF
IMAGE_LIMIT=$((2 * 1024 * 1024))   # 2 MB for images and PDFs
EMAIL_ALLOW='dev@zainaltaf\.com|@example\.(com|org|invalid)|noreply@'

# These files hold the patterns themselves.
EXCLUDES=(':!package-lock.json' ':!bin/conventions_audit.sh' ':!bin/conventions_audit.baseline'
          ':!.claude/skills/conventions-audit/*' ':!bin/test_*.sh')

fails=0
warns=0
section() { printf '\n== %s\n' "$1"; }
fail()    { fails=$((fails+1)); printf '  FAIL %s\n' "$1"; }
warn()    { warns=$((warns+1)); printf '  WARN %s\n' "$1"; }
pass()    { printf '  ok   %s\n' "$1"; }

# Every file that is, or could become, part of a commit: tracked plus untracked-not-ignored.
all_files() { git ls-files -co --exclude-standard; }

# ---- 1. secrets and env files ------------------------------------------------
section "1. Secrets and .env files"
bad_files="$(all_files | grep -E '(^|/)\.env($|\.)|\.pem$|\.key$|\.p12$|(^|/)id_rsa|(^|/)credentials|(^|/)secrets' | grep -vE '(^|/)\.env\.example$' || true)"
if [ -n "$bad_files" ]; then
    while IFS= read -r f; do fail "file that should not be committed: $f"; done <<<"$bad_files"
else
    pass "no .env, key or credential files in the tree"
fi

# Note: macOS git's regex has no \b. Use explicit boundary classes, and -i only where wanted.
secret_hits="$( {
    git grep -nIE --untracked \
        -e 'AKIA[0-9A-Z]{16}' \
        -e '-----BEGIN [A-Z ]*PRIVATE KEY-----' \
        -e 'gh[pousr]_[A-Za-z0-9]{30,}' \
        -e 'sk-[A-Za-z0-9]{20,}' \
        -- . "${EXCLUDES[@]}" 2>/dev/null
    git grep -nIiE --untracked \
        -e '(api[_-]?key|secret|token|passw(or)?d)[A-Za-z_]*[[:space:]]*[:=][[:space:]]*["'"'"'][A-Za-z0-9_./+-]{16,}["'"'"']' \
        -- . "${EXCLUDES[@]}" 2>/dev/null
  } | cut -c1-140 || true)"
if [ -n "$secret_hits" ]; then
    while IFS= read -r l; do fail "possible secret: $l"; done <<<"$secret_hits"
else
    pass "no secret-shaped strings in text files"
fi

# ---- 2. personal details -----------------------------------------------------
section "2. Personal details in committed text"
phone_hits="$(git grep -nIE --untracked \
    -e '(\+|00)44[ -]?\(?0?\)?[0-9]{2,4}[ -]?[0-9]{3,4}[ -]?[0-9]{3,4}' \
    -e '(^|[^0-9.:/-])0[0-9]{3,4}[ -][0-9]{3}[ -]?[0-9]{3,4}([^0-9]|$)' \
    -e '(^|[^0-9.:/-])07[0-9]{3}[ -]?[0-9]{6}([^0-9]|$)' \
    -e '\+[1-9][0-9]{0,2}[ -]\(?[0-9]{2,4}\)?[ -][0-9]{3,4}[ -][0-9]{3,4}' \
    -- . "${EXCLUDES[@]}" 2>/dev/null | cut -c1-140 || true)"
if [ -n "$phone_hits" ]; then
    while IFS= read -r l; do fail "phone-number pattern: $l"; done <<<"$phone_hits"
else
    pass "no phone-number patterns"
fi

dob_hits="$(git grep -nIiE --untracked \
    -e 'date of birth[[:space:]]*[:=]' -e '(^|[^A-Za-z])d\.?o\.?b\.?[[:space:]]*[:=]' -e 'born on [0-9]' -e 'home address[[:space:]]*[:=]' \
    -e '(^|[^A-Za-z0-9])[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}([^A-Za-z0-9]|$)' \
    -- . "${EXCLUDES[@]}" 2>/dev/null | grep -vE 'rgb|#[0-9a-fA-F]{3,8}|[0-9]px|data:image' | cut -c1-140 || true)"
if [ -n "$dob_hits" ]; then
    while IFS= read -r l; do fail "date-of-birth / address / postcode pattern: $l"; done <<<"$dob_hits"
else
    pass "no date-of-birth, home-address or postcode patterns"
fi

email_hits="$(git grep -nIoE --untracked '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' \
    -- . "${EXCLUDES[@]}" ':!.githooks/*' 2>/dev/null | grep -vE "$EMAIL_ALLOW" | sort -u | cut -c1-120 || true)"
if [ -n "$email_hits" ]; then
    while IFS= read -r l; do warn "email address (confirm it is meant to be public): $l"; done <<<"$email_hits"
else
    pass "no email addresses beyond the allowlist"
fi

# ---- 3. changelog entry ------------------------------------------------------
section "3. Changelog entry on this branch"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"
case "$branch" in
    main|dev|HEAD|'') printf '  skip on "%s" (a feature branch carries the entry)\n' "${branch:-?}" ;;
    *)
        base="main"; git rev-parse --verify --quiet dev >/dev/null 2>&1 && base="dev"
        if [ -x bin/check_changelog.sh ] && bin/check_changelog.sh --base "$base" --incoming HEAD >/dev/null 2>&1; then
            pass "docs/CHANGELOG.md gained an entry versus $base"
        else
            fail "no new docs/CHANGELOG.md entry on $branch versus $base (use the changelog-entry skill)"
        fi ;;
esac

# ---- 4. unfiled TODOs --------------------------------------------------------
section "4. TODO / FIXME without an issue reference"
todo_hits="$(git grep -nIE --untracked '(^|[^A-Za-z0-9_])(TODO|FIXME|XXX)([^A-Za-z0-9_]|$)' -- . "${EXCLUDES[@]}" ':!docs/*' 2>/dev/null \
    | grep -vE '(TODO|FIXME|XXX)[^#]{0,20}(#[0-9]+|https?://[^ ]*/issues/[0-9]+)' | cut -c1-140 || true)"
if [ -n "$todo_hits" ]; then
    while IFS= read -r l; do fail "unfiled TODO (add #<issue> or remove): $l"; done <<<"$todo_hits"
else
    pass "no unfiled TODO/FIXME in code"
fi

# ---- 5. file size ------------------------------------------------------------
section "5. Files over the size limit (text 512 KB, images and PDFs 2 MB)"
known=0; newbig=0
while IFS= read -r f; do
    [ -f "$f" ] || continue
    size=$(wc -c <"$f" | tr -d ' ')
    case "$f" in
        *.png|*.jpg|*.jpeg|*.webp|*.avif|*.gif|*.pdf|*.ico|*.woff|*.woff2) limit=$IMAGE_LIMIT ;;
        package-lock.json) continue ;;
        *) limit=$TEXT_LIMIT ;;
    esac
    [ "$size" -gt "$limit" ] || continue
    if [ -f "$BASELINE" ] && grep -qxF "$f" "$BASELINE"; then
        known=$((known+1))
    else
        newbig=$((newbig+1)); fail "$f is $((size/1024)) KB, over the limit and not in $BASELINE"
    fi
done < <(all_files)
[ "$newbig" -gt 0 ] || pass "no new oversized files"
[ "$known" -eq 0 ] || printf '  note %s oversized file(s) already in %s (known, not failing)\n' "$known" "$BASELINE"

section "Stack-specific checks"
printf '  not enabled - proposals are in .claude/skills/conventions-audit/SKILL.md\n'

printf '\n%s FAIL, %s WARN\n' "$fails" "$warns"
[ "$fails" -eq 0 ]
