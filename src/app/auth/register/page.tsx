import { getDepartments } from "@/app/_services/getDepartments";
import { getFaculties } from "@/app/_services/getFaculties";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import RegistrationSteps from "./_components/RegistrationsSteps";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    notFound();
  }

  const user = session.user;
  const departments = await getDepartments();
  const faculties = await getFaculties();

  return (
    <RegistrationSteps
      departments={departments}
      faculties={faculties}
      user={user}
    />
  );
}
