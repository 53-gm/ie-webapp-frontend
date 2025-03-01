"use server";

import { makeRequest } from "..";

type Props = {
  lecture_id: string;
  year: number;
};

export const postRegistLecture = ({ ...payload }: Props): Promise<any> => {
  return makeRequest(
    "/api/v1/academics/registrations/",
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    },
    true
  );
};
