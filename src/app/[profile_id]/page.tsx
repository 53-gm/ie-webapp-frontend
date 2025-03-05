// app/[profile_id]/page.tsx
import { getArticlesByProfileId, getProfileById } from "@/actions";
import { unwrap } from "@/utils/unwrap";
import { Box } from "@yamada-ui/react";
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
  const profileData = unwrap(await getProfileById(profile_id));

  // ユーザーの記事一覧を取得
  const articlesData = unwrap(await getArticlesByProfileId(profile_id, true));

  // 記事数
  const articlesCount = Array.isArray(articlesData) ? articlesData.length : 0;

  return (
    <Box w="full" rounded="md">
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
