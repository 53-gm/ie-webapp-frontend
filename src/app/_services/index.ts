import { auth as nextauth } from "@/lib/auth";

export const host = process.env.BACKEND_URL;
export const path = (endpoint: string = ""): string => `${host}${endpoint}`;

export class FetchError extends Error {
  status: number;
  details?: any;
  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const handleSucceed = async (res: Response): Promise<any> => {
  if (res.status === 204) {
    // 204 No Content の場合は何も返さない
    return;
  }

  let data: any;
  try {
    data = await res.json();
  } catch (parseError) {
    // JSON のパースに失敗した場合はその旨のエラーを投げる
    throw new FetchError("レスポンスのパースに失敗しました。", res.status);
  }

  if (!res.ok) {
    const errorMessage = data?.detail || res.statusText;
    throw new FetchError(errorMessage, res.status, data);
  }
  return data;
};

export const handleFailed = async (err: unknown): Promise<never> => {
  if (err instanceof FetchError) {
    console.warn(
      "FetchError:",
      err.message,
      "Status:",
      err.status,
      "Details:",
      err.details
    );
  } else {
    console.warn("Unknown error:", err);
  }
  throw err;
};

export const makeRequest = async (
  endpoint: string,
  options: RequestInit = {},
  auth: boolean = false
): Promise<any> => {
  const url = path(endpoint);
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (auth) {
    const session = await nextauth();
    if (!session || !session.user?.accessToken) {
      throw new FetchError("未認証です、再度ログインしてください。", 401);
    }
    headers["Authorization"] = `Bearer ${session.user.accessToken}`;
  }

  return fetch(url, { ...options, headers })
    .then(handleSucceed)
    .catch(handleFailed);
};
