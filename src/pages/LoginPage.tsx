import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogIn, Lock, Mail, Key, ShieldCheck } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('instructor@nvcfi.edu.ph');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  const handleQuickDemoLogin = () => {
    login('instructor@nvcfi.edu.ph', 'password123');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Top Icon & Branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 mx-auto text-white">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Instructor Portal Login</h2>
          <p className="text-xs text-slate-400">
            CCIT Department • North Valley College Foundation Inc.
          </p>
        </div>

        {/* Login Glass Card */}
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-6 shadow-2xl">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Official Email Address
              </label>
              <input
                type="email"
                required
                className="input-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="instructor@nvcfi.edu.ph"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Account Password
              </label>
              <input
                type="password"
                required
                className="input-dark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-cyan w-full justify-center py-3 text-sm">
              <LogIn className="w-4 h-4" /> Sign In to Instructor Dashboard
            </button>
          </form>

          {/* Quick Demo Login Button */}
          <div className="pt-4 border-t border-white/10 text-center space-y-3">
            <span className="text-xs text-slate-400 block">Quick Demo Access</span>
            <button
              onClick={handleQuickDemoLogin}
              className="btn-secondary w-full justify-center text-xs py-2.5 border-dashed border-cyan-500/40 text-cyan-300"
            >
              <Key className="w-3.5 h-3.5" /> One-Click Login as Demo Instructor
            </button>
          </div>

        </div>

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/60" />
          <span>Role-Based Access Control Enabled • CCIT Department</span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
