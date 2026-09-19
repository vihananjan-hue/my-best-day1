import React from 'react';
import { Award, LogOut, Sun, Moon, ShieldCheck, UserCheck, BookOpen } from 'lucide-react';
import { HouseName } from '../types';
import { NvsLogo } from './NvsLogo';

interface NavbarProps {
  userRole: 'teacher' | 'student' | null;
  userData: any;
  currentView: 'dashboard' | 'exam' | 'leaderboards' | 'teacher';
  onNavigate: (view: 'dashboard' | 'exam' | 'leaderboards' | 'teacher') => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const houseColorMap: Record<HouseName, { bg: string; text: string; border: string }> = {
  Aravali: { bg: 'bg-red-500/15', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30' },
  Nilgiri: { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  Shivalik: { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
  Udaygiri: { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
};

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  userData,
  currentView,
  onNavigate,
  onLogout,
  isDarkMode,
  onToggleTheme,
}) => {
  const houseStyle = userData?.house ? houseColorMap[userData.house as HouseName] : null;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Header Title */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="group-hover:scale-105 transition-transform">
            <NvsLogo size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                JNV Junagadh
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full">
                JNV Best Day
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block font-medium">
              Navodaya Vidyalaya Samiti
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Leaderboards Button */}
          <button
            onClick={() => onNavigate('leaderboards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              currentView === 'leaderboards'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Leaderboards</span>
          </button>

          {/* Teacher Panel Button */}
          {userRole === 'teacher' && (
            <button
              onClick={() => onNavigate('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'teacher'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 hover:bg-purple-500/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Staff Panel</span>
            </button>
          )}

          {/* Student Badge */}
          {userRole === 'student' && userData && (
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {userData.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Class {userData.classSection} • Roll {userData.rollNo}
                </div>
              </div>
              {houseStyle && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${houseStyle.bg} ${houseStyle.text} ${houseStyle.border}`}>
                  {userData.house}
                </span>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Logout Button */}
          {userRole && (
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
