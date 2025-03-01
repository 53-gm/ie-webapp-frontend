// RegistrationSteps.tsx
"use client";

import { Department, Faculty } from "@/app/_services/type";
import { User } from "next-auth";
import RegistrationStepper from "../RegistrationStepper";
import { StepComplete } from "../StepComplete";
import { StepIntro } from "../StepIntro";
import { StepProfile } from "../StepProfile";

type RegistrationStepsProps = {
  departments: Department[];
  faculties: Faculty[];
  user: User;
};

export default function RegistrationSteps({
  departments,
  faculties,
  user,
}: RegistrationStepsProps) {
  return (
    <RegistrationStepper
      renderItem={({ onStepNext, onStepPrev }) => [
        <StepIntro onStepNext={onStepNext} onStepPrev={onStepPrev} />,
        <StepProfile
          departments={departments}
          faculties={faculties}
          user={user}
          onStepNext={onStepNext}
          onStepPrev={onStepPrev}
        />,
        <StepComplete onStepNext={onStepNext} onStepPrev={onStepPrev} />,
      ]}
    />
  );
}
