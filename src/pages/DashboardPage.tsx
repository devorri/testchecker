import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Camera,
  Printer,
  BarChart3,
  Users,
  Award,
  PlusCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { authUser } = useAuth();
  const { exams, students, scannedAnswers } = useApp();

  const totalExams = exams.length;
  const totalStudents = students.length;
  const totalScans = scannedAnswers.length;

  const avgPercentage = totalScans > 0
    ? Math.round((scannedAnswers.reduce((sum, s) => sum + s.percentage, 0) / totalScans) * 10) / 10
    : 0;

  const passCount = scannedAnswers.filter(s => s.remarks === 'PASSED').length;
  const passRate = totalScans > 0 ? Math.round((passCount / totalScans) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="badge-pill">
            <Award className="w-3.5 h-3.5" /> CCIT Faculty Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome, <span className="text-gradient-cyan">{authUser?.name}</span>
          </h1>
          <p className="text-xs text-slate-300">
            {authUser?.department} • North Valley College Foundation Inc.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link to="/scanner" className="btn-cyan text-xs py-2.5 px-4 shadow-lg shadow-cyan-500/20">
            <Camera className="w-4 h-4" /> Launch OMR Scanner
          </Link>
          <Link to="/scantron-generator" className="btn-secondary text-xs py-2.5 px-4">
            <Printer className="w-4 h-4 text-cyan-400" /> Export Scantron PDF
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Examinations</span>
            <span className="text-3xl font-extrabold text-white mt-1 block">{totalExams}</span>
            <span className="text-[11px] text-cyan-400 mt-1 inline-flex items-center gap-1 font-mono">
              <FileText className="w-3 h-3" /> Active Assessments
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Scanned Answer Sheets</span>
            <span className="text-3xl font-extrabold text-white mt-1 block">{totalScans}</span>
            <span className="text-[11px] text-emerald-400 mt-1 inline-flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> Auto-Graded Records
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Camera className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Class Average Score</span>
            <span className="text-3xl font-extrabold text-cyan-300 mt-1 block">{avgPercentage}%</span>
            <span className="text-[11px] text-slate-400 mt-1 inline-flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3 text-cyan-400" /> Pass Rate: {passRate}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Registered Students</span>
            <span className="text-3xl font-extrabold text-white mt-1 block">{totalStudents}</span>
            <span className="text-[11px] text-purple-400 mt-1 inline-flex items-center gap-1 font-mono">
              <Users className="w-3 h-3" /> CCIT Class Rosters
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Active Examinations & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Active Examinations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" /> Active Assessments & Answer Keys
            </h2>
            <Link to="/exams" className="btn-secondary text-xs py-1.5 px-3">
              <PlusCircle className="w-3.5 h-3.5" /> Create Exam
            </Link>
          </div>

          <div className="space-y-4">
            {exams.length === 0 ? (
              <div className="glass-card p-10 rounded-2xl border border-white/10 text-center space-y-3">
                <FileText className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-white">No active assessments</h4>
                <p className="text-xs text-slate-400">Create an assessment to start grading student answer sheets.</p>
                <Link to="/exams" className="btn-cyan text-xs inline-flex py-2 px-4">
                  Create First Assessment
                </Link>
              </div>
            ) : (
              exams.map(exam => (
                <div key={exam.exam_id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="badge-pill">{exam.section}</span>
                      <span className="text-xs font-mono text-slate-400">{exam.subject}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-2">{exam.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {exam.exam_date}</span>
                      <span>• {exam.total_questions} Multiple Choice Items</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link to={`/scanner?examId=${exam.exam_id}`} className="btn-cyan text-xs py-2 px-3 flex-1 sm:flex-none justify-center">
                      <Camera className="w-3.5 h-3.5" /> Scan Papers
                    </Link>
                    <Link to={`/scantron-generator?examId=${exam.exam_id}`} className="btn-secondary text-xs py-2 px-3 flex-1 sm:flex-none justify-center">
                      <Printer className="w-3.5 h-3.5 text-cyan-400" /> Print
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Recent OMR Scans Log */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> Recent OMR Scans
            </h2>
            <Link to="/gradebook" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
            {scannedAnswers.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Camera className="w-7 h-7 text-cyan-400 mx-auto opacity-50" />
                <p className="text-xs text-slate-400">No scanned answer sheets recorded yet.</p>
                <Link to="/scanner" className="text-[11px] text-cyan-400 hover:underline block pt-1">
                  Open Scanner to grade papers
                </Link>
              </div>
            ) : (
              scannedAnswers.slice(0, 5).map(scan => (
                <div key={scan.scan_id} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{scan.student_name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{scan.student_number} • {scan.date_generated}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-extrabold ${scan.remarks === 'PASSED' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scan.score} / {scan.total}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-400">{scan.percentage}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
