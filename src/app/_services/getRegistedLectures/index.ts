"use server";

import { makeRequest } from "..";
import { Register } from "../type";

type Props = {
  year: number;
  term: number;
};

export const getRegistedLectures = ({
  year,
  term,
}: Props): Promise<Register[]> => {
  return makeRequest(
    `/api/v1/academics/registrations/?year=${year}&number=${term}`,
    { method: "GET" },
    true
  );
};
