import React, { useMemo } from 'react';
import { Trophy, Award, Crown, Sparkles, Users, Layers, TrendingUp, Flame } from 'lucide-react';
import { Student, HouseName, ClassSection, HouseStats, ClassStats } from '../types';
import { NvsLogo } from './NvsLogo';

interface LeaderboardsProps {
  students: Student[];
  onStartExamClick?: () => void;
  currentUser?: Student | null;
}

const HOUSES: HouseName[] = ['Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri'];
const CLASS_SECTIONS: ClassSection[] = ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'];

const HOUSE_THEMES: Record<HouseName, { color: string; bg: string; text: string; border: string; bar: string; gradient: string }> = {
  Aravali: {
    color: '#3B82F6',
    bg: 'bg-blue-500/10 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    bar: 'bg-gradient-to-r from-blue-600 to-sky-500',
    gradient: 'from-blue-600 via-indigo-600 to-sky-500',
  },
  Nilgiri: {
    color: '#10B981',
    bg: 'bg-emerald-500/10 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    bar: 'bg-gradient-to-r from-emerald-600 to-teal-500',
    gradient: 'from-emerald-600 via-teal-500 to-green-500',
  },
  Shivalik: {
    color: '#EF4444',
    bg: 'bg-red-500/10 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/30',
    bar: 'bg-gradient-to-r from-red-600 to-rose-500',
    gradient: 'from-red-600 via-rose-500 to-pink-600',
  },
  Udaygiri: {
    color: '#F59E0B',
    bg: 'bg-amber-500/10 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    bar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    gradient: 'from-amber-500 via-yellow-500 to-orange-500',
  },
};

