# Todo App

A full-stack todo app designed to showcase advanced **Claude Code** workflows. The sophistication is in the Claude Code configuration ecosystem — skills, hooks, agents, MCP servers, memory systems, and model tiering — not the app complexity. The app itself is deliberately minimal (single table CRUD) to keep the focus on the tooling.

## Quick Start

```bash
# Clone and install
git clone https://github.com/bernardjbs/todo-app.git
cd todo-app
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials (see below)

# Start development
npm run dev          # API (port 3001) + frontend (port 5173)
npm run dev:api      # API only
npm run dev:web      # Frontend only
```

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your **Project URL**, **publishable key**, and **secret key** from Project Settings > API
3. Paste them into `.env`
4. Run the migration in the Supabase SQL Editor: `supabase/migrations/20260321000000_create_todos_table.sql`

## Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| Frontend        | Vue 3 (Options API), Vite, Tailwind CSS v4  |
| Backend         | Hono, Node.js, TypeScript                   |
| Database        | Supabase (Postgres) with Row Level Security |
| Testing         | Vitest, @vue/test-utils, happy-dom          |
| Infrastructure  | Docker, GitHub Actions CI/CD                |
| Package Manager | npm (workspaces)                            |

## Architecture

```
todo-app/
├── apps/
│   ├── api/                 # Hono REST API
│   │   ├── src/
│   │   │   ├── db/          # Supabase client singleton
│   │   │   ├── middleware/  # Error handler (Zod → 422, SyntaxError → 400)
│   │   │   ├── routes/      # CRUD routes with Zod validation
│   │   │   └── schemas/     # Zod input validation schemas
│   │   └── package.json
│   └── web/                 # Vue 3 frontend
│       ├── src/
│       │   ├── api/         # Fetch wrapper with error handling
│       │   ├── components/  # TodoForm, TodoItem, TodoList, TodoPage
│       │   └── __tests__/   # Component tests
│       └── package.json
├── packages/
│   └── shared/              # Shared TypeScript types (ApiResponse, Todo)
├── supabase/
│   └── migrations/          # Database migration SQL
├── docker/                  # Production Dockerfiles + nginx config
└── .claude/                 # Claude Code configuration (see below)
```

### API Design

- RESTful endpoints under `/api/v1/`
- Response envelope: `{ data: T | null, error: string | null, meta?: { count } }`
- Zod validation with `.strict()` on all request bodies
- `.maybeSingle()` for clean separation of "not found" vs "database error"
- Internal database `id` (BIGINT) never exposed — only `uuid` in API responses

### Security

