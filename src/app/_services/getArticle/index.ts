"use server";

import { makeRequest } from "..";
import { Article } from "../type";

type Props = {
  slug: string;
};

export const getArticle = ({ slug }: Props): Promise<Article> => {
  return makeRequest(
    `/api/v1/articles/articles/${slug}`,
    {
      method: "GET",
    },
    true
  );
};
