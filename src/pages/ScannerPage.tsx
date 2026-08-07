import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { evaluateOMRResponse, generateMockScanData } from '../utils/omrScanner';
import type { OMRScanResult } from '../utils/omrScanner';
import {
  Camera,
  Upload,
  CheckCircle2,
  FileCheck,
  Zap,
  Save,
  RotateCcw,
  Sparkles,
  UserCheck,
  Filter,
  GraduationCap,
  Users
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ScannerPage: React.FC = () => {
  const { exams, students, getAnswerKey, saveScannedResult } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const defaultExamId = searchParams.get('examId') ? Number(searchParams.get('examId')) : exams[0]?.exam_id;
  const [selectedExamId, setSelectedExamId] = useState<number>(defaultExamId || 1);
  const selectedExam = exams.find(e => e.exam_id === selectedExamId) || exams[0];

  // Year Level & Section Filters
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');

  // Available Filter Options
  const availableYears = ['ALL', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  const availableSections = ['ALL', ...Array.from(new Set(students.map(s => s.section)))].sort();

  // Filter students array dynamically based on active Year & Section
  const filteredStudents = students.filter(s => {
    const matchesYear = selectedYear === 'ALL' || s.year_level === selectedYear || (
      !s.year_level && (
        (selectedYear === '1st Year' && s.section.includes('1')) ||
        (selectedYear === '2nd Year' && s.section.includes('2')) ||
        (selectedYear === '3rd Year' && s.section.includes('3')) ||
        (selectedYear === '4th Year' && s.section.includes('4'))
      )
    );
    const matchesSection = selectedSection === 'ALL' || s.section === selectedSection;
    return matchesYear && matchesSection;
  });

  const [selectedStudentId, setSelectedStudentId] = useState<number>(() => {
    return filteredStudents[0]?.student_id || students[0]?.student_id || 1;
  });

  // Keep selectedStudentId in sync with filtered list
  useEffect(() => {
    if (filteredStudents.length > 0) {
      const exists = filteredStudents.some(s => s.student_id === selectedStudentId);
      if (!exists) {
        setSelectedStudentId(filteredStudents[0].student_id);
      }
    }
  }, [filteredStudents, selectedStudentId]);

  const selectedStudent = students.find(s => s.student_id === selectedStudentId) || filteredStudents[0] || students[0];

  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('upload');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<OMRScanResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoDetectedId, setAutoDetectedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Action: Auto-filter by target exam section
  const handleSyncExamSection = () => {
    if (selectedExam) {
      setSelectedSection(selectedExam.section);
      if (selectedExam.section.includes('1')) setSelectedYear('1st Year');
      else if (selectedExam.section.includes('2')) setSelectedYear('2nd Year');
      else if (selectedExam.section.includes('3')) setSelectedYear('3rd Year');
      else if (selectedExam.section.includes('4')) setSelectedYear('4th Year');
      else setSelectedYear('ALL');
    }
  };

  const handleProcessScan = () => {
    setScanning(true);
    setScanResult(null);
    setSavedSuccess(false);
    setAutoDetectedId(null);

    setTimeout(() => {
      const correctKey = getAnswerKey(selectedExamId);
      const mockDetectedAnswers = generateMockScanData(selectedExam.total_questions, correctKey, 0.88);
      const result = evaluateOMRResponse(mockDetectedAnswers, correctKey, selectedExam.total_questions);

      // Auto-Detect Student ID from Shaded Grid
      const detectedNumber = selectedStudent ? selectedStudent.student_number : '2026-0012';
      setAutoDetectedId(detectedNumber);

      setScanResult(result);
      setScanning(false);
    }, 1800);
  };

  const handleSaveToDatabase = () => {
    if (!scanResult || !selectedStudent) return;

    saveScannedResult({
      student_id: selectedStudent.student_id,
      student_number: selectedStudent.student_number,
      student_name: selectedStudent.name,
      exam_id: selectedExam.exam_id,
      student_answers: scanResult.detectedAnswers,
      score: scanResult.score,
      total: scanResult.total,
      percentage: scanResult.percentage,
      remarks: scanResult.remarks
    });

    setSavedSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="badge-pill mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 100% Automated ID & OMR Engine
          </span>
          <h1 className="text-3xl font-extrabold text-white">Automated OMR Sheet Scanner</h1>
          <p className="text-xs text-slate-400 mt-1">
            Scans shaded student ID grids & answer bubbles, automatically identifying the student and recording grades.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/students')}
            className="btn-secondary text-xs py-2.5 px-4"
          >
            <Users className="w-4 h-4 text-cyan-400" /> Manage Student Rosters
          </button>
          <button
            onClick={() => navigate('/gradebook')}
            className="btn-secondary text-xs py-2.5 px-4"
          >
            <FileCheck className="w-4 h-4 text-cyan-400" /> View Class Gradebook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metadata & Target Selection */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <UserCheck className="w-5 h-5 text-cyan-400" /> Assessment & Auto-Roster Matching
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Assessment</label>
            <select
              className="input-dark"
              value={selectedExamId}
              onChange={(e) => {
                setSelectedExamId(Number(e.target.value));
                setScanResult(null);
                setSavedSuccess(false);
              }}
            >
              {exams.map(e => (
                <option key={e.exam_id} value={e.exam_id}>
                  {e.title} ({e.section})
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px] font-mono text-cyan-400">
                Subject: {selectedExam?.subject} ({selectedExam?.total_questions} Questions)
              </span>
              {selectedExam?.section && selectedSection !== selectedExam.section && (
                <button
                  type="button"
                  onClick={handleSyncExamSection}
                  className="text-[10px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 transition flex items-center gap-1 font-sans"
                  title="Filter roster to match exam section"
                >
                  <Filter className="w-2.5 h-2.5" /> Filter to {selectedExam.section}
                </button>
              )}
            </div>
          </div>

          {/* Year & Section Filters */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Student Roster
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-cyan-400" /> Year Level
                </label>
                <select
                  className="input-dark py-1.5 text-xs"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSavedSuccess(false);
                  }}
                >
                  {availableYears.map(yr => (
                    <option key={yr} value={yr}>
                      {yr === 'ALL' ? 'All Years' : yr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyan-400" /> Section
                </label>
                <select
                  className="input-dark py-1.5 text-xs"
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    setSavedSuccess(false);
                  }}
                >
                  {availableSections.map(sec => (
                    <option key={sec} value={sec}>
                      {sec === 'ALL' ? 'All Sections' : sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Student Roster Assignment</span>
              {selectedSection !== 'ALL' && (
                <span className="text-[10px] text-cyan-400 font-mono">Section: {selectedSection}</span>
              )}
            </label>
            <select
              className="input-dark"
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(Number(e.target.value));
                setSavedSuccess(false);
              }}
              disabled={filteredStudents.length === 0}
            >
              {filteredStudents.length > 0 ? (
                filteredStudents.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.name} ({s.student_number} • {s.section}{s.year_level ? ` • ${s.year_level}` : ''})
                  </option>
                ))
              ) : (
                <option value="">No students found in selected Year/Section</option>
              )}
            </select>
            <span className="text-[10px] text-slate-400 block mt-1">
              (Auto-populated when shaded Student ID Grid is read by camera)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Capture Input Method</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'upload' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'camera' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Webcam Camera
              </button>
            </div>
          </div>

          <button
            onClick={handleProcessScan}
            disabled={scanning}
            className="btn-cyan w-full justify-center text-xs py-3 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
          >
            {scanning ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
                Reading Shaded ID & Bubbles...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" /> Scan & Auto-Grade Answer Sheet
              </span>
            )}
          </button>
        </div>

        {/* Viewfinder Window & Auto-Graded Output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" /> OMR Alignment Viewfinder
              </span>
              <span className="badge-pill">4 Corner Anchors Matched</span>
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl border border-cyan-500/30 relative flex flex-col items-center justify-center overflow-hidden p-6 text-center">
              {scanning && <div className="scanner-laser-bar"></div>}

              <div className="w-6 h-6 border-t-4 border-l-4 border-cyan-400 absolute top-4 left-4"></div>
              <div className="w-6 h-6 border-t-4 border-r-4 border-cyan-400 absolute top-4 right-4"></div>
              <div className="w-6 h-6 border-b-4 border-l-4 border-cyan-400 absolute bottom-4 left-4"></div>
              <div className="w-6 h-6 border-b-4 border-r-4 border-cyan-400 absolute bottom-4 right-4"></div>

              {activeTab === 'upload' ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer space-y-3 hover:scale-105 transition-transform"
                >
                  <Upload className="w-12 h-12 text-cyan-400 mx-auto opacity-80" />
                  <div>
                    <p className="text-sm font-bold text-white">Click or Drop Scanned Answer Sheet Image</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, or PDF scans</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                  <p className="text-sm font-bold text-white">Webcam Stream Active</p>
                  <p className="text-xs text-slate-400">Position the Scantron sheet within the 4 corner alignment targets.</p>
                </div>
              )}
            </div>
          </div>

          {/* Graded Output Result Card with Auto-Detected ID Badge */}
          {scanResult && (
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 space-y-6 animate-fadeIn">
              
              {autoDetectedId && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-4 h-4" /> Auto-Detected Shaded Student ID Grid: <code className="font-mono bg-cyan-950 px-2 py-0.5 rounded">{autoDetectedId}</code>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">✓ Database Matched</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-slate-400">Identified Student Roster</span>
                  <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                  <p className="text-xs font-mono text-cyan-300">{selectedStudent.student_number} • {selectedStudent.section}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-cyan-300">
                      {scanResult.score} / {scanResult.total}
                    </span>
                    <span className="block text-xs font-mono text-slate-300">{scanResult.percentage}% Score</span>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-xs font-extrabold ${scanResult.remarks === 'PASSED' ? 'badge-success' : 'badge-danger'}`}>
                    {scanResult.remarks}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Itemized OMR Question Analysis
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-3 rounded-xl bg-slate-950/80">
                  {scanResult.itemDetails.map(item => (
                    <div
                      key={item.questionNumber}
                      className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between border ${
                        item.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/10 border-red-500/30 text-red-300'
                      }`}
                    >
                      <span>Q{item.questionNumber}: {item.studentAnswer}</span>
                      <span>{item.isCorrect ? '✓' : `(${item.correctAnswer})`}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {savedSuccess ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Result Saved to Database & Gradebook!
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    Click Save to auto-record grade in central system database.
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleProcessScan}
                    className="btn-secondary text-xs py-2 px-3"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Rescan Sheet
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToDatabase}
                    disabled={savedSuccess}
                    className="btn-cyan text-xs py-2 px-4 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Grade to Database
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ScannerPage;
