---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Testing Rules

## Structure
- Use `describe` blocks to group related tests
- Use `it` with descriptive names: `it('returns 404 when todo not found')`
- One assertion concept per test — keep tests focused
- Arrange-Act-Assert pattern in each test

## Naming
- Test files: `*.test.ts` for unit tests, `*.spec.ts` for component tests
- Describe blocks match the module/component name
- Test names describe behavior, not implementation

## Mocking
- Mock at module boundaries (database, HTTP, external services)
- Never mock the module under test
- Use `vi.mock()` for module-level mocks
- Reset mocks between tests with `beforeEach`

## Coverage
- Test happy paths AND error cases
- Test edge cases: empty inputs, missing fields, invalid IDs
- API tests: validate response shape matches `ApiResponse<T>` envelope
- Component tests: test user interactions, not internal state
