import { getAllDepartments, getAllFaculties } from "@/actions";
import { auth } from "@/lib/auth";
import { unwrap } from "@/utils/unwrap";
import { notFound } from "next/navigation";
import RegistrationSteps from "./_components/RegistrationsSteps";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    notFound();
  }

  const user = session.user;
  const departments = unwrap(await getAllDepartments());
  const faculties = unwrap(await getAllFaculties());

  return (
    <RegistrationSteps
      departments={departments}
      faculties={faculties}
      user={user}
    />
  );
}
