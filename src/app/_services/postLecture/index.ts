"use server";

import { makeRequest } from "..";
import { CreateLecture } from "../type";

type Props = {
  payload: CreateLecture;
};

export const postLecture = ({ payload }: Props) => {
  return makeRequest(
    `/api/v1/academics/lectures/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    },
    true
  );
};
