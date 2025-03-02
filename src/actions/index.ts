// actions/index.ts

// 全てのアクションをエクスポート
export * from "./articles";
export * from "./lectures";
export * from "./tasks";
export * from "./users";

// エラーハンドリングユーティリティ
export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    error: {
      code: string;
      message: string;
      status: number;
    };
  };
}

// アクションレスポンスを処理するためのヘルパー関数
export function isActionError<T>(response: ActionResponse<T>): boolean {
  return !response.success && !!response.error;
}

export function getErrorMessage<T>(response: ActionResponse<T>): string {
  if (isActionError(response) && response.error) {
    return response.error.error.message;
  }
  return "不明なエラーが発生しました";
}
