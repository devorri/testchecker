import React from 'react';
import { CheckSquare } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 mt-20 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">TestChecker</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Web-Based Optical Mark Recognition (OMR) & Automated Test Checker System for the College of Computing and Information Technology (CCIT) at North Valley College Foundation Inc.
          </p>
          <div className="text-xs text-slate-500 font-mono">
            Developed by Mirven Dave S. Castro & Kyle G. Sanquillos (May 2026)
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-sm mb-3">System Features</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>Automated OMR Sheet Reader</li>
            <li>Exportable PDF Scantron Sheet Generator</li>
            <li>Answer Key Management</li>
            <li>Automated Grade Computation & Storage</li>
            <li>Section-based Analytics & Gradebook</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-sm mb-3">Institutional Links</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>North Valley College Foundation Inc.</li>
            <li>College of Computing & IT (CCIT)</li>
            <li>Kidapawan City, Philippines</li>
            <li>System Version v1.0.4</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>© 2026 CCIT Department - North Valley College Foundation Inc. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-mono text-[11px] text-cyan-500/60">Powered by OMR Image Processing Technology</p>
      </div>
    </footer>
  );
};

export default Footer;
