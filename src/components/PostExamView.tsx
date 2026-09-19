import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle2, XCircle, ArrowRight, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Student, MCQQuestion } from '../types';
import { MathRenderer } from './MathRenderer';
import { NvsLogo } from './NvsLogo';

interface PostExamViewProps {
  student: Student;
  questions: MCQQuestion[];
  scores: {
    math: number;
    science: number;
    english: number;
    total: number;
  };
  timeTakenSeconds?: number;
  onGoToLeaderboards: () => void;
  onReturnHome: () => void;
}

export const PostExamView: React.FC<PostExamViewProps> = ({
  student,
  questions,
  scores,
  timeTakenSeconds = 3600,
  onGoToLeaderboards,
  onReturnHome,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const percentage = Math.round((scores.total / 60) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Celebration Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/40 p-8 sm:p-10 text-white shadow-2xl text-center space-y-4">
        <div className="flex justify-center mb-2">
          <NvsLogo size="lg" />
        </div>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-widest">
            Monthly Contest Completed
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3">
            Awesome Job, {student.name}!
          </h2>
          {/* Dynamic Contribution Prompt */}
          <div className="mt-4 inline-block px-6 py-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm sm:text-base font-extrabold shadow-lg">
            🎉 You added <span className="text-amber-400 text-lg">+{scores.total} marks</span> to <span className="text-white">{student.house} House</span> and <span className="text-white">Class {student.classSection}</span>!
          </div>
        </div>

        {/* Big Score Summary Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-xs text-slate-400 font-medium">Total Score</div>
            <div className="text-2xl font-black text-amber-400">{scores.total} / 60</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-xs text-slate-400 font-medium">Accuracy</div>
            <div className="text-2xl font-black text-emerald-400">{percentage}%</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-xs text-slate-400 font-medium">Time Taken</div>
            <div className="text-2xl font-black text-indigo-300">{formatTime(timeTakenSeconds)}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-xs text-slate-400 font-medium">House Contributed</div>
            <div className="text-2xl font-black text-white">{student.house}</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={onGoToLeaderboards}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Trophy className="w-4 h-4" />
            <span>Check Master Leaderboards</span>
          </button>

          <button
            onClick={onReturnHome}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700"
          >
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Section Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center space-y-2">
          <div className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
            Section 1: Mathematics
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {scores.math} / 20
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Algebra, Geometry & Arithmetic</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center space-y-2">
          <div className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
            Section 2: Science
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {scores.science} / 20
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Physics, Chemistry & Biology</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center space-y-2">
          <div className="text-xs font-extrabold uppercase text-purple-600 dark:text-purple-400">
            Section 3: English
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {scores.english} / 20
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Grammar, Vocabulary & Reading</p>
        </div>
      </div>

      {/* Question Bank & Answer Explanations */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Answer Key & Explanations (60 Questions)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review solutions and explanations for all 60 test questions
            </p>
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400">
                  Q{q.id} • [{q.subject}]
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Correct Option: {['A', 'B', 'C', 'D'][q.correctOptionIndex]}
                </span>
              </div>

              <div className="font-bold text-slate-900 dark:text-white">
                <MathRenderer text={q.questionText} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className={`p-2 rounded-lg border ${
                      optIdx === q.correctOptionIndex
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {['A', 'B', 'C', 'D'][optIdx]}. <MathRenderer text={opt} />
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                <strong className="text-amber-600 dark:text-amber-400">Explanation: </strong>
                <MathRenderer text={q.explanation} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
