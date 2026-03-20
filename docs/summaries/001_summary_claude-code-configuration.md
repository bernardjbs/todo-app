# Journey Summary 001: Claude Code Configuration

**Date:** 2026-03-20
**Branch:** `feature/1-claude-code-config`
**Phase:** 1 of 4

## The Story

Before jumping into any application code, I spent the first session setting up Claude Code's configuration. The thinking was that getting the tooling right early would save time later. Whether that bet pays off remains to be seen, but it felt like the right call.

I started by writing an implementation plan (`docs/implementation-plan.md`) to map out what the project would look like across four phases. Then came `CLAUDE.md`, which captures the tech stack, coding standards, and conventions. Having one file as the source of truth seemed better than scattering decisions across multiple places.

The bulk of the work went into five areas:

1. **Path-scoped rules** (`.claude/rules/`). Four files for code style, API design, frontend, and testing. The idea is that rules load based on context, so API conventions don't get in the way when working on frontend code.

2. **Hooks** (`.claude/hooks/`). Five scripts that plug into Claude Code's lifecycle. Things like blocking writes to `.env` files, running Prettier after edits, and capturing session state for recovery. I'm not sure yet how well the context backup hook will work in practice.

3. **MCP servers**. GitHub and Supabase integrations so Claude can interact with both without leaving the CLI. Supabase is set to read-only, which felt like a sensible default.

4. **Agents**. Five agents with different model assignments. The more expensive models handle planning and code review, while cheaper ones handle research and formatting. It will be interesting to see if the tiering actually makes a noticeable difference.

5. **Skills**. Nine slash commands for common workflows like deploying, committing, reviewing, and wrapping up sessions. These are meant to keep things consistent, though I suspect some will need tweaking once I actually start using them regularly.

## What I Learned

I went with Options API over Composition API for Vue. It's what I know better, and for a project meant to showcase Claude Code workflows rather than cutting-edge Vue patterns, that seemed like the right trade-off.

I discovered that `disable-model-invocation: true` in skills stops Claude from calling the skill automatically, but I can still type the slash command myself. Handy for things like `/smart-commit` where I want to stay in the loop.

I tried to put security rules in multiple places (CLAUDE.md, the security reviewer agent, and the API design rules). The duplication is deliberate. If one layer gets missed, the others should catch it. Whether that actually works in practice is something I'll find out.

The wrap-up skill turned out to be more important than I expected. I forgot to run it at the end of this session, which meant the journey summary and some memory updates didn't get written. I'm backfilling this summary in the next session, which kind of proves the point.

## Key Decisions

| Decision           | Choice                                   | Reasoning                                    |
| ------------------ | ---------------------------------------- | -------------------------------------------- |
| Vue API style      | Options API                              | What I'm more comfortable with               |
| Semicolons         | Required                                 | Personal preference                          |
| Deployment target  | Oracle Cloud                             | Already have infrastructure there            |
| Commit strategy    | Logical groups                           | Keep plan, config, and code commits separate |
| Summary naming     | `NNN_summary_<topic>.md`                 | Easy to find and browse in order             |
| Verification gates | Start unchecked, mark only when verified | Avoids ticking things off prematurely        |

## Takeaways

Setting up configuration before writing code felt slow in the moment, but the second session already benefited from it. The security reviewer agent flagged a few things worth addressing in the first PR.

The three-tier memory system (auto-loaded MEMORY.md, on-demand handoff file, backup hooks) seems promising for keeping context across sessions. Time will tell if it holds up.

Biggest lesson: always run `/wrap-up` before ending a session. Forgetting it means losing context, which is the whole thing it's designed to prevent.
