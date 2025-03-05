import { getAllDepartments, getAllFaculties } from "@/actions";
import { auth } from "@/lib/auth";
import { unwrap } from "@/utils/unwrap";
import { notFound } from "next/navigation";
import SettingTabs from "./_components/SettingTabs";

const Page = async () => {
  const session = await auth();

  if (!session || !session.user) {
    notFound();
  }

  const user = session.user;
  const departments = unwrap(await getAllDepartments());
  const faculties = unwrap(await getAllFaculties());
  return (
    <SettingTabs user={user} departments={departments} faculties={faculties} />
  );
};

export default Page;
