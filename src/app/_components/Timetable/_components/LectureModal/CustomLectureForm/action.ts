"use server";

import { getDepartments } from "@/app/_services/getDepartments";
import { postLecture } from "@/app/_services/postLecture";
import { postRegistLecture } from "@/app/_services/postRegistLecture";
import { CreateLecture } from "@/app/_services/type";
import { auth } from "@/lib/auth";
import { createLectureSchema } from "./schema";

export async function createLecture(formData: CreateLecture) {
  const session = await auth();
  const user = session?.user;
  if (!session || !user) {
    throw new Error("未認証です。再度ログインしてください");
  }

  const parsedData = createLectureSchema.safeParse(formData);
  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map((err) => err.message);
    throw new Error(errorMessages.join(", "));
  }

  if (!parsedData.data.department_ids) {
    const allDepartments = await getDepartments();
    parsedData.data.department_ids = allDepartments.map((d) => String(d.id));
  }

  console.log(parsedData.data);

  const data = await postLecture({
    payload: parsedData.data,
  });

  console.log(data);

  if (!data.id) {
    throw new Error("講義の生成時にエラーが発生したため登録を中断しました");
  }

  const registerData = await postRegistLecture({
    lecture_id: data!.id,
    year: 2024,
  });

  return registerData;
}
