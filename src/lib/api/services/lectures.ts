// lib/api/services/lecture.ts
import {
  CreateLectureInput,
  Lecture,
  QueryParams,
  Registration,
  RegistrationInput,
  Schedule,
} from "@/types/api";
import { apiClient } from "../client";

/**
 * 講義関連のAPIサービス
 */
export const LectureService = {
  /**
   * 全ての講義を取得（フィルタリング可能）
   */
  getAll: async (params?: QueryParams): Promise<Lecture[]> => {
    let endpoint = "/api/v1/academics/lectures/";

    if (params) {
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&");

      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return apiClient.get<Lecture[]>(endpoint, true);
  },

  /**
   * 特定の時間帯・学期の講義を取得
   */
  getByTimeAndTerm: async (
    day: number,
    time: number,
    term: number
  ): Promise<Lecture[]> => {
    return apiClient.get<Lecture[]>(
      `/api/v1/academics/lectures/?day=${day}&time=${time}&terms=${term}`,
      true
    );
  },

  /**
   * 特定の講義を取得
   */
  getById: async (lectureId: string): Promise<Lecture> => {
    return apiClient.get<Lecture>(
      `/api/v1/academics/lectures/${lectureId}/`,
      true
    );
  },

  /**
   * 新しい講義を作成
   */
  create: async (data: CreateLectureInput): Promise<Lecture> => {
    return apiClient.post<Lecture>("/api/v1/academics/lectures/", data, true);
  },

  /**
   * 講義を更新
   */
  update: async (
    lectureId: string,
    data: Partial<CreateLectureInput>
  ): Promise<Lecture> => {
    return apiClient.patch<Lecture>(
      `/api/v1/academics/lectures/${lectureId}/`,
      data,
      true
    );
  },

  /**
   * 講義を削除
   */
  delete: async (lectureId: string): Promise<void> => {
    return apiClient.delete<void>(
      `/api/v1/academics/lectures/${lectureId}/`,
      true
    );
  },

  /**
   * 全てのスケジュールを取得
   */
  getAllSchedules: async (): Promise<Schedule[]> => {
    return apiClient.get<Schedule[]>("/api/v1/academics/schedules/", true);
  },

  /**
   * 登録済み講義を取得（年度・学期でフィルタリング）
   */
  getRegisteredLectures: async (
    year: number,
    term: number
  ): Promise<Registration[]> => {
    return apiClient.get<Registration[]>(
      `/api/v1/academics/registrations/?year=${year}&number=${term}`,
      true
    );
  },

  getRegisteredLectureById: async (id: string): Promise<Registration> => {
    return apiClient.get<Registration>(
      `/api/v1/academics/registrations/${id}/`,
      true
    );
  },

  /**
   * 講義を登録
   */
  registerLecture: async (data: RegistrationInput): Promise<Registration> => {
    return apiClient.post<Registration>(
      "/api/v1/academics/registrations/",
      data,
      true
    );
  },

  /**
   * 講義の登録を削除
   */
  deleteRegistration: async (registrationId: string): Promise<void> => {
    return apiClient.delete<void>(
      `/api/v1/academics/registrations/${registrationId}/`,
      true
    );
  },
};
