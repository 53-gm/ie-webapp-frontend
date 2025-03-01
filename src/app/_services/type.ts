export type Department = {
  id: number;
  name: string;
  faculty: Faculty;
};

export type Faculty = {
  id: number;
  name: string;
};

export type Profile = {
  email: string;
  profile_id: string;
  display_name?: string;
  faculty?: Faculty;
  department?: Department;
  grade?: number;
  is_profile_complete?: boolean;
  picture?: string;
};

export type Term = {
  id: number;
  number: number;
};

export type Schedule = {
  id: number;
  day: number;
  time: number;
};

export type Lecture = {
  id: string;
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
  created_at: Date;
  updated_at: Date;
  owner?: string;
};

export type CreateLecture = {
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
};

export type Register = {
  id: string;
  lecture: Lecture;
  year: number;
  registered_at: Date;
};

export type Article = {
  slug: string;
  title: string;
  author: Profile;
  content: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
};

export type CreateArticle = {
  title: string;
  content: string; //JSON
  is_public?: boolean;
};

export type Task = {
  id: string;
  lecture: Lecture;
  title: string;
  description: string;
  due_date: string;
  priority: number;
  status: number;
  created_at: Date;
  updated_at: Date;
};

export type CreateTask = {
  lecture_id?: string;
  title: string;
  description?: string;
  due_date?: Date;
  priority?: number;
  status?: number;
};
