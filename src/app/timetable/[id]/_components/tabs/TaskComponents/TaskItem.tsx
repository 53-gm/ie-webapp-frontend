import { Task } from "@/types/api";
import { format } from "@formkit/tempo";
import { CircleIcon, FilePenIcon, TrashIcon } from "@yamada-ui/lucide";
import { Box, HStack, IconButton, Text, VStack } from "@yamada-ui/react";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (taskId: string, status: number) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskItem({
  task,
  onUpdateStatus,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // タスクの状態を切り替え
  const toggleTaskStatus = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      // 完了 ↔ 未完了 の切り替え
      const newStatus = task.status === 2 ? 0 : 2;
      await onUpdateStatus(task.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  // 優先度に応じた色
  const priorityColor =
    {
      0: "green",
      1: "blue",
      2: "red",
    }[task.priority] || "gray";

  // 状態に応じたスタイル
  const isCompleted = task.status === 2;

  return (
    <Box
      w="full"
      p={3}
      borderWidth="1px"
      borderRadius="md"
      borderLeftWidth="4px"
      borderLeftColor={`${priorityColor}.500`}
      bg="white"
      opacity={isCompleted ? 0.7 : 1}
    >
      <HStack>
        <IconButton
          aria-label={isCompleted ? "タスクを未完了にする" : "タスクを完了する"}
          icon={<CircleIcon />}
          variant="ghost"
          colorScheme={isCompleted ? "green" : "gray"}
          size="sm"
          isLoading={isUpdating}
          onClick={toggleTaskStatus}
        />

        <VStack align="start" flex={1}>
          <Text
            fontWeight="medium"
            textDecoration={isCompleted ? "line-through" : "none"}
            color={isCompleted ? "gray.500" : "inherit"}
          >
            {task.title}
          </Text>

          {task.description && (
            <Text
              fontSize="sm"
              color={isCompleted ? "gray.400" : "gray.600"}
              textDecoration={isCompleted ? "line-through" : "none"}
            >
              {task.description}
            </Text>
          )}
        </VStack>

        {task.due_date && (
          <Text fontSize="xs" color="gray.500">
            {format(task.due_date, "short")}
          </Text>
        )}

        {/* 編集ボタン */}
        <IconButton
          aria-label="タスクを編集"
          icon={<FilePenIcon />}
          variant="ghost"
          size="sm"
          onClick={onEdit}
        />

        {/* 削除ボタン */}
        <IconButton
          aria-label="タスクを削除"
          icon={<TrashIcon />}
          variant="ghost"
          colorScheme="red"
          size="sm"
          onClick={onDelete}
        />
      </HStack>
    </Box>
  );
}
