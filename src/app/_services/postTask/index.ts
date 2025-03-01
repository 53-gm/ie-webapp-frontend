"use server";

import { makeRequest } from "..";
import { CreateTask } from "../type";

export const postTask = ({ ...payload }: CreateTask): Promise<any> => {
  return makeRequest(
    "/api/v1/tasks/tasks/",
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    },
    true
  );
};
