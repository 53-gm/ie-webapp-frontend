"use server";

import { makeRequest } from "..";
import { Lecture } from "../type";

type Props = {
  day: number;
  time: number;
  terms: number;
};

export const getLectures = ({
  day,
  time,
  terms,
}: Props): Promise<Lecture[]> => {
  return makeRequest(
    `/api/v1/academics/lectures/?day=${day}&time=${time}&terms=${terms}`,
    {
      method: "GET",
    },
    true
  );
};
