// LectureRegistrar.tsx
import { getLectures } from "@/app/_services/getLectures";
import {
  CreateLecture,
  Lecture,
  Register,
  Schedule,
  Task,
} from "@/app/_services/type";
import { Button, ScrollArea, Text, VStack } from "@yamada-ui/react";
import React, { useEffect, useState } from "react";
import CustomLectureForm from "../CustomLectureForm";
import LectureDetail from "../LectureDetail";
import { LectureList } from "../LectureList";

interface LectureRegistrarProps {
  // Timetable などから受け取る日付・時間
  day: number | null;
  time: number | null;
  term: number;
  // すでに登録されている講義の場合
  registeredLecture?: Register;

  registeredLectureTasks?: Task[];
  // 全体のスケジュール(カスタムフォームで日程を選択する等)
  allSchedules: Schedule[];
  // 登録完了後や削除完了後に呼び出す
  onRegisterSuccess: () => void;
}

export const LectureRegistrar: React.FC<LectureRegistrarProps> = ({
  day,
  time,
  term,
  registeredLecture,
  registeredLectureTasks,
  allSchedules,
  onRegisterSuccess,
}) => {
  // 「既存の講義を登録する」か「カスタム講義を登録する」か
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // 取得した既存講義リスト
  const [lectures, setLectures] = useState<Lecture[]>([]);

  // カスタムフォーム用のデータ
  const [customFormData, setCustomFormData] = useState<Partial<CreateLecture>>(
    {}
  );

  useEffect(() => {
    // 既存登録がある場合は「講義詳細画面」を出すのでfetch不要
    if (registeredLecture) return;
    if (day !== null && time !== null) {
      // 既存講義を取得
      getLectures({ day, time, terms: term })
        .then((fetched) => setLectures(fetched))
        .catch((err) => console.error(err));
    }
  }, [day, time, registeredLecture]);

  useEffect(() => {
    if (!registeredLecture && day !== null && time !== null) {
      const targetSchedule = allSchedules.find(
        (sch) => sch.day === day && sch.time === time
      );
      setCustomFormData((prev) => ({
        ...prev,
        schedule_ids: targetSchedule ? [String(targetSchedule.id)] : [],
        term_ids: [String(term)],
      }));
    }
  }, [registeredLecture, day, time, term, allSchedules]);

  // 「既存講義をカスタム登録で複製」ボタンが押された時
  const handleCopyLectureToCustom = (lecture: Lecture) => {
    setCustomFormData({
      name: lecture.name,
      room: lecture.room,
      instructor: lecture.instructor,
      description: lecture.description,
      eval_method: lecture.eval_method,
      biko: lecture.biko,
      schedule_ids: lecture.schedules.map((s) => String(s.id)),
      term_ids: lecture.terms.map((t) => String(t.number)),
      units: lecture.units || 0,
    });
    setIsCustom(true);
  };

  // LectureDetail は「すでに登録された講義の表示・削除のみ」を担当
  if (registeredLecture) {
    return (
      <LectureDetail
        register={registeredLecture}
        onDeleteSuccess={onRegisterSuccess}
        tasks={registeredLectureTasks}
      />
    );
  }

  return (
    <VStack align="start">
      <VStack align="start">
        <Text fontSize="lg" fontWeight="bold">
          講義を登録
        </Text>
        {isCustom ? (
          <Button onClick={() => setIsCustom(false)}>
            既存の講義を登録する
          </Button>
        ) : (
          <Button onClick={() => setIsCustom(true)}>
            カスタム講義を登録する
          </Button>
        )}
      </VStack>

      <ScrollArea w="full" p="sm" innerProps={{ as: VStack }}>
        {isCustom ? (
          <CustomLectureForm
            day={day || 0}
            time={time || 0}
            schedules={allSchedules}
            // フォーム初期値
            defaultValues={customFormData}
            // フォーム変更をキャッチしたければ
            onChangeCustomFormData={setCustomFormData}
            onRegisterSuccess={onRegisterSuccess}
          />
        ) : (
          <LectureList
            lectures={lectures}
            onRegisterSuccess={onRegisterSuccess}
            // カスタムへコピー
            onCopyLectureToCustom={handleCopyLectureToCustom}
          />
        )}
      </ScrollArea>
    </VStack>
  );
};
