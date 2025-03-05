"use server";

import { fetchApi, withErrorHandling } from "@/lib/api/client";
import { unstable_update } from "@/lib/auth";
import {
  Department,
  Faculty,
  ProfileUpdateInput,
  UserProfile,
} from "@/types/api";

/**
 * プロフィールIDからユーザープロフィールを取得
 */
export async function getProfileById(profileId: string) {
  return withErrorHandling(async () => {
    return await fetchApi<UserProfile>(
      `/api/v1/users/profiles/${profileId}/`,
      { method: "GET" },
      false
    );
  });
}

/**
 * プロフィールを更新
 */
export async function updateProfile(data: ProfileUpdateInput) {
  return withErrorHandling(async () => {
    const result = await fetchApi<UserProfile>(
      "/api/v1/users/me/profile/",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      true
    );

    // セッションのプロフィール情報も更新
    await unstable_update({ user: { profile: result } });

    return result;
  });
}

/**
 * 全ての学部を取得
 */
export async function getAllFaculties() {
  return withErrorHandling(async () => {
    return await fetchApi<Faculty[]>(
      "/api/v1/users/faculties/",
      { method: "GET" },
      false
    );
  });
}

/**
 * 全ての学科を取得
 */
export async function getAllDepartments() {
  return withErrorHandling(async () => {
    return await fetchApi<Department[]>(
      "/api/v1/users/departments/",
      { method: "GET" },
      false
    );
  });
}
