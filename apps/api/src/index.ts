import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { ApiResponse } from '@todo-app/shared';
import { errorHandler } from './middleware/error-handler.js';
import todos from './routes/todos.js';

const app = new Hono();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173'];

if (process.env.NODE_ENV !== 'production') {
  app.use('*', logger());
}
app.use(
  '/api/*',
  cors({
    origin: allowedOrigins,
  }),
);

app.onError(errorHandler);

app.get('/api/v1/health', (c) => {
  const response: ApiResponse<{ status: string }> = {
    data: { status: 'ok' },
    error: null,
  };
  return c.json(response);
});

app.route('/api/v1/todos', todos);

app.notFound((c) => {
  const response: ApiResponse<null> = { data: null, error: 'Not found' };
  return c.json(response, 404);
});

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on http://localhost:${port}`);
});

export default app;
