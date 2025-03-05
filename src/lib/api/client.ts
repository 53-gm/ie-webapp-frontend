import { auth } from "@/lib/auth";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiResult<T> = {
  data?: T;
  error?: {
    message: string;
    code: number;
  };
  success: boolean;
};

/**
 * エラーハンドリングラッパー
 */
export async function withErrorHandling<T>(
  action: () => Promise<T>
): Promise<ApiResult<T>> {
  try {
    const data = await action();
    return { data, success: true };
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof ApiError) {
      return {
        error: {
          message: error.message,
          code: error.statusCode,
        },
        success: false,
      };
    }

    return {
      error: {
        message:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
        code: 500,
      },
      success: false,
    };
  }
}

/**
 * バックエンドAPIとの通信を行う基本関数
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const baseUrl = process.env.BACKEND_URL || "";
  const url = `${baseUrl}${endpoint}`;

  const headers: HeadersInit = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (requireAuth) {
    const session = await auth();
    if (!session?.user?.accessToken) {
      throw new ApiError(401, "認証が必要です。再度ログインしてください。");
    }
    headers["Authorization"] = `Bearer ${session.user.accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    let data: any;
    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError(response.status, "レスポンスの解析に失敗しました");
    }

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        response.statusText ||
        "リクエストに失敗しました";
      throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      error instanceof Error ? error.message : "不明なエラーが発生しました"
    );
  }
}
