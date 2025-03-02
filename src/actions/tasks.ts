// actions/task.ts
"use server";

import { APIError } from "@/lib/api/client";
import { TaskService } from "@/lib/api/services/tasks";
import { CreateTaskInput, QueryParams } from "@/types/api";
import { revalidateTag } from "next/cache";

/**
 * 全てのタスクを取得
 */
export async function getTasks(params?: QueryParams) {
  try {
    return await TaskService.getAll(params);
  } catch (error) {
    console.error("タスク一覧の取得に失敗しました", error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 特定の講義に関連するタスクを取得
 */
export async function getTasksByLectureId(lectureId: string) {
  try {
    return await TaskService.getByLectureId(lectureId);
  } catch (error) {
    console.error(`講義 ${lectureId} のタスク取得に失敗しました`, error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * タスクを取得
 */
export async function getTaskById(taskId: string) {
  try {
    return await TaskService.getById(taskId);
  } catch (error) {
    console.error(`タスク ${taskId} の取得に失敗しました`, error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 新しいタスクを作成
 */
export async function createTask(data: CreateTaskInput) {
  try {
    const result = await TaskService.create(data);

    // キャッシュを無効化
    revalidateTag("tasks");
    if (data.lecture_id) {
      revalidateTag(`lecture-${data.lecture_id}-tasks`);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("タスクの作成に失敗しました", error);
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
 * タスクを更新
 */
export async function updateTask(
  taskId: string,
  data: Partial<CreateTaskInput>
) {
  try {
    const result = await TaskService.update(taskId, data);

    // キャッシュを無効化
    revalidateTag("tasks");
    revalidateTag(`task-${taskId}`);
    if (data.lecture_id) {
      revalidateTag(`lecture-${data.lecture_id}-tasks`);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error(`タスク ${taskId} の更新に失敗しました`, error);
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
 * タスクのステータスを更新
 */
export async function updateTaskStatus(taskId: string, status: number) {
  try {
    const result = await TaskService.updateStatus(taskId, status);

    // キャッシュを無効化
    revalidateTag("tasks");
    revalidateTag(`task-${taskId}`);

    return { success: true, data: result };
  } catch (error) {
    console.error(`タスク ${taskId} のステータス更新に失敗しました`, error);
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
 * タスクを削除
 */
export async function deleteTask(taskId: string) {
  try {
    await TaskService.delete(taskId);

    // キャッシュを無効化
    revalidateTag("tasks");
    revalidateTag(`task-${taskId}`);

    return { success: true };
  } catch (error) {
    console.error(`タスク ${taskId} の削除に失敗しました`, error);
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
