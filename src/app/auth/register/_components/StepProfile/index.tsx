import MyProfileEditForm from "@/app/_components/MyProfileEditForm";
import { Department, Faculty } from "@/app/_services/type";
import { Card, CardBody, CardHeader, Heading } from "@yamada-ui/react";
import { User } from "next-auth";

type Props = {
  onStepNext: () => void;
  onStepPrev: () => void;
  departments: Department[];
  faculties: Faculty[];
  user: User;
};

export function StepProfile({
  onStepNext,
  onStepPrev,
  departments,
  faculties,
  user,
}: Props) {
  return (
    <Card variant="outline" bg="white" p="md" maxW="4xl" w="4xl">
      <CardHeader>
        <Heading size="xl">プロフィール設定</Heading>
      </CardHeader>

      <CardBody>
        <MyProfileEditForm
          departments={departments}
          faculties={faculties}
          user={user}
          onSuccess={onStepNext}
        />
      </CardBody>
    </Card>
  );
}
