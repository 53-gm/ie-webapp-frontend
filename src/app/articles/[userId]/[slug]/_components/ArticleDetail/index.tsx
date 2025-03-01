"use client";

import { getExtensions } from "@/app/_components/tiptap/extensions";
import {
  CustomBubbleMenu,
  LinkBubbleMenu,
} from "@/app/_components/tiptap/menus";
import { notitapEditorClass } from "@/app/_components/tiptap/proseClassString";
import "@/app/_components/tiptap/styles/tiptap.scss";
import { Article } from "@/app/_services/type";
import { EditorContent, useEditor } from "@tiptap/react";
import { VStack } from "@yamada-ui/react";
import { useState } from "react";

type Props = {
  article: Article;
};

const ArticleDetail = ({ article }: Props) => {
  const [isAddingNewLink, setIsAddingNewLink] = useState(false);

  const openLinkModal = () => setIsAddingNewLink(true);

  const content = JSON.parse(article.content);

  const editor = useEditor({
    extensions: getExtensions({ openLinkModal }),
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class: `${notitapEditorClass} focus:outline-none w-full`,
        spellcheck: "false",
        suppressContentEditableWarning: "true",
      },
    },
    immediatelyRender: false,
  });

  return (
    editor && (
      <VStack>
        <EditorContent className="w-full flex justify-center" editor={editor} />

        <CustomBubbleMenu editor={editor} />

        <LinkBubbleMenu editor={editor} />
      </VStack>
    )
  );
};

export default ArticleDetail;
