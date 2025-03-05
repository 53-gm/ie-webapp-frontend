"use server";

import { fetchApi, withErrorHandling } from "@/lib/api/client";
import { Article, CreateArticleInput } from "@/types/api";

/**
 * 全ての記事を取得
 */
export async function getAllArticles(isPublicOnly: boolean = false) {
  return withErrorHandling(async () => {
    const endpoint = `/api/v1/articles/articles/${
      isPublicOnly ? "?is_public=true" : ""
    }`;
    return await fetchApi<Article[]>(endpoint, { method: "GET" }, true);
  });
}

/**
 * 著者IDとスラッグで記事を取得
 */
export async function getArticleByAuthorAndSlug(
  authorId: string,
  slug: string
) {
  return withErrorHandling(async () => {
    return await fetchApi<Article>(
      `/api/v1/articles/articles/${slug}/`,
      { method: "GET" },
      true
    );
  });
}

/**
 * ユーザーのプロフィールIDに基づいて記事一覧を取得
 */
export async function getArticlesByProfileId(
  profileId: string,
  isPublicOnly: boolean = false
) {
  return withErrorHandling(async () => {
    const endpoint = `/api/v1/articles/articles/user/${profileId}/${
      isPublicOnly ? "?is_public=true" : ""
    }`;
    return await fetchApi<Article[]>(endpoint, { method: "GET" }, true);
  });
}

export async function createArticle(data: CreateArticleInput) {
  return withErrorHandling(async () => {
    return await fetchApi<Article>(
      `/api/v1/articles/articles/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      true
    );
  });
}

/**
 * 記事を更新
 */
export async function updateArticle(
  slug: string,
  data: Partial<CreateArticleInput>
) {
  return withErrorHandling(async () => {
    return await fetchApi<Article>(
      `/api/v1/articles/articles/${slug}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      true
    );
  });
}
