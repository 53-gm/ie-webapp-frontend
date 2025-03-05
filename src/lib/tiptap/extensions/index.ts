import { uploadImage } from "@/actions";
import { AnyExtension } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import DropCursor from "@tiptap/extension-dropcursor";
import GapCursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { DBlock } from "./dBlock";
import { Document } from "./doc";
import { DropZone } from "./dropzone/dropzone";
import { Paragraph } from "./paragraph";
import { Placeholder } from "./placeholder";
import { ResizableMedia } from "./resizableMedia";
import { Commands, suggestions } from "./slash-menu";
import { TrailingNode } from "./trailingNode";

type GetExtensionsProps = {};

export const getExtensions = (): AnyExtension[] => {
  return [
    // Necessary
    Document,
    DBlock,
    Paragraph,
    Text,
    DropCursor.configure({
      width: 2,
      class: "notitap-dropcursor",
      color: "skyblue",
    }),
    GapCursor,
    History,
    HardBreak,
    Commands.configure({
      suggestions,
    }),

    // marks
    Bold,
    Italic,
    Strike,
    Underline,

    // Node
    ListItem,
    BulletList,
    OrderedList,
    Heading.configure({
      levels: [1, 2, 3],
    }),
    TrailingNode,
    Blockquote,

    // Resizable Media
    ResizableMedia.configure({
      uploadFn: async (image) => {
        const fd = new FormData();

        fd.append("file", image);

        const uploadImageResult = await uploadImage(fd);

        if ("error" in uploadImageResult) {
          throw new Error(uploadImageResult.error?.error.message);
        }

        return uploadImageResult.url;
      },
    }),

    DropZone.configure({
      uploadFn: async (image) => {
        const fd = new FormData();

        fd.append("file", image);

        const uploadImageResult = await uploadImage(fd);

        if ("error" in uploadImageResult) {
          throw new Error(uploadImageResult.error?.error.message);
        }

        return uploadImageResult.url;
      },
    }),

    Placeholder.configure({
      placeholder: "「/」でコマンドを呼び出します...",
      includeChildren: true,
    }),
  ];
};
