"use server";

import { makeRequest } from "..";

type Props = {
  profile_id: string;
  display_name?: string;
  faculty_id?: string;
  department_id?: string;
  grade?: number;
  picture_url?: string;
};

export const postProfile = ({ ...payload }: Props): Promise<any> => {
  return makeRequest(
    "/api/v1/users/me/profile/",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    },
    true
  );
};
