import { Article } from "@/types/api";
import { Box, Grid, GridItem, Heading, Text } from "@yamada-ui/react";
import ArticleCard from "../ArticleCard";

interface ArticlesListProps {
  articles: Article[];
  title?: string;
  emptyMessage?: string;
}

export default function ArticlesList({
  articles,
  title = "記事一覧",
  emptyMessage = "記事がありません",
}: ArticlesListProps) {
  return (
    <Box as="section" py={8}>
      {title && (
        <Heading as="h2" size="lg" mb={6}>
          {title}
        </Heading>
      )}

      {articles.length > 0 ? (
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={4}
        >
          {articles.map((article) => (
            <GridItem key={article.slug}>
              <ArticleCard article={article} />
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Box
          py={12}
          textAlign="center"
          bg="gray.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text color="gray.500">{emptyMessage}</Text>
        </Box>
      )}
    </Box>
  );
}
