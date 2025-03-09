"use client";

import { getRegisteredLectures } from "@/actions/lectures";
import { Registration } from "@/types/api";
import { unwrap } from "@/utils/unwrap";
import { YearPicker } from "@yamada-ui/calendar";
import {
  HStack,
  Modal,
  ModalBody,
  Option,
  Select,
  useDisclosure,
} from "@yamada-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LectureRegistrar } from "./_components/LectureRegister";
import TimeTableGrid from "./_components/TimeTableGrid";

const buildRegistrationMap = (
  registrations: Registration[]
): Map<number, Registration> => {
  const map = new Map<number, Registration>();
  registrations.forEach((registration) => {
    registration.lecture.schedules.forEach((sch) => {
      const key = (sch.day - 1) * 5 + sch.time;
      map.set(key, registration);
    });
  });
  return map;
};

export function TimeTable() {
  const router = useRouter();
  const [year, setYear] = useState<number>(2024);
  const [term, setTerm] = useState<number>(4);
  const [registrationsMap, setRegistrationsMap] = useState<
    Map<number, Registration>
  >(new Map());
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const fetchRegisteredLectures = async () => {
    const registers = unwrap(await getRegisteredLectures(year, term));

    setRegistrationsMap(buildRegistrationMap(registers));
  };

  // 年やタームが変更されたら再取得する
  useEffect(() => {
    fetchRegisteredLectures();
  }, [year, term]);

  const handleCellClick = (day: number, time: number) => {
    setSelectedDay(day);
    setSelectedTime(time);

    // const registration = registrationsMap.get((day - 1) * 5 + time);

    // if (registration) {
    //   router.push(`/timetable/${registration.id}`);
    // } else {
    //   onOpen();
    // }

    router.push(`/timetable/${year}/${term}/${(day - 1) * 5 + time}`);
  };

  return (
    <>
      {/* 年度とタームの選択部分 */}
      <HStack>
        {/* 年度選択 */}
        <YearPicker
          calendarVariant="solid"
          calendarColorScheme="secondary"
          allowInput={false}
          clearable={false}
          defaultValue={new Date(new Date().setFullYear(year))}
          onChange={(value) => setYear(value!.getFullYear())}
        />

        {/* ターム選択 */}
        <Select
          placeholderInOptions={false}
          defaultValue={String(term)}
          onChange={(value) => setTerm(Number(value))}
        >
          <Option value="1">第1ターム</Option>
          <Option value="2">第2ターム</Option>
          <Option value="3">第3ターム</Option>
          <Option value="4">第4ターム</Option>
        </Select>
      </HStack>

      {/* タイムテーブル本体 */}
      <TimeTableGrid
        registrationsMap={registrationsMap}
        onCellClick={handleCellClick}
      />

      {/* 講義選択用モーダル */}
      <Modal open={open} onClose={onClose} size="6xl" minH="5xl">
        <ModalBody>
          <LectureRegistrar
            day={selectedDay}
            time={selectedTime}
            term={term}
            onRegisterSuccess={() => {
              fetchRegisteredLectures();
              onClose();
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
