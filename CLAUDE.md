# Todo App — Claude Code Project Rules

## Overview

Full-stack todo app showcasing advanced Claude Code workflows. The sophistication is in the Claude Code configuration ecosystem (skills, hooks, MCP servers, agents, memory systems, model tiering), not the app complexity.

## Tech Stack

- **Frontend:** Vue 3 (Options API, `defineComponent()`), Vite, Tailwind CSS v4
- **Backend:** Hono, Node.js, TypeScript
- **Database:** Supabase (Postgres)
- **Infrastructure:** Docker, GitHub Actions CI/CD
- **Package Manager:** npm (with workspaces)

## Monorepo Structure

```
apps/web/     — Vue 3 frontend
apps/api/     — Hono backend
packages/shared/ — Shared TypeScript types
```

## Commands

```bash
npm run dev          # Start all services (web + api)
npm run build        # Build all packages
npm test             # Run all tests
npm run lint         # Lint all packages
npm run format       # Format with Prettier
npm run dev:web      # Frontend only
npm run dev:api      # Backend only
```

## Coding Standards

- **TypeScript:** Strict mode, no `any`, explicit return types on exported functions
- **Validation:** Zod for all API input validation
- **Vue:** Options API with `defineComponent()`, composables for shared logic
- **Styling:** Tailwind CSS only — no custom CSS files, no inline styles
- **Formatting:** 2-space indent, single quotes, semicolons required (Prettier enforced)

## API Design

- RESTful endpoints under `/api/v1/`
- Response envelope: `{ data: T | null, error: string | null, meta?: object }`
- Zod validation on all request bodies
- Proper HTTP status codes (201 created, 404 not found, 422 validation error)

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- Branch naming: `feature/<slug>`, `fix/<slug>`
- Always run tests before committing

## Key Config Files

- `.claude/rules/` — Path-scoped coding rules
- `.claude/hooks/` — Pre/post tool hooks + context recovery
- `.claude/agents/` — Custom agents with model tiering
- `.claude/skills/` — Custom slash commands
- `.claude/.mcp.json` — MCP server config (GitHub, Supabase)

## Memory System

- **Project memory:** This file (checked into git)
- **Semantic memory:** Path-scoped rules in `.claude/rules/`
- **Auto memory:** Machine-local learnings in `~/.claude/projects/.../memory/`
- **Session continuity:** `/wrap-up` skill + context recovery hooks
