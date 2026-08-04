import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FileText, PlusCircle, CheckCircle2, Trash2, Printer, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExamsPage: React.FC = () => {
  const { exams, addExam, deleteExam, getAnswerKey } = useApp();
  const { authUser } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [section, setSection] = useState('BSIT-3A');
  const [totalQuestions, setTotalQuestions] = useState(15);
  const [keyAnswers, setKeyAnswers] = useState<Record<number, string>>({});

  const handleKeyChange = (qNum: number, option: string) => {
    setKeyAnswers(prev => ({
      ...prev,
      [qNum]: option
    }));
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;

    // Fill missing keys with 'A' as fallback
    const completeKeys: Record<number, string> = {};
    for (let i = 1; i <= totalQuestions; i++) {
      completeKeys[i] = keyAnswers[i] || 'A';
    }

    addExam({
      title,
      subject,
      section,
      exam_date: new Date().toISOString().split('T')[0],
      instructor_id: authUser?.instructor_id || 101,
      total_questions: totalQuestions,
      options_per_question: 4
    }, completeKeys);

    setShowModal(false);
    setTitle('');
    setSubject('');
    setKeyAnswers({});
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Answer Keys & Assessment Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create new examinations, define official answer keys, and generate corresponding OMR sheets.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-cyan text-xs py-2.5 px-4 shadow-lg shadow-cyan-500/20">
          <PlusCircle className="w-4 h-4" /> Create New Assessment
        </button>
      </div>

      {/* Modal for Creating Exam */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-5 h-5 text-cyan-400" /> New Examination & Answer Key Encoder
            </h2>

            <form onSubmit={handleCreateExam} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Assessment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm Quiz in Systems Integration"
                    className="input-dark"
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
                    className="input-dark"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Class Section</label>
                  <select
                    className="input-dark"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  >
                    <option value="BSIT-3A">BSIT-3A (IT)</option>
                    <option value="BSIT-3B">BSIT-3B (CS)</option>
                    <option value="BSIT-4A">BSIT-4A (IT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Total Questions</label>
                  <select
                    className="input-dark"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  >
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                    <option value={50}>50 Questions</option>
                  </select>
                </div>
              </div>

              {/* Answer Key Grid Encoder */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                  Encode Correct Options (Answer Key)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-3 rounded-xl bg-slate-950/80 border border-white/10">
                  {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => (
                    <div key={qNum} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-white/5">
                      <span className="text-xs font-mono font-bold text-slate-300">Q{qNum}:</span>
                      <select
                        className="bg-slate-800 text-cyan-300 text-xs font-bold font-mono px-2 py-1 rounded border border-cyan-500/30 outline-none"
                        value={keyAnswers[qNum] || 'A'}
                        onChange={(e) => handleKeyChange(qNum, e.target.value)}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  ))}
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

      {/* List of Assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => {
          const key = getAnswerKey(exam.exam_id);
          return (
            <div key={exam.exam_id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="badge-pill">{exam.section}</span>
                  <h3 className="text-lg font-bold text-white mt-2">{exam.title}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">{exam.subject}</p>
                </div>
                <button
                  onClick={() => deleteExam(exam.exam_id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Delete Exam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-white/5">
                <span className="text-xs font-semibold text-slate-300 block mb-2">Stored Answer Key:</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-xl bg-slate-950/60 font-mono text-xs">
                  {Object.entries(key).map(([q, ans]) => (
                    <span key={q} className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                      {q}:{ans}
                    </span>
                  ))}
                </div>
              </div>

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

    </div>
  );
};

export default ExamsPage;
