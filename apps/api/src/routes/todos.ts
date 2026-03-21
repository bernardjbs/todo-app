import { Hono } from 'hono';
import type { ApiResponse, Todo } from '@todo-app/shared';
import { supabase } from '../db/supabase.js';
import { createTodoSchema, updateTodoSchema, uuidSchema, searchSchema } from '../schemas/todo.js';

/** Columns to select — never include internal `id` */
const TODO_COLUMNS = 'uuid, title, description, completed, created_at, updated_at';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/** Escape LIKE/ILIKE pattern metacharacters */
function escapeLikePattern(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

const todos = new Hono();

// GET /api/v1/todos — list all todos with optional filters
todos.get('/', async (c) => {
  let query = supabase.from('todos').select(TODO_COLUMNS, { count: 'exact' });

  const completed = c.req.query('completed');
  if (completed !== undefined) {
    if (completed === 'true') {
      query = query.eq('completed', true);
    } else if (completed === 'false') {
      query = query.eq('completed', false);
    } else {
      const response: ApiResponse<null> = {
        data: null,
        error: 'completed must be "true" or "false"',
      };
      return c.json(response, 422);
    }
  }

  const search = c.req.query('search');
  if (search) {
    const validated = searchSchema.parse(search);
    query = query.ilike('title', `%${escapeLikePattern(validated)}%`);
  }

  const limit = Math.max(Math.min(Number(c.req.query('limit')) || DEFAULT_LIMIT, MAX_LIMIT), 1);
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0);
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase error [%s]: %s', error.code, error.hint ?? 'no hint');
    const response: ApiResponse<null> = { data: null, error: 'Failed to fetch todos' };
    return c.json(response, 500);
  }

  const response: ApiResponse<Todo[]> = {
    data: data as Todo[],
    error: null,
    meta: count != null ? { count } : undefined,
  };
  return c.json(response);
});

// GET /api/v1/todos/:uuid — get single todo
todos.get('/:uuid', async (c) => {
  const uuid = uuidSchema.parse(c.req.param('uuid'));

  const { data, error } = await supabase
    .from('todos')
    .select(TODO_COLUMNS)
    .eq('uuid', uuid)
    .maybeSingle();

  if (error) {
    console.error('Supabase error [%s]: %s', error.code, error.hint ?? 'no hint');
    const response: ApiResponse<null> = { data: null, error: 'Failed to fetch todo' };
    return c.json(response, 500);
  }

  if (!data) {
    const response: ApiResponse<null> = { data: null, error: 'Todo not found' };
    return c.json(response, 404);
  }

  const response: ApiResponse<Todo> = { data: data as Todo, error: null };
  return c.json(response);
});

// POST /api/v1/todos — create a new todo
todos.post('/', async (c) => {
  const body = createTodoSchema.parse(await c.req.json());

  const { data, error } = await supabase.from('todos').insert(body).select(TODO_COLUMNS).single();

  if (error) {
    console.error('Supabase error [%s]: %s', error.code, error.hint ?? 'no hint');
    const response: ApiResponse<null> = { data: null, error: 'Failed to create todo' };
    return c.json(response, 500);
  }

  const response: ApiResponse<Todo> = { data: data as Todo, error: null };
  return c.json(response, 201);
});

// PATCH /api/v1/todos/:uuid — update a todo
todos.patch('/:uuid', async (c) => {
  const uuid = uuidSchema.parse(c.req.param('uuid'));
  const body = updateTodoSchema.parse(await c.req.json());

  const { data, error } = await supabase
    .from('todos')
    .update(body)
    .eq('uuid', uuid)
    .select(TODO_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error('Supabase error [%s]: %s', error.code, error.hint ?? 'no hint');
    const response: ApiResponse<null> = { data: null, error: 'Failed to update todo' };
    return c.json(response, 500);
  }

  if (!data) {
    const response: ApiResponse<null> = { data: null, error: 'Todo not found' };
    return c.json(response, 404);
  }

  const response: ApiResponse<Todo> = { data: data as Todo, error: null };
  return c.json(response);
});

// DELETE /api/v1/todos/:uuid — delete a todo
todos.delete('/:uuid', async (c) => {
  const uuid = uuidSchema.parse(c.req.param('uuid'));

  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('uuid', uuid)
    .select(TODO_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error('Supabase error [%s]: %s', error.code, error.hint ?? 'no hint');
    const response: ApiResponse<null> = { data: null, error: 'Failed to delete todo' };
    return c.json(response, 500);
  }

  if (!data) {
    const response: ApiResponse<null> = { data: null, error: 'Todo not found' };
    return c.json(response, 404);
  }

  const response: ApiResponse<Todo> = { data: data as Todo, error: null };
  return c.json(response);
});

export default todos;
