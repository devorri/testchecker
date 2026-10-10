import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Screen width detection for responsive sidebar
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on mobile navigation
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const publicPaths = ['/', '/thesis-docs', '/login'];
  const isPublicPage = publicPaths.includes(location.pathname);

  if (isAuthenticated && !isPublicPage) {
    const sidebarWidth = isMobile ? 0 : (sidebarOpen ? 240 : 64);

    return (
      <div className="min-h-screen flex bg-[#060a12] text-slate-100 relative overflow-x-hidden">
        {/* Background orbs */}
        <div className="bg-glow-orb top-[-100px] left-[15%] opacity-40 pointer-events-none"></div>
        <div className="bg-glow-orb top-[40%] right-[-100px] opacity-25 pointer-events-none"></div>

        {/* Mobile Backdrop Overlay when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity"
          />
        )}

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />

        {/* Page content — shifts right by sidebar width on desktop, 0 margin on mobile */}
        <div
          className="flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out w-full"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          {/* Top bar */}
          <div
            className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 shadow-xl"
            style={{ background: 'rgba(8,14,26,0.92)', backdropFilter: 'blur(12px)' }}
          >
            {/* Hamburger toggle */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title={sidebarOpen ? 'Collapse menu' : 'Open menu'}
            >
              {sidebarOpen && isMobile ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono">System Online • CCIT</span>
            </div>
          </div>

          {/* Main page content */}
          <main className="flex-1 overflow-y-auto relative z-10 px-2 sm:px-0">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Landing page — always render without navbar
  if (location.pathname === '/') {
    return (
      <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-100 relative">
        <div className="bg-glow-orb top-[-100px] left-[15%] opacity-40" />
        <div className="bg-glow-orb top-[40%] right-[-100px] opacity-25" />
        <main className="flex-1 relative z-10">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-100 relative">
      <div className="bg-glow-orb top-[-100px] left-[15%] opacity-40" />
      <div className="bg-glow-orb top-[40%] right-[-100px] opacity-25" />

      <Navbar />

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
