import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Exam, Student, ScannedAnswer } from '../utils/mockData';
import {
  INITIAL_EXAMS,
  INITIAL_STUDENTS,
  INITIAL_ANSWER_KEYS,
  INITIAL_SCANNED_ANSWERS
} from '../utils/mockData';

interface AppContextType {
  exams: Exam[];
  students: Student[];
  answerKeys: Record<number, Record<number, string>>; // exam_id -> { qNum: option }
  scannedAnswers: ScannedAnswer[];
  addExam: (exam: Omit<Exam, 'exam_id'>, answerKey: Record<number, string>) => Exam;
  updateExam: (examId: number, examData: Partial<Exam>, keyData?: Record<number, string>) => void;
  addStudent: (student: Omit<Student, 'student_id'>) => void;
  updateStudent: (studentId: number, updatedData: Partial<Omit<Student, 'student_id'>>) => void;
  deleteStudent: (studentId: number) => void;
  saveScannedResult: (result: Omit<ScannedAnswer, 'scan_id' | 'date_generated'>) => ScannedAnswer;
  deleteExam: (examId: number) => void;
  getAnswerKey: (examId: number) => Record<number, string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('testchecker_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('testchecker_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [answerKeys, setAnswerKeys] = useState<Record<number, Record<number, string>>>(() => {
    const saved = localStorage.getItem('testchecker_answer_keys');
    return saved ? JSON.parse(saved) : INITIAL_ANSWER_KEYS;
  });

  const [scannedAnswers, setScannedAnswers] = useState<ScannedAnswer[]>(() => {
    const saved = localStorage.getItem('testchecker_scanned_results');
    return saved ? JSON.parse(saved) : INITIAL_SCANNED_ANSWERS;
  });

  useEffect(() => {
    localStorage.setItem('testchecker_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('testchecker_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('testchecker_answer_keys', JSON.stringify(answerKeys));
  }, [answerKeys]);

  useEffect(() => {
    localStorage.setItem('testchecker_scanned_results', JSON.stringify(scannedAnswers));
  }, [scannedAnswers]);

  const addExam = (examData: Omit<Exam, 'exam_id'>, keyData: Record<number, string>): Exam => {
    const newExamId = exams.length > 0 ? Math.max(...exams.map(e => e.exam_id)) + 1 : 1;
    const newExam: Exam = {
      ...examData,
      exam_id: newExamId
    };
    setExams(prev => [newExam, ...prev]);
    setAnswerKeys(prev => ({
      ...prev,
      [newExamId]: keyData
    }));
    return newExam;
  };

  const updateExam = (examId: number, examData: Partial<Exam>, keyData?: Record<number, string>) => {
    setExams(prev => prev.map(e => e.exam_id === examId ? { ...e, ...examData } : e));
    if (keyData) {
      setAnswerKeys(prev => ({
        ...prev,
        [examId]: keyData
      }));
    }
  };

  const addStudent = (studentData: Omit<Student, 'student_id'>) => {
    const newStudentId = students.length > 0 ? Math.max(...students.map(s => s.student_id)) + 1 : 1;
    const newStudent: Student = {
      ...studentData,
      student_id: newStudentId
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (studentId: number, updatedData: Partial<Omit<Student, 'student_id'>>) => {
    setStudents(prev => prev.map(s => s.student_id === studentId ? { ...s, ...updatedData } : s));
  };

  const deleteStudent = (studentId: number) => {
    setStudents(prev => prev.filter(s => s.student_id !== studentId));
  };

  const saveScannedResult = (resultData: Omit<ScannedAnswer, 'scan_id' | 'date_generated'>): ScannedAnswer => {
    const newScanId = scannedAnswers.length > 0 ? Math.max(...scannedAnswers.map(s => s.scan_id)) + 1 : 1001;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const newResult: ScannedAnswer = {
      ...resultData,
      scan_id: newScanId,
      date_generated: formattedDate
    };

    setScannedAnswers(prev => [newResult, ...prev]);
    return newResult;
  };

  const deleteExam = (examId: number) => {
    setExams(prev => prev.filter(e => e.exam_id !== examId));
    setScannedAnswers(prev => prev.filter(s => s.exam_id !== examId));
  };

  const getAnswerKey = (examId: number): Record<number, string> => {
    return answerKeys[examId] || {};
  };

  return (
    <AppContext.Provider
      value={{
        exams,
        students,
        answerKeys,
        scannedAnswers,
        addExam,
        updateExam,
        addStudent,
        updateStudent,
        deleteStudent,
        saveScannedResult,
        deleteExam,
        getAnswerKey
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
