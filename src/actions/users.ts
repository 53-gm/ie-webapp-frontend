// actions/user.ts
"use server";

import { APIError } from "@/lib/api/client";
import { UserService } from "@/lib/api/services/users";
import { unstable_update } from "@/lib/auth";
import { ProfileUpdateInput } from "@/types/api";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * ユーザープロフィールを取得
 */
export async function getProfile() {
  try {
    return await UserService.getProfile();
  } catch (error) {
    console.error("プロフィールの取得に失敗しました", error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * プロフィールIDからユーザープロフィールを取得
 */
export async function getProfileById(profileId: string) {
  try {
    return await UserService.getProfileById(profileId);
  } catch (error) {
    console.error(`プロフィールID ${profileId} の取得に失敗しました`, error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * プロフィールを更新
 */
export async function updateProfile(data: ProfileUpdateInput) {
  try {
    const result = await UserService.updateProfile(data);

    // セッションのプロフィール情報も更新
    await unstable_update({ user: { profile: result } });

    // キャッシュを無効化
    revalidateTag("user-profile");
    revalidatePath("/settings");

    return { success: true, data: result };
  } catch (error) {
    console.error("プロフィールの更新に失敗しました", error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.toJSON(),
      };
    }
    return {
      success: false,
      error: {
        error: {
          code: "unknown_error",
          message:
            error instanceof Error
              ? error.message
              : "不明なエラーが発生しました",
          status: 500,
        },
      },
    };
  }
}

/**
 * 全ての学部を取得
 */
export async function getAllFaculties() {
  try {
    return await UserService.getAllFaculties();
  } catch (error) {
    console.error("学部一覧の取得に失敗しました", error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 全ての学科を取得
 */
export async function getAllDepartments() {
  try {
    return await UserService.getAllDepartments();
  } catch (error) {
    console.error("学科一覧の取得に失敗しました", error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}
