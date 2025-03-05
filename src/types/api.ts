/**
 * 学部モデル
 * @see accounts/models.py:Faculty
 */
export interface Faculty {
  id: number;
  name: string;
}

/**
 * 学科モデル
 * @see accounts/models.py:Department
 */
export interface Department {
  id: number;
  name: string;
  faculty: Faculty;
}

/**
 * 学期モデル
 * @see academics/models.py:Term
 */
export interface Term {
  number: number; // プライマリキー
}

/**
 * 時間割モデル
 * @see academics/models.py:Schedule
 */
export interface Schedule {
  id: number;
  day: number; // 1-7: 月-日
  time: number; // 1-5: 1限-5限
}

/**
 * ユーザープロフィールモデル
 * @see accounts/models.py:UserProfile
 */
export interface UserProfile {
  profile_id: string;
  display_name?: string;
  faculty?: Faculty;
  department?: Department;
  grade?: number;
  picture?: string;
  is_profile_complete: boolean;
  email: string; // ユーザーモデルから
}

/**
 * プロフィール更新リクエスト
 */
export interface ProfileUpdateInput {
  profile_id: string;
  display_name?: string;
  faculty_id?: string;
  department_id?: string;
  grade?: number;
  picture_url?: string;
}

/**
 * 講義モデル
 * @see academics/models.py:Lecture
 */
export interface Lecture {
  id: string;
  syllabus_id?: string;
  name: string;
  terms: Term[];
  departments: Department[];
  schedules: Schedule[];
  grade: number;
  room: string;
  instructor: string;
  units: number;
  is_required: boolean;
  is_exam: boolean;
  description: string;
  eval_method: string;
  biko: string;
  created_at: string;
  updated_at: string;
  owner?: string;
}

/**
 * 講義作成リクエスト
 */
export interface CreateLectureInput {
  name: string;
  term_ids?: string[];
  department_ids?: string[];
  schedule_ids?: string[];
  grade?: number;
  room?: string;
  instructor?: string;
  units?: number;
  is_required?: boolean;
  is_exam?: boolean;
  description?: string;
  eval_method?: string;
  biko?: string;
}

/**
 * 講義登録モデル
 * @see academics/models.py:Registration
 */
export interface Registration {
  id: string;
  lecture: Lecture;
  year: number;
  registered_at: string;
}

/**
 * 講義登録リクエスト
 */
export interface RegistrationInput {
  lecture_id: string;
  year: number;
}

/**
 * 記事モデル
 * @see articles/models.py:Article
 */
export interface Article {
  slug: string; // プライマリキー
  title: string;
  author: UserProfile;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 記事作成リクエスト
 */
export interface CreateArticleInput {
  title: string;
  content: string;
  is_public?: boolean;
}

/**
 * タスクモデル
 * @see tasks/models.py:Task
 */
export interface Task {
  id: string;
  lecture: Lecture;
  title: string;
  description: string;
  due_date: string | null;
  priority: number; // 0: 低, 1: 中, 2: 高
  status: number; // 0: 未着手, 1: 進行中, 2: 完了
  created_at: string;
  updated_at: string;
}

/**
 * タスク作成リクエスト
 */
export interface CreateTaskInput {
  lecture_id?: string;
  title: string;
  description?: string;
  due_date?: string | null;
  priority?: number;
  status?: number;
}

/**
 * エラーレスポンス型定義
 * @see common/exceptions.py
 */
export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    status: number;
  };
}

/**
 * ページネーションレスポンス
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * クエリパラメータ
 */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}
