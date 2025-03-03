// lib/api/services/task.ts
import { CreateTaskInput, QueryParams, Task } from "@/types/api";
import { apiClient } from "../client";

/**
 * タスク関連のAPIサービス
 */
export const TaskService = {
  /**
   * 全てのタスクを取得
   */
  getAll: async (params?: QueryParams): Promise<Task[]> => {
    let endpoint = "/api/v1/tasks/tasks/";

    if (params) {
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&");

      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return apiClient.get<Task[]>(endpoint, true);
  },

  /**
   * 特定の講義に関連するタスクを取得
   */
  getByLectureId: async (lectureId: string): Promise<Task[]> => {
    return apiClient.get<Task[]>(
      `/api/v1/tasks/tasks/?lecture_id=${lectureId}`,
      true
    );
  },

  /**
   * 特定のタスクを取得
   */
  getById: async (taskId: string): Promise<Task> => {
    return apiClient.get<Task>(`/api/v1/tasks/tasks/${taskId}/`, true);
  },

  /**
   * 新しいタスクを作成
   */
  create: async (data: CreateTaskInput): Promise<Task> => {
    return apiClient.post<Task>("/api/v1/tasks/tasks/", data, true);
  },

  /**
   * タスクを更新
   */
  update: async (
    taskId: string,
    data: Partial<CreateTaskInput>
  ): Promise<Task> => {
    return apiClient.patch<Task>(`/api/v1/tasks/tasks/${taskId}/`, data, true);
  },

  /**
   * タスクのステータスを更新
   */
  updateStatus: async (taskId: string, status: number): Promise<Task> => {
    return apiClient.patch<Task>(
      `/api/v1/tasks/tasks/${taskId}/`,
      { status },
      true
    );
  },

  /**
   * タスクを削除
   */
  delete: async (taskId: string): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/tasks/tasks/${taskId}/`, true);
  },
};
