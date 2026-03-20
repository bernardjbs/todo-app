export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta?: { count?: number };
}

/** ISO 8601 date string (e.g. "2026-03-21T12:00:00.000Z") */
export type ISODateString = string;

export interface Todo {
  uuid: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export interface TodoFilters {
  completed?: boolean;
  /** Matches against todo title (case-insensitive) */
  search?: string;
}
