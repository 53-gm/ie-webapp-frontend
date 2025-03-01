import { z } from "zod";

export const postProfileSchema = z.object({
  profile_id: z.string().min(1, "この項目は必須です"),
  display_name: z.string().min(1, "この項目は必須です"),
  faculty_id: z.string().min(1, "この項目は必須です"),
  department_id: z.string().min(1, "この項目は必須です"),
  grade: z.number().min(1, "学年の最小値は1です").max(4, "学年の最大値は4です"),
});

export type PostProfileData = z.infer<typeof postProfileSchema>;
