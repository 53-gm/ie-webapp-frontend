"use client";

import { getRegistedLectures } from "@/app/_services/getRegistedLectures";
import { getTasks } from "@/app/_services/getTasks";
import { Register, Schedule, Task } from "@/app/_services/type";
import { YearPicker } from "@yamada-ui/calendar";
import { HStack, Option, Select, useDisclosure } from "@yamada-ui/react";
import { useEffect, useState } from "react";
import { LectureModal } from "./_components/LectureModal";
import { LectureRegistrar } from "./_components/LectureModal/LectureRegister";
import TimeTableGrid from "./_components/TimeTableGrid";

const buildRegisteredMap = (
  registers: Register[]
): Record<string, Register | undefined> =>
  registers.reduce((acc, register) => {
    register.lecture.schedules.forEach((sch) => {
      const key = `${sch.day}-${sch.time}`;
      acc[key] = register;
    });
    return acc;
  }, {} as Record<string, Register | undefined>);

export function TimeTable({ allSchedules }: { allSchedules: Schedule[] }) {
  const [year, setYear] = useState<number>(2024);
  const [term, setTerm] = useState<number>(4);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [registeredMap, setRegisteredMap] = useState<
    Record<string, Register | undefined>
  >({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const fetchRegisteredLectures = async () => {
    const registers = await getRegistedLectures({ year, term });
    const tasks = await getTasks();

    setTasks(tasks);
    setRegisteredMap(buildRegisteredMap(registers));
  };

  // 年やタームが変更されたら再取得する
  useEffect(() => {
    fetchRegisteredLectures();
  }, [year, term]);

  const handleCellClick = (day: number, time: number) => {
    setSelectedDay(day);
    setSelectedTime(time);
    onOpen();
  };

  const selectedKey =
    selectedDay !== null && selectedTime !== null
      ? `${selectedDay}-${selectedTime}`
      : "";
  const registeredLecture = selectedKey
    ? registeredMap[selectedKey]
    : undefined;

  const registeredLectureTasks = tasks?.filter(
    (task) => task.lecture.id === registeredLecture?.lecture.id
  );

  return (
    <>
      <HStack>
        <YearPicker
          calendarVariant="solid"
          calendarColorScheme="secondary"
          allowInput={false}
          isClearable={false}
          defaultValue={new Date(new Date().setFullYear(year))}
          onChange={(value) => setYear(value!.getFullYear())}
        />

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

      <TimeTableGrid
        registeredMap={registeredMap}
        onCellClick={handleCellClick}
      />

      {/* 講義選択用モーダル */}
      <LectureModal isOpen={isOpen} onClose={onClose}>
        <LectureRegistrar
          day={selectedDay}
          time={selectedTime}
          term={term}
          allSchedules={allSchedules}
          registeredLecture={registeredLecture}
          registeredLectureTasks={registeredLectureTasks}
          onRegisterSuccess={() => {
            fetchRegisteredLectures();
            onClose();
          }}
        />
      </LectureModal>
    </>
  );
}
