// lib/api/services/article.ts
import { Article, CreateArticleInput } from "@/types/api";
import { apiClient } from "../client";

/**
 * 記事関連のAPIサービス
 */
export const ArticleService = {
  /**
   * 全ての記事を取得
   */
  getAll: async (isPublicOnly: boolean = false): Promise<Article[]> => {
    const endpoint = `/api/v1/articles/articles/${
      isPublicOnly ? "?is_public=true" : ""
    }`;
    return apiClient.get<Article[]>(endpoint, true);
  },

  /**
   * 特定の記事を取得
   */
  getBySlug: async (slug: string): Promise<Article> => {
    return apiClient.get<Article>(`/api/v1/articles/articles/${slug}`, true);
  },

  /**
   * 著者のIDと記事のスラッグで記事を取得
   */
  getByAuthorAndSlug: async (
    authorId: string,
    slug: string
  ): Promise<Article> => {
    return apiClient.get<Article>(`/api/v1/articles/articles/${slug}/`, true);
  },

  /**
   * ユーザーのプロフィールIDに基づいて記事を取得
   */
  getByProfileId: async (
    profileId: string,
    isPublicOnly: boolean = false
  ): Promise<Article[]> => {
    const endpoint = `/api/v1/articles/articles/user/${profileId}/${
      isPublicOnly ? "?is_public=true" : ""
    }`;
    return apiClient.get<Article[]>(endpoint, true);
  },

  /**
   * 新しい記事を作成
   */
  create: async (data: CreateArticleInput): Promise<Article> => {
    return apiClient.post<Article>("/api/v1/articles/articles/", data, true);
  },

  /**
   * 記事を更新
   */
  update: async (
    slug: string,
    data: Partial<CreateArticleInput>
  ): Promise<Article> => {
    return apiClient.patch<Article>(
      `/api/v1/articles/articles/${slug}/`,
      data,
      true
    );
  },

  /**
   * 記事を削除
   */
  delete: async (slug: string): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/articles/articles/${slug}/`, true);
  },

  /**
   * 画像をアップロード
   */
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.request<{ url: string }>(
      "/api/v1/articles/upload_image/",
      {
        method: "POST",
        body: formData,
      },
      true
    );
  },
};
