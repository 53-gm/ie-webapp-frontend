// LectureRegistrar.tsx

import { getLectures } from "@/actions";
import { CreateLectureInput, Lecture } from "@/types/api";
import { Button, ScrollArea, Text, VStack } from "@yamada-ui/react";
import React, { useEffect, useState } from "react";
import CustomLectureForm from "../CustomLectureForm";
import { LectureList } from "../LectureList";

interface LectureRegistrarProps {
  // Timetable などから受け取る日付・時間
  day: number | null;
  time: number | null;
  term: number;

  // 登録完了後や削除完了後に呼び出す
  onRegisterSuccess: () => void;
}

export const LectureRegistrar: React.FC<LectureRegistrarProps> = ({
  day,
  time,
  term,

  onRegisterSuccess,
}) => {
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [lectures, setLectures] = useState<Lecture[]>([]);

  const [customFormData, setCustomFormData] = useState<
    Partial<CreateLectureInput>
  >({});

  useEffect(() => {
    if (day !== null && time !== null) {
      // 既存講義を取得
      getLectures({ schedules: String((day - 1) * 5 + time), terms: term })
        .then((result) => {
          if (!("error" in result)) {
            setLectures(result);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [day, time]);

  useEffect(() => {
    if (day !== null && time !== null) {
      setCustomFormData((prev) => ({
        ...prev,
        schedule_ids: [String((day - 1) * 5 + time)],
        term_ids: [String(term)],
      }));
    }
  }, [day, time, term]);

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
            defaultValues={customFormData}
            onChangeCustomFormData={setCustomFormData}
            onRegisterSuccess={onRegisterSuccess}
          />
        ) : (
          <LectureList
            lectures={lectures}
            onRegisterSuccess={onRegisterSuccess}
            onCopyLectureToCustom={handleCopyLectureToCustom}
          />
        )}
      </ScrollArea>
    </VStack>
  );
};
