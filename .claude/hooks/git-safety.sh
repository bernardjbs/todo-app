#!/bin/bash
set -euo pipefail

# PreToolUse hook: Git safety checks
# - Block commits directly to main/master
# - Block force pushes
# - Block staging .env files

# Read tool input from stdin
input=$(cat)

# Extract command using node for reliable JSON parsing
command=$(echo "$input" | node -e "
  let d = '';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    try { console.log(JSON.parse(d).command || ''); }
    catch { console.log(''); }
  });
")

# If command is empty, allow it (not a Bash command we need to check)
if [ -z "$command" ]; then
  exit 0
fi

# Block commits to main/master (match 'git' followed by 'commit' anywhere)
if echo "$command" | grep -qE '\bgit\b.*\bcommit\b'; then
  branch=$(git branch --show-current 2>/dev/null)
  if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
    echo "BLOCKED: Cannot commit directly to $branch. Create a feature branch first."
    echo "Use: git checkout -b feature/<name> or fix/<name>"
    exit 2
  fi
fi

# Block force pushes (match git push with --force, --force-with-lease, or -f flag)
if echo "$command" | grep -qE '\bgit\b.*\bpush\b.*--force'; then
  echo "BLOCKED: Force push is not allowed. It can overwrite remote history."
  exit 2
fi
if echo "$command" | grep -qE '\bgit\b.*\bpush\b.*\s-f(\s|$)'; then
  echo "BLOCKED: Force push (-f) is not allowed. It can overwrite remote history."
  exit 2
fi

# Block staging .env files (explicit filename or wildcard staging)
if echo "$command" | grep -qE '\bgit\b.*\badd\b'; then
  if echo "$command" | grep -qE '\.env(\s|$|\.)' && ! echo "$command" | grep -qE '\.env\.example'; then
    echo "BLOCKED: Cannot stage .env files. They contain secrets and must not be committed."
    exit 2
  fi
  if echo "$command" | grep -qE 'git add \.(\s|$)|git add -A|git add --all'; then
    echo "BLOCKED: Broad staging commands are not allowed. Stage specific files instead."
    echo "Use: git add <file1> <file2> ..."
    exit 2
  fi
fi

exit 0
