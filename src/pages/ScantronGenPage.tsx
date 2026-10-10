import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { printScantronSheet } from '../utils/scantronPdf';
import { Printer, Eye, Layers, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ScantronGenPage: React.FC = () => {
  const { exams } = useApp();
  const [searchParams] = useSearchParams();
  const defaultExamId = searchParams.get('examId') ? Number(searchParams.get('examId')) : exams[0]?.exam_id;

  const [selectedExamId, setSelectedExamId] = useState<number>(defaultExamId || 1);
  const selectedExam = exams.find(e => e.exam_id === selectedExamId) || exams[0];

  // Editable Sheet Configurations
  const [examTitle, setExamTitle] = useState<string>(selectedExam?.title || 'Midterm Examination');
  const [subjectText, setSubjectText] = useState<string>(selectedExam?.subject || 'CCIT 312 - Systems Integration');
  const [sectionText, setSectionText] = useState<string>(selectedExam?.section || 'BSIT-3A (IT)');
  const [examDate, setExamDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [questionsCount, setQuestionsCount] = useState<number>(selectedExam?.total_questions || 30);

  const handleSelectExamChange = (id: number) => {
    setSelectedExamId(id);
    const ex = exams.find(x => x.exam_id === id);
    if (ex) {
      setExamTitle(ex.title);
      setSubjectText(ex.subject);
      setSectionText(ex.section);
      setQuestionsCount(ex.total_questions);
    }
  };

  const handlePrint = () => {
    printScantronSheet(
      examTitle,
      subjectText,
      sectionText,
      questionsCount,
      examDate
    );
  };

  // Preview Grid Calculations:
  // For 100 or 80 questions: 5 columns (or 4 columns)
  // For <= 50 questions: 2 or 3 columns
  const numPreviewCols = questionsCount >= 75 ? 5 : questionsCount >= 40 ? 3 : 2;
  const questionsPerCol = Math.ceil(questionsCount / numPreviewCols);

  const idDigits = [1, 2, 3, 4, 5, 6];
  const digitsRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const bubbleOptions = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="badge-pill mb-2 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Standardized Sheet Printing (A4)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Scantron Answer Sheet PDF Generator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generates standardized OMR bubble sheets with live-updated course/section headers, 6-digit Student ID grids, and options A–E up to 100 items.
          </p>
        </div>

        <button onClick={handlePrint} className="btn-cyan text-xs py-3 px-6 shadow-xl shadow-cyan-500/20 w-full sm:w-auto justify-center">
          <Printer className="w-4 h-4" /> Print / Export to PDF
        </button>
      </div>

      {/* Control Panel & Live Sheet Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customization Controls */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5 h-fit">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Layers className="w-4 h-4 text-cyan-400" /> Live Sheet Configurations
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Load from Assessment</label>
            <select
              className="input-dark text-xs"
              value={selectedExamId}
              onChange={(e) => handleSelectExamChange(Number(e.target.value))}
            >
              {exams.map(e => (
                <option key={e.exam_id} value={e.exam_id}>
                  {e.title} ({e.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exam Title Header</label>
            <input
              type="text"
              className="input-dark text-xs"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject Code / Name</label>
            <input
              type="text"
              className="input-dark text-xs"
              value={subjectText}
              onChange={(e) => setSubjectText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Course / Section Header</label>
            <input
              type="text"
              className="input-dark text-xs"
              value={sectionText}
              onChange={(e) => setSectionText(e.target.value)}
              placeholder="e.g. BSIT-3A (IT)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exam Date</label>
              <input
                type="date"
                className="input-dark text-xs"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Questions</label>
              <select
                className="input-dark text-xs font-mono font-bold"
                value={questionsCount}
                onChange={(e) => setQuestionsCount(Number(e.target.value))}
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

          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1.5 text-cyan-300">
            <p className="font-bold flex items-center gap-1.5 text-white">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Automated ID & 5-Column OMR Layout
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              When 80 or 100 questions is selected, the sheet renders the 5-column layout partitioned into 5-question visual clusters with choices A through E.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10">
            <button onClick={handlePrint} className="btn-cyan w-full justify-center text-xs py-2.5">
              <Printer className="w-4 h-4" /> Download / Print A4 PDF
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Live Sheet Paper Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Live Sheet Paper Layout Preview
            </span>
            <span className="text-xs text-slate-400 font-mono">Standard A4 Format • {questionsCount} Items</span>
          </div>

          <div className="bg-white text-slate-900 p-5 sm:p-7 rounded-2xl shadow-2xl relative border-4 border-slate-900 min-h-[640px] text-xs overflow-x-auto">
            
            {/* Corner alignment markers preview */}
            <div className="w-3.5 h-3.5 bg-black absolute top-2 left-2"></div>
            <div className="w-3.5 h-3.5 bg-black absolute top-2 right-2"></div>
            <div className="w-3.5 h-3.5 bg-black absolute bottom-2 left-2"></div>
            <div className="w-3.5 h-3.5 bg-black absolute bottom-2 right-2"></div>

            {/* Header preview */}
            <div className="text-center border-b-2 border-slate-900 pb-2 mb-3">
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">NORTH VALLEY COLLEGE FOUNDATION INC.</h2>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700">College of Computing & Information Technology (CCIT)</p>
              <p className="text-[9px] sm:text-[10px] italic text-slate-500">
                Automated OMR Answer Sheet with Shadeable Student ID & Section Grid • {questionsCount} Questions (A–E)
              </p>
            </div>

            {/* Student metadata & Perfectly Aligned Shadeable ID Grid Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-100 p-3 rounded border border-slate-300 mb-3 text-[10.5px]">
              <div className="space-y-1">
                <p><strong>STUDENT NAME:</strong> _________________________________</p>
                <p><strong>EXAM:</strong> <span className="font-semibold underline">{examTitle}</span></p>
                <p><strong>SUBJECT:</strong> <span className="font-semibold">{subjectText}</span></p>
                <p><strong>DATE:</strong> <u>{examDate}</u></p>
                
                {/* Live Section Bubbles */}
                <div className="mt-2.5 pt-2 border-t border-slate-300">
                  <span className="font-bold text-[9.5px] block mb-1 text-slate-800">SHADE CLASS SECTION:</span>
                  <div className="flex gap-2.5 text-[9.5px] flex-wrap items-center">
                    {['BSIT-3A', 'BSIT-3B', 'BSIT-4A'].map(sec => (
                      <span key={sec} className="flex items-center gap-1">
                        <span className={`w-3 h-3 rounded-full border border-slate-800 flex items-center justify-center ${sectionText.includes(sec) ? 'bg-black' : ''}`}></span>
                        {sec}
                      </span>
                    ))}
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full border border-slate-800 block"></span>
                      OTHER: <u>{sectionText}</u>
                    </span>
                  </div>
                </div>
              </div>

              {/* Shadeable Student ID Grid */}
              <div className="border-t sm:border-t-0 sm:border-l border-slate-300 pt-2 sm:pt-0 sm:pl-3 flex flex-col items-center justify-center">
                <span className="font-bold text-[9px] block text-center mb-1 text-slate-900 tracking-wider">
                  SHADE STUDENT ID NUMBER
                </span>
                
                <div className="flex gap-1 justify-center">
                  {idDigits.map(col => (
                    <div key={col} className="flex flex-col items-center gap-0.5">
                      <div className="w-3.5 h-4 border border-slate-900 bg-white"></div>
                      <div className="flex flex-col gap-0.5 items-center mt-0.5">
                        {digitsRows.map(d => (
                          <span
                            key={d}
                            className="w-3 h-3 rounded-full border border-slate-800 text-[6.5px] flex items-center justify-center font-bold bg-white"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Shading instructions */}
            <div className="border border-slate-400 p-1.5 mb-3 text-[9px] text-slate-600 flex justify-between items-center">
              <span><strong>SHADING:</strong> Fill circle completely with black pen/pencil. Options A through E.</span>
              <div className="flex gap-2 font-mono">
                <span>[●] Correct</span>
                <span>[◯] Incorrect</span>
              </div>
            </div>

            {/* Questions Bubble Grid Preview (Matching Page 3 layout with 5-question clusters) */}
            <div
              className="grid gap-2 text-[10px]"
              style={{ gridTemplateColumns: `repeat(${numPreviewCols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: numPreviewCols }, (_, colIdx) => {
                const startQ = colIdx * questionsPerCol + 1;
                const endQ = Math.min((colIdx + 1) * questionsPerCol, questionsCount);
                if (startQ > questionsCount) return null;

                return (
                  <div key={colIdx} className="space-y-1">
                    {Array.from({ length: endQ - startQ + 1 }, (_, i) => {
                      const qNum = startQ + i;
                      const isEndOfBlock = qNum % 5 === 0 && qNum !== endQ;
                      return (
                        <div
                          key={qNum}
                          className={`flex justify-between items-center py-0.5 ${
                            isEndOfBlock ? 'border-b-2 border-slate-300 pb-1.5 mb-1.5' : 'border-b border-dashed border-slate-200'
                          }`}
                        >
                          <span className="font-bold font-mono w-5 text-[9.5px]">{qNum}.</span>
                          <div className="flex gap-1">
                            {bubbleOptions.map(opt => (
                              <div key={opt} className="flex flex-col items-center">
                                <span className="text-[6.5px] text-slate-400 line-none">{opt}</span>
                                <span className="w-2.5 h-2.5 rounded-full border border-slate-800 block"></span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default ScantronGenPage;
