# Todo App Portfolio Project — Implementation Plan

## Context

A full-stack todo app designed to showcase advanced Claude Code workflows. The **sophistication is in the Claude Code configuration ecosystem**, not the app complexity. The app itself is deliberately minimal (single table CRUD) — the value is in the skills, hooks, MCP servers, agents, memory systems, model tiering, and worktree workflows that surround it.

Tech stack: TypeScript, Vue 3, Vite, Tailwind CSS, Hono, Node.js, Supabase (Postgres), Docker, GitHub Actions CI/CD. Using npm for package management.

---

## Phase 1: Foundation — Claude Code Configuration

> All Claude Code config files created before any application code. This is the core of the portfolio demonstration.

### Step 1.1: Git init + `.gitignore`

- `git init`
- Create `.gitignore` (node_modules, dist, .env*, .claude/settings.local.json, .claude/worktrees/, coverage/, .DS_Store)

### Step 1.2: `CLAUDE.md` — Project Rules & Memory Root

Project overview, tech stack, monorepo structure, build/test/lint commands, coding standards (strict TS, Zod validation, Vue 3 Composition API, Tailwind-only styling), API design conventions (REST, response envelope `{ data, error, meta }`), git conventions (conventional commits), worktree workflow notes, memory system notes.

Target: <150 lines. Concise and scannable.

### Step 1.3: Path-Specific Rules in `.claude/rules/`

| File | `paths:` glob | Purpose |
|------|---------------|---------|
| `api-design.md` | `apps/api/**/*.ts` | Zod validation, Hono middleware, response envelope, error handling |
| `frontend.md` | `apps/web/**/*.{ts,vue}` | Vue 3 Composition API (`<script setup>`), composables for reuse, Tailwind-only, accessibility |
| `testing.md` | `**/*.test.ts`, `**/*.spec.ts` | describe/it blocks, mock boundaries, test naming, error case coverage |
| `code-style.md` | *(no path filter — global)* | 2-space indent, single quotes, no semicolons, import ordering, file naming |

### Step 1.4: Custom Skills in `.claude/skills/`

| Skill | Key config | Purpose |
|-------|------------|---------|
| **deploy** | `disable-model-invocation: true`, `context: fork` | Pre-flight checks → Docker build → push to registry → verify health |
| **review** | `context: fork` | Git diff → check against rules → report CRITICAL/WARNING/SUGGESTION |
| **db-query** | `allowed-tools: Bash(npx *), Bash(node *)` | Query Supabase for debugging/inspection |
| **workflow** | `disable-model-invocation: true` | Orchestrator: plan → issue → branch → implement → test → review → commit → PR |
| **test-report** | `context: fork` | Run full test suite, generate structured pass/fail report with coverage |
| **smart-commit** | `disable-model-invocation: true` | Group changed files by type, create separate descriptive commits |
| **branch** | `disable-model-invocation: true` | Create feature branch from issue, open draft PR via GitHub MCP |
| **build-skill** | `disable-model-invocation: true` | Meta-skill: scaffold new skills with verification gate checklists |
| **wrap-up** | `disable-model-invocation: true` | Session continuity: capture state, update memory, write handoff doc |

### Step 1.5: Hooks in `.claude/settings.json`

| Event | Matcher | Hook script | Behavior |
|-------|---------|-------------|----------|
| `PreToolUse` | `Edit\|Write` | `protect-files.sh` | Blocks writes to `.env*` files |
| `PostToolUse` | `Edit\|Write` | `auto-format.sh` | Runs Prettier on changed files |
| `Stop` | *(none)* | `verify-tests.sh` | Runs `npm test` — fix before stopping |
| `PreCompact` | *(none)* | `context-backup.mjs` | Extracts key context, writes backup before compaction |
| *(StatusLine)* | *(always)* | `context-statusline.mjs` | Displays token usage + context remaining % |

### Step 1.6: MCP Servers

