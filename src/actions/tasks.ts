"use server";

import { fetchApi, withErrorHandling } from "@/lib/api/client";
import { CreateTaskInput, Task } from "@/types/api";

/**
 * 全てのタスクを取得
 */
export async function getTasks() {
  return withErrorHandling(async () => {
    return await fetchApi<Task[]>(
      "/api/v1/tasks/tasks/",
      { method: "GET" },
      true
    );
  });
}

/**
 * 特定の講義に関連するタスクを取得
 */
export async function getTasksByLectureId(lectureId: string) {
  return withErrorHandling(async () => {
    return await fetchApi<Task[]>(
      `/api/v1/tasks/tasks/?lecture_id=${lectureId}`,
      { method: "GET" },
      true
    );
  });
}

/**
 * 新しいタスクを作成
 */
export async function createTask(data: CreateTaskInput) {
  return withErrorHandling(async () => {
    return await fetchApi<Task>(
      "/api/v1/tasks/tasks/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      true
    );
  });
}

/**
 * タスクのステータスを更新
 */
export async function updateTaskStatus(taskId: string, status: number) {
  return withErrorHandling(async () => {
    return await fetchApi<Task>(
      `/api/v1/tasks/tasks/${taskId}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
      true
    );
  });
}

export async function updateTask(taskId: string, data: CreateTaskInput) {
  return withErrorHandling(async () => {
    return await fetchApi<Task>(
      `/api/v1/tasks/tasks/${taskId}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      },
      true
    );
  });
}

/**
 * タスクの削除
 */
export async function deleteTask(id: string) {
  return withErrorHandling(async () => {
    return await fetchApi<Task>(
      `/api/v1/tasks/tasks/${id}/`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
      true
    );
  });
}
