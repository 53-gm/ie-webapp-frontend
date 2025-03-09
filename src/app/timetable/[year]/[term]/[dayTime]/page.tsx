import { getRegistrationBySchedule } from "@/actions";
import { unwrap } from "@/utils/unwrap";
import LectureDetail from "./_components/LectureDetail/LectureDetail/indext";
import { LectureRegistrar } from "./_components/LectureRegister";

export default async function TimeSlotPage({
  params,
}: {
  params: { year: string; term: string; dayTime: string };
}) {
  const { year: yearString, term: termString, dayTime } = params;
  const numDayTime = parseInt(dayTime);
  const year = parseInt(yearString);
  const term = parseInt(termString);

  // day/timeを逆算
  const day = Math.floor(numDayTime / 5) + 1;
  const time = numDayTime % 5;

  const registration = unwrap(
    await getRegistrationBySchedule(year, term, numDayTime)
  );

  if (registration.length > 0) {
    return <LectureDetail registration={registration[0]} />;
  }

  return <LectureRegistrar day={day} time={time} term={term} />;
}
