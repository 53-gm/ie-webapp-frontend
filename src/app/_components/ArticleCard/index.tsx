// app/_components/article/ArticleCard.tsx
import { Article } from "@/types/api";
import { format } from "@formkit/tempo";
import { CalendarIcon, ClockIcon } from "@yamada-ui/lucide";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react";
import Link from "next/link";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // 日付をフォーマット
  const formattedDate = format(article.created_at, "short", "ja");
  const formattedUpdateDate =
    article.updated_at !== article.created_at
      ? format(article.updated_at, "short", "ja")
      : null;

  // 記事へのリンクパス
  const articlePath = `/${article.author.profile_id}/articles/${article.slug}`;

  // 著者プロフィールへのリンクパス
  const authorProfilePath = `/${article.author.profile_id}`;

  // 記事のプレビューテキストを作成
  const previewText = getPreviewText(article.content);

  return (
    <Card
      shadow="sm"
      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
    >
      <CardBody p={0}>
        <VStack w="full" gap="xs">
          {/* 記事情報セクション */}
          <Link
            href={articlePath}
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Box p="md">
              <Heading size="md" mb={2}>
                {article.title}
              </Heading>

              {previewText && (
                <Text color="gray.600" fontSize="sm" mb={3}>
                  {previewText}
                </Text>
              )}

              {/* 日付情報 */}
              <HStack fontSize="xs" color="gray.500">
                <HStack gap="xs">
                  <CalendarIcon fontSize="16px" />
                  <Text fontSize="14px">{formattedDate}</Text>
                </HStack>

                {formattedUpdateDate && (
                  <HStack gap="xs">
                    <ClockIcon font-size="16px" />
                    <Text fontSize="14px">{formattedUpdateDate}</Text>
                  </HStack>
                )}
              </HStack>
            </Box>
          </Link>

          {/* 著者情報 */}
          <Link href={authorProfilePath} style={{ textDecoration: "none" }}>
            <HStack p="md">
              <Avatar
                size="xs"
                src={article.author.picture || undefined}
                name={article.author.display_name || article.author.email}
              />
              <Text fontSize="xs" color="gray.700">
                {article.author.display_name || "ユーザー"}
              </Text>
            </HStack>
          </Link>
        </VStack>
      </CardBody>
    </Card>
  );
}

// 記事のプレビューテキストを抽出する関数
function getPreviewText(content: string): string {
  try {
    const jsonContent = JSON.parse(content);

    // JSONからテキストを抽出
    let plainText = "";

    // content.contentがあれば、そこから抽出
    if (jsonContent.content) {
      plainText = extractTextFromNodes(jsonContent.content);
    }
    // contentがなければトップレベルから抽出
    else {
      plainText = extractTextFromNodes(jsonContent);
    }

    return plainText.trim();
  } catch (e) {
    // JSONでない場合や解析エラーの場合
    return "";
  }
}

// JSONノードからテキストを再帰的に抽出する関数
function extractTextFromNodes(nodes: any[]): string {
  if (!nodes || !Array.isArray(nodes)) return "";

  return nodes.reduce((text, node) => {
    // テキストノードの場合
    if (node.text) {
      return text + node.text + " ";
    }

    // 子ノードがある場合は再帰的に処理
    if (node.content) {
      return text + extractTextFromNodes(node.content) + " ";
    }

    return text;
  }, "");
}
