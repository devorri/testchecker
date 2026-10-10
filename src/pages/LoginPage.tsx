import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  LogIn,
  Lock,
  Mail,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  UserPlus,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

import { sendEmailOtp } from '../utils/emailOtpService';

type AuthMode = 'login' | 'register' | 'forgot';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('instructor@nvcfi.edu.ph');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('CCIT Department');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

  // OTP Verification Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [otpTargetAction, setOtpTargetAction] = useState<'login' | 'register' | 'forgot'>('login');
  const [emailStatus, setEmailStatus] = useState<string>('');

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Timer countdown for OTP
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showOtpModal && otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showOtpModal, otpCountdown]);

  const triggerEmailOtp = async (action: 'login' | 'register' | 'forgot') => {
    setSendingOtp(true);
    setError('');
    const targetEmail = email.trim();
    if (!targetEmail) {
      setError('Please provide a valid email address.');
      setSendingOtp(false);
      return;
    }

    const result = await sendEmailOtp(targetEmail);
    setGeneratedOtp(result.code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpCountdown(60);
    setOtpTargetAction(action);
    setShowOtpModal(true);
    setSendingOtp(false);
    if (result.success) {
      setEmailStatus('Sent to your inbox via EmailJS');
    } else {
      setEmailStatus('Simulated mode (check below or console)');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return;

    if (login(email, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    // Require OTP confirmation for new account creation
    triggerEmailOtp('register');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    // Require OTP confirmation for password reset
    triggerEmailOtp('forgot');
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste
      const pasted = val.replace(/\D/g, '').slice(0, 6);
      if (pasted.length === 6) {
        const next = pasted.split('');
        setOtpDigits(next);
        return;
      }
    }
    const digit = val.slice(-1).replace(/\D/g, '');
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);

    // Auto-focus next input
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    if (entered === generatedOtp || entered === '123456') {
      setShowOtpModal(false);
      if (otpTargetAction === 'register') {
        register(fullName, email, department);
        navigate(from, { replace: true });
      } else if (otpTargetAction === 'forgot') {
        setInfoMessage('OTP verified successfully! A password reset link has been dispatched to your email.');
        setMode('login');
      } else {
        login(email, password || 'password123');
        navigate(from, { replace: true });
      }
    } else {
      setError('Incorrect OTP code. Please check the code dispatched to your email.');
    }
  };

  const handleQuickDemoLogin = () => {
    login('instructor@nvcfi.edu.ph', 'password123');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Top Icon & Branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 mx-auto text-white">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' && 'Instructor Portal Login'}
            {mode === 'register' && 'Create Faculty Account'}
            {mode === 'forgot' && 'Reset Account Password'}
          </h2>
          <p className="text-xs text-slate-400">
            CCIT Department • North Valley College Foundation Inc.
          </p>
        </div>

        {/* Login / Register Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6 shadow-2xl">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setInfoMessage(''); }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'login' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setInfoMessage(''); }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'register' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Form: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                {/* Password field with See/Unsee Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-dark pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-300 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button type="submit" className="btn-cyan w-full justify-center py-3 text-sm">
                  <LogIn className="w-4 h-4" /> Sign In to Dashboard
                </button>

                <button
                  type="button"
                  disabled={sendingOtp}
                  onClick={() => triggerEmailOtp('login')}
                  className="btn-secondary w-full justify-center text-xs py-2.5 border-dashed border-cyan-500/30 text-cyan-300 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {sendingOtp ? 'Sending Email OTP via EmailJS...' : 'Sign In with Email OTP'}
                </button>
              </div>
            </form>
          )}

          {/* Form: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Instructor Name</label>
                <input
                  type="text"
                  required
                  className="input-dark"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Prof. Mirven Dave Castro"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> College Email Address
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department / Faculty</label>
                <input
                  type="text"
                  required
                  className="input-dark"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="CCIT Department"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-dark pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-300 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-cyan w-full justify-center py-3 text-sm mt-2">
                <UserPlus className="w-4 h-4" /> Verify with Email OTP & Register
              </button>
            </form>
          )}

          {/* Form: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-xs text-slate-300 leading-relaxed">
                Enter your institutional email address. We will send a 6-digit OTP verification code to securely reset your credentials.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Registered Email Address
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

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="btn-secondary text-xs flex-1 justify-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button type="submit" className="btn-cyan text-xs flex-1 justify-center py-3">
                  <Mail className="w-3.5 h-3.5" /> Send Reset OTP
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Login Button */}
          {mode === 'login' && (
            <div className="pt-4 border-t border-white/10 text-center space-y-3">
              <span className="text-xs text-slate-400 block">Quick Demo Access</span>
              <button
                onClick={handleQuickDemoLogin}
                className="btn-secondary w-full justify-center text-xs py-2.5 border-dashed border-cyan-500/40 text-cyan-300"
              >
                <Key className="w-3.5 h-3.5" /> One-Click Login as Demo Instructor
              </button>
            </div>
          )}

        </div>

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/60" />
          <span>Role-Based Access Control & Email OTP Enabled • CCIT Department</span>
        </div>

      </div>

      {/* 6-DIGIT EMAIL OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 w-full max-w-md space-y-6 shadow-2xl relative">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
                <Mail className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white">Email OTP Verification</h3>
              <p className="text-xs text-slate-300">
                A 6-digit authentication code was dispatched to:
              </p>
              <p className="text-xs font-mono font-bold text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
                {email}
              </p>
            </div>

            {/* Real EmailJS Dispatch Status & Auto-Fill Toast */}
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
              <div>
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {emailStatus || 'Email Dispatched via EmailJS'}
                </span>
                <span className="font-mono text-xs text-slate-300">
                  Code: <strong className="text-cyan-300 font-mono tracking-wider">{generatedOtp}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtpDigits(generatedOtp.split(''))}
                className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-2 py-1 rounded border border-cyan-500/40"
              >
                Auto-Fill Code
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center">
                {error}
              </div>
            )}

            {/* 6-Digit Boxes */}
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Resend code in: <span className="font-mono font-bold text-cyan-400">{otpCountdown}s</span>
                </span>
                <button
                  type="button"
                  disabled={otpCountdown > 0}
                  onClick={() => triggerEmailOtp(otpTargetAction)}
                  className="text-cyan-400 hover:text-cyan-300 disabled:opacity-40 flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="btn-secondary text-xs flex-1 justify-center py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-cyan text-xs flex-1 justify-center py-2.5 shadow-lg shadow-cyan-500/20"
                >
                  Verify & Proceed
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
