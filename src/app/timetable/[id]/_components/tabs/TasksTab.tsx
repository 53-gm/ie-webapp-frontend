import { Task } from "@/types/api";
import { format } from "@formkit/tempo";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleIcon,
  FilePenIcon,
  PlusIcon,
  TrashIcon,
} from "@yamada-ui/lucide";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  Divider,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
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
  onUpdateTask: (taskId: string, taskData: any) => Promise<boolean>;
  onDeleteTask: (taskId: string) => Promise<boolean>;
  onDeleteCompletedTasks: () => Promise<boolean>;
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
  onUpdateTask,
  onDeleteTask,
  onDeleteCompletedTasks,
}: TasksTabProps) {
  const { open, onToggle } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // 編集モーダルの状態
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  // 削除確認ダイアログの状態
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  // 完了タスク一括削除確認ダイアログの状態
  const {
    isOpen: isDeleteCompletedDialogOpen,
    onOpen: onDeleteCompletedDialogOpen,
    onClose: onDeleteCompletedDialogClose,
  } = useDisclosure();

  // タスクをステータスごとに分類
  const todoTasks = tasks.filter((task) => task.status === 0);
  const inProgressTasks = tasks.filter((task) => task.status === 1);
  const completedTasks = tasks.filter((task) => task.status === 2);

  // 新規作成フォーム
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

  // 編集フォーム
  const {
    register: registerEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
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

  // 編集モーダルを開く
  const handleEditTask = (task: Task) => {
    setSelectedTaskId(task.id);
    resetEdit({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });
    onEditModalOpen();
  };

  // タスク編集を保存
  const onSubmitEdit: SubmitHandler<TaskFormValues> = async (data) => {
    if (!selectedTaskId) return;

    const success = await onUpdateTask(selectedTaskId, data);
    if (success) {
      onEditModalClose();
    }
  };

  // 削除確認ダイアログを開く
  const handleOpenDeleteDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    onDeleteDialogOpen();
  };

  // タスク削除を実行
  const handleConfirmDelete = async () => {
    if (!selectedTaskId) return;

    setIsDeleting(true);
    try {
      const success = await onDeleteTask(selectedTaskId);
      if (success) {
        onDeleteDialogClose();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // 完了タスクの一括削除を実行
  const handleConfirmDeleteCompleted = async () => {
    setIsDeletingCompleted(true);
    try {
      const success = await onDeleteCompletedTasks();
      if (success) {
        onDeleteCompletedDialogClose();
      }
    } finally {
      setIsDeletingCompleted(false);
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
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleOpenDeleteDialog(task.id)}
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
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleOpenDeleteDialog(task.id)}
                  />
                ))}
              </VStack>
            </Box>
          )}

          {/* 完了タスク */}
          {completedTasks.length > 0 && (
            <Box w="full">
              <HStack justifyContent="space-between" mb={2}>
                <Heading size="sm">完了</Heading>
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<TrashIcon />}
                  onClick={onDeleteCompletedDialogOpen}
                >
                  完了タスクをすべて削除
                </Button>
              </HStack>
              <Divider mb={2} />
              <VStack align="start">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdateStatus={onUpdateStatus}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleOpenDeleteDialog(task.id)}
                  />
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      )}

      {/* タスク編集モーダル */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalHeader>タスクを編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box as="form" onSubmit={handleSubmitEdit(onSubmitEdit)}>
            <VStack align="start">
              <FormControl isInvalid={!!errorsEdit.title} mb={3}>
                <Input
                  placeholder="タスクのタイトル"
                  {...registerEdit("title")}
                />
              </FormControl>

              <FormControl mb={3}>
                <Textarea
                  placeholder="タスクの詳細"
                  {...registerEdit("description")}
                />
              </FormControl>

              <FormControl mb={3}>
                <Controller
                  name="priority"
                  control={controlEdit}
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
            </VStack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onEditModalClose}>
            キャンセル
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isSubmittingEdit}
            onClick={handleSubmitEdit(onSubmitEdit)}
          >
            保存
          </Button>
        </ModalFooter>
      </Modal>

      {/* タスク削除確認ダイアログ */}
      <Dialog isOpen={isDeleteDialogOpen} onClose={onDeleteDialogClose}>
        <DialogOverlay />
        <DialogBody>
          <DialogHeader>タスクの削除</DialogHeader>
          <Text>このタスクを削除しますか？この操作は取り消せません。</Text>
          <DialogFooter>
            <Button onClick={onDeleteDialogClose}>キャンセル</Button>
            <Button
              colorScheme="red"
              isLoading={isDeleting}
              onClick={handleConfirmDelete}
              ml={3}
            >
              削除
            </Button>
          </DialogFooter>
        </DialogBody>
      </Dialog>

      {/* 完了タスク一括削除確認ダイアログ */}
      {completedTasks.length > 0 && (
        <Dialog
          isOpen={isDeleteCompletedDialogOpen}
          onClose={onDeleteCompletedDialogClose}
        >
          <DialogOverlay />
          <DialogBody>
            <DialogHeader>完了タスクの一括削除</DialogHeader>
            <Text>
              完了したタスク({completedTasks.length}
              件)をすべて削除しますか？この操作は取り消せません。
            </Text>
            <DialogFooter>
              <Button onClick={onDeleteCompletedDialogClose}>キャンセル</Button>
              <Button
                colorScheme="red"
                isLoading={isDeletingCompleted}
                onClick={handleConfirmDeleteCompleted}
                ml={3}
              >
                すべて削除
              </Button>
            </DialogFooter>
          </DialogBody>
        </Dialog>
      )}
    </VStack>
  );
}

// タスクアイテムコンポーネント
interface TaskItemProps {
  task: Task;
  onUpdateStatus: (taskId: string, status: number) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
}

function TaskItem({ task, onUpdateStatus, onEdit, onDelete }: TaskItemProps) {
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
