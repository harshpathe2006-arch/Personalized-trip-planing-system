import React, { useState } from 'react';
import {
  Compass,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { AuthService } from '../services/authService';
import { DEMO_USER } from '../services/storageService';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
  onNavigateToHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address format (e.g. name@example.com).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = AuthService.login(email, password);
      setIsLoading(false);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 250);
  };

  const handleQuickDemoLogin = () => {
    setEmail(DEMO_USER.email);
    setPassword('Password@123');
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const res = AuthService.login(DEMO_USER.email, 'Password@123');
      setIsLoading(false);
      if (res.success) {
        onSuccess();
      }
    }, 200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotPassword(false);
      setForgotEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 sm:p-8 animate-in fade-in duration-200">
        {/* Return to Home link */}
        {onNavigateToHome && (
          <button
            type="button"
            onClick={onNavigateToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#183153] mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-lg bg-[#183153] items-center justify-center text-white mb-3 shadow-xs">
            <Compass className="w-6 h-6 text-teal-300" />
          </div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            Personalized Trip Planning System • Information Technology Mini-Project
          </p>
        </div>

        {/* Quick Demo Login Preset Banner */}
        <div className="mb-6 p-3.5 bg-teal-50/80 border border-teal-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
              <span className="text-xs font-semibold text-[#0F766E]">
                Quick Demo Credentials
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-bold text-[#0F766E] hover:text-[#0c625c] underline"
            >
              Autofill & Sign In
            </button>
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5">
            Test account: <code className="font-mono text-slate-800 font-semibold">{DEMO_USER.email}</code> • password: <code className="font-mono text-slate-800 font-semibold">Password@123</code>
          </p>
        </div>

        {/* Authentication Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#1F2937]">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[11px] font-medium text-[#0F766E] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter account password"
                className="w-full pl-9 pr-10 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 focus:outline-hidden"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#64748B]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#E2E8F0] text-[#0F766E] focus:ring-[#0F766E]"
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#183153] hover:bg-[#12243d] text-white py-2.5 rounded-md font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating credentials...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Registration */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
          Do not have an account yet?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-[#0F766E] font-bold hover:underline"
          >
            Register new account
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-lg shadow-xl border border-[#E2E8F0] max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0F766E]" />
                <h3 className="text-base font-bold text-[#183153]">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-md border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password reset token generated. Use default Password@123.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-3">
                <p className="text-xs text-[#64748B]">
                  Enter your registered email address to receive password reset instructions.
                </p>
                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3 py-1.5 text-xs text-[#64748B] hover:bg-slate-50 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs bg-[#183153] text-white font-semibold rounded-md hover:bg-[#12243d]"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
