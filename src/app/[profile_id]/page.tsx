// app/[profile_id]/page.tsx
import { getArticlesByProfileId, getProfileById } from "@/actions";
import { Box } from "@yamada-ui/react";
import { notFound } from "next/navigation";
import ArticlesList from "../_components/ArticleList";
import ProfileHeader from "./_components/ProfileHeader";

interface ProfilePageProps {
  params: {
    profile_id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { profile_id } = params;

  // プロフィール情報を取得
  const profileData = await getProfileById(profile_id);

  // エラーハンドリング
  if ("error" in profileData) {
    if (profileData.error.error.code === "not_found") {
      return notFound();
    }

    throw new Error(profileData.error.error.message);
  }

  // ユーザーの記事一覧を取得
  const articlesData = await getArticlesByProfileId(profile_id, true);

  // エラーハンドリング
  if ("error" in articlesData) {
    throw new Error(articlesData.error.error.message);
  }

  // 記事数
  const articlesCount = Array.isArray(articlesData) ? articlesData.length : 0;

  return (
    <Box as="main">
      {/* プロフィールヘッダー */}
      <ProfileHeader profile={profileData} articlesCount={articlesCount} />

      {/* 記事一覧 */}
      <ArticlesList
        articles={Array.isArray(articlesData) ? articlesData : []}
        title={`${profileData.display_name || "ユーザー"}の記事`}
        emptyMessage="このユーザーはまだ記事を投稿していません"
      />
    </Box>
  );
}
