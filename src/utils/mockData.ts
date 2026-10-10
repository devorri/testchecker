export interface Instructor {
  instructor_id: number;
  name: string;
  email: string;
  department: string;
  role: 'instructor' | 'admin';
}

export interface Student {
  student_id: number;
  student_number: string;
  name: string;
  section: string;
  course: string;
  year_level?: string;
}

export interface Exam {
  exam_id: number;
  title: string;
  subject: string;
  exam_date: string;
  instructor_id: number;
  total_questions: number;
  options_per_question: number; // e.g. 5 for A-E
  section: string;
}

export interface AnswerKey {
  answerkey_id: number;
  exam_id: number;
  correct_answers: Record<number, string>; // e.g. { 1: 'A', 2: 'C', ... }
}

export interface ScannedAnswer {
  scan_id: number;
  student_id: number;
  student_number: string;
  student_name: string;
  exam_id: number;
  student_answers: Record<number, string>;
  score: number;
  total: number;
  percentage: number;
  remarks: 'PASSED' | 'FAILED';
  date_generated: string;
}

export const INITIAL_INSTRUCTOR: Instructor = {
  instructor_id: 101,
  name: 'CCIT Faculty Instructor',
  email: 'instructor@nvcfi.edu.ph',
  department: 'CCIT (College of Computing & IT)',
  role: 'instructor'
};

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_EXAMS: Exam[] = [];

export const INITIAL_ANSWER_KEYS: Record<number, Record<number, string>> = {};

export const INITIAL_SCANNED_ANSWERS: ScannedAnswer[] = [];
