import { Task } from "@/types/api";
import { PlusIcon, TrashIcon } from "@yamada-ui/lucide";
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import { useState } from "react";
import CreateTaskForm from "./TaskComponents/CreateTaskForm";
import DeleteCompletedTasksDialog from "./TaskComponents/DeleteCompletedTasksDialog";
import DeleteTaskDialog from "./TaskComponents/DeleteTaskDialog";
import EditTaskModal from "./TaskComponents/EditTaskModal";
import TaskItem from "./TaskComponents/TaskItem";

interface TasksTabProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: number) => Promise<void>;
  onCreateTask: (taskData: any) => Promise<boolean>;
  onUpdateTask: (taskId: string, taskData: any) => Promise<boolean>;
  onDeleteTask: (taskId: string) => Promise<boolean>;
  onDeleteCompletedTasks: () => Promise<boolean>;
}

export default function TasksTab({
  tasks,
  onUpdateStatus,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onDeleteCompletedTasks,
}: TasksTabProps) {
  const { open, onToggle } = useDisclosure(); // 新規タスクフォーム表示制御
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

  // タスク編集モーダルを開く
  const handleEditTask = (task: Task) => {
    setSelectedTaskId(task.id);
    onEditModalOpen();
  };

  // 削除確認ダイアログを開く
  const handleOpenDeleteDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    onDeleteDialogOpen();
  };

  // タスク作成フォーム送信成功後
  const handleCreateSuccess = () => {
    onToggle(); // フォームを閉じる
  };

  const getSelectedTask = () => {
    return tasks.find((task) => task.id === selectedTaskId) || null;
  };

  return (
    <VStack align="start" w="full">
      {/* タスク作成ボタンとフォーム */}
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

        {open && (
          <CreateTaskForm
            onSubmit={onCreateTask}
            onSuccess={handleCreateSuccess}
          />
        )}
      </Box>

      {/* タスクリスト */}
      {tasks.length === 0 ? (
        <EmptyTasksMessage />
      ) : (
        <VStack align="start" w="full">
          {/* 未着手タスク */}
          {todoTasks.length > 0 && (
            <TaskSection
              title="未着手"
              tasks={todoTasks}
              onUpdateStatus={onUpdateStatus}
              onEdit={handleEditTask}
              onDelete={handleOpenDeleteDialog}
            />
          )}

          {/* 進行中タスク */}
          {inProgressTasks.length > 0 && (
            <TaskSection
              title="進行中"
              tasks={inProgressTasks}
              onUpdateStatus={onUpdateStatus}
              onEdit={handleEditTask}
              onDelete={handleOpenDeleteDialog}
            />
          )}

          {/* 完了タスク */}
          {completedTasks.length > 0 && (
            <TaskSection
              title="完了"
              tasks={completedTasks}
              onUpdateStatus={onUpdateStatus}
              onEdit={handleEditTask}
              onDelete={handleOpenDeleteDialog}
              extraHeader={
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<TrashIcon />}
                  onClick={onDeleteCompletedDialogOpen}
                >
                  完了タスクをすべて削除
                </Button>
              }
            />
          )}
        </VStack>
      )}

      {/* モーダルとダイアログ */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        onSubmit={onUpdateTask}
        task={getSelectedTask()}
        taskId={selectedTaskId}
      />

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDelete={() =>
          selectedTaskId ? onDeleteTask(selectedTaskId) : Promise.resolve(false)
        }
      />

      <DeleteCompletedTasksDialog
        isOpen={isDeleteCompletedDialogOpen}
        onClose={onDeleteCompletedDialogClose}
        onDelete={onDeleteCompletedTasks}
        taskCount={completedTasks.length}
      />
    </VStack>
  );
}

// サブコンポーネント: タスク空の時のメッセージ
function EmptyTasksMessage() {
  return (
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
  );
}

// サブコンポーネント: タスクセクション
interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: number) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  extraHeader?: React.ReactNode;
}

function TaskSection({
  title,
  tasks,
  onUpdateStatus,
  onEdit,
  onDelete,
  extraHeader,
}: TaskSectionProps) {
  return (
    <Box w="full">
      <HStack justifyContent="space-between" mb={2}>
        <Heading size="sm">{title}</Heading>
        {extraHeader}
      </HStack>
      <Divider mb={2} />
      <VStack align="start">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdateStatus={onUpdateStatus}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </VStack>
    </Box>
  );
}
