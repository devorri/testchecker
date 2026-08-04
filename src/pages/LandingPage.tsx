import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Sparkles,
  Camera,
  Printer,
  BarChart3,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  Layers,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section - upskwela style with dark blue glowing grid */}
      <section className="relative pt-12 lg:pt-20 px-6 max-w-7xl mx-auto text-center">
        
        {/* Floating pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>North Valley College Foundation Inc. • CCIT Automated Assessment System</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight">
          Automated <span className="text-gradient">OMR Test Checker</span> & Grade Management System
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Transform physical shaded examination papers into instant digitized grades. Designed specifically for CCIT instructors to streamline quiz evaluation, generate exportable Scantron answer sheets, and eliminate manual scoring errors.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-cyan text-base py-3 px-8 shadow-xl shadow-cyan-500/20">
              Go to Instructor Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/login" className="btn-cyan text-base py-3 px-8 shadow-xl shadow-cyan-500/20">
              Instructor Portal Login
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          
          <Link to="/thesis-docs" className="btn-secondary text-base py-3 px-6">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            System Manual & Specs
          </Link>
        </div>

        {/* Interactive Inspo Preview Glass Mockup Card */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
          <div className="glass-panel p-4 sm:p-8 rounded-3xl relative overflow-hidden border border-cyan-500/30 shadow-2xl">
            
            {/* Top window controls */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-2 font-mono text-slate-300">testchecker.nvcfi.edu.ph/omr-scanner</span>
              </div>
              <span className="badge-pill">
                <Zap className="w-3 h-3" /> Live Engine Active
              </span>
            </div>

            {/* Mock Dashboard Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              {/* OMR Live Scan Widget Mock */}
              <div className="glass-card p-5 rounded-2xl relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Camera className="w-4 h-4" /> Optical Bubble Reader
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">99.12% Accuracy</span>
                </div>
                <div className="aspect-video rounded-xl bg-slate-950/90 border border-cyan-500/30 relative flex items-center justify-center overflow-hidden">
                  <div className="scanner-laser-bar"></div>
                  <div className="text-center p-4">
                    <CheckSquare className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-mono text-slate-300">Shaded Answer Sheet Detected</p>
                    <p className="text-[10px] text-slate-500 mt-1">Alignment Anchors Matched</p>
                  </div>
                </div>
              </div>

              {/* Instant Score Result Widget Mock */}
              <div className="glass-card p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" /> Auto Score Engine
                  </span>
                  <span className="badge-success">PASSED</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-400">Student</p>
                      <p className="text-sm font-semibold text-white">Kyle G. Sanquillos</p>
                      <p className="text-[11px] font-mono text-slate-400">ID: 2026-0012 • BSIT-3A</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-cyan-300">15 / 15</p>
                      <p className="text-[10px] font-mono text-emerald-400">100% Score</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>

              {/* Scantron Export Widget Mock */}
              <div className="glass-card p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Printer className="w-4 h-4" /> Printable Scantron
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">PDF Standard</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <p className="flex justify-between border-b border-white/5 pb-1">
                    <span>Target Exam</span>
                    <span className="font-semibold text-white">CCIT 312 Midterm</span>
                  </p>
                  <p className="flex justify-between border-b border-white/5 pb-1">
                    <span>Corner Markers</span>
                    <span className="text-emerald-400">4 Corner Targets</span>
                  </p>
                  <p className="flex justify-between border-b border-white/5 pb-1">
                    <span>Student Encoding</span>
                    <span className="text-cyan-400">ID Bubble Grid</span>
                  </p>
                  <div className="pt-2 text-center">
                    <span className="text-[11px] text-cyan-300 font-medium hover:underline cursor-pointer">
                      Export Standard A4 Sheet →
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Core System Features Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Built for Academic Precision & Speed
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Engineered specifically to solve examination grading delays for the CCIT Department at North Valley College Foundation Inc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Camera & File OMR Scanner</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Utilize any standard webcam or phone camera to scan physical shaded answer sheets. Detects answer bubbles and compares them instantly with the active answer key.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Exportable Scantron Sheets</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate and print standardized OMR Answer Sheets complete with student name, ID bubble grid, section info, and optical corner markers for seamless camera alignment.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Auto Gradebook & Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              All scanned results automatically sync into the central database. Filter class performance by section, review itemized pass/fail metrics, and export data to CSV.
            </p>
          </div>

        </div>
      </section>

      {/* System Overview Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden border border-cyan-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="badge-pill">
                <Layers className="w-3.5 h-3.5" /> Departmental Platform
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Empowering CCIT Faculty & Assessment Reporting
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Traditional manual test checking is time-consuming and vulnerable to calculation errors. TestChecker provides an end-to-end automated platform that speeds up result retrieval and secures academic records.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Instructor-Only Authenticated Access Control</span>
                </li>
                <li className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Centralized Database for Class Rosters & Exam Records</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>High-Precision OMR Image Recognition Engine</span>
                </li>
              </ul>
              <div>
                <Link to="/thesis-docs" className="btn-primary text-sm">
                  View Technical Manual & Specifications →
                </Link>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-base border-b border-white/10 pb-3">System Information</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Institution</span>
                  <span className="font-semibold text-slate-200">North Valley College Foundation Inc.</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-semibold text-cyan-300">College of Computing & IT</span>
                </div>
                <div>
                  <span className="text-slate-400 block">System Type</span>
                  <span className="font-semibold text-slate-200">Web OMR Assessment Platform</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Target Users</span>
                  <span className="font-semibold text-slate-200">CCIT Faculty & Students</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
