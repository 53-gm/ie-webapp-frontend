import { Editor } from "@tiptap/react";
import { Badge, Box, Heading, Text, VStack } from "@yamada-ui/react";
import React, { useCallback, useEffect, useState } from "react";

interface TocItem {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  editor: Editor;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ editor }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  // デバウンス関数
  const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // 見出しの抽出と目次アイテムの生成
  const updateToc = useCallback(() => {
    if (!editor) return;

    const items: TocItem[] = [];

    // コンソールでデバッグ情報を表示
    console.log("目次更新を開始します...");

    editor.view.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        console.log("見出し検出:", {
          text: node.textContent,
          attrs: node.attrs,
          pos,
        });

        items.push({
          id: node.attrs.id || "",
          level: node.attrs.level,
          text: node.textContent,
        });
      }
    });

    console.log("検出された見出し数:", items.length);
    setTocItems(items);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    // パフォーマンス向上のためデバウンスを適用
    const debouncedUpdateToc = debounce(updateToc, 300);

    // エディタの内容が変更されたら目次を更新
    editor.on("transaction", debouncedUpdateToc);
    editor.on("update", debouncedUpdateToc);

    // 初期化時に一度実行
    updateToc();

    return () => {
      editor.off("transaction", debouncedUpdateToc);
      editor.off("update", debouncedUpdateToc);
    };
  }, [editor, updateToc]);

  // 見出しクリック時のハンドラ - スムーズスクロール
  const handleItemClick = (id: string) => {
    if (!id) {
      console.warn("アイテムにIDがありません");
      return;
    }

    // プレフィックスが付いているかもしれない
    const targetId = id.startsWith("#") ? id.substring(1) : id;

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });

      // クリック時にハイライト効果を追加（オプション）
      element.classList.add("heading-highlight");
      setTimeout(() => {
        element.classList.remove("heading-highlight");
      }, 2000);
    } else {
      console.warn(`ID: ${targetId} の要素が見つかりません`);
    }
  };

  if (tocItems.length === 0) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
        <Text fontSize="sm" color="gray.500">
          目次がありません。見出しを追加してください。
        </Text>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
      bg="white"
      pos="sticky"
      inset="md"
    >
      <Heading size="md" mb={4}>
        目次
      </Heading>
      <VStack align="start">
        {tocItems.map((item, index) => (
          <Box key={index} w="full">
            <Text
              fontSize={item.level === 1 ? "md" : "sm"}
              fontWeight={item.level === 1 ? "bold" : "normal"}
              ml={`${(item.level - 1) * 16}px`}
              color={item.id ? "blue.600" : "gray.400"}
              cursor={item.id ? "pointer" : "not-allowed"}
              _hover={{ textDecoration: item.id ? "underline" : "none" }}
              onClick={() => item.id && handleItemClick(item.id)}
              display="inline-flex"
              alignItems="center"
            >
              {item.text}
              {!item.id && (
                <Badge ml={2} colorScheme="red" size="sm">
                  ID未設定
                </Badge>
              )}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
