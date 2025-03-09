"use client";

import { Task } from "@/types/api";
import { format } from "@formkit/tempo";
import {
  ArrowRightIcon,
  CircleCheckBigIcon,
  CircleIcon,
  FilePenIcon,
  TrashIcon,
} from "@yamada-ui/lucide";
import {
  Badge,
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  VStack,
} from "@yamada-ui/react";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (taskId: string, status: number) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  showLecture?: boolean; // 講義情報を表示するかどうか
}

export default function TaskItem({
  task,
  onUpdateStatus,
  onEdit,
  onDelete,
  showLecture = true, // デフォルトでは講義情報を表示
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

  // タスクのステータスを特定のステータスに更新
  const updateTaskStatus = async (status: number) => {
    if (isUpdating || task.status === status) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(task.id, status);
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

  // フォーマットされた日付
  const formattedDueDate = task.due_date
    ? format(task.due_date, "short")
    : null;

  return (
    <Box
      p={3}
      borderWidth="1px"
      borderRadius="md"
      borderLeftWidth="4px"
      borderLeftColor={`${priorityColor}.500`}
      bg="white"
      opacity={isCompleted ? 0.7 : 1}
      _hover={{ shadow: "sm" }}
      transition="all 0.2s"
    >
      <HStack alignItems="flex-start">
        {/* チェックボックス */}
        <Tooltip
          label={isCompleted ? "タスクを未完了にする" : "タスクを完了する"}
        >
          <IconButton
            aria-label={
              isCompleted ? "タスクを未完了にする" : "タスクを完了する"
            }
            icon={isCompleted ? <CircleCheckBigIcon /> : <CircleIcon />}
            variant="ghost"
            colorScheme={isCompleted ? "green" : "gray"}
            size="sm"
            isLoading={isUpdating}
            onClick={toggleTaskStatus}
          />
        </Tooltip>

        {/* タスク情報 */}
        <VStack align="start" flex={1}>
          <HStack w="full" justify="space-between">
            <Text
              fontWeight="medium"
              textDecoration={isCompleted ? "line-through" : "none"}
              color={isCompleted ? "gray.500" : "inherit"}
            >
              {task.title}
            </Text>

            {/* 講義名を表示（オプション） */}
            {showLecture && task.lecture && (
              <Badge colorScheme="purple" variant="subtle">
                {task.lecture.name}
              </Badge>
            )}
          </HStack>

          {task.description && (
            <Text
              fontSize="sm"
              color={isCompleted ? "gray.400" : "gray.600"}
              textDecoration={isCompleted ? "line-through" : "none"}
            >
              {task.description}
            </Text>
          )}

          {/* メタ情報 */}
          <HStack fontSize="xs" color="gray.500">
            {formattedDueDate && <Text>期限: {formattedDueDate}</Text>}
            <Text>
              優先度:
              <Badge ml={1} colorScheme={priorityColor} variant="subtle">
                {task.priority === 0 ? "低" : task.priority === 1 ? "中" : "高"}
              </Badge>
            </Text>
          </HStack>
        </VStack>

        {/* アクションボタン */}
        <ButtonGroup size="sm" variant="ghost">
          {/* ステータス変更メニュー */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="ステータスを変更"
              icon={<ArrowRightIcon />}
              size="sm"
              isDisabled={isUpdating}
            />
            <MenuList>
              <MenuItem
                onClick={() => updateTaskStatus(0)}
                isDisabled={task.status === 0}
              >
                未着手に移動
              </MenuItem>
              <MenuItem
                onClick={() => updateTaskStatus(1)}
                isDisabled={task.status === 1}
              >
                進行中に移動
              </MenuItem>
              <MenuItem
                onClick={() => updateTaskStatus(2)}
                isDisabled={task.status === 2}
              >
                完了に移動
              </MenuItem>
            </MenuList>
          </Menu>

          {/* 編集ボタン */}
          <IconButton
            aria-label="タスクを編集"
            icon={<FilePenIcon />}
            onClick={() => onEdit(task)}
          />

          {/* 削除ボタン */}
          <IconButton
            aria-label="タスクを削除"
            icon={<TrashIcon />}
            colorScheme="red"
            onClick={() => onDelete(task)}
          />
        </ButtonGroup>
      </HStack>
    </Box>
  );
}
