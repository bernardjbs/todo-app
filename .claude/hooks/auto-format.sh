#!/bin/bash
# PostToolUse hook: Runs Prettier on changed .ts/.vue/.json/.md files
# Matched on Edit|Write tool calls

# Read the tool input from stdin
input=$(cat)

# Extract the file path from the JSON input
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*: *"//;s/"$//')

# Only format supported file types
case "$file_path" in
  *.ts|*.vue|*.json|*.md)
    if [ -f "$file_path" ]; then
      npx prettier --write "$file_path" 2>/dev/null
    fi
    ;;
esac
