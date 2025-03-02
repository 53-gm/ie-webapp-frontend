// app/_components/article/ArticleCard.tsx
import { Article } from "@/types/api";
import { format } from "@formkit/tempo";
import { CalendarIcon, EyeIcon } from "@yamada-ui/lucide";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Text,
} from "@yamada-ui/react";
import Link from "next/link";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // 日付をフォーマット
  const formattedDate = format(article.created_at, "short");

  // 記事へのリンクパス
  const articlePath = `/${article.author.profile_id}/articles/${article.slug}`;

  return (
    <Link href={articlePath} style={{ textDecoration: "none", width: "100%" }}>
      <Card
        shadow="sm"
        _hover={{ shadow: "md", transform: "translateY(-2px)" }}
        transition="all 0.2s"
        overflow="hidden"
        height="100%"
      >
        <CardBody p={4}>
          <Flex direction="column" gap={3} height="100%">
            <Box>
              <Heading size="md" mb={2}>
                {article.title}
              </Heading>

              <Text color="gray.600" fontSize="sm"></Text>
            </Box>

            <HStack mt="auto" pt={2} fontSize="xs" color="gray.500">
              <HStack>
                <CalendarIcon size="14px" />
                <Text>{formattedDate}</Text>
              </HStack>

              {article.is_public ? (
                <HStack>
                  <EyeIcon size="14px" />
                  <Text>公開</Text>
                </HStack>
              ) : (
                <Text>非公開</Text>
              )}
            </HStack>
          </Flex>
        </CardBody>
      </Card>
    </Link>
  );
}
