"use client";

import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "@/actions/tasks";
import CreateTaskForm from "@/app/_components/Task/CreateTaskForm";
import DeleteCompletedTasksDialog from "@/app/_components/Task/DeleteCompletedTasksDialog";
import DeleteTaskDialog from "@/app/_components/Task/DeleteTaskDialog";
import EditTaskModal from "@/app/_components/Task/EditTaskModal";
import { TaskFormValues } from "@/app/_components/Task/schema";
import { Task } from "@/types/api";
import { unwrap } from "@/utils/unwrap";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  useNotice,
} from "@yamada-ui/react";
import { useState } from "react";
import TaskColumn from "../TaskColumn";

interface TasksDashboardProps {
  initialTasks: Task[];
}

export default function TasksDashboard({ initialTasks }: TasksDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const notice = useNotice();

  // 編集モーダルの状態管理
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteCompletedDialogOpen, setIsDeleteCompletedDialogOpen] =
    useState(false);

  // タスクのステータスでフィルタリング
  const todoTasks = tasks.filter((task) => task.status === 0);
  const inProgressTasks = tasks.filter((task) => task.status === 1);
  const completedTasks = tasks.filter((task) => task.status === 2);

  // タスクのステータスを更新
  const handleUpdateTaskStatus = async (taskId: string, status: number) => {
    try {
      const result = await updateTaskStatus(taskId, status);

      if (result.success && result.data) {
        // ローカルの状態を更新
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, status } : task))
        );

        notice({
          title: "タスク更新",
          description: "タスクのステータスを更新しました",
          status: "success",
        });
      } else {
        throw new Error(result.error?.message || "更新に失敗しました");
      }
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message,
        status: "error",
      });
    }
  };

  // 新規タスク作成
  const handleCreateTask = async (formData: TaskFormValues) => {
    try {
      const result = unwrap(await createTask(formData));

      // 新しいタスクを追加
      setTasks((prev) => [...prev, result]);

      notice({
        title: "タスク作成",
        description: "新しいタスクを作成しました",
        status: "success",
      });
      return true;
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  // タスク編集
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // タスク更新
  const handleUpdateTask = async (taskId: string, taskData: TaskFormValues) => {
    try {
      const result = unwrap(await updateTask(taskId, taskData));

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? result : task))
      );

      notice({
        title: "タスク更新",
        description: "タスクを更新しました",
        status: "success",
      });
      return true;
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  // タスク削除ダイアログを開く
  const handleOpenDeleteDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  // タスク削除
  const handleDeleteTask = async () => {
    if (!selectedTask) return false;

    try {
      const result = await deleteTask(selectedTask.id);

      if (result.success) {
        setTasks((prev) => prev.filter((task) => task.id !== selectedTask.id));

        notice({
          title: "タスク削除",
          description: "タスクを削除しました",
          status: "success",
        });
        return true;
      } else {
        throw new Error(result.error?.message || "削除に失敗しました");
      }
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  // 完了タスクの一括削除
  const handleDeleteCompletedTasks = async () => {
    try {
      const completedTaskIds = completedTasks.map((task) => task.id);
      let successCount = 0;

      // 各タスクを順番に削除
      for (const taskId of completedTaskIds) {
        const result = await deleteTask(taskId);
        if (result.success) {
          successCount++;
        }
      }

      // 成功した場合、ローカルの状態を更新
      if (successCount > 0) {
        setTasks((prev) => prev.filter((task) => task.status !== 2));

        notice({
          title: "一括削除",
          description: `${successCount}件の完了タスクを削除しました`,
          status: "success",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message,
        status: "error",
      });
      return false;
    }
  };

  return (
    <Box w="full">
      {/* タスクボード */}
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {/* 未着手タスク */}
        <GridItem>
          <TaskColumn
            title="未着手"
            tasks={todoTasks}
            onUpdateStatus={handleUpdateTaskStatus}
            onEdit={handleEditTask}
            onDelete={handleOpenDeleteDialog}
          />
        </GridItem>

        {/* 進行中タスク */}
        <GridItem>
          <TaskColumn
            title="進行中"
            tasks={inProgressTasks}
            onUpdateStatus={handleUpdateTaskStatus}
            onEdit={handleEditTask}
            onDelete={handleOpenDeleteDialog}
          />
        </GridItem>

        {/* 完了タスク */}
        <GridItem>
          <TaskColumn
            title="完了"
            tasks={completedTasks}
            onUpdateStatus={handleUpdateTaskStatus}
            onEdit={handleEditTask}
            onDelete={handleOpenDeleteDialog}
            extraHeader={
              completedTasks.length > 0 && (
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => setIsDeleteCompletedDialogOpen(true)}
                >
                  完了タスクをすべて削除
                </Button>
              )
            }
          />
        </GridItem>
      </Grid>

      <Box mt={6}>
        <Heading size="md" mb={4}>
          新しいタスクを作成
        </Heading>
        <CreateTaskForm onSubmit={handleCreateTask} />
      </Box>

      {/* モーダルとダイアログ */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTask}
        task={selectedTask}
      />

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteTask}
      />

      <DeleteCompletedTasksDialog
        isOpen={isDeleteCompletedDialogOpen}
        onClose={() => setIsDeleteCompletedDialogOpen(false)}
        onDelete={handleDeleteCompletedTasks}
        taskCount={completedTasks.length}
      />
    </Box>
  );
}
