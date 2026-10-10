import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Calendar,
  User,
  X
} from 'lucide-react';

export interface GeneratedExamData {
  title: string;
  subject: string;
  course: string;
  yearLevel: string;
  section: string;
  totalQuestions: number;
  answerKey: Record<number, string>;
  questions: {
    questionNumber: number;
    questionText: string;
    options: { key: string; text: string }[];
    correctKey: string;
  }[];
}

interface AiExamGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAnswerKey: (data: GeneratedExamData) => void;
}

export const AiExamGeneratorModal: React.FC<AiExamGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyAnswerKey
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([
    { name: 'Chapter_3_Systems_Integration_Architecture.pdf', size: '2.4 MB' },
    { name: 'Lecture_OMR_and_Computer_Vision_Algorithms.pptx', size: '5.1 MB' }
  ]);

  const [course, setCourse] = useState('BS Information Technology');
  const [subject, setSubject] = useState('CCIT 312 - Systems Integration');
  const [yearLevel, setYearLevel] = useState('3rd Year');
  const [section, setSection] = useState('BSIT-3A');
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [title, setTitle] = useState('Automated AI Assessment in Systems Integration');

  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedExamData | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }));
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateQuestions = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one lesson file, PDF, or PPT first.');
      return;
    }

    setGenerating(true);

    setTimeout(() => {
      const optionsLetters = ['A', 'B', 'C', 'D', 'E'];
      const sampleTopics = [
        'Which component is responsible for corner anchor detection in Optical Mark Recognition?',
        'In computer vision thresholding, Otsu’s binarization algorithm is primarily used for:',
        'What is the primary role of an Enterprise Service Bus (ESB) in systems integration?',
        'Which image processing transformation corrects sheet tilt and camera perspective skewing?',
        'What metric denotes OMR scanning sensitivity against faint pencil shading?',
        'Which API architectural style relies on stateless HTTP methods and resource URIs?',
        'In relational databases, what key uniquely identifies records across dependent tables?',
        'Which protocol is most commonly utilized for real-time asynchronous camera streams?'
      ];

      const generatedQuestions = Array.from({ length: totalQuestions }, (_, i) => {
        const qNum = i + 1;
        const topic = sampleTopics[(qNum - 1) % sampleTopics.length];
        const correctChoice = optionsLetters[Math.floor(Math.random() * optionsLetters.length)];

        return {
          questionNumber: qNum,
          questionText: `${topic} (Item #${qNum})`,
          options: [
            { key: 'A', text: 'Homography Matrix Perspective Rectification' },
            { key: 'B', text: 'Adaptive Dynamic Bubble Grayscale Thresholding' },
            { key: 'C', text: 'Centralized Microservice Message Broker Hub' },
            { key: 'D', text: 'Edge Detection using Canny Gradient Filter' },
            { key: 'E', text: 'Standardized Normalized Cross-Correlation' }
          ],
          correctKey: correctChoice
        };
      });

      const keyRecord: Record<number, string> = {};
      generatedQuestions.forEach(q => {
        keyRecord[q.questionNumber] = q.correctKey;
      });

      setGeneratedResult({
        title,
        subject,
        course,
        yearLevel,
        section,
        totalQuestions,
        answerKey: keyRecord,
        questions: generatedQuestions
      });

      setGenerating(false);
    }, 1500);
  };

  const handleProceedToAnswerKey = () => {
    if (generatedResult) {
      onApplyAnswerKey(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 w-full max-w-4xl max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="badge-pill flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI-Powered Test & Answer Key Generator
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Generate Test Questions & Answer Keys from Files
            </h2>
            <p className="text-xs text-slate-400">
              Upload multiple syllabus files, PDFs, or PPTs. The AI model extracts core competencies, writes MCQs with choices A–E, and compiles official answer keys automatically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Upload Files */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Step 1: Upload Lesson / Syllabus Files (PDF, PPT, DOCX)
          </label>
          
          <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-5 text-center transition bg-slate-950/40">
            <input
              type="file"
              multiple
              accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
              id="ai-file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="ai-file-upload" className="cursor-pointer space-y-2 block">
              <Upload className="w-8 h-8 text-cyan-400 mx-auto opacity-80" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-cyan-300">Click to upload files</span> or drag and drop multiple lessons simultaneously
              </div>
              <p className="text-[11px] text-slate-500">Supports PDF, PowerPoint (.ppt, .pptx), Word documents, and text files</p>
            </label>
          </div>

          {/* List of uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-white/5 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="truncate text-slate-200 font-medium">{f.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">({f.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Assessment Metadata */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Step 2: Course & Section Configuration
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assessment Title</label>
              <input
                type="text"
                className="input-dark py-2 text-xs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject Code & Name</label>
              <input
                type="text"
                className="input-dark py-2 text-xs"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Course / Degree Program</label>
              <input
                type="text"
                className="input-dark py-2 text-xs"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Year Level</label>
              <select
                className="input-dark py-2 text-xs"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Class Section</label>
              <input
                type="text"
                className="input-dark py-2 text-xs uppercase font-mono"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. BSIT-3A"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Total Questions</label>
              <select
                className="input-dark py-2 text-xs font-mono font-bold"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
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

          <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-cyan-400" /> Student Name: <strong className="text-slate-300">[Auto-Printed / Blank]</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-cyan-400" /> Date: <strong className="text-slate-300">{new Date().toISOString().split('T')[0]}</strong>
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerateQuestions}
              disabled={generating}
              className="btn-cyan w-full justify-center py-2.5 text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
                  Analyzing Uploaded Lessons & Synthesizing Questions...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Synthesize Questionnaire with AI
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Generated Questions Preview & Direct Answer Key Action */}
        {generatedResult && (
          <div className="space-y-4 pt-3 border-t border-cyan-500/30 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Generated Questionnaire ({generatedResult.questions.length} Items)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Questions are generated with options A through E. Review items below then click "Generate answer keys" to direct to the answer key editor.
                </p>
              </div>
              <span className="badge-pill font-mono">{generatedResult.section} • {generatedResult.totalQuestions} Questions</span>
            </div>

            {/* Scrollable Questions list */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-slate-950/80 border border-white/10 text-xs">
              {generatedResult.questions.map((q) => (
                <div key={q.questionNumber} className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-200">
                      <strong className="text-cyan-400 mr-1.5">#{q.questionNumber}.</strong>
                      {q.questionText}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-500/40">
                      Key: {q.correctKey}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 text-[11px] text-slate-300 font-mono">
                    {q.options.map(opt => (
                      <div
                        key={opt.key}
                        className={`p-1.5 rounded border ${
                          opt.key === q.correctKey
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                            : 'bg-slate-950/60 border-white/5 text-slate-400'
                        }`}
                      >
                        <strong className="mr-1">({opt.key})</strong> {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Prominent "Generate answer keys" Button */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Ready to review and customize the official answer key?
              </span>
              <button
                type="button"
                onClick={handleProceedToAnswerKey}
                className="btn-cyan w-full sm:w-auto text-xs py-3 px-6 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 font-extrabold text-slate-950"
              >
                <Sparkles className="w-4 h-4" />
                Generate answer keys
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
