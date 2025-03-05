import { getAllArticles } from "@/actions";
import ArticlesList from "@/app/_components/ArticleList";
import { auth } from "@/lib/auth";
import { Article } from "@/types/api";
import { unwrap } from "@/utils/unwrap";
import { PenIcon, PlusIcon } from "@yamada-ui/lucide";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react";
import Link from "next/link";
import SearchBar from "./_components/SearchBar";
import SortControl from "./_components/SortControl";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // 現在のユーザー情報を取得
  const session = await auth();
  const currentUser = session?.user;

  // 検索パラメータを取得
  const searchQuery = searchParams.q || "";
  const sortBy = searchParams.sort || "newest";

  // 記事一覧を取得
  const articlesData = unwrap(await getAllArticles(true)); // true は公開記事のみを取得

  // 検索でフィルタリング
  let filteredArticles = [...articlesData];

  // 検索語句でフィルタリング
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.author.display_name?.toLowerCase().includes(query)
    );
  }

  // 記事の並び替え
  let sortedArticles: Article[] = [...filteredArticles];

  if (sortBy === "newest") {
    sortedArticles.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else if (sortBy === "oldest") {
    sortedArticles.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  } else if (sortBy === "updated") {
    sortedArticles.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  } else if (sortBy === "title") {
    sortedArticles.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <VStack align="start" w="full">
      <VStack w="full" align="start">
        <Flex
          w="full"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          gap={4}
        >
          <Heading as="h1" size="xl">
            記事一覧
          </Heading>

          <HStack>
            <SortControl defaultSortBy={sortBy} />

            {currentUser && (
              <Link href="/articles/new" passHref>
                <Button colorScheme="blue" leftIcon={<PlusIcon />}>
                  新規記事
                </Button>
              </Link>
            )}
          </HStack>
        </Flex>

        <SearchBar defaultQuery={searchQuery} />
      </VStack>

      {/* 検索結果サマリー */}
      {searchQuery && (
        <Text color="gray.600" mt={2}>
          「{searchQuery}」の検索結果: {sortedArticles.length}件
        </Text>
      )}

      {/* 記事がない場合 */}
      {sortedArticles.length === 0 ? (
        <Box
          w="full"
          p={10}
          textAlign="center"
          borderWidth="1px"
          borderRadius="md"
          borderStyle="dashed"
        >
          <VStack>
            <PenIcon boxSize={10} color="gray.400" />
            {searchQuery ? (
              <Text color="gray.500">
                「{searchQuery}」に一致する記事が見つかりませんでした
              </Text>
            ) : (
              <Text color="gray.500">まだ記事がありません</Text>
            )}
            {currentUser && (
              <Link href="/articles/new" passHref>
                <Button as="a" colorScheme="blue" leftIcon={<PlusIcon />}>
                  新しい記事を書く
                </Button>
              </Link>
            )}
          </VStack>
        </Box>
      ) : (
        // 記事一覧表示
        <ArticlesList
          articles={sortedArticles}
          emptyMessage="記事がありません"
        />
      )}
    </VStack>
  );
}
