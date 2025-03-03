import { auth } from "@/lib/auth";
import { VStack } from "@yamada-ui/react";
import { notFound } from "next/navigation";
import { TimeTable } from "./_components/Timetable";

const TimeTablePage = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    notFound();
  }

  return (
    <>
      <VStack alignItems="center">
        <TimeTable />
      </VStack>
    </>
  );
};

export default TimeTablePage;
