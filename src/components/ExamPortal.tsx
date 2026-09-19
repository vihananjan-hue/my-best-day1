import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Calculator,
  Atom,
} from 'lucide-react';
import { MCQQuestion, SubjectCategory, Student } from '../types';
import { MathRenderer } from './MathRenderer';
import { NvsLogo } from './NvsLogo';

interface ExamPortalProps {
  questions: MCQQuestion[];
  student: Student;
  startTime: number; // Epoch time in ms
  onSubmitExam: (answers: Record<number, number>, timeTakenSeconds: number) => void;
}

export const ExamPortal: React.FC<ExamPortalProps> = ({
  questions,
  student,
  startTime,
  onSubmitExam,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    // Attempt load saved answers from localStorage for anti-cheat/refresh survival
    const saved = localStorage.getItem(`jnv_answers_${student.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [flagged, setFlagged] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem(`jnv_flagged_${student.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [activeSubjectTab, setActiveSubjectTab] = useState<SubjectCategory>('Math');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Unstoppable Timer Logic: Calculates remaining time based on absolute startTime
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return Math.max(0, 3600 - elapsed);
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Interval ticker
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 3600 - elapsed);
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Auto-submit exam when timer reaches 0
        handleSubmitFinal(3600);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime]);

  // Sync answers & flagged to localStorage
  useEffect(() => {
    localStorage.setItem(`jnv_answers_${student.id}`, JSON.stringify(answers));
  }, [answers, student.id]);

  useEffect(() => {
    localStorage.setItem(`jnv_flagged_${student.id}`, JSON.stringify(flagged));
  }, [flagged, student.id]);

  const currentQuestion = questions[currentQuestionIndex];

  // Subject question ranges
  const mathQuestions = questions.filter((q) => q.subject === 'Math');
  const scienceQuestions = questions.filter((q) => q.subject === 'Science');
  const englishQuestions = questions.filter((q) => q.subject === 'English');

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleSubjectTabChange = (subject: SubjectCategory) => {
    setActiveSubjectTab(subject);
    const firstInSubjectIndex = questions.findIndex((q) => q.subject === subject);
    if (firstInSubjectIndex !== -1) {
      setCurrentQuestionIndex(firstInSubjectIndex);
    }
  };

  const handleSubmitFinal = (overrideTimeSeconds?: number) => {
    const elapsed = overrideTimeSeconds ?? Math.min(3600, Math.floor((Date.now() - startTime) / 1000));
    // Clear localStorage for this session
    localStorage.removeItem(`jnv_answers_${student.id}`);
    localStorage.removeItem(`jnv_flagged_${student.id}`);
    onSubmitExam(answers, elapsed);
  };

  // Format time display HH:MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  const answeredCount = Object.keys(answers).length;
  const isWarningTime = remainingSeconds <= 300 && remainingSeconds > 0; // <= 5 minutes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Bar with Unstoppable Anti-Cheat Timer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <NvsLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                JNV Best Day Test Portal
              </span>
              <span className="text-xs text-slate-400">Class {student.classSection} • {student.house} House</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1">
              Student: {student.name} (Roll #{student.rollNo})
            </h2>
          </div>
        </div>

        {/* Unstoppable Anti-Cheat Timer Display */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border ${
            isWarningTime
              ? 'bg-red-500/20 border-red-500 text-red-300 animate-timer-warning'
              : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
          }`}>
            <Clock className={`w-6 h-6 ${isWarningTime ? 'text-red-400 animate-spin' : 'text-amber-400'}`} />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Unstoppable Anti-Cheat Timer
              </div>
              <div className="text-2xl font-black font-mono tracking-wider">
                {formatTime(remainingSeconds)}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Submit Exam</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Subject Tabs + Question View (Left/Top) & Question Navigator Palette (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Question Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section Tabs: Math, Science, English */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleSubjectTabChange('Math')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeSubjectTab === 'Math'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Math (Q1 - 20)</span>
            </button>

            <button
              onClick={() => handleSubjectTabChange('Science')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeSubjectTab === 'Science'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>Science (Q21 - 40)</span>
            </button>

            <button
              onClick={() => handleSubjectTabChange('English')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeSubjectTab === 'English'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>English (Q41 - 60)</span>
            </button>
          </div>

          {/* Current Question Card */}
          {currentQuestion && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-amber-400 font-black text-sm flex items-center justify-center">
                    Q{currentQuestion.id}
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Section: {currentQuestion.subject}
                    </span>
                    <div className="text-xs text-slate-400">Select one option</div>
                  </div>
                </div>

                <button
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    flagged[currentQuestion.id]
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${flagged[currentQuestion.id] ? 'fill-amber-500' : ''}`} />
                  <span>{flagged[currentQuestion.id] ? 'Flagged for Review' : 'Mark Review'}</span>
                </button>
              </div>

              {/* Question Text with KaTeX Support */}
              <div className="text-slate-900 dark:text-white text-base sm:text-lg font-bold leading-relaxed">
                <MathRenderer text={currentQuestion.questionText} />
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((optionText, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;
                  const optionLabel = ['A', 'B', 'C', 'D'][optIdx];

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all ${
                        isSelected
                          ? 'bg-indigo-600/10 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/20 text-slate-900 dark:text-white font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {optionLabel}
                      </span>
                      <div className="text-sm sm:text-base flex-1">
                        <MathRenderer text={optionText} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      const newIdx = currentQuestionIndex - 1;
                      setCurrentQuestionIndex(newIdx);
                      setActiveSubjectTab(questions[newIdx].subject);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                      const newIdx = currentQuestionIndex + 1;
                      setCurrentQuestionIndex(newIdx);
                      setActiveSubjectTab(questions[newIdx].subject);
                    }
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Question Palette & Progress Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Question Palette (60 MCQs)
              </h3>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                {answeredCount} / 60 Answered
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" /> Flagged
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600" /> Current
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" /> Unanswered
              </div>
            </div>

            {/* Question Grid 1 to 60 */}
            <div className="grid grid-cols-6 gap-2 pt-2 max-h-80 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged[q.id];
                const isCurrent = idx === currentQuestionIndex;

                let btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

                if (isCurrent) {
                  btnStyle = 'bg-indigo-600 text-white font-black ring-2 ring-indigo-400 border-indigo-600';
                } else if (isFlagged) {
                  btnStyle = 'bg-amber-500 text-slate-950 font-black border-amber-400';
                } else if (isAnswered) {
                  btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-500';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setActiveSubjectTab(q.subject);
                    }}
                    className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all hover:scale-105 ${btnStyle}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Complete Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="w-7 h-7" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Submit Exam Confirmation
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to finish and submit your test now?
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <strong className="text-slate-900 dark:text-white">60 MCQs</strong>
              </div>
              <div className="flex justify-between">
                <span>Answered:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{answeredCount} Questions</strong>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <strong className="text-amber-600 dark:text-amber-400">{60 - answeredCount} Questions</strong>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{formatTime(remainingSeconds)}</strong>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Return to Test
              </button>
              <button
                onClick={() => handleSubmitFinal()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
