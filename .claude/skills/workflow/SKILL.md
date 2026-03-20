---
disable-model-invocation: true
---

# /workflow — Development Workflow Orchestrator

Guides through the full development lifecycle for a feature. Invoke with a feature description.

## Usage

```
/workflow Add ability to filter todos by status
```

## Pipeline

Execute these steps in order, confirming with the user before each:

### 1. Plan

Invoke the `planner` agent (opus) to analyze the feature, identify files to change, and write a structured implementation plan.

### 2. Issue

Use GitHub MCP to create a GitHub issue from the plan.

### 3. Branch

Invoke `/branch` skill: create `feature/<slug>` branch from issue, open a draft PR.

### 4. Implement

Build the feature according to the plan. Follow the implementation steps and consult the user on any decisions.

### 5. Test

Invoke `/test-report` skill: run `npm test`, generate pass/fail report with coverage.

### 6. Security Review

Invoke `security-reviewer` agent (sonnet): scan for OWASP vulnerabilities, exposed secrets, injection risks, exposed database IDs.

### 7. Code Review

Invoke `code-reviewer` agent (sonnet): review quality, adherence to rules, check for breaking changes.

### 8. Commit & Push

Invoke `/smart-commit` skill: group changed files by type, create separate commits with descriptive messages, push to remote.

### 9. PR Ready

Mark the draft PR as ready for review via GitHub MCP.

## Verification Gates

**Gate execution rules:**

- Start ALL gates as ❌ (unchecked)
- Execute each gate in order — do NOT skip or combine steps
- Mark ✅ ONLY when the step is verified complete
- If ANY gate remains ❌ → STOP and report what was not completed
- Confirm with the user before proceeding to each new step

- ❌ Plan produced and approved by user
- ❌ GitHub issue created with link
- ❌ Branch created and draft PR opened
- ❌ Implementation complete, verified against plan
- ❌ All tests pass with coverage report
- ❌ Security review shows no CRITICAL findings
- ❌ Code review shows no CRITICAL findings
- ❌ All changes committed and pushed
- ❌ PR marked as ready for review
