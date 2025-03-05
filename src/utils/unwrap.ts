import { ApiResult } from "@/lib/api/client";
import { notFound } from "next/navigation";

export function unwrap<T>(result: ApiResult<T>): T {
  if (!result.success || !result.data) {
    if (result.error?.code === 404) {
      notFound();
    }
    throw new Error(result.error?.message || "データの取得に失敗しました");
  }
  return result.data;
}

export function unwrapOr<T>(result: ApiResult<T>, defaultValue: T): T {
  if (!result.success) {
    return defaultValue;
  }

  return result.data ?? defaultValue;
}
