"use server";

import { getAllDepartments, registerLecture } from "@/actions";
import { auth } from "@/lib/auth";
import { CreateLectureInput } from "@/types/api";
import { createLectureSchema } from "./schema";

import { createLecture as CreateLecture } from "@/actions";
import { unwrap } from "@/utils/unwrap";

export async function createLecture(formData: CreateLectureInput) {
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
    const allDepartments = unwrap(await getAllDepartments());
    parsedData.data.department_ids = allDepartments.map((d) => String(d.id));
  }

  const createLectureResult = unwrap(
    await CreateLecture({
      ...parsedData.data,
    })
  );

  const registerData = unwrap(
    await registerLecture(createLectureResult.id, 2024)
  );

  return registerData;
}
