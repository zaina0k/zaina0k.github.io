#!/usr/bin/env bash
#
# Proves bin/conventions_audit.sh can report a problem: plants one violation per check in a
# throwaway repo and requires the audit to FAIL on each, and to pass on a clean tree.
# "A verifier that reports success must also be shown capable of reporting failure."
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
S="$(mktemp -d "${TMPDIR:-/tmp}/audit-test.XXXXXX")"
pass=0; fail=0
cd "$S" || exit 1
git init -q -b main; git config user.email t@example.invalid; git config user.name t
mkdir -p bin docs src
cp "$HERE/conventions_audit.sh" "$HERE/check_changelog.sh" bin/; chmod +x bin/*.sh
printf '# C\n\n## [Unreleased]\n' > docs/CHANGELOG.md
echo "hello" > src/a.txt
git add . && git commit -qm base && git branch dev && git switch -qc cp/9-test dev
printf -- '- An entry\n' >> docs/CHANGELOG.md && git add . && git commit -qm entry

expect() { # name want(0|1) 
    bin/conventions_audit.sh >/dev/null 2>&1; local got=$?
    if [ "$got" = "$2" ]; then pass=$((pass+1)); printf '  ok   %s\n' "$1"; else fail=$((fail+1)); printf '  FAIL %s (wanted exit %s, got %s)\n' "$1" "$2" "$got"; fi
}
plant() { # name, file, content, [want]  -- plants, expects 1, removes
    printf '%b' "$3" > "$2"; expect "flags: $1" 1; rm -f "$2"
}

expect "clean tree passes" 0
plant "a .env.local file"            .env.local        'KEY=1\n'
plant "a private key block"          src/k.txt         '-----BEGIN RSA PRIVATE KEY-----\n'
plant "an AWS-style key"             src/aws.txt       'id AKIAABCDEFGHIJKLMNOP\n'
plant "a quoted api key"             src/c.ts          'const apiKey = "abcd1234efgh5678ijkl9012";\n'
plant "a UK mobile number"           src/p.txt         'call me on 07123 456789 today\n'
plant "a +44 number"                 src/p2.txt        'tel +44 7123 456789\n'
plant "a date-of-birth label"        src/d.txt         'Date of birth: 1 Jan 2000\n'
plant "a home address label"         src/h.txt         'Home address: 1 Some Street\n'
plant "a postcode"                   src/pc.txt        'LE1 7RH\n'
plant "an unfiled TODO"              src/t.ts          '// TODO fix this\n'
head -c 3000000 /dev/zero > src/big.png; expect "flags: a new 3 MB image" 1; rm -f src/big.png
printf '.env.example allowed: ' ; printf 'KEY=\n' > .env.example; expect ".env.example (blank template) is allowed" 0; rm -f .env.example
printf '// TODO(#12) filed\n' > src/t2.ts; expect "a TODO with an issue ref is allowed" 0; rm -f src/t2.ts
git switch -q dev; git switch -qc cp/10-noentry dev; echo y > src/b.txt; git add . ; git commit -qm x
expect "flags: a branch with no changelog entry" 1

printf '\n%s passed, %s failed\n' "$pass" "$fail"
cd / && rm -rf "$S"
[ "$fail" = 0 ]
