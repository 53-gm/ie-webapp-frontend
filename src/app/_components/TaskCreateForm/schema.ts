import { z } from "zod";

export const postTaskSchema = z.object({
  title: z.string().min(1, "この項目は必須です"),
  description: z.string().optional(),
  priority: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val);
    return val;
  }, z.number().min(0, "優先度の最小値は0です").max(5, "優先度の最大値は5です")),
  due_date: z.date().optional(),
});

export type PostTaskData = z.infer<typeof postTaskSchema>;
