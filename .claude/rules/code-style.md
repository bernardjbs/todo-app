# Code Style Rules (Global)

## Formatting
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multiline structures
- Max line length: 100 characters

## Imports
- Order: node builtins → external packages → internal packages → relative imports
- Blank line between import groups
- Use `type` imports for type-only imports: `import type { Todo } from '@todo-app/shared';`

## File Naming
- `kebab-case` for all files and directories
- Vue components: `PascalCase.vue` (exception to kebab-case)
- Composables: `use-<name>.ts`
- Test files: `<name>.test.ts` or `<name>.spec.ts`

## TypeScript
- Prefer `interface` over `type` for object shapes
- Use `const` by default, `let` only when reassignment is needed
- No `enum` — use `as const` objects or union types
- Explicit return types on exported functions
