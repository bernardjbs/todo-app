import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import type { ApiResponse, Todo } from '@todo-app/shared';
import { errorHandler } from '../middleware/error-handler.js';
import todos from './todos.js';

// Mock the Supabase client
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockIlike = vi.fn();
const mockOrder = vi.fn();
const mockRange = vi.fn();
const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();

const chainable = {
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
  eq: mockEq,
  ilike: mockIlike,
  order: mockOrder,
  range: mockRange,
  single: mockSingle,
  maybeSingle: mockMaybeSingle,
};

// Each mock returns the chainable object for method chaining
for (const fn of Object.values(chainable)) {
  fn.mockReturnValue(chainable);
}

vi.mock('../db/supabase.js', () => ({
  supabase: {
    from: vi.fn(() => chainable),
  },
}));

const app = new Hono();
app.onError(errorHandler);
app.route('/api/v1/todos', todos);

function json(res: Response): Promise<ApiResponse<unknown>> {
  return res.json();
}

const sampleTodo: Todo = {
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Buy milk',
  description: null,
  completed: false,
  created_at: '2026-03-21T12:00:00.000Z',
  updated_at: '2026-03-21T12:00:00.000Z',
};

describe('GET /api/v1/todos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const fn of Object.values(chainable)) {
      fn.mockReturnValue(chainable);
    }
  });

  it('returns a list of todos', async () => {
    mockRange.mockResolvedValue({ data: [sampleTodo], error: null, count: 1 });

    const res = await app.request('/api/v1/todos');
    const body = await json(res);

    expect(res.status).toBe(200);
    expect(body.data).toEqual([sampleTodo]);
    expect(body.error).toBeNull();
    expect(body.meta?.count).toBe(1);
  });

  it('returns empty list when no todos', async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    const res = await app.request('/api/v1/todos');
    const body = await json(res);

    expect(res.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.meta?.count).toBe(0);
  });

  it('filters by completed status', async () => {
    mockRange.mockResolvedValue({ data: [sampleTodo], error: null, count: 1 });

    await app.request('/api/v1/todos?completed=false');

    expect(mockEq).toHaveBeenCalledWith('completed', false);
  });

  it('returns 422 for invalid completed value', async () => {
    const res = await app.request('/api/v1/todos?completed=yes');
    const body = await json(res);

    expect(res.status).toBe(422);
    expect(body.error).toBe('completed must be "true" or "false"');
  });

  it('filters by search term', async () => {
    mockRange.mockResolvedValue({ data: [sampleTodo], error: null, count: 1 });

    await app.request('/api/v1/todos?search=milk');

    expect(mockIlike).toHaveBeenCalledWith('title', '%milk%');
  });

  it('returns 500 on database error', async () => {
    mockRange.mockResolvedValue({
      data: null,
      error: { message: 'DB error', code: 'PGRST000', hint: null },
      count: null,
    });

    const res = await app.request('/api/v1/todos');
    const body = await json(res);

    expect(res.status).toBe(500);
    expect(body.data).toBeNull();
    expect(body.error).toBe('Failed to fetch todos');
  });
});

describe('GET /api/v1/todos/:uuid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const fn of Object.values(chainable)) {
      fn.mockReturnValue(chainable);
    }
  });

  it('returns a single todo', async () => {
    mockMaybeSingle.mockResolvedValue({ data: sampleTodo, error: null });

    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`);
    const body = await json(res);

    expect(res.status).toBe(200);
    expect(body.data).toEqual(sampleTodo);
    expect(body.error).toBeNull();
  });

  it('returns 404 for missing todo', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`);
    const body = await json(res);

    expect(res.status).toBe(404);
    expect(body.data).toBeNull();
    expect(body.error).toBe('Todo not found');
  });

  it('returns 500 for database error', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: 'DB error', code: 'PGRST000', hint: null },
    });

    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`);
    const body = await json(res);

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed to fetch todo');
  });

  it('returns 422 for invalid uuid', async () => {
    const res = await app.request('/api/v1/todos/not-a-uuid');
    const body = await json(res);

    expect(res.status).toBe(422);
    expect(body.data).toBeNull();
    expect(body.error).toContain('Invalid todo identifier');
  });
});

describe('POST /api/v1/todos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const fn of Object.values(chainable)) {
      fn.mockReturnValue(chainable);
    }
  });

  it('creates a todo with valid input', async () => {
    mockSingle.mockResolvedValue({ data: sampleTodo, error: null });

    const res = await app.request('/api/v1/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Buy milk' }),
    });
    const body = await json(res);

    expect(res.status).toBe(201);
    expect(body.data).toEqual(sampleTodo);
    expect(body.error).toBeNull();
  });

  it('returns 422 for missing title', async () => {
    const res = await app.request('/api/v1/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const body = await json(res);

    expect(res.status).toBe(422);
    expect(body.data).toBeNull();
  });

  it('returns 422 for empty title', async () => {
    const res = await app.request('/api/v1/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    const body = await json(res);

    expect(res.status).toBe(422);
    expect(body.data).toBeNull();
    expect(body.error).toContain('Title is required');
  });

  it('returns 422 for extra fields (strict mode)', async () => {
    const res = await app.request('/api/v1/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test', extraField: true }),
    });
    const body = await json(res);

    expect(res.status).toBe(422);
    expect(body.data).toBeNull();
  });
});

describe('PATCH /api/v1/todos/:uuid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const fn of Object.values(chainable)) {
      fn.mockReturnValue(chainable);
    }
  });

  it('updates a todo', async () => {
    const updated = { ...sampleTodo, completed: true };
    mockMaybeSingle.mockResolvedValue({ data: updated, error: null });

    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    const body = await json(res);

    expect(res.status).toBe(200);
    expect(body.data).toEqual(updated);
  });

  it('returns 404 for missing todo', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    const body = await json(res);

    expect(res.status).toBe(404);
    expect(body.error).toBe('Todo not found');
  });

  it('returns 422 for invalid input', async () => {
    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: 'not-a-boolean' }),
    });
    const body = await json(res);

    expect(res.status).toBe(422);
    expect(body.data).toBeNull();
  });

  it('returns 422 for empty body', async () => {
    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const body = await json(res);

    expect(res.status).toBe(422);
    expect(body.error).toContain('At least one field is required');
  });
});

describe('DELETE /api/v1/todos/:uuid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const fn of Object.values(chainable)) {
      fn.mockReturnValue(chainable);
    }
  });

  it('deletes a todo', async () => {
    mockMaybeSingle.mockResolvedValue({ data: sampleTodo, error: null });

    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`, {
      method: 'DELETE',
    });
    const body = await json(res);

    expect(res.status).toBe(200);
    expect(body.data).toEqual(sampleTodo);
  });

  it('returns 404 for missing todo', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const res = await app.request(`/api/v1/todos/${sampleTodo.uuid}`, {
      method: 'DELETE',
    });
    const body = await json(res);

    expect(res.status).toBe(404);
    expect(body.error).toBe('Todo not found');
  });
});

describe('Search escaping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const fn of Object.values(chainable)) {
      fn.mockReturnValue(chainable);
    }
  });

  it('escapes LIKE metacharacters in search', async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await app.request('/api/v1/todos?search=100%25');

    expect(mockIlike).toHaveBeenCalledWith('title', '%100\\%%');
  });

  it('escapes underscore in search', async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await app.request('/api/v1/todos?search=foo_bar');

    expect(mockIlike).toHaveBeenCalledWith('title', '%foo\\_bar%');
  });
});
