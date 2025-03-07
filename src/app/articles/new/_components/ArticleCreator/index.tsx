// src/app/articles/new/ArticleCreator.tsx
"use client";

import { createArticle } from "@/actions";
import { getExtensions } from "@/lib/tiptap/extensions";
import { CustomBubbleMenu, LinkBubbleMenu } from "@/lib/tiptap/menus";
import { unwrap } from "@/utils/unwrap";
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
  useNotice,
  VStack,
} from "@yamada-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ArticleCreatorProps {
  profileId: string;
}

export default function ArticleCreator({ profileId }: ArticleCreatorProps) {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const notice = useNotice();
  const router = useRouter();

  // エディタの設定
  const editor = useEditor({
    extensions: getExtensions(),
    editable: true,
    immediatelyRender: false,
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none w-full",
        spellcheck: "false",
      },
    },
  });

  // 新しい記事を保存
  const saveArticle = async () => {
    if (!editor || !title.trim()) {
      notice({
        title: "エラー",
        description: "タイトルを入力してください",
        status: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      const editorContent = JSON.stringify(editor.getJSON());

      const result = unwrap(
        await createArticle({
          title: title.trim(),
          content: editorContent,
          is_public: isPublic,
        })
      );

      notice({
        title: "成功",
        description: "記事を作成しました",
        status: "success",
      });

      // 作成した記事の表示ページにリダイレクト
      router.push(`/${profileId}/articles/${result.slug}`);
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
    // キャンセルして記事一覧ページに戻る
    router.push("/articles");
  };

  if (!editor) {
    return null; // ローディング中は何も表示しない
  }

  return (
    <VStack w="full" align="start">
      {/* ヘッダー部分 */}
      <VStack
        as="header"
        pt={8}
        pb={6}
        borderBottomWidth="1px"
        borderColor="gray.200"
        w="full"
        align="start"
      >
        <Heading size="md">新しい記事を作成</Heading>

        {/* タイトル入力 */}
        <FormControl isRequired>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力してください"
            size="lg"
            fontSize="2xl"
            fontWeight="bold"
          />
        </FormControl>

        {/* 公開設定とアクション */}
        <HStack w="full" justify="space-between">
          <Switch isChecked={isPublic} onChange={() => setIsPublic(!isPublic)}>
            公開する
          </Switch>

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
              loadingText="作成中"
              onClick={saveArticle}
            >
              作成
            </Button>
          </HStack>
        </HStack>
      </VStack>

      {/* エディタ本体 */}
      <Box as="article" py={4} w="full" minH="100vh">
        <EditorContent editor={editor} />
        <CustomBubbleMenu editor={editor} />
        <LinkBubbleMenu editor={editor} />
      </Box>
    </VStack>
  );
}
