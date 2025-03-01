"use client";
import { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import "tippy.js/animations/shift-toward-subtle.css";

import { getExtensions } from "./extensions";
import { CustomBubbleMenu, LinkBubbleMenu } from "./menus";
import { notitapEditorClass } from "./proseClassString";

import { uploadImage } from "@/app/_services/uploadImage";
import { VStack } from "@yamada-ui/react";
import "./styles/tiptap.scss";

export const Tiptap = () => {
  const logContent = useCallback((e: Editor) => console.log(e.getJSON()), []);

  const [isAddingNewLink, setIsAddingNewLink] = useState(false);

  const openLinkModal = () => setIsAddingNewLink(true);

  const closeLinkModal = () => setIsAddingNewLink(false);

  const [uploading, setUploading] = useState(false);

  const addImage = async (files: File[] | undefined) => {
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      setUploading(true);

      try {
        const url = (await uploadImage({ formData }))?.url;

        editor?.commands.setMedia({
          src: url,
          "media-type": "img",
          alt: "Something else",
          title: "Something",
          // width: "800",
          // height: "400",
        });
      } catch (error) {
        console.error("アップロードエラー:", error);
        alert("エラーが発生しました。");
      } finally {
        setUploading(false);
      }
    }
  };

  const videoUrl =
    "https://user-images.githubusercontent.com/45892659/178123048-0257e732-8cc2-466b-8447-1e2b7cd1b5d9.mov";

  const addVideo = () =>
    editor?.commands.setMedia({
      src: videoUrl,
      "media-type": "video",
      alt: "Some Video",
      title: "Some Title Video",
      width: "400",
      height: "400",
    });

  const editor = useEditor({
    extensions: getExtensions({ openLinkModal }),
    editorProps: {
      attributes: {
        class: `${notitapEditorClass} focus:outline-none w-full`,
        spellcheck: "false",
        suppressContentEditableWarning: "true",
      },
    },
    editable: false,
    content: "<p>test</p>",
    immediatelyRender: false,
    onUpdate: debounce(({ editor: e }) => {
      logContent(e);
    }, 500),
  });

  return (
    editor && (
      <VStack>
        <VStack>
          {/* <FileButton onChange={addImage}>Add Image</FileButton> */}

          <EditorContent
            className="w-full flex justify-center"
            editor={editor}
          />

          <CustomBubbleMenu editor={editor} />

          <LinkBubbleMenu editor={editor} />
        </VStack>
      </VStack>
    )
  );
};
