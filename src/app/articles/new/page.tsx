// src/app/articles/new/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ArticleCreator from "./_components/ArticleCreator";

export default async function CreateArticlePage() {
  // 認証チェック
  const session = await auth();
  if (!session?.user) {
    // 未ログインの場合はログインページにリダイレクト
    redirect("/auth/login?callbackUrl=/articles/new");
  }

  const user = session.user;

  // プロフィールが完了していない場合はプロフィール設定に誘導
  if (!user.profile.is_profile_complete) {
    redirect("/auth/register");
  }

  return <ArticleCreator profileId={user.profile.profile_id} />;
}
