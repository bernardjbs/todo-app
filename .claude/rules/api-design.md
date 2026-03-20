---
paths:
  - "apps/api/**/*.ts"
---

# API Design Rules

## Request Validation

- Validate ALL request bodies with Zod schemas
- Define schemas adjacent to route handlers
- Use `.parse()` (throws) in routes — the error handler catches ZodErrors
- Never trust client input — validate types, lengths, and formats

## Response Envelope

Every response MUST use the standard envelope:

```ts
{ data: T | null, error: string | null, meta?: { count?: number } }
```

- Success: `{ data: result, error: null }`
- Error: `{ data: null, error: "message" }`
- Never return raw data without the envelope

## Hono Middleware

- Use `Hono.route()` for grouping related endpoints
- Apply CORS middleware globally with an explicit origin allowlist from `ALLOWED_ORIGINS` env var. Never use wildcard (`*`) in production.
- Apply logger middleware in development
- Error handler middleware catches all errors and returns envelope format

## Error Handling

- `400` — Bad request (malformed input)
- `404` — Resource not found
- `422` — Validation error (Zod failure)
- `500` — Internal server error (unexpected)
- Always return JSON error responses, never HTML

## Database Access

- Use Supabase client from `src/db/supabase.ts` singleton
- Handle Supabase errors explicitly — check `.error` on every query
- Never expose internal DB errors to clients
