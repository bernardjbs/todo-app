---
disable-model-invocation: true
---

# /wrap-up — Session Wrap-Up & Continuity

Captures session state, updates memory, writes handoff doc, updates journey summary, and generates a resume prompt for the next session.

## Steps

### 1. Capture Session State

```bash
git status                  # Uncommitted changes
git log --oneline -10       # Recent commits this session
git diff --stat             # Files currently modified
git branch --show-current   # Current branch
```

### 2. Update Auto Memory

- Read `~/.claude/projects/-Users-bernard-code-todo-app/memory/MEMORY.md`
- Append session learnings: decisions made, patterns discovered, issues encountered
- Update the `## Outstandings` section with future work items noticed this session
- Keep under 200 lines (trim oldest entries if needed)

### 3. Write Session Handoff

Write to `~/.claude/projects/-Users-bernard-code-todo-app/memory/session-handoff.md`:

```markdown
# Session Handoff — [date/time]

## Completed This Session

- [list of what was accomplished]

## In Progress

- [current file/feature being worked on]
- [branch: feature/xyz]
- [what remains to finish]

## Next Steps (ordered)

1. [first thing to do next session]
2. [second thing]

## Decisions Made

- [key decisions and their rationale]

## Known Issues / Blockers

- [any problems encountered]

## Outstandings (Future Work)

- [items NOT part of current branch — tech debt, improvements, ideas]

## Files Modified This Session

- [list from git diff]
```

### 4. Update Journey Summary

Append to the appropriate file in `docs/summaries/` (naming: `NNN_summary_<topic>.md`, e.g. `001_summary_project-setup.md`) documenting this session's work:

- Write in **narrative style** from the user's first-person perspective ("I did", "I learned")
- Use natural, humble language. Be honest about uncertainty ("time will tell", "not sure yet", "remains to be seen")
- Do not sound overly confident or like an AI writing marketing copy
- Use proper punctuation (full stops, commas). Never use dashes as sentence punctuation
- Use UK English (e.g. "colour", "organised", "judgement")
- Include what was learned and key takeaways
- Document decisions with the reasoning behind them
- Note any surprises or things that didn't go as expected
- This is a personal learning journal, not a changelog

Example tone:

> "I spent a while trying to get Zod validation errors to work at the route level before realising they need to be caught in middleware. It wasn't obvious at first, but centralising error handling in Hono middleware keeps routes clean and gives consistent API responses. Something to remember for next time."

### 5. Capture Outstandings

Scan for observations made during the session not related to the current branch:

- Future improvements, tech debt, ideas noticed in passing
- These go into `## Outstandings` in both the handoff and `MEMORY.md`
- Examples: "Consider adding rate limiting", "Shared types could use Zod schemas"

### 6. Generate Resume Prompt

Output a ready-to-paste prompt:

> "Continue from session handoff. I was working on [feature] on branch [branch]. Read `~/.claude/projects/-Users-bernard-code-todo-app/memory/session-handoff.md` for full context. Next step: [step]."

## Verification Gates

**Gate execution rules:**

- Start ALL gates as ❌ (unchecked)
- Run each gate command in order
- Mark ✅ ONLY when the check is verified
- If ANY gate remains ❌ → report what was not completed

- ❌ `MEMORY.md` updated with session learnings
- ❌ `session-handoff.md` written with all sections populated
- ❌ Journey summary in `docs/summaries/` updated with narrative + takeaways
- ❌ No uncommitted changes (or explicitly documented as "in progress")
- ❌ All tests still pass (or failures documented)
- ❌ No new `TODO`/`FIXME` in code without corresponding tracking
- ❌ Outstandings captured (future work items not related to current branch)

## Memory Architecture

- **Tier 1 (automatic):** `MEMORY.md` loaded on every session start
- **Tier 2 (on-demand):** `session-handoff.md` with detailed context
- **Tier 3 (backup):** Context recovery hook backups in `.claude/backups/`
