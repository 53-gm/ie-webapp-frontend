"use server";

import { makeRequest } from "..";
import { Task } from "../type";

export const getTasks = (): Promise<Task[]> => {
  return makeRequest(`/api/v1/tasks/tasks/`, { method: "GET" }, true);
};
