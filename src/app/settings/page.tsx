import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getDepartments } from "../_services/getDepartments";
import { getFaculties } from "../_services/getFaculties";
import SettingTabs from "./_components/SettingTabs";

const Page = async () => {
  const session = await auth();

  if (!session || !session.user) {
    notFound();
  }

  const user = session.user;
  const departments = await getDepartments();
  const faculties = await getFaculties();
  return (
    <SettingTabs user={user} departments={departments} faculties={faculties} />
  );
};

export default Page;
