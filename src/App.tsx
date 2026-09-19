import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Leaderboards } from './components/Leaderboards';
import { ExamPortal } from './components/ExamPortal';
import { PostExamView } from './components/PostExamView';
import { AuthModal } from './components/AuthModal';
import { Student, MCQQuestion } from './types';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'exam' | 'leaderboards' | 'teacher' | 'post-exam'>('dashboard');

  const [students, setStudents] = useState<Student[]>([]);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [lastSubmittedScores, setLastSubmittedScores] = useState<{ math: number; science: number; english: number; total: number } | null>(null);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch initial data
  useEffect(() => {
    fetchStudents();
    fetchQuestions();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (e) {
      console.error('Failed to fetch students:', e);
    }
  };

  const fetchQuestions = async (classSection?: string) => {
    try {
      const url = classSection ? `/api/questions?classSection=${classSection}` : '/api/questions';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (e) {
      console.error('Failed to fetch questions:', e);
    }
  };

  const handleLoginSuccess = (role: 'teacher' | 'student', user: any) => {
    setUserRole(role);
    setUserData(user);
    if (role === 'teacher') {
      setCurrentView('teacher');
    } else {
      fetchQuestions(user.classSection);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
    setCurrentView('dashboard');
  };

  // Start Exam Handler
  const handleStartExam = async () => {
    if (!userData || userRole !== 'student') return;

    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: userData.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setExamStartTime(data.startTime);
        setCurrentView('exam');
      }
    } catch (e) {
      console.error('Failed to start exam session:', e);
    }
  };

  // Submit Exam Handler
  const handleSubmitExam = async (answers: Record<number, number>, timeTakenSeconds: number) => {
    if (!userData || userRole !== 'student') return;

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: userData.id,
          answers,
          timeTakenSeconds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data.student);
        setLastSubmittedScores(data.scores);
        await fetchStudents();
        setCurrentView('post-exam');
      }
    } catch (e) {
      console.error('Failed to submit exam:', e);
    }
  };

  // Teacher Action: Create Student
  const handleCreateStudent = async (newStudentData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentData),
      });

      if (res.ok) {
        await fetchStudents();
        return true;
      }
    } catch (e) {
      console.error('Failed to create student:', e);
    }
    return false;
  };

  // Teacher Action: Delete Student
  const handleDeleteStudent = async (studentId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchStudents();
        return true;
      }
    } catch (e) {
      console.error('Failed to delete student:', e);
    }
    return false;
  };

  // Teacher Action: Update Full Student Profile or Score
  const handleUpdateStudent = async (studentId: string, updatedData: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        await fetchStudents();
        return true;
      }
    } catch (e) {
      console.error('Failed to update student:', e);
    }
    return false;
  };

  // Teacher Action: Update Student Score (backward compatibility)
  const handleUpdateScore = async (
    studentId: string,
    math: number,
    science: number,
    english: number,
    hasTakenExam: boolean
  ): Promise<boolean> => {
    return handleUpdateStudent(studentId, {
      mathScore: math,
      scienceScore: science,
      englishScore: english,
      hasTakenExam,
    });
  };

  // Teacher Action: Set Questions Standard-Wise
  const handleSetClassQuestions = async (classStandard: string, questionsList: MCQQuestion[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/questions/set-class-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classStandard, questions: questionsList }),
      });

      if (res.ok) {
        await fetchQuestions();
        return true;
      }
    } catch (e) {
      console.error('Failed to set class questions:', e);
    }
    return false;
  };

  // Teacher Action: Delete Single Question
  const handleDeleteQuestion = async (questionId: number, classStandard?: string): Promise<boolean> => {
    try {
      const url = classStandard
        ? `/api/questions/${questionId}?classStandard=${classStandard}`
        : `/api/questions/${questionId}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        await fetchQuestions();
        return true;
      }
    } catch (e) {
      console.error('Failed to delete question:', e);
    }
    return false;
  };

  // Teacher Action: Clear All Questions for Class Standard
  const handleClearClassQuestions = async (classStandard: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/questions/class/${classStandard}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchQuestions();
        return true;
      }
    } catch (e) {
      console.error('Failed to clear class questions:', e);
    }
    return false;
  };

  // Teacher Action: Bulk Upload Students
  const handleBulkUploadStudents = async (studentsList: any[], replaceAll = false): Promise<boolean> => {
    try {
      const res = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: studentsList, replaceAll }),
      });

      if (res.ok) {
        await fetchStudents();
        return true;
      }
    } catch (e) {
      console.error('Failed to bulk upload students:', e);
    }
    return false;
  };

  // Teacher Action: Clear All Students
  const handleClearAllStudents = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/students/clear-all', { method: 'POST' });
      if (res.ok) {
        await fetchStudents();
        return true;
      }
    } catch (e) {
      console.error('Failed to clear all students:', e);
    }
    return false;
  };

  // Teacher Action: Reset Monthly Contest
  const handleResetMonthlyContest = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/exam/reset-month', { method: 'POST' });
      if (res.ok) {
        await fetchStudents();
        if (userData && userRole === 'student') {
          setUserData((prev: any) => ({
            ...prev,
            hasTakenExam: false,
            mathScore: 0,
            scienceScore: 0,
            englishScore: 0,
            totalScore: 0,
          }));
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to reset monthly contest:', e);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar
        userRole={userRole}
        userData={userData}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="pb-12">
        {!userRole ? (
          <AuthModal onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {currentView === 'dashboard' && userRole === 'student' && (
              <StudentDashboard
                student={userData}
                onStartExam={handleStartExam}
                onViewLeaderboards={() => setCurrentView('leaderboards')}
                onViewResults={() => setCurrentView('post-exam')}
              />
            )}

            {currentView === 'dashboard' && userRole === 'teacher' && (
              <TeacherDashboard
                students={students}
                questions={questions}
                onCreateStudent={handleCreateStudent}
                onDeleteStudent={handleDeleteStudent}
                onUpdateStudent={handleUpdateStudent}
                onUpdateScore={handleUpdateScore}
                onSetClassQuestions={handleSetClassQuestions}
                onDeleteQuestion={handleDeleteQuestion}
                onClearClassQuestions={handleClearClassQuestions}
                onBulkUploadStudents={handleBulkUploadStudents}
                onClearAllStudents={handleClearAllStudents}
                onResetMonthlyContest={handleResetMonthlyContest}
              />
            )}

            {currentView === 'teacher' && userRole === 'teacher' && (
              <TeacherDashboard
                students={students}
                questions={questions}
                onCreateStudent={handleCreateStudent}
                onDeleteStudent={handleDeleteStudent}
                onUpdateStudent={handleUpdateStudent}
                onUpdateScore={handleUpdateScore}
                onSetClassQuestions={handleSetClassQuestions}
                onDeleteQuestion={handleDeleteQuestion}
                onClearClassQuestions={handleClearClassQuestions}
                onBulkUploadStudents={handleBulkUploadStudents}
                onClearAllStudents={handleClearAllStudents}
                onResetMonthlyContest={handleResetMonthlyContest}
              />
            )}

            {currentView === 'exam' && userRole === 'student' && (
              <ExamPortal
                questions={questions}
                student={userData}
                startTime={examStartTime || Date.now()}
                onSubmitExam={handleSubmitExam}
              />
            )}

            {currentView === 'post-exam' && userRole === 'student' && (
              <PostExamView
                student={userData}
                questions={questions}
                scores={
                  lastSubmittedScores || {
                    math: userData.mathScore || 0,
                    science: userData.scienceScore || 0,
                    english: userData.englishScore || 0,
                    total: userData.totalScore || 0,
                  }
                }
                onGoToLeaderboards={() => setCurrentView('leaderboards')}
                onReturnHome={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'leaderboards' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Leaderboards
                  students={students}
                  currentUser={userRole === 'student' ? userData : null}
                  onStartExamClick={handleStartExam}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
