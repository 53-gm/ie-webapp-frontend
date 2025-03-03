// app/_components/article/ArticleHeader.tsx
import { Article } from "@/types/api";
import { format } from "@formkit/tempo";
import { CalendarIcon, ClockIcon } from "@yamada-ui/lucide";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Tag,
  Text,
} from "@yamada-ui/react";
import Link from "next/link";

interface ArticleHeaderProps {
  article: Article;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  // 日付をフォーマット
  const formattedDate = format(article.created_at, "short");
  const formattedUpdateDate =
    article.updated_at !== article.created_at
      ? format(article.updated_at, "short")
      : null;

  // 著者のプロフィールへのリンク
  const authorProfilePath = `/${article.author.profile_id}`;

  return (
    <Box
      as="header"
      pt={8}
      pb={6}
      borderBottomWidth="1px"
      borderColor="gray.200"
    >
      <Heading as="h1" size="2xl" mb={6}>
        {article.title}
      </Heading>

      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "start", md: "center" }}
        gap={4}
      >
        <Link href={authorProfilePath} style={{ textDecoration: "none" }}>
          <HStack>
            <Avatar
              src={article.author.picture || undefined}
              name={article.author.display_name || article.author.email}
              size="md"
            />

            <Box>
              <Text fontWeight="bold">
                {article.author.display_name || "ユーザー"}
              </Text>
              <Text color="gray.600" fontSize="sm">
                @{article.author.profile_id}
              </Text>
            </Box>
          </HStack>
        </Link>

        <HStack color="gray.600" fontSize="sm">
          <HStack>
            <CalendarIcon size="16px" />
            <Text>{formattedDate} 公開</Text>
          </HStack>

          {formattedUpdateDate && (
            <HStack>
              <ClockIcon size="16px" />
              <Text>{formattedUpdateDate} 更新</Text>
            </HStack>
          )}

          {!article.is_public && (
            <Tag colorScheme="red" size="sm">
              非公開
            </Tag>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
