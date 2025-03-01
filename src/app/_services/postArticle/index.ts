"use server";

import { makeRequest } from "..";
import { CreateArticle } from "../type";

type Props = {
  payload: CreateArticle;
};

export const postArticle = ({ payload }: Props) => {
  return makeRequest(
    `/api/v1/articles/articles/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    },
    true
  );
};
