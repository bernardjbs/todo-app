---
disable-model-invocation: true
---

# /smart-commit — Intelligent Grouped Commits

Analyze changed files, group by relevance, stage and commit each group with descriptive messages.

## Steps

1. **Analyze changes** — Run `git status` and `git diff` to see all modifications
2. **Group files** — Categorize changes into logical groups:
   - **feature** — Application code (routes, components, composables)
   - **test** — Test files
   - **config** — Configuration files (tsconfig, package.json, vite config)
   - **docs** — Documentation and markdown files
   - **style** — Formatting-only changes
3. **Show breakdown** — Present the proposed commits to the user for approval before committing:
   - List each commit group with its message and files
   - Wait for user confirmation before proceeding
4. **Stage and commit each group** — Create separate commits with conventional commit messages
5. **Push** — Optionally push to remote (confirm with user first)

## Commit Message Format
Use conventional commits:
- `feat: add todo filtering by status`
- `test: add TodoItem component tests`
- `chore: update tsconfig compiler options`
- `docs: add API design documentation`

## Verification Gates

**Gate execution rules:**

- Start ALL gates as ❌ (unchecked)
- Run each gate command in order
- Mark ✅ ONLY when the check is verified
- If ANY gate remains ❌ → STOP and report what was not completed

- ❌ No secrets in staged files (no `.env`, no API keys in code)
- ❌ Breakdown shown to user and approved before committing
- ❌ All commit messages follow conventional commit format
- ❌ Current branch is up to date with remote
- ❌ Each commit is atomic — related changes only

## Usage
```
/smart-commit
/smart-commit --push   # also push after committing
```
