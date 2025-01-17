import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCompleted: z.boolean(),
});
export type Todo = z.infer<typeof todoSchema>;

export const voidResponseSchema = z.object({
  success: z.boolean(),
});
export type VoidResponse = z.infer<typeof voidResponseSchema>;
