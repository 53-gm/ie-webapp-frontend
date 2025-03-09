import { getTasksByLectureId } from "@/actions";
import { Registration } from "@/types/api";
import { unwrapOr } from "@/utils/unwrap";
import { VStack } from "@yamada-ui/react";
import LectureDetailHeader from "../LectureDetailHeader";
import LectureDetailTabs from "../LectureDetailTabs";

interface LectureDetailPageProps {
  registration: Registration;
}

export default async function LectureDetail({
  registration,
}: LectureDetailPageProps) {
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
