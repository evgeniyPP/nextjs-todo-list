import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  isCompleted: z.boolean(),
  createdAt: z.date({ coerce: true }),
});
export type Todo = z.infer<typeof todoSchema>;

export const voidResponseSchema = z.object({
  success: z.boolean(),
});
export type VoidResponse = z.infer<typeof voidResponseSchema>;

export const addTodoFormSchema = z.object({
  text: z.string().min(1, { message: 'Text is required' }),
});
export type AddTodoForm = z.infer<typeof addTodoFormSchema>;
