#!/bin/bash
# PreToolUse hook: Blocks writes to .env* files
# Matched on Edit|Write tool calls

# Read the tool input from stdin
input=$(cat)

# Extract the file path from the JSON input
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*: *"//;s/"$//')

# Check if the file matches .env* pattern
if [[ "$file_path" == *.env* ]] && [[ "$file_path" != *.env.example ]]; then
  # Return deny decision as JSON
  cat <<'DENY'
{"decision":"block","reason":"Writing to .env files is blocked by protect-files hook. Use .env.example for templates."}
DENY
  exit 0
fi
