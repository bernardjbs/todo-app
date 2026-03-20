#!/bin/bash
# Stop hook: Runs npm test before Claude stops
# If tests fail, signals Claude to fix them

# Only run if package.json exists (project is set up)
if [ ! -f "package.json" ]; then
  exit 0
fi

# Check if test script exists
has_test=$(node -e "const p = require('./package.json'); console.log(p.scripts?.test ? 'yes' : 'no')" 2>/dev/null)

if [ "$has_test" != "yes" ]; then
  exit 0
fi

# Run tests
output=$(npm test 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "Tests failed. Please fix the failing tests before stopping."
  echo ""
  echo "$output" | tail -30
  exit 1
fi
