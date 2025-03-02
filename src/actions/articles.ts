// actions/article.ts
"use server";

import { APIError } from "@/lib/api/client";
import { ArticleService } from "@/lib/api/services/articles";
import { CreateArticleInput } from "@/types/api";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * 全ての記事を取得
 */
export async function getAllArticles(isPublicOnly: boolean = false) {
  try {
    return await ArticleService.getAll(isPublicOnly);
  } catch (error) {
    console.error("記事一覧の取得に失敗しました", error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 特定の記事を取得
 */
export async function getArticleBySlug(slug: string) {
  try {
    return await ArticleService.getBySlug(slug);
  } catch (error) {
    console.error(`記事 ${slug} の取得に失敗しました`, error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 著者IDとスラッグで記事を取得
 */
export async function getArticleByAuthorAndSlug(
  authorId: string,
  slug: string
) {
  try {
    return await ArticleService.getByAuthorAndSlug(authorId, slug);
  } catch (error) {
    console.error(`記事 ${authorId}/${slug} の取得に失敗しました`, error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * ユーザーのプロフィールIDに基づいて記事一覧を取得
 */
export async function getArticlesByProfileId(
  profileId: string,
  isPublicOnly: boolean = false
) {
  try {
    return await ArticleService.getByProfileId(profileId, isPublicOnly);
  } catch (error) {
    console.error(
      `プロフィールID ${profileId} の記事一覧取得に失敗しました`,
      error
    );
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 新しい記事を作成
 */
export async function createArticle(data: CreateArticleInput) {
  try {
    const result = await ArticleService.create(data);

    // キャッシュを無効化
    revalidateTag("articles");
    revalidatePath("/articles");

    return { success: true, data: result };
  } catch (error) {
    console.error("記事の作成に失敗しました", error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.toJSON(),
      };
    }
    return {
      success: false,
      error: {
        error: {
          code: "unknown_error",
          message:
            error instanceof Error
              ? error.message
              : "不明なエラーが発生しました",
          status: 500,
        },
      },
    };
  }
}

/**
 * 記事を更新
 */
export async function updateArticle(
  slug: string,
  data: Partial<CreateArticleInput>
) {
  try {
    const result = await ArticleService.update(slug, data);

    // キャッシュを無効化
    revalidateTag("articles");
    revalidateTag(`article-${slug}`);
    revalidatePath(`/articles/${slug}`);

    return { success: true, data: result };
  } catch (error) {
    console.error(`記事 ${slug} の更新に失敗しました`, error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.toJSON(),
      };
    }
    return {
      success: false,
      error: {
        error: {
          code: "unknown_error",
          message:
            error instanceof Error
              ? error.message
              : "不明なエラーが発生しました",
          status: 500,
        },
      },
    };
  }
}

/**
 * 記事を削除
 */
export async function deleteArticle(slug: string) {
  try {
    await ArticleService.delete(slug);

    // キャッシュを無効化
    revalidateTag("articles");
    revalidateTag(`article-${slug}`);
    revalidatePath("/articles");

    return { success: true };
  } catch (error) {
    console.error(`記事 ${slug} の削除に失敗しました`, error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.toJSON(),
      };
    }
    return {
      success: false,
      error: {
        error: {
          code: "unknown_error",
          message:
            error instanceof Error
              ? error.message
              : "不明なエラーが発生しました",
          status: 500,
        },
      },
    };
  }
}

/**
 * 画像をアップロード
 */
export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("ファイルが見つかりません");
    }

    const result = await ArticleService.uploadImage(file);
    return { success: true, url: result.url };
  } catch (error) {
    console.error("画像のアップロードに失敗しました", error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.toJSON(),
      };
    }
    return {
      success: false,
      error: {
        error: {
          code: "unknown_error",
          message:
            error instanceof Error
              ? error.message
              : "不明なエラーが発生しました",
          status: 500,
        },
      },
    };
  }
}
