import { auth } from "@/lib/auth";
import { APIErrorResponse } from "@/types/api";
import { AppError, ErrorSeverity } from "@/types/error";

/*
 API通信時に発生するエラーを表すクラス
 */
export class APIError extends Error {
  code: string;
  status: number;
  details?: any;
  appError?: Omit<AppError, "id">;

  constructor(
    message: string,
    code: string = "unknown_error",
    status: number = 500,
    details?: any
  ) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  /**
   * エラーオブジェクトをバックエンドの形式に変換
   */
  toJSON(): APIErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        status: this.status,
      },
    };
  }

  /**
   * バックエンドのエラーレスポンスからAPIErrorインスタンスを作成
   */
  static fromResponse(response: Response, data?: any): APIError {
    // レスポンスからエラー情報を抽出
    if (data && data.error) {
      // バックエンドのエラー形式に従う場合
      return new APIError(
        data.error.message,
        data.error.code,
        data.error.status || response.status,
        data
      );
    }

    // 一般的なエラーの場合
    const message =
      data?.detail || response.statusText || "不明なエラーが発生しました";
    let code = "unknown_error";

    // HTTPステータスコードからエラーコードを推測
    switch (response.status) {
      case 400:
        code = "invalid_request";
        break;
      case 401:
        code = "authentication_failed";
        break;
      case 403:
        code = "permission_denied";
        break;
      case 404:
        code = "not_found";
        break;
      case 409:
        code = "resource_conflict";
        break;
      case 429:
        code = "throttled";
        break;
      case 500:
        code = "server_error";
        break;
    }

    return new APIError(message, code, response.status, data);
  }

  // AppErrorへの変換メソッド
  toAppError(): Omit<AppError, "id"> {
    if (this.appError) return this.appError;

    let severity = ErrorSeverity.ERROR;
    let recoverable = false;

    // ステータスコードに基づく分類
    if (this.status < 400) {
      severity = ErrorSeverity.INFO;
      recoverable = true;
    } else if (this.status < 500) {
      severity = ErrorSeverity.WARNING;
      recoverable = true;
    }

    return {
      code: this.code,
      message: this.message,
      details: this.details ? JSON.stringify(this.details) : undefined,
      severity,
      source: "api",
      recoverable,
      action:
        this.status === 401
          ? {
              type: "redirect",
              label: "再ログイン",
              href: "/auth/login",
            }
          : recoverable
          ? {
              type: "retry",
              label: "再試行",
            }
          : undefined,
    };
  }
}

/**
 * APIクライアントのシングルトンクラス
 */
export class APIClient {
  private static instance: APIClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.BACKEND_URL || "";
  }

  /**
   * APIClientのシングルトンインスタンスを取得
   */
  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  /**
   * APIリクエストを実行する
   * @param endpoint APIエンドポイント
   * @param options フェッチオプション
   * @param requireAuth 認証が必要かどうか
   * @param cacheOptions キャッシュオプション
   * @returns レスポンスデータ
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false,
    cacheOptions?: {
      revalidate?: number | false;
      tags?: string[];
    }
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      ...((options.headers as Record<string, string>) || {}),
    };

    if (requireAuth) {
      const session = await auth();
      if (!session?.user?.accessToken) {
        throw new APIError(
          "認証が必要です。再度ログインしてください。",
          "authentication_required",
          401
        );
      }
      headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }

    // キャッシュオプションを適用
    if (cacheOptions) {
      (options as any).next = {
        revalidate: cacheOptions.revalidate,
        tags: cacheOptions.tags,
      };
    }

    try {
      const response = await fetch(url, { ...options, headers });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * APIレスポンスを処理する
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    let data: any;
    try {
      data = await response.json();
    } catch (error) {
      // JSONパースエラー
      throw new APIError(
        "レスポンスの解析に失敗しました",
        "parse_error",
        response.status
      );
    }

    // エラーレスポンスの場合
    if (!response.ok) {
      throw APIError.fromResponse(response, data);
    }

    return data as T;
  }

  /**
   * APIエラーハンドリング
   */
  private handleError<T>(error: unknown): Promise<T> {
    if (error instanceof APIError) {
      console.warn(
        `APIエラー: ${error.code} (${error.status})`,
        error.message,
        error.details
      );
    } else {
      console.warn("不明なエラー:", error);
      error = new APIError(
        error instanceof Error ? error.message : "不明なエラーが発生しました",
        "unknown_error",
        500
      );
    }
    throw error;
  }

  // 便利なヘルパーメソッド
  async get<T>(
    endpoint: string,
    requireAuth: boolean = false,
    cacheOptions?: any
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      { method: "GET" },
      requireAuth,
      cacheOptions
    );
  }

  async post<T>(
    endpoint: string,
    data: any,
    requireAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      requireAuth
    );
  }

  async put<T>(
    endpoint: string,
    data: any,
    requireAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      requireAuth
    );
  }

  async patch<T>(
    endpoint: string,
    data: any,
    requireAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      requireAuth
    );
  }

  async delete<T>(endpoint: string, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, requireAuth);
  }
}

// エクスポート用の便利なインスタンス
export const apiClient = APIClient.getInstance();
