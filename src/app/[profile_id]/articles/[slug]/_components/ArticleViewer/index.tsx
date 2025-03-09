// src/app/[profile_id]/articles/[slug]/ArticleViewer.tsx
"use client";

import { getExtensions } from "@/lib/tiptap/extensions";
import { TableOfContents } from "@/lib/tiptap/extensions/TableOfContents";
import { Article } from "@/types/api";
import { format } from "@formkit/tempo";
import { EditorContent, useEditor } from "@tiptap/react";
import { CalendarIcon, ClockIcon, FilePenIcon } from "@yamada-ui/lucide";
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
import { useEffect } from "react";

interface ArticleViewerProps {
  article: Article;
  isAuthor: boolean;
}

export default function ArticleViewer({
  article,
  isAuthor,
}: ArticleViewerProps) {
  // 日付フォーマット
  const formattedDate = format(article.created_at, "short", "ja");
  const formattedUpdateDate =
    article.updated_at !== article.created_at
      ? format(article.updated_at, "short", "ja")
      : null;

  // 著者のプロフィールへのリンク
  const authorProfilePath = `/${article.author.profile_id}`;
  // 編集ページへのパス
  const editPath = `/${article.author.profile_id}/articles/${article.slug}/edit`;

  // 読み取り専用エディタの設定
  const editor = useEditor({
    extensions: getExtensions(),
    content: null,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none w-full",
        spellcheck: "false",
      },
    },
  });

  // 記事内容を設定
  useEffect(() => {
    if (editor && article.content) {
      try {
        const content = JSON.parse(article.content);
        editor.commands.setContent(content);
      } catch (error) {
        console.error("記事内容の解析に失敗しました:", error);
        editor.commands.setContent("<p>記事の内容を読み込めませんでした</p>");
      }
    }
  }, [editor, article.content]);

  if (!editor) {
    return null; // ローディング中は何も表示しない
  }

  return (
    <VStack w="full" align="start">
      {/* 記事ヘッダー部分 */}
      <VStack
        as="header"
        pb={6}
        borderBottomWidth="1px"
        borderColor="gray.200"
        w="full"
        align="start"
      >
        {isAuthor && (
          <Box alignSelf="end">
            <Link href={editPath} passHref>
              <Button leftIcon={<FilePenIcon />} colorScheme="blue">
                編集する
              </Button>
            </Link>
          </Box>
        )}

        <Heading as="h1" size="2xl" alignSelf="center">
          {article.title}
        </Heading>

        {/* 著者情報とメタデータ */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={4}
          w="full"
        >
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
              <Box
                px={2}
                py={1}
                bg="red.100"
                color="red.600"
                borderRadius="sm"
                fontSize="xs"
              >
                非公開
              </Box>
            )}
          </HStack>
        </Flex>
      </VStack>

      {/* 記事本文部分 */}
      <Box as="article" py={4} w="full" minH="100vh">
        <HStack alignItems="stretch" gap="lg">
          <Box w="full">
            <EditorContent editor={editor} />
          </Box>
          <Box w="sm">
            <TableOfContents editor={editor} />
          </Box>
        </HStack>
      </Box>
    </VStack>
  );
}
