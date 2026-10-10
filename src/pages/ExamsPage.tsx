import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Printer,
  Camera,
  Pencil,
  Sparkles,
  AlertCircle,
  X,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AiExamGeneratorModal } from '../components/AiExamGeneratorModal';
import type { GeneratedExamData } from '../components/AiExamGeneratorModal';
import type { Exam } from '../utils/mockData';

const AVAILABLE_SECTIONS = [
  'BSIT-3A (IT)',
  'BSIT-3B (CS)',
  'BSIT-4A (IT)',
  'BSIT-1A',
  'BSIT-2A',
  'Custom'
];

const ExamsPage: React.FC = () => {
  const { exams, addExam, updateExam, deleteExam, getAnswerKey } = useApp();
  const { authUser } = useAuth();

  // Create/Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [section, setSection] = useState('BSIT-3A (IT)');
  const [customSection, setCustomSection] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [keyAnswers, setKeyAnswers] = useState<Record<number, string>>({});

  // AI Generator Modal
  const [showAiModal, setShowAiModal] = useState(false);

  // Delete Confirmation Modal
  const [examToDelete, setExamToDelete] = useState<{ id: number; title: string } | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const bubbleOptions = ['A', 'B', 'C', 'D', 'E'];

  const handleKeySelect = (qNum: number, option: string) => {
    setKeyAnswers(prev => ({
      ...prev,
      [qNum]: option
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingExamId(null);
    setTitle('');
    setSubject('');
    setSection('BSIT-3A (IT)');
    setCustomSection('');
    setTotalQuestions(20);
    // Initialize default keys to 'A'
    const initialKeys: Record<number, string> = {};
    for (let i = 1; i <= 20; i++) initialKeys[i] = 'A';
    setKeyAnswers(initialKeys);
    setShowModal(true);
  };

  const handleOpenEditModal = (exam: Exam) => {
    setEditingExamId(exam.exam_id);
    setTitle(exam.title);
    setSubject(exam.subject);
    if (AVAILABLE_SECTIONS.includes(exam.section)) {
      setSection(exam.section);
      setCustomSection('');
    } else {
      setSection('Custom');
      setCustomSection(exam.section);
    }
    setTotalQuestions(exam.total_questions);
    const existingKey = getAnswerKey(exam.exam_id);
    setKeyAnswers({ ...existingKey });
    setShowModal(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;

    const finalSection = section === 'Custom' ? (customSection.trim().toUpperCase() || 'BSIT-3A') : section;

    // Fill missing keys with 'A' as fallback
    const completeKeys: Record<number, string> = {};
    for (let i = 1; i <= totalQuestions; i++) {
      completeKeys[i] = keyAnswers[i] || 'A';
    }

    if (editingExamId !== null) {
      updateExam(editingExamId, {
        title: title.trim(),
        subject: subject.trim(),
        section: finalSection,
        total_questions: totalQuestions,
        options_per_question: 5
      }, completeKeys);
    } else {
      addExam({
        title: title.trim(),
        subject: subject.trim(),
        section: finalSection,
        exam_date: new Date().toISOString().split('T')[0],
        instructor_id: authUser?.instructor_id || 101,
        total_questions: totalQuestions,
        options_per_question: 5
      }, completeKeys);
    }

    setShowModal(false);
  };

  const confirmDelete = () => {
    if (examToDelete) {
      deleteExam(examToDelete.id);
      setExamToDelete(null);
    }
  };

  // Called when AI modal finishes and user clicks "Generate answer keys"
  const handleApplyAiGenerated = (aiData: GeneratedExamData) => {
    setEditingExamId(null);
    setTitle(aiData.title);
    setSubject(aiData.subject);
    if (AVAILABLE_SECTIONS.includes(aiData.section)) {
      setSection(aiData.section);
      setCustomSection('');
    } else {
      setSection('Custom');
      setCustomSection(aiData.section);
    }
    setTotalQuestions(aiData.totalQuestions);
    setKeyAnswers(aiData.answerKey);
    setShowModal(true);
  };

  // Filter exams by query
  const filteredExams = exams.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="badge-pill mb-2 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Answer Key & OMR Sheet Authority
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Answer Keys & Assessment Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Encode and edit official assessment answer keys (options A–E up to 100 questions), or synthesize questions automatically with AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowAiModal(true)}
            className="btn-secondary text-xs py-2.5 px-4 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 shadow-lg shadow-cyan-500/10 flex-1 sm:flex-none justify-center"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" /> AI Question & Key Generator
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="btn-cyan text-xs py-2.5 px-4 shadow-lg shadow-cyan-500/20 flex-1 sm:flex-none justify-center"
          >
            <PlusCircle className="w-4 h-4" /> Create New Assessment
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter assessments by title, subject, or section..."
          className="input-dark pl-10 py-2 text-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* List of Assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExams.map((exam) => {
          const key = getAnswerKey(exam.exam_id);
          const keyCount = Object.keys(key).length || exam.total_questions;
          return (
            <div key={exam.exam_id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-cyan-500/30 transition">
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="badge-pill font-mono">{exam.section}</span>
                    <span className="text-[11px] font-mono text-cyan-400">
                      {exam.total_questions} Questions (A–E)
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white pt-1">{exam.title}</h3>
                  <p className="text-xs font-mono text-slate-400">{exam.subject}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(exam)}
                    className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
                    title="Edit Assessment & Answer Keys"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExamToDelete({ id: exam.exam_id, title: exam.title })}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete Assessment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stored Answer Key Bubbles Preview */}
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">Official Answer Key ({keyCount} items):</span>
                  <button
                    onClick={() => handleOpenEditModal(exam)}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Edit Key
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2.5 rounded-xl bg-slate-950/80 font-mono text-xs border border-white/5">
                  {Object.entries(key).slice(0, exam.total_questions).map(([q, ans]) => (
                    <span key={q} className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] flex items-center gap-1">
                      <span className="text-slate-400">{q}:</span>
                      <strong>{ans}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Link to={`/scanner?examId=${exam.exam_id}`} className="btn-cyan text-xs py-2 px-3 flex-1 justify-center">
                  <Camera className="w-3.5 h-3.5" /> Scan OMR Papers
                </Link>
                <Link to={`/scantron-generator?examId=${exam.exam_id}`} className="btn-secondary text-xs py-2 px-3 flex-1 justify-center">
                  <Printer className="w-3.5 h-3.5 text-cyan-400" /> Export Scantron
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT ASSESSMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 w-full max-w-4xl max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl relative">
            
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  {editingExamId !== null ? 'Edit Assessment & Answer Keys' : 'New Assessment & Answer Key Encoder'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure assessment header details and tap direct answer bubbles (A–E) for effortless answer key setup.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Assessment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm Quiz in Systems Integration"
                    className="input-dark text-xs"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Subject Code & Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CCIT 312 - Systems Integration"
                    className="input-dark text-xs"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Class Section</label>
                  <select
                    className="input-dark text-xs"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  >
                    {AVAILABLE_SECTIONS.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                  {section === 'Custom' && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom section (e.g. BSCS-3C)"
                      className="input-dark text-xs mt-2 uppercase font-mono"
                      value={customSection}
                      onChange={(e) => setCustomSection(e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Total Questions</label>
                  <select
                    className="input-dark text-xs font-mono font-bold"
                    value={totalQuestions}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setTotalQuestions(count);
                      // Pre-fill newly added questions with 'A'
                      setKeyAnswers(prev => {
                        const updated = { ...prev };
                        for (let i = 1; i <= count; i++) {
                          if (!updated[i]) updated[i] = 'A';
                        }
                        return updated;
                      });
                    }}
                  >
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                    <option value={50}>50 Questions</option>
                    <option value={80}>80 Questions</option>
                    <option value={100}>100 Questions</option>
                  </select>
                </div>
              </div>

              {/* Direct Clickable Bubble Answer Key Encoder (A–E + 1pt) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Official Answer Key Matrix (Click Letters directly to select)
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allA: Record<number, string> = {};
                        for (let i = 1; i <= totalQuestions; i++) allA[i] = 'A';
                        setKeyAnswers(allA);
                      }}
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-white/10"
                    >
                      Default All to A
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const letters = ['A', 'B', 'C', 'D', 'E'];
                        const randomKeys: Record<number, string> = {};
                        for (let i = 1; i <= totalQuestions; i++) {
                          randomKeys[i] = letters[Math.floor(Math.random() * letters.length)];
                        }
                        setKeyAnswers(randomKeys);
                      }}
                      className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/30 font-semibold"
                    >
                      Shuffle Demo Keys
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto p-3.5 rounded-2xl bg-slate-950/80 border border-white/10">
                  {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => {
                    const currentSelected = keyAnswers[qNum] || 'A';
                    return (
                      <div
                        key={qNum}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-white/5 hover:border-cyan-500/30 transition"
                      >
                        <span className="text-xs font-mono font-bold text-slate-300 w-9">
                          {qNum}:
                        </span>
                        
                        {/* Direct Clickable Bubbles (A, B, C, D, E) */}
                        <div className="flex items-center gap-1.5">
                          {bubbleOptions.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleKeySelect(qNum, opt)}
                              className={`answer-bubble ${currentSelected === opt ? 'selected' : ''}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        <span className="text-[11px] font-mono text-slate-400 pl-1">
                          1pt
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-cyan text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Save Answer Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-red-500/30 w-full max-w-md space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">Delete Assessment?</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-cyan-300">"{examToDelete.title}"</span>? This will also permanently remove its associated official answer key and recorded student scan data.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExamToDelete(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-danger text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI EXAM GENERATOR MODAL */}
      <AiExamGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApplyAnswerKey={handleApplyAiGenerated}
      />

    </div>
  );
};

export default ExamsPage;
