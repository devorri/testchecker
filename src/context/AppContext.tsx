import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Exam, Student, ScannedAnswer } from '../utils/mockData';
import {
  INITIAL_EXAMS,
  INITIAL_STUDENTS,
  INITIAL_ANSWER_KEYS,
  INITIAL_SCANNED_ANSWERS
} from '../utils/mockData';
import { supabase } from '../utils/supabaseClient';

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
  isSyncing: boolean;
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

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync to localStorage
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

  // Initial fetch from Supabase if tables exist
  useEffect(() => {
    const fetchFromSupabase = async () => {
      setIsSyncing(true);
      try {
        // 1. Fetch Students
        const { data: supaStudents, error: studentErr } = await supabase
          .from('students')
          .select('*')
          .order('student_id', { ascending: true });

        if (!studentErr && supaStudents && supaStudents.length > 0) {
          setStudents(supaStudents);
        }

        // 2. Fetch Examinations
        const { data: supaExams, error: examErr } = await supabase
          .from('examinations')
          .select('*')
          .order('exam_id', { ascending: false });

        if (!examErr && supaExams && supaExams.length > 0) {
          setExams(supaExams);
        }

        // 3. Fetch Answer Keys
        const { data: supaKeys, error: keyErr } = await supabase
          .from('answer_keys')
          .select('*');

        if (!keyErr && supaKeys && supaKeys.length > 0) {
          const mappedKeys: Record<number, Record<number, string>> = {};
          supaKeys.forEach(k => {
            mappedKeys[k.exam_id] = typeof k.correct_answers === 'string'
              ? JSON.parse(k.correct_answers)
              : k.correct_answers;
          });
          setAnswerKeys(mappedKeys);
        }

        // 4. Fetch Scanned Answers
        const { data: supaScans, error: scanErr } = await supabase
          .from('scanned_answers')
          .select('*')
          .order('scan_id', { ascending: false });

        if (!scanErr && supaScans && supaScans.length > 0) {
          setScannedAnswers(supaScans);
        }
      } catch (err) {
        console.warn('Supabase fetch failed or tables not initialized yet, falling back to localStorage:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    fetchFromSupabase();
  }, []);

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

    // Async Supabase Sync
    (async () => {
      try {
        await supabase.from('examinations').insert([newExam]);
        await supabase.from('answer_keys').insert([{
          exam_id: newExamId,
          correct_answers: keyData
        }]);
      } catch (e) {
        console.warn('Supabase addExam sync error:', e);
      }
    })();

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

    // Async Supabase Sync
    (async () => {
      try {
        await supabase.from('examinations').update(examData).eq('exam_id', examId);
        if (keyData) {
          await supabase.from('answer_keys').upsert({
            exam_id: examId,
            correct_answers: keyData
          }, { onConflict: 'exam_id' });
        }
      } catch (e) {
        console.warn('Supabase updateExam sync error:', e);
      }
    })();
  };

  const deleteExam = (examId: number) => {
    setExams(prev => prev.filter(e => e.exam_id !== examId));
    setScannedAnswers(prev => prev.filter(s => s.exam_id !== examId));

    // Async Supabase Sync
    (async () => {
      try {
        await supabase.from('examinations').delete().eq('exam_id', examId);
        await supabase.from('answer_keys').delete().eq('exam_id', examId);
        await supabase.from('scanned_answers').delete().eq('exam_id', examId);
      } catch (e) {
        console.warn('Supabase deleteExam sync error:', e);
      }
    })();
  };

  const addStudent = (studentData: Omit<Student, 'student_id'>) => {
    const newStudentId = students.length > 0 ? Math.max(...students.map(s => s.student_id)) + 1 : 1;
    const newStudent: Student = {
      ...studentData,
      student_id: newStudentId
    };
    setStudents(prev => [...prev, newStudent]);

    // Async Supabase Sync
    (async () => {
      try {
        await supabase.from('students').insert([newStudent]);
      } catch (e) {
        console.warn('Supabase addStudent sync error:', e);
      }
    })();
  };

  const updateStudent = (studentId: number, updatedData: Partial<Omit<Student, 'student_id'>>) => {
    setStudents(prev => prev.map(s => s.student_id === studentId ? { ...s, ...updatedData } : s));

    // Async Supabase Sync
    (async () => {
      try {
        await supabase.from('students').update(updatedData).eq('student_id', studentId);
      } catch (e) {
        console.warn('Supabase updateStudent sync error:', e);
      }
    })();
  };

  const deleteStudent = (studentId: number) => {
    setStudents(prev => prev.filter(s => s.student_id !== studentId));

    // Async Supabase Sync
    (async () => {
      try {
        await supabase.from('students').delete().eq('student_id', studentId);
      } catch (e) {
        console.warn('Supabase deleteStudent sync error:', e);
      }
    })();
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

    // Async Supabase Sync
    (async () => {
      try {
        await supabase.from('scanned_answers').insert([newResult]);
      } catch (e) {
        console.warn('Supabase saveScannedResult sync error:', e);
      }
    })();

    return newResult;
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
        getAnswerKey,
        isSyncing
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
