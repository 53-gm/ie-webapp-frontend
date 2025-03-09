import { Editor } from "@tiptap/react";
import { Box, Heading, HStack, Text, VStack } from "@yamada-ui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

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

    editor.view.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        items.push({
          id: node.attrs.id || "",
          level: node.attrs.level,
          text: node.textContent,
        });
      }
    });

    setTocItems(items);
  }, [editor]);

  // スクロール時のアクティブ見出し検出
  const setupIntersectionObserver = useCallback(() => {
    if (!editor || typeof window === "undefined") return;

    // 既存のObserverをクリーンアップ
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 要素がビューポートに入ったときに呼び出される関数
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // 交差している要素をチェック
      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting
      );

      // 交差している要素がある場合、最初の要素をアクティブに
      if (intersectingEntries.length > 0) {
        const newActiveId = intersectingEntries[0].target.id;
        setActiveId(newActiveId);

        // URLを更新（履歴を残さずにステート更新）
        if (window.history) {
          const newUrl =
            window.location.pathname +
            window.location.search +
            (newActiveId ? `#${newActiveId}` : "");
          window.history.replaceState(null, "", newUrl);
        }
      }
    };

    // IntersectionObserverのオプション
    const options = {
      root: null, // ビューポート
      rootMargin: "-80px 0px -80% 0px", // 上部に少し余裕を持たせる
      threshold: 0, // 少しでも見えたら発火
    };

    // IntersectionObserverの作成
    observerRef.current = new IntersectionObserver(handleIntersect, options);

    // 監視対象の要素を登録
    setTimeout(() => {
      // DOMが更新された後に実行
      tocItems.forEach((item) => {
        if (item.id) {
          const element = document.getElementById(item.id);
          if (element) {
            observerRef.current?.observe(element);
          }
        }
      });
    }, 100);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [editor, tocItems]);

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

  // 目次アイテムが変更されたらIntersectionObserverを再設定
  useEffect(() => {
    setupIntersectionObserver();

    // ページロード時にURLのハッシュがあれば対応する要素にスクロール
    const hash = window.location.hash;
    if (hash && hash.startsWith("#")) {
      const targetId = hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        // スムーズにスクロール
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          setActiveId(targetId);
        }, 300);
      }
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [tocItems, setupIntersectionObserver]);

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
      // スクロール前にアクティブIDを設定
      setActiveId(targetId);

      // Next.jsのルーターでURLを更新（オプション）
      // router.push(`${window.location.pathname}#${targetId}`, { scroll: false });

      // または、window.historyを使用
      const newUrl =
        window.location.pathname + window.location.search + `#${targetId}`;
      window.history.pushState(null, "", newUrl);

      // スムーズにスクロール
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`ID: ${targetId} の要素が見つかりません`);
    }
  };

  // 見出しレベルに基づいてマーカーサイズを取得
  const getMarkerSize = (level: number): number => {
    switch (level) {
      case 1:
        return 10; // h1
      case 2:
        return 8; // h2
      default:
        return 6; // h3以下
    }
  };

  if (tocItems.length === 0) {
    return <></>;
  }

  return (
    <Box
      p={4}
      borderRadius="md"
      bg="white"
      borderColor="gray.100"
      borderWidth="1px"
      boxShadow="sm"
      position="sticky"
      top="16px"
      maxHeight="calc(100vh - 150px)"
      overflowY="auto"
      className="zenn-toc"
    >
      <Heading size="md" mb={4} fontWeight="bold" fontSize="md">
        目次
      </Heading>

      <VStack align="start" position="relative">
        {tocItems.map((item, index) => {
          const isActive = item.id === activeId;
          const markerSize = getMarkerSize(item.level);

          return (
            <HStack key={index} gap="sm" pl={(item.level - 1) * 3}>
              {/* マーカー（アクティブな項目のみ青色） */}
              <Box
                width={`${markerSize}px`}
                height={`${markerSize}px`}
                borderRadius="full"
                bg={isActive ? "blue.400" : "blue.100"}
                zIndex={1}
              />

              <Text
                fontSize="sm"
                fontWeight={isActive ? "bold" : "normal"}
                color={isActive ? "gray.900" : "gray.500"}
                transition="all 0.2s ease"
                cursor={item.id ? "pointer" : "not-allowed"}
                onClick={() => item.id && handleItemClick(item.id)}
              >
                {item.text}
                {!item.id && (
                  <Text as="span" ml={1} fontSize="xs" color="gray.400">
                    (ID未設定)
                  </Text>
                )}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
};
