// components/ArticleThumbnail.tsx
import { Article } from "@/app/_services/type";
import { Card, CardBody, Flex, Heading, Image, Text } from "@yamada-ui/react";
import Link from "next/link";
import React from "react";

type ArticleThumbnailProps = {
  article: Article;
};

const ArticleThumbnail: React.FC<ArticleThumbnailProps> = ({ article }) => {
  const { title, created_at, author, slug } = article;
  const displayName = author.display_name || author.email;

  return (
    <Link href={`/articles/${author.user_id}/${slug}`}>
      <Card shadow="sm" borderRadius="md" overflow="hidden">
        <CardBody p={4}>
          <Heading as="h3" size="lg" mb={2}>
            {title}
          </Heading>
          <Flex align="center" gap={2}>
            {author.picture_url && (
              <Image
                src={author.picture_url}
                alt={displayName}
                width="40px"
                height="40px"
                borderRadius="50%"
                objectFit="cover"
              />
            )}
            <Text color="gray.600" fontSize="sm">
              {displayName} • {new Date(created_at).toLocaleDateString()}
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </Link>
  );
};

export default ArticleThumbnail;
