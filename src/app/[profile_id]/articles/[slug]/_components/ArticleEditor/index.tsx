"use client";

import { updateArticle } from "@/actions";
import { getExtensions } from "@/app/_components/tiptap/extensions";
import {
  CustomBubbleMenu,
  LinkBubbleMenu,
} from "@/app/_components/tiptap/menus";
import { notitapEditorClass } from "@/app/_components/tiptap/proseClassString";
import "@/app/_components/tiptap/styles/tiptap.scss";
import { Article } from "@/types/api";
import { format } from "@formkit/tempo";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  CalendarIcon,
  ClockIcon,
  FilePenIcon,
  SaveIcon,
} from "@yamada-ui/lucide";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Input,
  Spacer,
  Switch,
  Text,
  useNotice,
  VStack,
} from "@yamada-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ArticleEditorProps {
  article: Article;
  isAuthor: boolean;
}

export default function ArticleEditor({
  article,
  isAuthor,
}: ArticleEditorProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [isPublic, setIsPublic] = useState(article.is_public);
  const [isSaving, setIsSaving] = useState(false);
  const notice = useNotice({
    style: { maxW: "80%", minW: "60%" },
    isClosable: true,
  });
  const router = useRouter();

  // Tiptapエディタを初期化
  const editor = useEditor({
    extensions: getExtensions({ openLinkModal: () => {} }),
    content: null, // 初期値はnull
    editable: false, // 初期状態は閲覧モード
    editorProps: {
      attributes: {
        class: `${notitapEditorClass} focus:outline-none w-full`,
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

  // 編集モードの切り替え
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditMode);
    }
  }, [editor, isEditMode]);

  // 日付フォーマット
  const formattedDate = format(article.created_at, "short");
  const formattedUpdateDate =
    article.updated_at !== article.created_at
      ? format(article.updated_at, "short")
      : null;

  // 編集モード切り替え
  const toggleEditMode = () => {
    if (!isAuthor) return;
    setIsEditMode(!isEditMode);
  };

  // 記事を保存
  const saveArticle = async () => {
    if (!editor || !isAuthor || !isEditMode) return;

    setIsSaving(true);

    try {
      const editorContent = JSON.stringify(editor.getJSON());

      const result = await updateArticle(article.slug, {
        title,
        content: editorContent,
        is_public: isPublic,
      });

      if ("error" in result) {
        notice({
          title: "エラー",
          description: result.error?.error.message,
          status: "error",
        });
      } else {
        notice({
          title: "成功",
          description: "記事を更新しました",
          status: "success",
        });

        // 状態を更新済みの記事に合わせる
        router.refresh();
      }
    } catch (error) {
      notice({
        title: "エラー",
        description:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
        status: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) {
    return <Text>読み込み中...</Text>;
  }

  // 著者のプロフィールへのリンク
  const authorProfilePath = `/${article.author.profile_id}`;

  return (
    <>
      {/* ヘッダー部分 */}
      <Box
        as="header"
        pt={8}
        pb={6}
        borderBottomWidth="1px"
        borderColor="gray.200"
        w="full"
      >
        {isEditMode ? (
          <VStack align="stretch" mb={6}>
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

            <HStack>
              <Switch
                isChecked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              >
                公開する
              </Switch>

              <Spacer />

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
          </VStack>
        ) : (
          <Flex align="center" mb={6}>
            <Heading as="h1" size="2xl" flex="1">
              {title}
            </Heading>

            {isAuthor && (
              <IconButton
                aria-label="記事を編集"
                icon={<FilePenIcon />}
                colorScheme="blue"
                variant="outline"
                onClick={toggleEditMode}
              />
            )}
          </Flex>
        )}

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

            {!isPublic && (
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
      </Box>

      {/* コンテンツ部分 */}
      <Box as="article" py={8} w="full">
        <Box>
          <EditorContent editor={editor} />
          {isEditMode && (
            <>
              <CustomBubbleMenu editor={editor} />
              <LinkBubbleMenu editor={editor} />
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
