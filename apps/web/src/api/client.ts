import type {
  ApiResponse,
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilters,
} from '@todo-app/shared';

const API_BASE = '/api/v1';

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        data: null,
        error: (body as ApiResponse<unknown>)?.error ?? 'Something went wrong. Please try again.',
      };
    }

    return res.json() as Promise<ApiResponse<T>>;
  } catch {
    return { data: null, error: 'Unable to connect to the server. Please check your connection.' };
  }
}

export function fetchTodos(filters?: TodoFilters): Promise<ApiResponse<Todo[]>> {
  const params = new URLSearchParams();
  if (filters?.completed !== undefined) {
    params.set('completed', String(filters.completed));
  }
  if (filters?.search) {
    params.set('search', filters.search);
  }
  const query = params.toString();
  return request<Todo[]>(`/todos${query ? `?${query}` : ''}`);
}

export function fetchTodo(uuid: string): Promise<ApiResponse<Todo>> {
  return request<Todo>(`/todos/${uuid}`);
}

export function createTodo(input: CreateTodoInput): Promise<ApiResponse<Todo>> {
  return request<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTodo(uuid: string, input: UpdateTodoInput): Promise<ApiResponse<Todo>> {
  return request<Todo>(`/todos/${uuid}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteTodo(uuid: string): Promise<ApiResponse<Todo>> {
  return request<Todo>(`/todos/${uuid}`, {
    method: 'DELETE',
  });
}
