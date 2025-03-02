// app/[profile_id]/articles/[slug]/page.tsx
import { getArticleByAuthorAndSlug, getArticlesByProfileId } from "@/actions";
import ArticlesList from "@/app/_components/ArticleList";
import { auth } from "@/lib/auth";
import { Article } from "@/types/api";
import { Separator } from "@yamada-ui/react";
import { notFound } from "next/navigation";
import ArticleEditor from "./_components/ArticleEditor";

interface ArticlePageProps {
  params: {
    profile_id: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { profile_id, slug } = params;

  // 記事情報を取得
  const articleData = await getArticleByAuthorAndSlug(profile_id, slug);

  // 現在のユーザー情報を取得
  const session = await auth();
  const currentUser = session?.user;

  // エラーハンドリング
  if ("error" in articleData) {
    if (articleData.error.error.code === "not_found") {
      return notFound();
    }

    throw new Error(articleData.error.error.message);
  }

  // 著者の他の記事を取得
  const otherArticlesData = await getArticlesByProfileId(profile_id, true);

  // 現在の記事を除外した関連記事を取得
  let relatedArticles: Article[] = [];

  if (!("error" in otherArticlesData) && Array.isArray(otherArticlesData)) {
    relatedArticles = otherArticlesData
      .filter((article) => article.slug !== slug)
      .slice(0, 4); // 最大4件まで
  }

  // ユーザーが著者かどうかを確認
  const isAuthor =
    !!currentUser && currentUser.profile.profile_id === profile_id;

  return (
    <>
      {/* 記事エディター/ビューワー */}
      <ArticleEditor article={articleData} isAuthor={isAuthor} />

      {/* 関連記事セクション */}
      {relatedArticles.length > 0 && (
        <>
          <Separator />
          <ArticlesList articles={relatedArticles} title="著者の他の記事" />
        </>
      )}
    </>
  );
}
