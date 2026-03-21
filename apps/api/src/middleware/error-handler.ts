import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import type { ApiResponse } from '@todo-app/shared';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    const response: ApiResponse<null> = {
      data: null,
      error: message,
    };
    return c.json(response, 422);
  }

  if (err instanceof SyntaxError) {
    const response: ApiResponse<null> = {
      data: null,
      error: 'Malformed JSON in request body',
    };
    return c.json(response, 400);
  }

  console.error('Unhandled error:', err instanceof Error ? err.message : 'Unknown error');

  const response: ApiResponse<null> = {
    data: null,
    error: 'Internal server error',
  };
  return c.json(response, 500);
};
