// actions/core.ts
import { APIError } from "@/lib/api/client";
import { AppError, ErrorSeverity } from "@/types/error";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: Omit<AppError, "id">;
}

/**
 * サーバーアクションを実行するための共通ラッパー関数
 */
export async function executeAction<T>(
  actionName: string,
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const result = await fn();
    return { success: true, data: result };
  } catch (error) {
    console.error(`アクション ${actionName} でエラーが発生しました:`, error);

    if (error instanceof APIError) {
      return {
        success: false,
        error: error.toAppError(),
      };
    }

    // その他のエラーをAppError形式に変換
    const appError: Omit<AppError, "id"> = {
      code: "action_failed",
      message:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
      severity: ErrorSeverity.ERROR,
      source: "server",
      recoverable: true,
      action: {
        type: "retry",
        label: "再試行",
      },
    };

    return { success: false, error: appError };
  }
}
