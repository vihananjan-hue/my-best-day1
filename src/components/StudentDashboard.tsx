import React from 'react';
import { Play, Trophy, Clock, CheckCircle2, ShieldCheck, HelpCircle, Flame, Layers, Award, Sparkles } from 'lucide-react';
import { Student, HouseName } from '../types';
import { NvsLogo } from './NvsLogo';

interface StudentDashboardProps {
  student: Student;
  onStartExam: () => void;
  onViewLeaderboards: () => void;
  onViewResults?: () => void;
}

const houseColorMap: Record<HouseName, { bg: string; text: string; border: string; gradient: string }> = {
  Aravali: { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30', gradient: 'from-blue-600 to-indigo-700' },
  Nilgiri: { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', gradient: 'from-emerald-600 to-teal-700' },
  Shivalik: { bg: 'bg-red-500/15', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30', gradient: 'from-red-600 to-rose-700' },
  Udaygiri: { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', gradient: 'from-amber-500 to-yellow-600' },
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onStartExam,
  onViewLeaderboards,
  onViewResults,
}) => {
  const houseStyle = houseColorMap[student.house];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 text-white shadow-2xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <NvsLogo size="sm" />
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                JNV Junagadh Student Hub
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${houseStyle.bg} ${houseStyle.text} ${houseStyle.border}`}>
                {student.house} House
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold">
                Class {student.classSection}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome, {student.name}!
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Roll No: <strong>{student.rollNo}</strong> • Representing Class <strong>{student.classSection}</strong> & <strong>{student.house} House</strong> in the JNV Best Day Monthly Competition!
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl min-w-[200px] text-center shadow-lg">
            <div className="text-xs text-slate-400 font-bold uppercase">My Test Score</div>
            <div className="text-3xl font-black text-amber-400 mt-1">
              {student.hasTakenExam ? `${student.totalScore} / 60` : 'Not Taken'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {student.hasTakenExam ? 'Exam Completed' : 'Pending Submission'}
            </div>
          </div>
        </div>
      </div>

      {/* Exam Status & Start CTA Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              ACTIVE MONTHLY TEST
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              JNV Best Day Monthly Championship
            </h3>
          </div>

          <div>
            {student.hasTakenExam ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <Flame className="w-5 h-5 text-amber-500" />
                Live & Active
              </span>
            )}
          </div>
        </div>

        {/* Test Rules & Format Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Clock className="w-4 h-4" /> Unstoppable Timer
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Strict <strong>60-Minute Countdown</strong>. Time keeps ticking continuously even if you close or refresh!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" /> 60 MCQs Split
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              20 Math, 20 Science, and 20 English Multiple Choice Questions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" /> Dual Impact
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your score adds points directly to <strong>{student.house} House</strong> & <strong>Class {student.classSection}</strong>!
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-4">
          {!student.hasTakenExam ? (
            <button
              onClick={onStartExam}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6 fill-slate-950" />
              <span>Start 60-Minute Exam Now</span>
            </button>
          ) : (
            <div className="flex-1 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">You have submitted your exam!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Score: {student.totalScore} / 60 Marks</p>
              </div>
              {onViewResults && (
                <button
                  onClick={onViewResults}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow"
                >
                  View Score & Answer Key
                </button>
              )}
            </div>
          )}

          <button
            onClick={onViewLeaderboards}
            className="py-4 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Master Leaderboards</span>
          </button>
        </div>
      </div>
    </div>
  );
};
