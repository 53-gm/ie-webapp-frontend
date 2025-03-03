import { getRegisteredLectureById, getTasksByLectureId } from "@/actions";
import { auth } from "@/lib/auth";
import { VStack } from "@yamada-ui/react";
import { notFound } from "next/navigation";
import LectureDetailHeader from "./_components/LectureDetailHeader";
import LectureDetailTabs from "./_components/LectureDetailTabs";

interface LectureDetailPageProps {
  params: {
    id: string;
  };
}

export default async function LectureDetailPage({
  params,
}: LectureDetailPageProps) {
  const { id } = params;
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const registrationResult = await getRegisteredLectureById(id);
  if ("error" in registrationResult) {
    if (registrationResult.error.error.code === "not_found") {
      notFound();
    }
    throw new Error(registrationResult.error.error.message);
  }

  const lectureResult = registrationResult.lecture;

  // 講義に関連するタスクを取得
  const tasksResult = await getTasksByLectureId(lectureResult.id);
  const tasks = "error" in tasksResult ? [] : tasksResult;

  return (
    <VStack align="start" w="full">
      {/* 講義詳細ヘッダー */}
      <LectureDetailHeader lecture={lectureResult} />

      {/* 講義詳細タブ */}
      <LectureDetailTabs registration={registrationResult} tasks={tasks} />
    </VStack>
  );
}
