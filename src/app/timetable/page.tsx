import { TimeTable } from "@/app/_components/Timetable";
import { auth } from "@/lib/auth";
import { VStack } from "@yamada-ui/react";
import { notFound } from "next/navigation";
import { getAllSchedules } from "../_services/getAllSchedules";

const TimeTablePage = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    notFound();
  }

  const schedules = await getAllSchedules();

  return (
    <>
      <VStack alignItems="center">
        <TimeTable allSchedules={schedules} />
      </VStack>
    </>
  );
};

export default TimeTablePage;
