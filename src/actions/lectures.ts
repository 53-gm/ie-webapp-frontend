"use server";

import { APIError } from "@/lib/api/client";
import { LectureService } from "@/lib/api/services/lectures";
import {
  CreateLectureInput,
  QueryParams,
  RegistrationInput,
} from "@/types/api";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * 全ての講義を取得
 */
export async function getLectures(params?: QueryParams) {
  try {
    return await LectureService.getAll(params);
  } catch (error) {
    console.error("講義一覧の取得に失敗しました", error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 特定の時間帯と学期の講義を取得
 */
export async function getLecturesByTimeAndTerm(
  day: number,
  time: number,
  term: number
) {
  try {
    return await LectureService.getByTimeAndTerm(day, time, term);
  } catch (error) {
    console.error(
      `時間帯 ${day}-${time} 学期 ${term} の講義取得に失敗しました`,
      error
    );
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 講義を取得
 */
export async function getLectureById(lectureId: string) {
  try {
    return await LectureService.getById(lectureId);
  } catch (error) {
    console.error(`講義 ${lectureId} の取得に失敗しました`, error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 新しい講義を作成
 */
export async function createLecture(data: CreateLectureInput) {
  try {
    const result = await LectureService.create(data);

    // キャッシュを無効化
    revalidateTag("lectures");
    revalidatePath("/timetable");

    return { success: true, data: result };
  } catch (error) {
    console.error("講義の作成に失敗しました", error);
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
 * 講義を更新
 */
export async function updateLecture(
  lectureId: string,
  data: Partial<CreateLectureInput>
) {
  try {
    const result = await LectureService.update(lectureId, data);

    // キャッシュを無効化
    revalidateTag("lectures");
    revalidateTag(`lecture-${lectureId}`);
    revalidatePath("/timetable");

    return { success: true, data: result };
  } catch (error) {
    console.error(`講義 ${lectureId} の更新に失敗しました`, error);
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
 * 全てのスケジュールを取得
 */
export async function getAllSchedules() {
  try {
    return await LectureService.getAllSchedules();
  } catch (error) {
    console.error("スケジュール一覧の取得に失敗しました", error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 登録された講義を取得
 */
export async function getRegisteredLectures(year: number, term: number) {
  try {
    return await LectureService.getRegisteredLectures(year, term);
  } catch (error) {
    console.error(`${year}年度 学期${term}の登録講義取得に失敗しました`, error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

export async function getRegisteredLectureById(id: string) {
  try {
    return await LectureService.getRegisteredLectureById(id);
  } catch (error) {
    console.error(`ID${id}の登録講義取得に失敗しました`, error);
    if (error instanceof APIError) {
      return { error: error.toJSON() };
    }
    throw error;
  }
}

/**
 * 講義を登録
 */
export async function registerLecture(data: RegistrationInput) {
  try {
    const result = await LectureService.registerLecture(data);

    // キャッシュを無効化
    revalidateTag(`registrations-${data.year}-*`);
    revalidatePath("/timetable");

    return { success: true, data: result };
  } catch (error) {
    console.error("講義の登録に失敗しました", error);
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
 * 講義の登録を削除
 */
export async function deleteRegistration(registrationId: string) {
  try {
    await LectureService.deleteRegistration(registrationId);

    // キャッシュを無効化
    revalidateTag("registrations-*");
    revalidatePath("/timetable");

    return { success: true };
  } catch (error) {
    console.error(`登録 ${registrationId} の削除に失敗しました`, error);
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
