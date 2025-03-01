import { Extension } from "@tiptap/core";
import { Node as ProsemirrorNode } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";

// 目次アイテムの型定義
export interface TocItem {
  id: string;
  level: number;
  text: string;
}

// 目次拡張機能の設定オプション
interface TableOfContentsOptions {
  // 対象とする見出しレベル
  levels: number[];
  // 見出し一覧が変化したときに呼ばれるコールバック
  onUpdate: (items: TocItem[]) => void;
}

export const TableOfContents = Extension.create<TableOfContentsOptions>({
  name: "tableOfContents",

  // デフォルトのオプション
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      onUpdate: () => {},
    };
  },

  addProseMirrorPlugins() {
    // ここで拡張機能の this.options から直接分割代入するパターン
    const { levels, onUpdate } = this.options;

    return [
      new Plugin({
        key: new PluginKey("tableOfContents"),

        state: {
          // 初期化時
          init(_, { doc }) {
            return getHeadings(doc, levels);
          },

          // トランザクション適用時に呼ばれる
          apply(transaction, oldState, newState) {
            // docが更新されたら見出し情報を取り出す
            const headings = getHeadings(newState.doc, levels);

            // もし前回の状態と変わったなら onUpdate() を呼ぶ
            if (JSON.stringify(headings) !== JSON.stringify(oldState)) {
              onUpdate(headings);
            }

            return headings;
          },
        },
      }),
    ];
  },
});

/**
 * ドキュメントから見出しを抽出して TocItem[] を返す関数
 */
function getHeadings(doc: ProsemirrorNode, levels: number[]): TocItem[] {
  const headings: TocItem[] = [];

  doc.descendants((node) => {
    if (node.type.name === "heading" && levels.includes(node.attrs.level)) {
      const text = node.textContent;
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      headings.push({
        id,
        level: node.attrs.level,
        text,
      });
    }
    return true;
  });

  return headings;
}
