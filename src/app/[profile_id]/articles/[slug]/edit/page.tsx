// src/app/[profile_id]/articles/[slug]/edit/page.tsx
import { getArticleByAuthorAndSlug } from "@/actions";
import { auth } from "@/lib/auth";
import { unwrap } from "@/utils/unwrap";
import { notFound, redirect } from "next/navigation";
import ArticleEditor from "../_components/ArticleEditor";

interface ArticleEditPageProps {
  params: {
    profile_id: string;
    slug: string;
  };
}

export default async function ArticleEditPage({
  params,
}: ArticleEditPageProps) {
  const { profile_id, slug } = params;

  // 認証チェック
  const session = await auth();
  if (!session?.user) {
    // 未ログインの場合はログインページにリダイレクト
    redirect(
      "/auth/login?callbackUrl=" +
        encodeURIComponent(`/${profile_id}/articles/${slug}/edit`)
    );
  }

  // 記事情報を取得
  const articleData = unwrap(await getArticleByAuthorAndSlug(profile_id, slug));

  // アクセス権のチェック：自分の記事のみ編集可能
  const currentUser = session.user;
  if (currentUser.profile.profile_id !== profile_id) {
    // 権限がない場合は404
    notFound();
  }

  return <ArticleEditor article={articleData} />;
}
