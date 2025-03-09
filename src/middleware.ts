import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { nextUrl, auth: session } = req;
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isLoginPage = nextUrl.pathname === "/auth/login";
  const isRegisterPage = nextUrl.pathname === "/auth/register";

  // 認証状態と完了状態
  const isAuthenticated = !!session?.user;
  const isProfileComplete = isAuthenticated
    ? !!session.user?.profile?.is_profile_complete
    : false;

  // 元のURLを保存するパラメータ（ログイン後にリダイレクトするため）
  const callbackUrl = nextUrl.pathname + nextUrl.search;

  // API routes や static assets は処理しない
  if (
    isApiRoute ||
    nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js|ico)$/)
  ) {
    return NextResponse.next();
  }

  // 未認証ユーザーは、認証ページ以外にアクセスしようとすると /auth/login にリダイレクト
  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  // 認証済みかつプロフィール未完了なら、/auth/register へリダイレクト
  // ただし既に /auth/register にいる場合は何もしない
  if (isAuthenticated && !isProfileComplete && !isRegisterPage) {
    const registerUrl = new URL("/auth/register", req.url);
    registerUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(registerUrl);
  }

  // 認証済みかつプロフィール完了済みなら、auth ページには行かせない（ダッシュボードへ）
  if (isAuthenticated && isProfileComplete && isAuthRoute) {
    // ログインページかつcallbackUrlがあればそちらにリダイレクト
    if (isLoginPage && req.nextUrl.searchParams.get("callbackUrl")) {
      const redirectUrl = req.nextUrl.searchParams.get("callbackUrl") || "/";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // それ以外の認証ページにいる場合はホームへリダイレクト
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 上記以外の場合は通常のナビゲーションを許可
  return NextResponse.next();
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * 以下を除外:
     * - static files (/_next/, /favicon.ico など)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
