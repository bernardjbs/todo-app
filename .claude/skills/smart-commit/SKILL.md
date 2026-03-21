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
3. **Security review** — If NOT running inside a `/workflow` pipeline (which has its own reviews), invoke `security-reviewer` agent to scan all changed files. If findings require fixes, apply them, then **re-review**. Continue the fix → re-review loop until a clean pass with no new WARNING or CRITICAL findings. The final pass must always be a verification-only review confirming everything is clean.
4. **Code review** — If NOT running inside a `/workflow` pipeline, invoke `code-reviewer` agent to review all changed files. If findings require fixes, apply them, then **re-review**. Continue the fix → re-review loop until a clean pass with no new WARNING or CRITICAL findings. The final pass must always be a verification-only review confirming everything is clean.
5. **Show breakdown** — Present the proposed commits to the user for approval before committing:
   - List each commit group with its message and files
   - Wait for user confirmation before proceeding
6. **Stage and commit each group** — Create separate commits with conventional commit messages
7. **Push** — Optionally push to remote (confirm with user first)

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
- ❌ Security review passed — no CRITICAL or WARNING findings (re-review until clean)
- ❌ Code review passed — no CRITICAL or WARNING findings (re-review until clean)
- ❌ Breakdown shown to user and approved before committing
- ❌ All commit messages follow conventional commit format
- ❌ Current branch is up to date with remote
- ❌ Each commit is atomic — related changes only

## Usage
```
/smart-commit
/smart-commit --push   # also push after committing
```
