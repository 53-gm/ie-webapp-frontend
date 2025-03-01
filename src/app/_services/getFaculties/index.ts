"use server";

import { makeRequest } from "..";
import { Faculty } from "../type";

export const getFaculties = (): Promise<Faculty[]> => {
  return makeRequest("/api/v1/users/faculties/", {
    method: "GET",
    cache: "force-cache",
  });
};
