---
disable-model-invocation: true
---

# /branch — Create Feature Branch + Draft PR

Create a feature branch from an issue number or name, and open a draft PR via GitHub MCP.

## Steps

1. **Parse input** — Accept issue number (e.g., `#12`) or feature name (e.g., `todo-filters`)
2. **Ensure main is current** — Pull latest from origin/main
3. **Create branch** — `git checkout -b feature/<slug>` from main
4. **Push branch** — `git push -u origin feature/<slug>`
5. **Open draft PR** — Use GitHub MCP to create a draft pull request linked to the issue

## Branch Naming
- Features: `feature/<slug>` (e.g., `feature/todo-filters`)
- Fixes: `fix/<slug>` (e.g., `fix/api-validation`)
- Slug derived from issue title or user input, lowercase, hyphenated

## Verification Gates
- [ ] Main branch is up to date with remote
- [ ] Issue exists (if issue number provided)
- [ ] Branch name follows convention (`feature/*` or `fix/*`)
- [ ] Branch created and pushed successfully
- [ ] Draft PR created and linked to issue

## Usage
```
/branch #12
/branch todo-filters
/branch fix/api-cors
```
