"use server";

import { makeRequest } from "..";
import { Schedule } from "../type";

export const getAllSchedules = (): Promise<Schedule[]> => {
  return makeRequest("/api/v1/academics/schedules/", {
    method: "GET",
    cache: "force-cache",
  });
};
