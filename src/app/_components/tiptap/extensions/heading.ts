import { mergeAttributes } from "@tiptap/core";
import { Heading } from "@tiptap/extension-heading";
import { Plugin } from "prosemirror-state";
import slugify from "slugify";

export const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) =>
          attributes.id ? { id: attributes.id } : {},
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    // 常に現在のテキストから slug を生成する
    const text = node.textContent || "";
    HTMLAttributes.id = slugify(text, { lower: true, strict: true });
    return [
      `h${node.attrs.level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        // ノードの更新後に自動で slug を再計算して id 属性を更新する
        appendTransaction: (transactions, oldState, newState) => {
          let tr = newState.tr;
          let updated = false;
          newState.doc.descendants((node, pos) => {
            if (node.type.name === this.name) {
              const newSlug = slugify(node.textContent || "", {
                lower: true,
                strict: true,
              });
              if (node.attrs.id !== newSlug) {
                tr = tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  id: newSlug,
                });
                updated = true;
              }
            }
          });
          return updated ? tr : null;
        },
      }),
    ];
  },
});
