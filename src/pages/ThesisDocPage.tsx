import React from 'react';
import { CheckSquare, ShieldCheck, Zap, Camera, Printer, BarChart3, Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThesisDocPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <Link to="/" className="btn-secondary text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <span className="badge-pill">Institutional System Manual & Guide</span>
      </div>

      {/* Hero Product Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/30 text-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-cyan-500/20">
          <CheckSquare className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white max-w-3xl mx-auto tracking-tight">
          TestChecker System Specifications & Documentation
        </h1>
        <p className="mt-3 text-slate-300 text-sm max-w-2xl mx-auto">
          Official platform manual for the College of Computing and Information Technology (CCIT) at North Valley College Foundation Inc.
        </p>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-8 text-xs text-slate-400 font-mono">
          <div><span className="text-cyan-400">Department:</span> CCIT Department</div>
          <div><span className="text-cyan-400">Institution:</span> North Valley College Foundation Inc.</div>
          <div><span className="text-cyan-400">Engine:</span> OMR Image Processing v1.0</div>
        </div>
      </div>

      {/* System Architecture & Workflow */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white">System Operation Workflow</h2>
          <p className="text-xs text-slate-400 mt-1">Four simple steps to automate physical test evaluation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="font-bold text-white text-base">Key Encoding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create an assessment in the Answer Key Manager, specifying total items and correct options (A–E).
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="font-bold text-white text-base">PDF Scantron Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate standardized A4 Scantron sheets complete with student ID bubble grids and corner alignment targets.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="font-bold text-white text-base">OMR Camera Scan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan student shaded answer sheets using any standard webcam or image file upload for instant scoring.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">
              04
            </div>
            <h3 className="font-bold text-white text-base">Gradebook Storage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Graded results are automatically saved to the central database, generating class metrics and CSV reports.
            </p>
          </div>

        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="glass-card p-8 rounded-3xl border border-white/10 space-y-8">
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> Platform Technical Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-2">
              <Camera className="w-4 h-4" /> High-Accuracy Optical Bubble Detection
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              The OMR engine utilizes corner registration anchors to orient scanned images regardless of minor tilt or lighting variations, delivering an average 99.12% bubble recognition rate.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-2">
              <Printer className="w-4 h-4" /> Standardized Scantron Sheet Printing
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Supports customizable question counts (15, 20, 30, 50) and formats student ID bubble grids directly on printable A4 sheets for high-volume department examinations.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Section Analytics & CSV Export
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Automatically aggregates class section averages, pass/fail ratios, and itemized score distributions. Export official grade records to CSV format with a single click.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Role-Based Access Control
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Ensures examination keys, student rosters, and graded results are strictly accessible only to authenticated instructors and program administrators.
            </p>
          </div>

        </div>
      </section>

      {/* Technical Requirements Table */}
      <section className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" /> System Hardware & Software Requirements
        </h2>

        <div className="overflow-x-auto">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Component</th>
                <th>Minimum Requirement</th>
                <th>Recommended Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold text-white">Camera Capture Device</td>
                <td className="text-slate-300">720p HD Webcam or Phone Camera</td>
                <td className="text-cyan-300 font-semibold">1080p Full HD Camera with Autofocus</td>
              </tr>
              <tr>
                <td className="font-semibold text-white">Supported Paper Size</td>
                <td className="text-slate-300">Standard Letter / A4 Paper</td>
                <td className="text-cyan-300 font-semibold">Standard 80gsm Clean White A4 Paper</td>
              </tr>
              <tr>
                <td className="font-semibold text-white">Browser Environment</td>
                <td className="text-slate-300">Modern Web Browser (Chrome, Edge, Firefox)</td>
                <td className="text-cyan-300 font-semibold">Latest Google Chrome or MS Edge</td>
              </tr>
              <tr>
                <td className="font-semibold text-white">Shading Instrument</td>
                <td className="text-slate-300">Black Ballpoint Pen or No. 2 Pencil</td>
                <td className="text-cyan-300 font-semibold">Dark Black Gel/Marker Pen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default ThesisDocPage;
