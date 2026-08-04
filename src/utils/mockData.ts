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
}

export interface Exam {
  exam_id: number;
  title: string;
  subject: string;
  exam_date: string;
  instructor_id: number;
  total_questions: number;
  options_per_question: number; // e.g. 4 for A-D
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
  name: 'Prof. Mirven Dave Castro',
  email: 'instructor@nvcfi.edu.ph',
  department: 'CCIT (College of Computing & IT)',
  role: 'instructor'
};

export const INITIAL_STUDENTS: Student[] = [
  { student_id: 1, student_number: '2026-0012', name: 'Kyle G. Sanquillos', section: 'BSIT-3A', course: 'BS Information Technology' },
  { student_id: 2, student_number: '2026-0015', name: 'Samantha Reyes', section: 'BSIT-3A', course: 'BS Information Technology' },
  { student_id: 3, student_number: '2026-0021', name: 'Juan Dela Cruz', section: 'BSIT-3A', course: 'BS Information Technology' },
  { student_id: 4, student_number: '2026-0034', name: 'Maria Santos', section: 'BSIT-3B', course: 'BS Computer Science' },
  { student_id: 5, student_number: '2026-0045', name: 'Angelo Tan', section: 'BSIT-3B', course: 'BS Computer Science' },
  { student_id: 6, student_number: '2026-0052', name: 'Christian Alcantara', section: 'BSIT-3A', course: 'BS Information Technology' },
  { student_id: 7, student_number: '2026-0068', name: 'Erika Villanueva', section: 'BSIT-3A', course: 'BS Information Technology' },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    exam_id: 1,
    title: 'Midterm Examination in OMR & Image Processing',
    subject: 'CCIT 312 - Systems Integration',
    exam_date: '2026-08-01',
    instructor_id: 101,
    total_questions: 15,
    options_per_question: 4,
    section: 'BSIT-3A'
  },
  {
    exam_id: 2,
    title: 'Final Assessment in Web Development',
    subject: 'CCIT 204 - Web Technologies',
    exam_date: '2026-08-03',
    instructor_id: 101,
    total_questions: 20,
    options_per_question: 4,
    section: 'BSIT-3B'
  }
];

export const INITIAL_ANSWER_KEYS: Record<number, Record<number, string>> = {
  1: {
    1: 'A', 2: 'C', 3: 'B', 4: 'D', 5: 'A',
    6: 'C', 7: 'A', 8: 'D', 9: 'B', 10: 'C',
    11: 'A', 12: 'D', 13: 'B', 14: 'C', 15: 'A'
  },
  2: {
    1: 'B', 2: 'A', 3: 'C', 4: 'D', 5: 'B',
    6: 'D', 7: 'A', 8: 'C', 9: 'C', 10: 'B',
    11: 'A', 12: 'D', 13: 'B', 14: 'C', 15: 'D',
    16: 'A', 17: 'B', 18: 'C', 19: 'A', 20: 'D'
  }
};

export const INITIAL_SCANNED_ANSWERS: ScannedAnswer[] = [
  {
    scan_id: 1001,
    student_id: 1,
    student_number: '2026-0012',
    student_name: 'Kyle G. Sanquillos',
    exam_id: 1,
    student_answers: { 1: 'A', 2: 'C', 3: 'B', 4: 'D', 5: 'A', 6: 'C', 7: 'A', 8: 'D', 9: 'B', 10: 'C', 11: 'A', 12: 'D', 13: 'B', 14: 'C', 15: 'A' },
    score: 15,
    total: 15,
    percentage: 100,
    remarks: 'PASSED',
    date_generated: '2026-08-02 10:15 AM'
  },
  {
    scan_id: 1002,
    student_id: 2,
    student_number: '2026-0015',
    student_name: 'Samantha Reyes',
    exam_id: 1,
    student_answers: { 1: 'A', 2: 'C', 3: 'A', 4: 'D', 5: 'A', 6: 'B', 7: 'A', 8: 'D', 9: 'B', 10: 'C', 11: 'A', 12: 'D', 13: 'B', 14: 'A', 15: 'A' },
    score: 12,
    total: 15,
    percentage: 80,
    remarks: 'PASSED',
    date_generated: '2026-08-02 10:18 AM'
  },
  {
    scan_id: 1003,
    student_id: 3,
    student_number: '2026-0021',
    student_name: 'Juan Dela Cruz',
    exam_id: 1,
    student_answers: { 1: 'C', 2: 'C', 3: 'D', 4: 'D', 5: 'B', 6: 'C', 7: 'B', 8: 'D', 9: 'A', 10: 'C', 11: 'B', 12: 'D', 13: 'B', 14: 'D', 15: 'C' },
    score: 7,
    total: 15,
    percentage: 46.7,
    remarks: 'FAILED',
    date_generated: '2026-08-02 10:22 AM'
  }
];
