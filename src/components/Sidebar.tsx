import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  LayoutDashboard,
  FileText,
  Printer,
  Camera,
  BarChart3,
  LogOut,
  User,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/exams', icon: FileText, label: 'Answer Keys' },
  { to: '/scantron-generator', icon: Printer, label: 'Scantron PDF' },
  { to: '/scanner', icon: Camera, label: 'OMR Scanner', pulse: true },
  { to: '/gradebook', icon: BarChart3, label: 'Gradebook' },
];

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-50 flex flex-col border-r border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: open ? '240px' : '64px',
        background: 'linear-gradient(180deg, #0c1220 0%, #080e1a 100%)',
      }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-3.5 py-4 border-b border-white/10 min-h-[60px]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <div
          className="overflow-hidden whitespace-nowrap transition-all duration-300"
          style={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
        >
          <div className="flex items-center gap-1.5 font-extrabold text-base tracking-tight text-white">
            <span>Test</span>
            <span className="text-cyan-400">Checker</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">CCIT</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">NVFC Inc.</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ to, icon: Icon, label, pulse }) => (
          <NavLink
            key={to}
            to={to}
            title={!open ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon
              className={`w-5 h-5 flex-shrink-0 ${pulse ? 'text-cyan-400' : ''}`}
            />
            <span
              className="truncate transition-all duration-300 whitespace-nowrap"
              style={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0, overflow: 'hidden' }}
            >
              {label}
            </span>
            {/* Tooltip when collapsed */}
            {!open && (
              <span className="absolute left-14 bg-slate-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile + Logout at bottom */}
      <div className="border-t border-white/10 px-2 py-3 space-y-1 overflow-hidden">
        {authUser && (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 mb-2 overflow-hidden transition-all duration-300"
            style={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0, padding: open ? undefined : 0, marginBottom: open ? undefined : 0 }}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{authUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{authUser.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={!open ? 'Logout' : undefined}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition group relative"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span
            className="whitespace-nowrap transition-all duration-300"
            style={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0, overflow: 'hidden' }}
          >
            Logout
          </span>
          {!open && (
            <span className="absolute left-14 bg-slate-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
