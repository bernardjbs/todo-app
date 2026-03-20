---
disable-model-invocation: true
---

# /build-skill — Skill Builder with Verification Gates

Meta-skill that scaffolds new skills with built-in verification checklists.

## Usage
```
/build-skill deploy-staging
```

## Steps

1. **Prompt for details:**
   - Skill name (from argument)
   - Purpose — what does this skill do?
   - Steps — what actions does it perform?
   - Tools needed — which tools should it have access to?
   - Context — should it fork? Disable model invocation?

2. **Generate SKILL.md** with:
   - Frontmatter (context, allowed-tools, disable-model-invocation as needed)
   - Description and steps
   - **Verification Gates section** — explicit commands that must all pass

3. **Write to `.claude/skills/<name>/SKILL.md`**

## Gate Pattern Template
Every generated skill includes:
```markdown
## Verification Gates
Run each check. ALL must pass (✅) for this skill to succeed.

- [ ] [Gate 1 — specific check command]
- [ ] [Gate 2 — specific check command]
```

When a skill with gates executes:
- Run each gate command in order
- Mark ✅ (pass) or ❌ (fail)
- If ANY gate fails → stop, report which gate failed and why
- If ALL gates pass → proceed / report success

## Verification Gates (for this skill)
- [ ] Skill name is unique (no existing skill with same name in `.claude/skills/`)
- [ ] SKILL.md frontmatter is valid YAML
- [ ] At least one verification gate defined in the generated skill
- [ ] Skill file written to correct directory (`.claude/skills/<name>/SKILL.md`)
