"use client";

import { ActionResult } from "@/actions/core";
import { useError } from "@/context/ErrorContext";
import { useState } from "react";

export function useAction<T, P>(
  action: (params: P) => Promise<ActionResult<T>>
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const { addError, logError } = useError();

  const execute = async (params: P): Promise<T | null> => {
    setLoading(true);
    try {
      const result = await action(params);

      if (result.success && result.data) {
        setData(result.data);
        return result.data;
      }

      if (!result.success && result.error) {
        addError(result.error);
      }

      return null;
    } catch (error) {
      console.error("アクション実行エラー:", error);

      logError(error, "予期しないエラーが発生しました");

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, data };
}
