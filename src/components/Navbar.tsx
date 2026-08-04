import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User, LogIn, FileText, Camera, BarChart3, LayoutDashboard, Printer, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const { authUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel-heavy sticky top-0 z-50 border-b border-white/10 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-xl tracking-tight text-white">
              <span>Test</span>
              <span className="text-cyan-400">Checker</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">CCIT</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">North Valley College Foundation Inc.</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/thesis-docs"
            className={({ isActive }: { isActive: boolean }) =>
              `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            System Specs
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }: { isActive: boolean }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/exams"
                className={({ isActive }: { isActive: boolean }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <FileText className="w-4 h-4" />
                Answer Keys
              </NavLink>

              <NavLink
                to="/scantron-generator"
                className={({ isActive }: { isActive: boolean }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                Scantron PDF
              </NavLink>

              <NavLink
                to="/scanner"
                className={({ isActive }: { isActive: boolean }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Camera className="w-4 h-4 text-cyan-400 animate-pulse" />
                OMR Scanner
              </NavLink>

              <NavLink
                to="/gradebook"
                className={({ isActive }: { isActive: boolean }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <BarChart3 className="w-4 h-4" />
                Gradebook
              </NavLink>
            </>
          )}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-200">{authUser?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary text-xs py-2 px-3 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-primary text-xs py-2 px-4">
                <LogIn className="w-3.5 h-3.5" />
                Instructor Portal
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
