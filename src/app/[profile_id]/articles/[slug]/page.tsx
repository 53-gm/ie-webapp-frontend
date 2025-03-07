// src/app/[profile_id]/articles/[slug]/page.tsx
import { getArticleByAuthorAndSlug, getArticlesByProfileId } from "@/actions";
import ArticlesList from "@/app/_components/ArticleList";
import { auth } from "@/lib/auth";
import { Article } from "@/types/api";
import { unwrap } from "@/utils/unwrap";
import { Separator } from "@yamada-ui/react";
import { notFound } from "next/navigation";
import ArticleViewer from "./_components/ArticleViewer";

interface ArticlePageProps {
  params: {
    profile_id: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { profile_id, slug } = params;

  // 記事情報を取得
  const articleData = unwrap(await getArticleByAuthorAndSlug(profile_id, slug));

  // 現在のユーザー情報を取得
  const session = await auth();
  const currentUser = session?.user;

  // アクセス権のチェック：非公開記事は著者のみ閲覧可能
  if (
    !articleData.is_public &&
    (!currentUser || currentUser.profile.profile_id !== profile_id)
  ) {
    notFound();
  }

  // 著者の他の記事を取得
  let relatedArticles: Article[] = [];
  try {
    const otherArticlesData = await getArticlesByProfileId(profile_id, true);
    if ("data" in otherArticlesData && Array.isArray(otherArticlesData.data)) {
      relatedArticles = otherArticlesData.data
        .filter((article) => article.slug !== slug)
        .slice(0, 4); // 最大4件まで
    }
  } catch (error) {
    console.error("関連記事の取得に失敗しました:", error);
  }

  // ユーザーが著者かどうかを確認
  const isAuthor =
    !!currentUser && currentUser.profile.profile_id === profile_id;

  return (
    <>
      {/* 記事表示コンポーネント */}
      <ArticleViewer article={articleData} isAuthor={isAuthor} />

      {/* 関連記事セクション */}
      {relatedArticles.length > 0 && (
        <>
          <Separator my={8} />
          <ArticlesList articles={relatedArticles} title="著者の他の記事" />
        </>
      )}
    </>
  );
}
