// lib/api/services/user.ts
import {
  Department,
  Faculty,
  ProfileUpdateInput,
  UserProfile,
} from "@/types/api";
import { apiClient } from "../client";

/**
 * ユーザー関連のAPIサービス
 */
export const UserService = {
  /**
   * ユーザープロフィールを取得
   */
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>("/api/v1/users/me/profile/", true);
  },

  getProfileById: async (id: string): Promise<UserProfile> => {
    return apiClient.get<UserProfile>(`/api/v1/users/profiles/${id}/`, false);
  },

  /**
   * プロフィールを更新
   */
  updateProfile: async (data: ProfileUpdateInput): Promise<UserProfile> => {
    return apiClient.patch<UserProfile>(
      "/api/v1/users/me/profile/",
      data,
      true
    );
  },

  /**
   * 全ての学部を取得
   */
  getAllFaculties: async (): Promise<Faculty[]> => {
    return apiClient.get<Faculty[]>("/api/v1/users/faculties/", false);
  },

  /**
   * 全ての学科を取得
   */
  getAllDepartments: async (): Promise<Department[]> => {
    return apiClient.get<Department[]>("/api/v1/users/departments/", false);
  },
};
