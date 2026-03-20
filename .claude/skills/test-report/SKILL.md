---
context: fork
---

# /test-report — Test Suite Report

Run the full test suite and generate a structured pass/fail report with coverage stats.

## Steps

1. **Discover tests** — Find all `*.test.ts` and `*.spec.ts` files
2. **Run tests** — Execute `npm test -- --reporter=verbose` for detailed output
3. **Parse results** — Extract pass/fail counts per suite
4. **Coverage** — Run `npm test -- --coverage` if available
5. **Report** — Output structured report

## Output Format
```markdown
## Test Report — [timestamp]

### Summary
- Total: [n] | Passed: [n] ✅ | Failed: [n] ❌ | Skipped: [n] ⏭️

### Suites
| Suite | Tests | Pass | Fail | Status |
|-------|-------|------|------|--------|
| todos.test.ts | 8 | 8 | 0 | ✅ |
| TodoItem.spec.ts | 5 | 4 | 1 | ❌ |

### Failed Tests
- `TodoItem.spec.ts` > "marks todo as completed" — [error message]

### Coverage
| File | Stmts | Branch | Funcs | Lines |
|------|-------|--------|-------|-------|
| ... | ...% | ...% | ...% | ...% |
```

## Verification Gates
- [ ] All test suites discovered (check `apps/` and `packages/`)
- [ ] Test runner executes without crashes
- [ ] Results parsed and formatted
- [ ] Coverage above 70% threshold (if coverage enabled)

## Usage
```
/test-report
```
