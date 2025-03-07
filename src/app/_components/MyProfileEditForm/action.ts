"use server";

import { updateProfile } from "@/actions";
import { unstable_update } from "@/lib/auth";
import { PostProfileData, postProfileSchema } from "./schema";

export async function updateUserProfile(formData: PostProfileData) {
  const parsedData = postProfileSchema.safeParse(formData);
  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map((err) => err.message);
    throw new Error(errorMessages.join(", "));
  }

  const data = await updateProfile({
    ...parsedData.data,
  });

  await unstable_update({ user: { profile: data } });

  return data;
}
