---
context: fork
---

# /review — Code Review

Analyze current changes against project rules and report findings.

## Steps

1. **Gather changes** — Run `git diff` and `git diff --cached` to see all changes
2. **Check rules** — Compare changes against `.claude/rules/` standards
3. **Analyze** — Look for bugs, type issues, missing error handling, breaking changes
4. **Report** — Output findings categorized by severity

## Output Format
Report findings as:
- **CRITICAL** — Must fix (bugs, security, broken types, breaking changes)
- **WARNING** — Should fix (missing handling, poor naming, missing tests)
- **SUGGESTION** — Nice to have (refactoring, style)

## Verification Gates

**Gate execution rules:**
- Start ALL gates as ❌ (unchecked)
- Run each gate command in order
- Mark ✅ ONLY when the check is verified
- If ANY gate remains ❌ → STOP and report what could not be verified

- ❌ `git diff` → changes exist to review
- ❌ All project rules files in `.claude/rules/` have been read and referenced
- ❌ Each changed file analyzed individually
- ❌ Breaking change analysis completed (all consumers of modified exports checked)
- ❌ No database IDs or sensitive data exposed in API responses

## Usage
```
/review
```
