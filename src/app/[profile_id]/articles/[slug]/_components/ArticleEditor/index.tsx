// src/app/[profile_id]/articles/[slug]/edit/ArticleEditor.tsx
"use client";

import { updateArticle } from "@/actions";
import { getExtensions } from "@/lib/tiptap/extensions";
import { TableOfContents } from "@/lib/tiptap/extensions/TableOfContents";
import { CustomBubbleMenu, LinkBubbleMenu } from "@/lib/tiptap/menus";
import { Article } from "@/types/api";
import { format } from "@formkit/tempo";
import { EditorContent, useEditor } from "@tiptap/react";
import { ArrowLeftIcon, SaveIcon } from "@yamada-ui/lucide";
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Switch,
  Text,
  useNotice,
  VStack,
} from "@yamada-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ArticleEditorProps {
  article: Article;
}

export default function ArticleEditor({ article }: ArticleEditorProps) {
  const [title, setTitle] = useState(article.title);
  const [isPublic, setIsPublic] = useState(article.is_public);
  const [isSaving, setIsSaving] = useState(false);
  const notice = useNotice();
  const router = useRouter();

  // 記事の表示ページへのパス
  const viewPath = `/${article.author.profile_id}/articles/${article.slug}`;

  // 日付フォーマット
  const formattedDate = format(article.created_at, "short", "ja");
  const formattedUpdateDate =
    article.updated_at !== article.created_at
      ? format(article.updated_at, "short", "ja")
      : null;

  // エディタの設定
  const editor = useEditor({
    extensions: getExtensions(),
    content: null,
    editable: true,
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

  // 記事を保存
  const saveArticle = async () => {
    if (!editor) return;

    setIsSaving(true);

    try {
      const editorContent = JSON.stringify(editor.getJSON());

      await updateArticle(article.slug, {
        title,
        content: editorContent,
        is_public: isPublic,
      });

      notice({
        title: "成功",
        description: "記事を更新しました",
        status: "success",
      });

      // 記事の表示ページにリダイレクト
      router.push(viewPath);
      router.refresh();
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // 変更を破棄して記事表示ページに戻る
    router.push(viewPath);
  };

  if (!editor) {
    return null; // ローディング中は何も表示しない
  }

  return (
    <VStack w="full" align="start">
      {/* 編集ヘッダー部分 */}
      <VStack
        as="header"
        pt={8}
        pb={6}
        borderBottomWidth="1px"
        borderColor="gray.200"
        w="full"
        align="start"
      >
        <Heading size="md">記事の編集</Heading>

        {/* タイトル入力 */}
        <FormControl>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトル"
            size="lg"
            fontSize="2xl"
            fontWeight="bold"
          />
        </FormControl>

        {/* 公開設定とアクション */}
        <HStack w="full" justify="space-between">
          <HStack>
            <Switch
              isChecked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            >
              公開する
            </Switch>
            <Text color="gray.500" fontSize="sm">
              {formattedDate}に作成
              {formattedUpdateDate && `、${formattedUpdateDate}に更新`}
            </Text>
          </HStack>

          <HStack>
            <Button
              leftIcon={<ArrowLeftIcon />}
              variant="outline"
              onClick={handleCancel}
            >
              キャンセル
            </Button>
            <Button
              leftIcon={<SaveIcon />}
              colorScheme="blue"
              isLoading={isSaving}
              loadingText="保存中"
              onClick={saveArticle}
            >
              保存
            </Button>
          </HStack>
        </HStack>
      </VStack>

      {/* エディタ本体 */}
      <Box as="article" py={4} w="full" minH="50vh">
        <HStack alignItems="stretch" gap="lg">
          <Box w="full">
            <EditorContent editor={editor} />
          </Box>
          <Box w="sm">
            <TableOfContents editor={editor} />
          </Box>
        </HStack>
        <CustomBubbleMenu editor={editor} />
        <LinkBubbleMenu editor={editor} />
      </Box>
    </VStack>
  );
}
