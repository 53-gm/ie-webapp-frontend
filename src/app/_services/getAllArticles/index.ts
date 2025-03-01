"use server";

import { makeRequest } from "..";
import { Article } from "../type";

export const getAllArticles = (): Promise<Article[]> => {
  return makeRequest(
    "/api/v1/articles/articles/",
    {
      method: "GET",
    },
    true
  );
};
