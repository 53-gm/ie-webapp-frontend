"use client";

import { deleteRegistration } from "@/actions/lectures";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "@/actions/tasks";
import { Registration, Task } from "@/types/api";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useNotice,
} from "@yamada-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LectureInfoTab from "../tabs/LectureInfoTab";
import SettingsTab from "../tabs/SettingsTab";
import TasksTab from "../tabs/TasksTab";

interface LectureDetailTabsProps {
  registration: Registration;
  tasks: Task[];
}

export default function LectureDetailTabs({
  registration,
  tasks,
}: LectureDetailTabsProps) {
  const lecture = registration.lecture;
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const router = useRouter();
  const notice = useNotice();

  // タスクの状態を更新
  const handleUpdateTaskStatus = async (taskId: string, status: number) => {
    try {
      const result = await updateTaskStatus(taskId, status);

      if (result.success) {
        // ローカルの状態を更新
        setLocalTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, status } : task))
        );

        notice({
          title: "タスク更新",
          description: "タスクのステータスを更新しました",
          status: "success",
        });
      } else {
        throw new Error(result.error?.error.message || "更新に失敗しました");
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
  const handleCreateTask = async (taskData: any) => {
    try {
      const result = await createTask({
        ...taskData,
        lecture_id: lecture.id,
      });

      if (result.success) {
        // ローカルの状態を更新
        if (result.data) {
          setLocalTasks((prev) => [...prev, result.data]);

          notice({
            title: "タスク作成",
            description: "新しいタスクを作成しました",
            status: "success",
          });
        }

        return true;
      } else {
        throw new Error(result.error?.error.message || "作成に失敗しました");
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

  // タスク編集
  const handleUpdateTask = async (taskId: string, taskData: any) => {
    try {
      const result = await updateTask(taskId, taskData);

      if (result.success && result.data) {
        // ローカルの状態を更新
        setLocalTasks((prev) =>
          prev.map((task) => (task.id === taskId ? result.data : task))
        );

        notice({
          title: "タスク更新",
          description: "タスクを更新しました",
          status: "success",
        });
        return true;
      } else {
        throw new Error(result.error?.error.message || "更新に失敗しました");
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

  // タスク削除
  const handleDeleteTask = async (taskId: string) => {
    try {
      const result = await deleteTask(taskId);

      if (result.success) {
        // ローカルの状態を更新
        setLocalTasks((prev) => prev.filter((task) => task.id !== taskId));

        notice({
          title: "タスク削除",
          description: "タスクを削除しました",
          status: "success",
        });
        return true;
      } else {
        throw new Error(result.error?.error.message || "削除に失敗しました");
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
      const completedTasks = localTasks.filter((task) => task.status === 2);
      let successCount = 0;

      // 各タスクを順番に削除
      for (const task of completedTasks) {
        const result = await deleteTask(task.id);
        if (result.success) {
          successCount++;
        }
      }

      // 成功した場合、ローカルの状態を更新
      if (successCount > 0) {
        setLocalTasks((prev) => prev.filter((task) => task.status !== 2));

        notice({
          title: "一括削除",
          description: `${successCount}件の完了タスクを削除しました`,
          status: "success",
        });
        return true;
      } else {
        return false;
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

  // 講義登録を削除
  const handleDeleteRegistration = async () => {
    try {
      // 講義IDで登録を削除
      const result = await deleteRegistration(registration.id);

      if (result.success) {
        notice({
          title: "登録削除",
          description: "講義の登録を削除しました",
          status: "success",
        });

        // 時間割ページにリダイレクト
        router.push("/timetable");
      } else {
        throw new Error(result.error?.error.message || "削除に失敗しました");
      }
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <Tabs w="full" variant="rounded" colorScheme="blue">
      <TabList>
        <Tab>講義情報</Tab>
        <Tab>タスク管理</Tab>
        <Tab>設定</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <LectureInfoTab lecture={lecture} />
        </TabPanel>

        <TabPanel>
          <TasksTab
            tasks={localTasks}
            onUpdateStatus={handleUpdateTaskStatus}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onDeleteCompletedTasks={handleDeleteCompletedTasks}
          />
        </TabPanel>

        <TabPanel>
          <SettingsTab
            lecture={lecture}
            onDeleteRegistration={handleDeleteRegistration}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
