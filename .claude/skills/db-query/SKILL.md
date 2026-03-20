---
allowed-tools:
  - "Bash(npx *)"
  - "Bash(node *)"
---

# /db-query — Query Supabase Database

Query the Supabase database for debugging and inspection purposes.

## Steps

1. **Accept query description** — What data the user wants to inspect
2. **Construct query** — Build a Supabase JS query using the client
3. **Execute** — Run via `node -e` or `npx tsx` with inline script
4. **Format results** — Display results in a readable table or JSON format

## Example

```
/db-query Show me all incomplete todos
```

Executes:

```bash
node -e "
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from('todos').select('*').eq('completed', false);
  console.table(data);
"
```

## Safety

- Read-only queries only. Never INSERT, UPDATE, or DELETE.
- Tool access is scoped to `Bash(npx *)` and `Bash(node *)` only.
- Always display the query before executing so the user can verify.
- Prefer using the Supabase MCP server (already configured as read-only) over direct client queries. This enforces read-only access at the infrastructure level, not just by convention.