export const Leaderboards: React.FC<LeaderboardsProps> = ({
  students,
  onStartExamClick,
  currentUser,
}) => {
  // Compute House Stats
  const houseStats: HouseStats[] = useMemo(() => {
    const rawMap: Record<HouseName, { totalScore: number; studentCount: number }> = {
      Aravali: { totalScore: 0, studentCount: 0 },
      Nilgiri: { totalScore: 0, studentCount: 0 },
      Shivalik: { totalScore: 0, studentCount: 0 },
      Udaygiri: { totalScore: 0, studentCount: 0 },
    };

    students.forEach((s) => {
      if (s.hasTakenExam) {
        rawMap[s.house].totalScore += s.totalScore;
        rawMap[s.house].studentCount += 1;
      }
    });

    const maxScore = Math.max(...HOUSES.map((h) => rawMap[h].totalScore));

    return HOUSES.map((h) => {
      const total = rawMap[h].totalScore;
      const count = rawMap[h].studentCount;
      return {
        house: h,
        totalScore: total,
        studentCount: count,
        avgScore: count > 0 ? Math.round((total / count) * 10) / 10 : 0,
        isWinning: maxScore > 0 && total === maxScore,
        colorHex: HOUSE_THEMES[h].color,
        bgGradient: HOUSE_THEMES[h].gradient,
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [students]);

  // Compute Class Stats (6A to 9B)
  const classStats: ClassStats[] = useMemo(() => {
    const rawMap: Record<ClassSection, { totalScore: number; studentCount: number }> = {
      '6A': { totalScore: 0, studentCount: 0 },
      '6B': { totalScore: 0, studentCount: 0 },
      '7A': { totalScore: 0, studentCount: 0 },
      '7B': { totalScore: 0, studentCount: 0 },
      '8A': { totalScore: 0, studentCount: 0 },
      '8B': { totalScore: 0, studentCount: 0 },
      '9A': { totalScore: 0, studentCount: 0 },
      '9B': { totalScore: 0, studentCount: 0 },
    };

    students.forEach((s) => {
      if (s.hasTakenExam && rawMap[s.classSection]) {
        rawMap[s.classSection].totalScore += s.totalScore;
        rawMap[s.classSection].studentCount += 1;
      }
    });

    const maxScore = Math.max(...CLASS_SECTIONS.map((c) => rawMap[c].totalScore));

    return CLASS_SECTIONS.map((c) => {
      const total = rawMap[c].totalScore;
      const count = rawMap[c].studentCount;
      return {
        classSection: c,
        totalScore: total,
        studentCount: count,
        avgScore: count > 0 ? Math.round((total / count) * 10) / 10 : 0,
        isWinning: maxScore > 0 && total === maxScore,
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [students]);

  // Top Individual Performers
  const topStudents = useMemo(() => {
    return [...students]
      .filter((s) => s.hasTakenExam)
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return (a.timeTakenSeconds || 3600) - (b.timeTakenSeconds || 3600);
      });
  }, [students]);

  const maxHouseScore = Math.max(...houseStats.map((h) => h.totalScore), 1);
  const maxClassScore = Math.max(...classStats.map((c) => c.totalScore), 1);

  const winningHouse = houseStats.find((h) => h.isWinning);
  const winningClass = classStats.find((c) => c.isWinning);

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <NvsLogo size="sm" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> JNV Junagadh Champions Standings
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Master Scoreboard & House Cup
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Every mark scored by a student feeds directly into both their House Pool and Class Section Pool. Active classes: 6th, 7th, 8th & 9th (A & B Sections).
            </p>
          </div>

          {currentUser && !currentUser.hasTakenExam && onStartExamClick && (
            <button
              onClick={onStartExamClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Flame className="w-5 h-5 text-slate-950 fill-slate-950" />
              Take Test & Add Points
            </button>
          )}
        </div>
      </div>

      {/* Winner Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Winning House Card */}
        {winningHouse && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-amber-500/40 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Crown className="w-7 h-7 animate-bounce" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                    LEADING HOUSE
                  </span>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    {winningHouse.house} House
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-amber-400">
                  {winningHouse.totalScore}
                </div>
                <div className="text-xs text-slate-400 font-medium">Total Marks</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-300">
              <span>Avg Score: <strong className="text-white">{winningHouse.avgScore}</strong> / 60</span>
              <span>Participants: <strong className="text-white">{winningHouse.studentCount}</strong> Students</span>
            </div>
          </div>
        )}

        {/* Winning Class Card */}
        {winningClass && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/40 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                    LEADING CLASS SECTION
                  </span>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    Class {winningClass.classSection}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">
                  {winningClass.totalScore}
                </div>
                <div className="text-xs text-slate-400 font-medium">Total Marks</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-300">
              <span>Avg Score: <strong className="text-white">{winningClass.avgScore}</strong> / 60</span>
              <span>Participants: <strong className="text-white">{winningClass.studentCount}</strong> Students</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: House Leaderboard & Class Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* House Leaderboard */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  House Pool Leaderboard
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aravali, Nilgiri, Shivalik, Udaygiri Total Scores
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              4 Houses
            </span>
          </div>

          <div className="space-y-4">
            {houseStats.map((h, index) => {
              const theme = HOUSE_THEMES[h.house];
              const pct = Math.round((h.totalScore / maxHouseScore) * 100);

              return (
                <div
                  key={h.house}
                  className={`p-4 rounded-xl border transition-all ${
                    h.isWinning
                      ? `${theme.bg} ${theme.border} shadow-sm ring-1 ring-amber-500/30`
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-slate-400 dark:text-slate-500 w-5">
                        #{index + 1}
                      </span>
                      <span className={`text-base font-black ${theme.text}`}>
                        {h.house} House
                      </span>
                      {h.isWinning && (
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 rounded-md flex items-center gap-1 shadow-sm">
                          <Crown className="w-3 h-3" /> WINNER
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {h.totalScore}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        pts
                      </span>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${theme.bar}`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span>{h.studentCount} Students Submitted</span>
                    <span>Avg: {h.avgScore} / 60</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Class Leaderboard */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Class Section Leaderboard
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Classes 6A through 9B Standings
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              8 Sections
            </span>
          </div>

          <div className="space-y-3">
            {classStats.map((c, index) => {
              const pct = Math.round((c.totalScore / maxClassScore) * 100);

              return (
                <div
                  key={c.classSection}
                  className={`p-3.5 rounded-xl border transition-all ${
                    c.isWinning
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-xs text-slate-400 w-4">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        Class {c.classSection}
                      </span>
                      {c.isWinning && (
                        <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white rounded">
                          WINNER
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {c.totalScore}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">pts</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{c.studentCount} Students</span>
                    <span>Avg: {c.avgScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Individual Student Champions Roster */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Individual Student Rankers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top Scorers in JNV Best Day Monthly Competition
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Submissions: <strong className="text-slate-900 dark:text-white">{topStudents.length}</strong>
          </div>
        </div>

        {topStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm">No exam submissions yet for this monthly cycle.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Rank</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Class</th>
                  <th className="pb-3">House</th>
                  <th className="pb-3 text-center">Math</th>
                  <th className="pb-3 text-center">Science</th>
                  <th className="pb-3 text-center">English</th>
                  <th className="pb-3 text-right pr-2">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {topStudents.map((s, index) => {
                  const theme = HOUSE_THEMES[s.house];
                  const isTop3 = index < 3;

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        currentUser?.id === s.id ? 'bg-amber-500/10 dark:bg-amber-950/20 font-bold' : ''
                      }`}
                    >
                      <td className="py-3.5 pl-2 font-black">
                        {index === 0 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">🥇</span>}
                        {index === 1 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs shadow">🥈</span>}
                        {index === 2 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs shadow">🥉</span>}
                        {index > 2 && <span className="text-slate-400 dark:text-slate-500 pl-2">#{index + 1}</span>}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{s.name}</span>
                          {currentUser?.id === s.id && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-indigo-600 text-white rounded">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300">
                        Class {s.classSection}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${theme.bg} ${theme.text} ${theme.border}`}>
                          {s.house}
                        </span>
                      </td>
                      <td className="py-3.5 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                        {s.mathScore} / 20
                      </td>
                      <td className="py-3.5 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {s.scienceScore} / 20
                      </td>
                      <td className="py-3.5 text-center font-semibold text-purple-600 dark:text-purple-400">
                        {s.englishScore} / 20
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {s.totalScore}
                        </span>
                        <span className="text-xs text-slate-400 font-normal"> / 60</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
