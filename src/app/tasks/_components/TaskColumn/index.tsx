"use client";

import TaskItem from "@/app/_components/Task/TaskItem";
import { Task } from "@/types/api";
import { Box, Heading, HStack, Text, VStack } from "@yamada-ui/react";
import { ReactNode } from "react";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: number) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  extraHeader?: ReactNode;
}

export default function TaskColumn({
  title,
  tasks,
  onUpdateStatus,
  onEdit,
  onDelete,
  extraHeader,
}: TaskColumnProps) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderRadius="md"
      p={4}
      h="full"
      minH="md"
      boxShadow="sm"
    >
      <HStack justifyContent="space-between" mb={4}>
        <Heading size="sm">
          {title} ({tasks.length})
        </Heading>
        {extraHeader}
      </HStack>

      {tasks.length === 0 ? (
        <Box py={8} textAlign="center">
          <Text color="gray.500">タスクがありません</Text>
        </Box>
      ) : (
        <VStack align="stretch" maxH="lg" overflow="auto" px={1}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              showLecture={true} // 講義ページと区別するために常に講義名を表示
            />
          ))}
        </VStack>
      )}
    </Box>
  );
}
