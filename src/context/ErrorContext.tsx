"use client";

import { AppError, ErrorSeverity, severityToStatus } from "@/types/error";
import { useNotice } from "@yamada-ui/react";
import { createContext, ReactNode, useContext } from "react";

interface ErrorContextType {
  addError: (error: Omit<AppError, "id">) => string;
  logError: (error: unknown, message?: string) => void;
}

// 簡易的なIDジェネレータ (uuidライブラリを使う場合はこれを変更)
const generateId = () => Math.random().toString(36).substring(2, 9);

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const notice = useNotice();

  const addError = (error: Omit<AppError, "id">): string => {
    const id = generateId(); // または uuidv4() を使用

    // エラー情報をコンソールにログ出力 (開発用)
    console.error(`[${error.code}] ${error.message}`, error);

    // Yamada-UIのnoticeを使用してエラーを表示
    notice({
      title: `${error.code}`,
      description: error.message,
      status: severityToStatus[error.severity],
      duration: error.severity === ErrorSeverity.ERROR ? 8000 : 5000, // 重大なエラーは長く表示
      isClosable: true,
    });

    // アクションボタンがある場合は別の通知を表示
    if (error.action) {
      notice({
        title: "対応方法",
        description: `問題を解決するには：${error.action.label}`,
        status: "info",
        duration: null, // 明示的に閉じるまで表示し続ける
        isClosable: true,
        // ボタン付きメッセージの場合、descriptionの下にコンポーネントを追加する形に
        // Yamada-UIが対応していればここで拡張
      });
    }

    return id;
  };

  // 一般的なエラーオブジェクトをAppError形式に変換してaddError関数に渡す
  const logError = (error: unknown, message?: string): void => {
    let appError: Omit<AppError, "id">;

    if (error instanceof Error) {
      appError = {
        code: "client_error",
        message: message || error.message,
        details: error.stack,
        severity: ErrorSeverity.ERROR,
        source: "client",
        recoverable: true,
      };
    } else if (typeof error === "string") {
      appError = {
        code: "error",
        message: message || error,
        severity: ErrorSeverity.ERROR,
        source: "client",
        recoverable: true,
      };
    } else {
      appError = {
        code: "unknown_error",
        message: message || "予期しないエラーが発生しました",
        details: JSON.stringify(error),
        severity: ErrorSeverity.ERROR,
        source: "client",
        recoverable: false,
      };
    }

    addError(appError);
  };

  return (
    <ErrorContext.Provider value={{ addError, logError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}