- CORS with explicit `ALLOWED_ORIGINS` (never wildcard)
- LIKE pattern injection prevention (escape `\`, `%`, `_`)
- Pagination with clamped limits (max 100)
- Structured error logging (code + hint only, no raw objects)
- Malformed JSON returns 400, not 500

## Claude Code Configuration

This is the core of the portfolio demonstration. The `.claude/` directory contains a complete configuration ecosystem:

### Skills (9 custom slash commands)

| Skill           | Purpose                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `/workflow`     | Full development lifecycle orchestrator: plan → issue → branch → implement → test → security review → code review → commit → PR |
| `/smart-commit` | Analyse changes, group by type, security + code review, then commit with conventional messages                                  |
| `/review`       | Code review against project rules with severity levels (CRITICAL/WARNING/SUGGESTION)                                            |
| `/test-report`  | Run test suite, generate structured pass/fail report                                                                            |
| `/deploy`       | Pre-flight checks, Docker build, push to registry                                                                               |
| `/db-query`     | Query Supabase database for debugging (read-only)                                                                               |
| `/branch`       | Create feature branch from issue, open draft PR                                                                                 |
| `/build-skill`  | Meta-skill: scaffold new skills with verification gates                                                                         |
| `/wrap-up`      | Session continuity: capture state, update memory, write handoff doc                                                             |

Every skill has **verification gates** — explicit checklists that start unchecked (❌) and are marked (✅) only when verified. If any gate fails, execution stops.

### Hooks (6 automated behaviours)

| Hook                     | Event                    | Purpose                                                               |
| ------------------------ | ------------------------ | --------------------------------------------------------------------- |
| `protect-files.sh`       | PreToolUse (Edit/Write)  | Blocks writes to `.env` files                                         |
| `git-safety.sh`          | PreToolUse (Bash)        | Blocks commits to main, force pushes, `.env` staging, broad `git add` |
| `auto-format.sh`         | PostToolUse (Edit/Write) | Runs Prettier on changed files                                        |
| `verify-tests.sh`        | Stop                     | Runs `npm test` before stopping                                       |
| `context-backup.mjs`     | PreCompact               | Backs up session context before compaction                            |
| `context-statusline.mjs` | StatusLine               | Colour-coded context %, branch name, warnings                         |

The git-safety hook uses **Node.js for JSON parsing** (not shell regex) after security review found that regex-based JSON extraction fails on escaped quotes. Pattern matching uses `grep -E` for macOS compatibility.

### Agents (5 with model tiering)

| Agent               | Model  | Purpose                                          |
| ------------------- | ------ | ------------------------------------------------ |
| `planner`           | Opus   | Complex reasoning, architecture decisions        |
| `code-reviewer`     | Sonnet | Quality review, rule adherence, breaking changes |
| `security-reviewer` | Sonnet | OWASP scanning, injection risks, exposed secrets |
| `researcher`        | Haiku  | Fast search and exploration tasks                |
| `formatter`         | Haiku  | Mechanical lint/format tasks                     |

### Rules (5 path-scoped)

| Rule               | Scope                          | Purpose                                         |
| ------------------ | ------------------------------ | ----------------------------------------------- |
| `api-design.md`    | `apps/api/**/*.ts`             | Envelope format, Zod validation, error handling |
| `frontend.md`      | `apps/web/**/*.{ts,vue}`       | Options API, Tailwind-only, accessibility       |
| `testing.md`       | `**/*.test.ts`, `**/*.spec.ts` | Test structure, mock boundaries, coverage       |
| `code-style.md`    | Global                         | Formatting, imports, naming conventions         |
| `documentation.md` | Global                         | UK English, journey summary style               |

### MCP Servers

- **GitHub** (HTTP) — issue/PR management via `gh` commands
- **Supabase** (stdio, read-only) — database inspection

### Memory System

- **Tier 1:** `CLAUDE.md` — project rules, loaded every session
- **Tier 2:** Path-scoped rules in `.claude/rules/`
- **Tier 3:** Auto memory in `~/.claude/projects/.../memory/`
- **Tier 4:** Session handoff docs for continuity across sessions
- **Tier 5:** Context backup hooks for compaction recovery

## CI/CD Pipeline

```
┌──────┐  ┌───────────┐  ┌──────┐
│ Lint │  │ Typecheck  │  │ Test │    ← parallel
└──┬───┘  └─────┬─────┘  └──┬───┘
   └─────────────┼───────────┘
                 ▼
            ┌─────────┐
            │  Build  │               ← after all 3 pass
            └────┬────┘
                 ▼
            ┌──────────┐
            │  Docker  │              ← main push only
            └──────────┘
```

- GitHub Actions with pinned action SHAs (supply chain security)
- Least-privilege permissions (`contents: read` by default)
- Docker images tagged with commit SHA for traceability
- Pushed to GitHub Container Registry (ghcr.io)

## Testing

```bash
npm test             # Run all 58 tests
npm run typecheck    # TypeScript build check
npm run lint         # ESLint
npm run format:check # Prettier
```

| Suite           | Tests | What it covers                                         |
| --------------- | ----- | ------------------------------------------------------ |
| API routes      | 22    | CRUD endpoints, validation, error handling, pagination |
| Vue components  | 17    | TodoForm, TodoItem, TodoList rendering and events      |
| Git safety hook | 19    | Commit protection, force push, .env staging            |

## Commands

```bash
npm run dev            # Start all services
npm run dev:api        # API only
npm run dev:web        # Frontend only
npm run build          # Build all packages
npm test               # Run all tests
npm run lint           # Lint all packages
npm run format         # Format with Prettier
npm run typecheck      # TypeScript check
npm run typecheck:watch # TypeScript watch mode
```

## Licence

MIT
