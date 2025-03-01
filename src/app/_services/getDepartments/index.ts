"use server";

import { makeRequest } from "..";
import { Department } from "../type";

export const getDepartments = (): Promise<Department[]> => {
  return makeRequest("/api/v1/users/departments/", {
    method: "GET",
    cache: "force-cache",
  });
};
