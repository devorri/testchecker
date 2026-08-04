import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const publicPaths = ['/', '/thesis-docs', '/login'];
  const isPublicPage = publicPaths.includes(location.pathname);

  if (isAuthenticated && !isPublicPage) {
    const sidebarWidth = sidebarOpen ? 240 : 64;

    return (
      <div className="min-h-screen flex bg-[#060a12] text-slate-100 relative overflow-hidden">
        {/* Background orbs */}
        <div className="bg-glow-orb top-[-100px] left-[15%] opacity-40 pointer-events-none"></div>
        <div className="bg-glow-orb top-[40%] right-[-100px] opacity-25 pointer-events-none"></div>

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} />

        {/* Page content — shifts right by sidebar width */}
        <div
          className="flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          {/* Top bar */}
          <div className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 border-b border-white/10 shadow-xl"
            style={{ background: 'rgba(8,14,26,0.92)', backdropFilter: 'blur(12px)' }}
          >
            {/* Hamburger toggle */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400 font-mono">System Online</span>
            </div>
          </div>

          {/* Main page content */}
          <main className="flex-1 overflow-y-auto relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Public layout — top navbar
  return (
    <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-100 relative">
      <div className="bg-glow-orb top-[-100px] left-[15%] opacity-40"></div>
      <div className="bg-glow-orb top-[40%] right-[-100px] opacity-25"></div>

      <Navbar />

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
