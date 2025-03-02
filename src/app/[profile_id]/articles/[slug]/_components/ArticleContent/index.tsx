// app/_components/article/ArticleContent.tsx
"use client";

import { getExtensions } from "@/app/_components/tiptap/extensions";
import { notitapEditorClass } from "@/app/_components/tiptap/proseClassString";
import { Article } from "@/types/api";
import { EditorContent, useEditor } from "@tiptap/react";
import { Box, Container } from "@yamada-ui/react";
import { useEffect } from "react";

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  // Tiptapエディタを初期化
  const editor = useEditor({
    extensions: getExtensions({ openLinkModal: () => {} }),
    content: null, // 初期値はnull
    editable: false, // 閲覧モード
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

  if (!editor) {
    return <div>読み込み中...</div>;
  }

  return (
    <Box as="article" py={8}>
      <Container maxW="4xl">
        <Box
          className="article-body"
          sx={{
            // Zenn風のスタイリング
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              fontWeight: "bold",
              lineHeight: 1.5,
              mt: 8,
              mb: 4,
            },
            "& h1": {
              fontSize: "2xl",
              borderBottom: "1px solid",
              borderColor: "gray.200",
              pb: 2,
            },
            "& h2": {
              fontSize: "xl",
              borderBottom: "1px solid",
              borderColor: "gray.200",
              pb: 2,
            },
            "& h3": { fontSize: "lg" },
            "& p": { my: 4, lineHeight: 1.8 },
            "& ul, & ol": { pl: 6, my: 4 },
            "& li": { mb: 2 },
            "& a": { color: "blue.500", textDecoration: "underline" },
            "& blockquote": {
              borderLeft: "4px solid",
              borderColor: "gray.200",
              pl: 4,
              py: 1,
              color: "gray.600",
              my: 4,
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "md",
              my: 4,
            },
            "& pre": {
              bg: "gray.50",
              p: 4,
              borderRadius: "md",
              overflowX: "auto",
              my: 4,
            },
            "& code": {
              fontFamily: "monospace",
              bg: "gray.100",
              px: 1,
              py: 0.5,
              borderRadius: "sm",
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Container>
    </Box>
  );
}
