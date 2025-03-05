import { getRegisteredLectureById, getTasksByLectureId } from "@/actions";
import { auth } from "@/lib/auth";
import { unwrap, unwrapOr } from "@/utils/unwrap";
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

  const registration = unwrap(await getRegisteredLectureById(id));
  const lecture = registration.lecture;

  const tasks = unwrapOr(await getTasksByLectureId(lecture.id), []);

  return (
    <VStack align="start" w="full">
      {/* 講義詳細ヘッダー */}
      <LectureDetailHeader lecture={lecture} />

      {/* 講義詳細タブ */}
      <LectureDetailTabs registration={registration} tasks={tasks} />
    </VStack>
  );
}
