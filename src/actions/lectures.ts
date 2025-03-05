"use server";

import { fetchApi, withErrorHandling } from "@/lib/api/client";
import { CreateLectureInput, Lecture, Registration } from "@/types/api";

/**
 * 全ての講義を取得（フィルタリング可能）
 */
export async function getLectures(params?: Record<string, string | number>) {
  return withErrorHandling(async () => {
    let endpoint = "/api/v1/academics/lectures/";

    if (params) {
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&");

      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return await fetchApi<Lecture[]>(endpoint, { method: "GET" }, true);
  });
}

/**
 * 特定の講義を取得
 */
export async function getLectureById(lectureId: string) {
  return withErrorHandling(async () => {
    return await fetchApi<Lecture>(
      `/api/v1/academics/lectures/${lectureId}/`,
      { method: "GET" },
      true
    );
  });
}

/**
 * 特定の時間帯と学期の講義を取得
 */
export async function getLecturesByTimeAndTerm(
  day: number,
  time: number,
  term: number
) {
  return withErrorHandling(async () => {
    return await fetchApi<Lecture[]>(
      `/api/v1/academics/lectures/?day=${day}&time=${time}&terms=${term}`,
      { method: "GET" },
      true
    );
  });
}

/**
 * 新しい講義を作成
 */
export async function createLecture(data: CreateLectureInput) {
  return withErrorHandling(async () => {
    return await fetchApi<Lecture>(
      "/api/v1/academics/lectures/",
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
 * 登録済み講義を取得
 */
export async function getRegisteredLectures(year: number, term: number) {
  return withErrorHandling(async () => {
    return await fetchApi<Registration[]>(
      `/api/v1/academics/registrations/?year=${year}&number=${term}`,
      { method: "GET" },
      true
    );
  });
}

export async function getRegisteredLectureById(id: string) {
  return withErrorHandling(async () => {
    return await fetchApi<Registration>(
      `/api/v1/academics/registrations/${id}/`,
      { method: "GET" },
      true
    );
  });
}

/**
 * 講義を登録
 */
export async function registerLecture(lectureId: string, year: number) {
  return withErrorHandling(async () => {
    return await fetchApi<Registration>(
      "/api/v1/academics/registrations/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lecture_id: lectureId, year }),
      },
      true
    );
  });
}

/**
 * 講義登録を削除
 */
export async function deleteRegistration(registrationId: string) {
  return withErrorHandling(async () => {
    return await fetchApi<void>(
      `/api/v1/academics/registrations/${registrationId}/`,
      { method: "DELETE" },
      true
    );
  });
}
