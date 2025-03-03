import { z } from "zod";

export const createLectureSchema = z.object({
  name: z.string(),
  term_ids: z.array(z.string()).optional(),
  department_ids: z.array(z.string()).optional(),
  schedule_ids: z.array(z.string()).optional(),
  grade: z.number().optional(),
  room: z.string().optional(),
  instructor: z.string().optional(),
  units: z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  }, z.number().min(0, "単位数の最小値は0です").max(100, "単位数の最大値は100です")),
  is_required: z.boolean().optional(),
  is_exam: z.boolean().optional(),
  description: z.string().optional(),
  eval_method: z.string().optional(),
  biko: z.string().optional(),
});

export type createLectureSchema = z.infer<typeof createLectureSchema>;
