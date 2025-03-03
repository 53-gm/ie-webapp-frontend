import { Task } from "@/types/api";
import { format } from "@formkit/tempo";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleIcon, PlusIcon } from "@yamada-ui/lucide";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface TasksTabProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: number) => Promise<void>;
  onCreateTask: (taskData: any) => Promise<boolean>;
}

// バリデーションスキーマ
const taskSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  description: z.string().optional(),
  priority: z.number().min(0).max(2),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function TasksTab({
  tasks,
  onUpdateStatus,
  onCreateTask,
}: TasksTabProps) {
  const { open, onToggle } = useDisclosure();

  // タスクをステータスごとに分類
  const todoTasks = tasks.filter((task) => task.status === 0);
  const inProgressTasks = tasks.filter((task) => task.status === 1);
  const completedTasks = tasks.filter((task) => task.status === 2);

  // フォーム
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: 1,
    },
  });

  // タスク作成
  const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    const success = await onCreateTask(data);
    if (success) {
      reset();
      onToggle();
    }
  };

  return (
    <VStack align="start" w="full">
      {/* タスク作成フォーム */}
      <Box w="full">
        <Button
          leftIcon={<PlusIcon />}
          onClick={onToggle}
          colorScheme="blue"
          size="sm"
          mb={4}
        >
          {open ? "キャンセル" : "タスクを追加"}
        </Button>

        <Collapse open={open} onToggle={onToggle} animationOpacity>
          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            p={4}
            borderWidth="1px"
            borderRadius="md"
          >
            <VStack align="start">
              <FormControl isInvalid={!!errors.title}>
                <Input
                  bg="white"
                  placeholder="タスクのタイトル"
                  {...register("title")}
                />
              </FormControl>

              <FormControl>
                <Textarea
                  bg="white"
                  placeholder="タスクの詳細"
                  {...register("description")}
                />
              </FormControl>

              <FormControl>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={String(field.value)}
                      onChange={(val) => field.onChange(Number(val))}
                    >
                      <HStack>
                        <Radio value="0">低</Radio>
                        <Radio value="1">中</Radio>
                        <Radio value="2">高</Radio>
                      </HStack>
                    </RadioGroup>
                  )}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                alignSelf="flex-end"
              >
                追加
              </Button>
            </VStack>
          </Box>
        </Collapse>
      </Box>

      {/* タスクリスト */}
      {tasks.length === 0 ? (
        <Box
          w="full"
          p={6}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
          textAlign="center"
        >
          <Text color="gray.500">この講義にはまだタスクがありません</Text>
        </Box>
      ) : (
        <VStack align="start" w="full">
          {/* 未着手タスク */}
          {todoTasks.length > 0 && (
            <Box w="full">
              <Heading size="sm" mb={2}>
                未着手
              </Heading>
              <Divider mb={2} />
              <VStack align="start">
                {todoTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </VStack>
            </Box>
          )}

          {/* 進行中タスク */}
          {inProgressTasks.length > 0 && (
            <Box w="full">
              <Heading size="sm" mb={2}>
                進行中
              </Heading>
              <Divider mb={2} />
              <VStack align="start">
                {inProgressTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </VStack>
            </Box>
          )}

          {/* 完了タスク */}
          {completedTasks.length > 0 && (
            <Box w="full">
              <Heading size="sm" mb={2}>
                完了
              </Heading>
              <Divider mb={2} />
              <VStack align="start">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      )}
    </VStack>
  );
}

// タスクアイテムコンポーネント
interface TaskItemProps {
  task: Task;
  onUpdateStatus: (taskId: string, status: number) => Promise<void>;
}

function TaskItem({ task, onUpdateStatus }: TaskItemProps) {
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
      borderLeftColor={priorityColor + ".500"}
      bg="white"
      opacity={isCompleted ? 0.7 : 1}
    >
      <HStack>
        <IconButton
          aria-label={isCompleted ? "タスクを未完了にする" : "タスクを完了する"}
          icon={isCompleted ? <CircleIcon /> : <CircleIcon />}
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
      </HStack>
    </Box>
  );
}
