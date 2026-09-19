import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Key, Lock, ArrowRight, Sparkles, School } from 'lucide-react';
import { NvsLogo } from './NvsLogo';

interface AuthModalProps {
  onLoginSuccess: (role: 'teacher' | 'student', userData: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        onLoginSuccess(data.role, data.user);
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <NvsLogo size="2xl" interactiveUpload={true} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
            JNV Junagadh • JNV Best Day
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Navodaya Vidyalaya Samiti Monthly Testing Portal
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'student'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'teacher'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Staff Admin Login</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {activeTab === 'teacher' ? 'Teacher ID / Staff ID' : 'Student User ID'}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder={activeTab === 'teacher' ? 'Enter Staff ID' : 'e.g. JNV6A01'}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 ${
              activeTab === 'teacher'
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <span>{isLoading ? 'Logging in...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
