import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { printScantronSheet } from '../utils/scantronPdf';
import { Printer, Download, Eye, Layers, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ScantronGenPage: React.FC = () => {
  const { exams } = useApp();
  const [searchParams] = useSearchParams();
  const defaultExamId = searchParams.get('examId') ? Number(searchParams.get('examId')) : exams[0]?.exam_id;

  const [selectedExamId, setSelectedExamId] = useState<number>(defaultExamId || 1);
  const selectedExam = exams.find(e => e.exam_id === selectedExamId) || exams[0];

  const [questionsCount, setQuestionsCount] = useState<number>(selectedExam?.total_questions || 30);
  const [sectionText, setSectionText] = useState<string>(selectedExam?.section || 'BSIT-3A');

  const handlePrint = () => {
    printScantronSheet(
      selectedExam?.title || 'Midterm Examination',
      selectedExam?.subject || 'CCIT Subject',
      sectionText,
      questionsCount
    );
  };

  const questionsPerCol = Math.ceil(questionsCount / 2);
  const idDigits = [1, 2, 3, 4, 5, 6];
  const digitsRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="badge-pill mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 100% Automated Data Reading
          </span>
          <h1 className="text-3xl font-extrabold text-white">Scantron Answer Sheet PDF Generator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generates OMR bubble answer sheets complete with perfectly aligned Student ID grids & section selection bubbles.
          </p>
        </div>

        <button onClick={handlePrint} className="btn-cyan text-xs py-3 px-6 shadow-xl shadow-cyan-500/20">
          <Printer className="w-4 h-4" /> Print / Export to PDF
        </button>
      </div>

      {/* Control Panel & Live Sheet Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customization Controls */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6 h-fit">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Layers className="w-5 h-5 text-cyan-400" /> Sheet Configurations
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Assessment</label>
            <select
              className="input-dark"
              value={selectedExamId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedExamId(id);
                const ex = exams.find(x => x.exam_id === id);
                if (ex) {
                  setQuestionsCount(ex.total_questions);
                  setSectionText(ex.section);
                }
              }}
            >
              {exams.map(e => (
                <option key={e.exam_id} value={e.exam_id}>
                  {e.title} ({e.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Course / Section Header</label>
            <input
              type="text"
              className="input-dark"
              value={sectionText}
              onChange={(e) => setSectionText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Bubble Questions</label>
            <select
              className="input-dark"
              value={questionsCount}
              onChange={(e) => setQuestionsCount(Number(e.target.value))}
            >
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
              <option value={30}>30 Questions</option>
              <option value={50}>50 Questions</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1 text-cyan-300">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Automated ID Feature
            </p>
            <p className="text-[11px] text-slate-300">
              Students shade their 6-digit Student ID grid directly on the paper. The camera scanner automatically detects their identity and assigns grades automatically!
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-3">
            <button onClick={handlePrint} className="btn-cyan w-full justify-center text-xs py-2.5">
              <Download className="w-4 h-4" /> Download / Print A4 PDF
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Paper Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Live Sheet Paper Layout Preview
            </span>
            <span className="text-xs text-slate-400 font-mono">Standard A4 Format</span>
          </div>

          <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl relative border-4 border-slate-900 min-h-[620px] text-xs">
            
            {/* Corner alignment markers preview */}
            <div className="w-4 h-4 bg-black absolute top-2 left-2"></div>
            <div className="w-4 h-4 bg-black absolute top-2 right-2"></div>
            <div className="w-4 h-4 bg-black absolute bottom-2 left-2"></div>
            <div className="w-4 h-4 bg-black absolute bottom-2 right-2"></div>

            {/* Header preview */}
            <div className="text-center border-b-2 border-slate-900 pb-2 mb-3">
              <h2 className="text-base font-extrabold tracking-tight">NORTH VALLEY COLLEGE FOUNDATION INC.</h2>
              <p className="text-xs font-semibold text-slate-700">College of Computing & Information Technology (CCIT)</p>
              <p className="text-[10px] italic text-slate-500">Automated OMR Answer Sheet with Shadeable Student ID & Section Grid</p>
            </div>

            {/* Student metadata & Perfectly Aligned Shadeable ID Grid Preview */}
            <div className="grid grid-cols-2 gap-4 bg-slate-100 p-3 rounded border border-slate-300 mb-3 text-[11px]">
              <div>
                <p><strong>STUDENT NAME:</strong> ______________________</p>
                <p className="mt-1"><strong>EXAM:</strong> {selectedExam?.title}</p>
                <p className="mt-1"><strong>DATE:</strong> ________________________</p>
                
                <div className="mt-3 pt-2 border-t border-slate-300">
                  <span className="font-bold text-[10px] block mb-1 text-slate-800">SHADE CLASS SECTION:</span>
                  <div className="flex gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-slate-800 block"></span> BSIT-3A</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-slate-800 block"></span> BSIT-3B</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-slate-800 block"></span> BSIT-4A</span>
                  </div>
                </div>
              </div>

              {/* Perfectly Aligned Column-based Student ID Grid */}
              <div className="border-l border-slate-300 pl-3 flex flex-col items-center justify-center">
                <span className="font-bold text-[10px] block text-center mb-1 text-slate-900 tracking-wider">
                  SHADE STUDENT ID NUMBER
                </span>
                
                {/* 6 Columns: Each column has top box + bubbles stacked together */}
                <div className="flex gap-1.5 justify-center">
                  {idDigits.map(col => (
                    <div key={col} className="flex flex-col items-center gap-0.5">
                      {/* Digit Box */}
                      <div className="w-4 h-4.5 border-1.5 border-slate-900 bg-white"></div>
                      
                      {/* 0-9 Bubbles directly under digit box */}
                      <div className="flex flex-col gap-0.5 items-center mt-0.5">
                        {digitsRows.map(d => (
                          <span
                            key={d}
                            className="w-3.5 h-3.5 rounded-full border border-slate-800 text-[7px] flex items-center justify-center font-bold bg-white"
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
            <div className="border border-slate-400 p-2 mb-3 text-[10px] text-slate-600 flex justify-between items-center">
              <span><strong>SHADING:</strong> Fill circle completely with black pen/pencil.</span>
              <div className="flex gap-2">
                <span>[●] Correct</span>
                <span>[◯] Incorrect</span>
              </div>
            </div>

            {/* Questions Bubble Grid Preview */}
            <div className="grid grid-cols-2 gap-6 text-[11px]">
              <div>
                {Array.from({ length: questionsPerCol }, (_, i) => i + 1).map((qNum) => (
                  <div key={qNum} className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-200">
                    <span className="font-bold w-6">{qNum}.</span>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <div key={opt} className="flex flex-col items-center">
                          <span className="text-[7px] text-slate-400">{opt}</span>
                          <span className="w-3 h-3 rounded-full border border-slate-800 block"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {Array.from({ length: questionsCount - questionsPerCol }, (_, i) => questionsPerCol + i + 1).map((qNum) => (
                  <div key={qNum} className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-200">
                    <span className="font-bold w-6">{qNum}.</span>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <div key={opt} className="flex flex-col items-center">
                          <span className="text-[7px] text-slate-400">{opt}</span>
                          <span className="w-3 h-3 rounded-full border border-slate-800 block"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default ScantronGenPage;
