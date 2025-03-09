import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  description: z.string().optional(),
  lecture_id: z.string().optional(),
  priority: z.number().min(0).max(2),
  status: z.number().min(0).max(2),
  due_date: z.date().nullable().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
