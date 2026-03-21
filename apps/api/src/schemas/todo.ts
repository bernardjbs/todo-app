import { z } from 'zod';

export const createTodoSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or fewer'),
    description: z.string().max(1000, 'Description must be 1000 characters or fewer').optional(),
  })
  .strict();

export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(200, 'Title must be 200 characters or fewer')
      .optional(),
    description: z
      .string()
      .max(1000, 'Description must be 1000 characters or fewer')
      .nullable()
      .optional(),
    completed: z.boolean().optional(),
  })
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, 'At least one field is required');

export const uuidSchema = z.string().uuid('Invalid todo identifier');

export const searchSchema = z
  .string()
  .min(1, 'Search term cannot be empty')
  .max(200, 'Search term must be 200 characters or fewer');
