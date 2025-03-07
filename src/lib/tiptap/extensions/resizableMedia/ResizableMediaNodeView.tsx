import { NodeSelection } from "@tiptap/pm/state";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Trash2Icon,
} from "@yamada-ui/lucide";
import { Box, HStack, IconButton, Tooltip } from "@yamada-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

export const ResizableMediaNodeView = ({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos,
}: NodeViewProps) => {
  const [mediaType, setMediaType] = useState<"img" | "video">();
  const [aspectRatio, setAspectRatio] = useState(1);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 初期化
  useEffect(() => {
    setMediaType(node.attrs["media-type"]);
  }, [node.attrs]);

  // アスペクト比の設定
  const setMediaAspectRatio = useCallback(() => {
    if (!mediaRef.current) return;

    if (mediaType === "img") {
      const img = mediaRef.current as HTMLImageElement;
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    } else if (mediaType === "video") {
      const video = mediaRef.current as HTMLVideoElement;
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio(video.videoWidth / video.videoHeight);
      }
    }
  }, [mediaType]);

  // メディアロード時にアスペクト比を設定
  useEffect(() => {
    if (!mediaRef.current) return;

    if (mediaType === "img") {
      if ((mediaRef.current as HTMLImageElement).complete) {
        setMediaAspectRatio();
      } else {
        mediaRef.current.addEventListener("load", setMediaAspectRatio);
      }
    } else if (mediaType === "video") {
      mediaRef.current.addEventListener("loadedmetadata", setMediaAspectRatio);
    }

    return () => {
      if (mediaRef.current) {
        if (mediaType === "img") {
          mediaRef.current.removeEventListener("load", setMediaAspectRatio);
        } else if (mediaType === "video") {
          mediaRef.current.removeEventListener(
            "loadedmetadata",
            setMediaAspectRatio
          );
        }
      }
    };
  }, [mediaRef, mediaType, setMediaAspectRatio]);

  // ドラッグハンドラー
  const handleDragStart = (e: React.DragEvent) => {
    // ドラッグ中のノード情報を設定
    if (typeof getPos === "function") {
      const { state } = editor;
      const pos = getPos();

      // NodeSelectionを使用して選択状態を設定
      const nodeSelection = NodeSelection.create(state.doc, pos);
      editor.view.dispatch(state.tr.setSelection(nodeSelection));
    }
  };

  // リサイズ機能
  useEffect(() => {
    if (!resizeHandleRef.current || !mediaRef.current) return;

    let startX = 0;
    let startWidth = 0;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!mediaRef.current) return;

      startX = e.clientX;
      startWidth = mediaRef.current.offsetWidth;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mediaRef.current) return;

      const delta = e.clientX - startX;
      let newWidth = startWidth + delta;

      // 最小サイズを制限
      newWidth = Math.max(100, newWidth);

      // 最大サイズを制限（コンテナの幅に基づく）
      const containerWidth =
        document.querySelector(".ProseMirror")?.clientWidth ||
        window.innerWidth;
      newWidth = Math.min(newWidth, containerWidth);

      // 新しい高さをアスペクト比に基づいて計算
      const newHeight = newWidth / aspectRatio;

      // 更新
      updateAttributes({
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // イベントリスナーを追加
    const resizeHandle = resizeHandleRef.current;
    resizeHandle.addEventListener("mousedown", handleMouseDown);

    // クリーンアップ
    return () => {
      resizeHandle.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [aspectRatio, updateAttributes]);

  // メディアアクションボタン
  const mediaActions = [
    {
      tooltip: "左寄せ",
      icon: <AlignLeftIcon />,
      action: () => updateAttributes({ dataAlign: "start", dataFloat: null }),
      isActive: node.attrs.dataAlign === "start" && !node.attrs.dataFloat,
    },
    {
      tooltip: "中央寄せ",
      icon: <AlignCenterIcon />,
      action: () => updateAttributes({ dataAlign: "center", dataFloat: null }),
      isActive: node.attrs.dataAlign === "center",
    },
    {
      tooltip: "右寄せ",
      icon: <AlignRightIcon />,
      action: () => updateAttributes({ dataAlign: "end", dataFloat: null }),
      isActive: node.attrs.dataAlign === "end" && !node.attrs.dataFloat,
    },
    {
      tooltip: "削除",
      icon: <Trash2Icon />,
      action: () => deleteNode(),
      isActive: false,
    },
  ];

  // アライメントクラスの取得
  const getAlignmentClass = () => {
    if (node.attrs.dataFloat === "left") return "float-left";
    if (node.attrs.dataFloat === "right") return "float-right";
    if (node.attrs.dataAlign === "center") return "mx-auto";
    if (node.attrs.dataAlign === "end") return "ml-auto";
    return "";
  };

  const isEditable = editor.isEditable;

  return (
    <NodeViewWrapper ref={wrapperRef} data-drag-handle>
      <Box
        className={`media-wrapper relative group ${getAlignmentClass()}`}
        my={4}
        w="fit-content"
        transition="all 0.2s ease-in-out"
      >
        {mediaType === "img" && (
          <img
            src={node.attrs.src}
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            alt={node.attrs.alt || "画像"}
            width={node.attrs.width}
            height={node.attrs.height}
            style={{ maxWidth: "100%", borderRadius: "0.375rem" }}
            draggable={isEditable}
            onDragStart={handleDragStart}
            data-drag-handle
          />
        )}

        {mediaType === "video" && (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            controls
            width={node.attrs.width}
            height={node.attrs.height}
            style={{ maxWidth: "100%", borderRadius: "0.375rem" }}
            draggable={isEditable}
            onDragStart={handleDragStart}
            data-drag-handle
          >
            <source src={node.attrs.src} />
          </video>
        )}
        {isEditable && (
          <>
            {/* リサイズハンドル */}
            <Box
              ref={resizeHandleRef}
              position="absolute"
              right="-6px"
              top="50%"
              transform="translateY(-50%)"
              width="15px"
              height="60px"
              cursor="ew-resize"
              opacity={0}
              _groupHover={{ opacity: 1 }}
              transition="all 0.2s"
              display="flex"
              justifyContent="center"
              alignItems="center"
              zIndex={10}
              className="resize-handle"
            />

            {/* メディアコントロール */}
            <HStack
              position="absolute"
              top={2}
              right={2}
              bg="white"
              rounded="md"
              shadow="md"
              p={1}
              opacity={0}
              _groupHover={{ opacity: 1 }}
              transition="all 0.2s ease"
            >
              {mediaActions.map((action) => (
                <Tooltip key={action.tooltip} label={action.tooltip}>
                  <IconButton
                    aria-label={action.tooltip}
                    icon={action.icon}
                    size="sm"
                    variant={action.isActive ? "solid" : "ghost"}
                    colorScheme={action.isActive ? "blue" : "gray"}
                    onClick={action.action}
                  />
                </Tooltip>
              ))}
            </HStack>
          </>
        )}
      </Box>
    </NodeViewWrapper>
  );
};
