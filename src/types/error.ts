export interface ApiErrorData {
  code: string;
  message: string;
  status: number;
  details?: any;
}

export interface ApiErrorResponse {
  error: ApiErrorData;
}

export enum ErrorSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  FATAL = "fatal",
}

// Yamada-UIのNoticeステータスと対応
export const severityToStatus: Record<
  ErrorSeverity,
  "info" | "success" | "warning" | "error"
> = {
  [ErrorSeverity.INFO]: "info",
  [ErrorSeverity.WARNING]: "warning",
  [ErrorSeverity.ERROR]: "error",
  [ErrorSeverity.FATAL]: "error",
};

export interface AppError {
  id: string; // 一意のエラーID (オプション)
  code: string; // エラーコード
  message: string; // ユーザーフレンドリーなメッセージ
  details?: string; // デバッグ用の詳細情報
  severity: ErrorSeverity; // エラーの重大度
  source: "api" | "client" | "server"; // エラー発生源
  recoverable: boolean; // ユーザーがアクションを取れるか
  action?: {
    // 可能な回復アクション
    type: "retry" | "reload" | "redirect" | "custom";
    label: string;
    handler?: () => void;
    href?: string;
  };
}
