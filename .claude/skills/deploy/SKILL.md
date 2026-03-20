---
disable-model-invocation: true
context: fork
---

# /deploy — Deploy to Oracle Cloud

Pre-flight checks, Docker build, push to registry, and health verification.
Target deployment: Oracle Cloud Infrastructure (OCI).

## Steps

1. **Pre-flight checks** — Run all verification gates before proceeding
2. **Docker build** — Build API and Web images with `docker compose build`
3. **Push to registry** — Push images to OCI Container Registry (or ghcr.io)
4. **Health check** — Verify the deployed services respond correctly

## Verification Gates

**Gate execution rules:**
- Start ALL gates as ❌ (unchecked)
- Run each gate command in order
- Mark ✅ ONLY when the check command passes
- If ANY gate remains ❌ → STOP immediately, report which gate failed and why
- If ALL gates are ✅ → proceed with deployment

- ❌ `git status` → working tree is clean
- ❌ `npm test` → all tests pass
- ❌ `npm run lint` → no lint errors
- ❌ `npm run build` → build succeeds
- ❌ No `.env` files in staged changes
- ❌ `docker compose build` → Docker images build successfully

## Usage
```
/deploy
```

## Notes
- This skill has side effects (pushes images) — it is manual-only, never auto-invoked
- Always runs in a forked context to avoid polluting the main session
- If any gate fails, stop immediately and report which gate failed and why