GitHub MCP (HTTP) and Supabase MCP (stdio, read-only) configured in `.claude/.mcp.json`.

### Step 1.7: Custom Agents in `.claude/agents/`

| Agent | Model | Rationale |
|-------|-------|-----------|
| **planner** | `opus` | Complex reasoning, worktree isolation, read-only |
| **code-reviewer** | `sonnet` | Balanced analysis for detailed review |
| **researcher** | `haiku` | Speed-optimized for search tasks |
| **security-reviewer** | `sonnet` | OWASP scanning, security patterns |
| **formatter** | `haiku` | Mechanical lint/format tasks |

### Step 1.9: Development Workflow Orchestrator (`/workflow`)

Pipeline: Plan → Issue → Branch → Implement → Test → Security Review → Code Review → Commit & Push → PR Ready. Each step confirms before proceeding.

### Step 1.10: Auto Memory Bootstrap

Save key architectural decisions to auto memory for future session context.

---

## Phase 2: Project Scaffolding — Monorepo Structure

### Step 2.1: Directory structure

```
todo-app/
├── apps/
│   ├── web/              # Vue 3 + Vite + Tailwind frontend
│   └── api/              # Hono + Node.js backend
├── packages/
│   └── shared/           # Shared TypeScript types
├── docker/
├── supabase/migrations/
├── docs/summaries/
└── .github/workflows/
```

### Step 2.2: Package files

- Root `package.json` with npm workspaces (`apps/*`, `packages/*`)
- Root `tsconfig.json` with strict mode
- Package-specific configs for shared, api, and web

### Step 2.3: Install dependencies + initial commit

---

## Phase 3: Implementation — Application Code

### Step 3.1: Shared types (`packages/shared/`)
- `Todo`, `CreateTodoInput`, `UpdateTodoInput` interfaces
- `ApiResponse<T>` envelope type
- `TodoFilters` type

### Step 3.2: Database migration
- `todos` table with UUID PK, title, description, completed, timestamps
- `update_updated_at()` trigger
- RLS enabled with permissive policy

### Step 3.3: Backend API (`apps/api/`)
- Hono app with CORS, logger, health endpoint, error handler
- Supabase client singleton
- Full CRUD routes with Zod validation
- Unit tests mocking Supabase

### Step 3.4: Frontend (`apps/web/`)
- Vue 3 with Composition API
- Composables for todo CRUD operations
- Components: TodoForm, TodoList, TodoItem, TodoPage
- Component tests with @vue/test-utils

### Step 3.5: Docker
- Multi-stage Dockerfiles for API and Web
- nginx config for SPA routing
- docker-compose.yml

### Step 3.6: CI/CD
- GitHub Actions: lint → test → build → docker push
- Node.js 22, push to ghcr.io

### Step 3.7: Test suite verification

---

## Phase 4: Documentation

### Journey Summaries (`docs/summaries/`)
1. Claude Code Configuration
2. Model Tiering Strategy
3. Worktree Workflow
4. Memory Architecture
5. Integration Ecosystem

### `docs/MY_SUPABASE_DOC.md`
Tutorial-style Supabase learning journal covering setup, schema, RLS, CRUD, filtering, error handling, MCP integration, migrations, and troubleshooting.

### `README.md`
Project overview, quick start, architecture, Claude Code features demonstrated.

---

## Verification Plan

1. Config validation — all `.claude/` files load correctly
2. Agent invocation — each custom agent works
3. Skills — `/deploy`, `/review`, `/db-query` trigger correctly
4. Hooks — PreToolUse blocks `.env` edits, PostToolUse formats, Stop runs tests
5. MCP — GitHub and Supabase servers connected
6. Tests — `npm test` passes
7. Build — `npm run build` succeeds
8. Docker — `docker compose up` runs both services
9. E2E — CRUD operations through the UI
10. CI — GitHub Actions workflow passes
