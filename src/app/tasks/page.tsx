import { getTasks } from "@/actions/tasks";
import { auth } from "@/lib/auth";
import { unwrap } from "@/utils/unwrap";
import { Box, Heading, VStack } from "@yamada-ui/react";
import { notFound } from "next/navigation";
import TasksDashboard from "./_components/TaskDashboard";

export default async function TasksPage() {
  // 現在のユーザー情報を取得
  const session = await auth();
  const user = session?.user;

  if (!user) {
    notFound();
  }

  // 全てのタスクを取得
  const tasks = unwrap(await getTasks());

  return (
    <VStack w="full" align="start">
      <Box w="full">
        <Heading size="xl" mb={2}>
          タスク管理
        </Heading>
      </Box>

      {/* タスクダッシュボード */}
      <Box w="full">
        <TasksDashboard initialTasks={tasks} />
      </Box>
    </VStack>
  );
}
