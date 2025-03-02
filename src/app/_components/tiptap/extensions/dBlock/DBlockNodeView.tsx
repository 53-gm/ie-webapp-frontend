/* eslint-disable jsx-a11y/no-static-element-interactions */

import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { GripVerticalIcon, PlusIcon } from "@yamada-ui/lucide";
import { HStack, IconButton } from "@yamada-ui/react";
import React, { useMemo } from "react";

export const DBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  getPos,
  editor,
}) => {
  const isTable = useMemo(() => {
    const { content } = node.content as any;

    return content[0].type.name === "table";
  }, [node.content]);

  const createNodeAfter = () => {
    const pos = getPos() + node.nodeSize;

    editor.commands.insertContentAt(pos, {
      type: "dBlock",
      content: [
        {
          type: "paragraph",
        },
      ],
    });
  };

  return (
    <NodeViewWrapper as="div" className="group relative">
      {/* コントロールバーを絶対位置で配置 */}
      {editor.isEditable && (
        <div
          className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ transform: "translateX(-130%)" }} // 左側に配置
        >
          <HStack>
            <IconButton
              variant="ghost"
              icon={<PlusIcon fontSize="lg" />}
              onClick={createNodeAfter}
              rounded="md"
              size="xs"
            />

            <IconButton
              variant="ghost"
              icon={<GripVerticalIcon fontSize="lg" />}
              contentEditable={false}
              draggable
              data-drag-handle
              rounded="lg"
              size="xs"
            />
          </HStack>
        </div>
      )}

      {/* メインコンテンツは同じ位置を維持 */}
      <NodeViewContent
        className={`node-view-content w-full ${isTable ? "ml-6" : ""}`}
      />
    </NodeViewWrapper>
  );
};
