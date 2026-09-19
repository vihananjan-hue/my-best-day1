import React, { useState } from 'react';
import {
  UserPlus,
  Trash2,
  Edit3,
  RotateCcw,
  Search,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Save,
  FileText,
  Upload,
  Check,
  Filter,
  GraduationCap,
  Sparkles,
  X,
} from 'lucide-react';
import { Student, MCQQuestion, HouseName, ClassSection, SubjectCategory } from '../types';
import { MathRenderer } from './MathRenderer';
import { NvsLogo } from './NvsLogo';

interface TeacherDashboardProps {
  students: Student[];
  questions: MCQQuestion[];
  onCreateStudent: (newStudent: any) => Promise<boolean>;
  onDeleteStudent: (id: string) => Promise<boolean>;
  onUpdateStudent?: (id: string, updatedData: any) => Promise<boolean>;
  onUpdateScore: (id: string, math: number, science: number, english: number, hasTakenExam: boolean) => Promise<boolean>;
  onSetClassQuestions: (classStandard: string, questions: MCQQuestion[]) => Promise<boolean>;
  onDeleteQuestion?: (questionId: number, classStandard?: string) => Promise<boolean>;
  onClearClassQuestions?: (classStandard: string) => Promise<boolean>;
  onBulkUploadStudents?: (studentsList: any[], replaceAll?: boolean) => Promise<boolean>;
  onClearAllStudents?: () => Promise<boolean>;
  onResetMonthlyContest: () => Promise<boolean>;
}

const HOUSES: HouseName[] = ['Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri'];
const CLASSES: ClassSection[] = ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'];

const HOUSE_BADGES: Record<HouseName, { bg: string; text: string; border: string }> = {
  Aravali: {
    bg: 'bg-blue-500/15 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-500/30',
  },
  Nilgiri: {
    bg: 'bg-emerald-500/15 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30',
  },
  Shivalik: {
    bg: 'bg-red-500/15 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-500/30',
  },
  Udaygiri: {
    bg: 'bg-amber-500/15 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-yellow-300',
    border: 'border-amber-500/30',
  },
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  questions,
  onCreateStudent,
  onDeleteStudent,
  onUpdateStudent,
  onUpdateScore,
  onSetClassQuestions,
  onDeleteQuestion,
  onClearClassQuestions,
  onBulkUploadStudents,
  onClearAllStudents,
  onResetMonthlyContest,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'questions' | 'reset'>('students');

  // Search & Filter state for Students
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedHouseFilter, setSelectedHouseFilter] = useState<string>('all');

  // Question Bank Filter State by Class Standard (6, 7, 8, 9, all)
  const [selectedQuestionStandard, setSelectedQuestionStandard] = useState<string>('6');

  // Question Deletion Modal States
  const [showClearQuestionsModal, setShowClearQuestionsModal] = useState(false);
  const [isClearingQuestions, setIsClearingQuestions] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<MCQQuestion | null>(null);
  const [isDeletingQuestionLoading, setIsDeletingQuestionLoading] = useState(false);

  // Clear All Students Modal States
  const [showClearAllStudentsModal, setShowClearAllStudentsModal] = useState(false);
  const [isClearingAllStudentsLoading, setIsClearingAllStudentsLoading] = useState(false);

  // Bulk Student Upload Modal States
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploadText, setBulkUploadText] = useState('');
  const [bulkDefaultClass, setBulkDefaultClass] = useState<ClassSection>('6A');
  const [bulkDefaultHouse, setBulkDefaultHouse] = useState<HouseName>('Aravali');
  const [bulkReplaceAll, setBulkReplaceAll] = useState(true);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');

  // Create Student Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRollNo, setFormRollNo] = useState('');
  const [formUserId, setFormUserId] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formClass, setFormClass] = useState<ClassSection>('6A');
  const [formHouse, setFormHouse] = useState<HouseName>('Aravali');
  const [isAutoCreds, setIsAutoCreds] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Full Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState('');
  const [editRollNo, setEditRollNo] = useState('');
  const [editClassSection, setEditClassSection] = useState<ClassSection>('6A');
  const [editHouse, setEditHouse] = useState<HouseName>('Aravali');
  const [editUserId, setEditUserId] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editHasTakenExam, setEditHasTakenExam] = useState(false);
  const [editMath, setEditMath] = useState<number>(0);
  const [editScience, setEditScience] = useState<number>(0);
  const [editEnglish, setEditEnglish] = useState<number>(0);
  const [editModalError, setEditModalError] = useState('');
  const [editModalSuccess, setEditModalSuccess] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Custom Delete Confirmation Modal State
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);

  // Custom Reset Attempt Confirmation Modal State
  const [resettingAttemptStudent, setResettingAttemptStudent] = useState<Student | null>(null);
  const [isResetAttemptLoading, setIsResetAttemptLoading] = useState(false);

  // PDF & Text Question Import Modal State
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [importClassStandard, setImportClassStandard] = useState<'6' | '7' | '8' | '9'>('6');
  const [questionPdfText, setQuestionPdfText] = useState('');
  const [answerPdfText, setAnswerPdfText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<MCQQuestion[]>([]);
  const [importStep, setImportStep] = useState<'paste' | 'preview'>('paste');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);

  // Monthly Reset Tab State
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm);
    const matchesClass = selectedClassFilter === 'all' || s.classSection === selectedClassFilter;
    const matchesHouse = selectedHouseFilter === 'all' || s.house === selectedHouseFilter;
    return matchesSearch && matchesClass && matchesHouse;
  });

  // Filtered Questions by Class Standard (Class 6, 7, 8, 9, or All)
  const filteredQuestions = questions.filter((q) => {
    if (selectedQuestionStandard === 'all') return true;
    return q.classStandard === selectedQuestionStandard || q.classStandard === 'all' || !q.classStandard;
  });

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditRollNo(student.rollNo);
    setEditClassSection(student.classSection);
    setEditHouse(student.house);
    setEditUserId(student.userId);
    setEditPassword(student.password);
    setEditHasTakenExam(student.hasTakenExam);
    setEditMath(student.mathScore);
    setEditScience(student.scienceScore);
    setEditEnglish(student.englishScore);
    setEditModalError('');
    setEditModalSuccess('');
  };

  const handleSaveStudentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditModalError('');
    setEditModalSuccess('');

    if (!editName.trim() || !editRollNo.trim() || !editUserId.trim() || !editPassword.trim()) {
      setEditModalError('Name, Roll Number, User ID, and Password are required.');
      return;
    }

    setIsSavingEdit(true);

    const updatedPayload = {
      name: editName.trim(),
      rollNo: editRollNo.trim(),
      classSection: editClassSection,
      house: editHouse,
      userId: editUserId.trim(),
      password: editPassword.trim(),
      hasTakenExam: editHasTakenExam,
      mathScore: editMath,
      scienceScore: editScience,
      englishScore: editEnglish,
    };

    let success = false;
    if (onUpdateStudent) {
      success = await onUpdateStudent(editingStudent.id, updatedPayload);
    } else {
      success = await onUpdateScore(editingStudent.id, editMath, editScience, editEnglish, editHasTakenExam);
    }

    setIsSavingEdit(false);

    if (success) {
      setEditModalSuccess('Student profile updated successfully!');
      setTimeout(() => {
        setEditingStudent(null);
        setEditModalSuccess('');
      }, 1000);
    } else {
      setEditModalError('Failed to update student profile. User ID might already exist.');
    }
  };

  const handleCreateStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formName || !formRollNo) {
      setFormError('Name and Roll Number are required.');
      return;
    }

    const autoUserId = `JNV${formClass}${formRollNo}`;
    const autoPassword = `jnv${formRollNo}2026`;

    const success = await onCreateStudent({
      name: formName,
      rollNo: formRollNo,
      userId: isAutoCreds ? autoUserId : formUserId,
      password: isAutoCreds ? autoPassword : formPassword,
      classSection: formClass,
      house: formHouse,
    });

    if (success) {
      setFormSuccess(`Student ${formName} added successfully! User ID: ${isAutoCreds ? autoUserId : formUserId}`);
      setFormName('');
      setFormRollNo('');
      setFormUserId('');
      setFormPassword('');
      setTimeout(() => setShowCreateModal(false), 1200);
    } else {
      setFormError('Failed to create student or User ID already exists.');
    }
  };

  const handleConfirmDeleteStudent = async () => {
    if (!deletingStudent) return;
    setIsDeletingLoading(true);
    const success = await onDeleteStudent(deletingStudent.id);
    setIsDeletingLoading(false);
    if (success) {
      setDeletingStudent(null);
    }
  };

  const handleConfirmDeleteSingleQuestion = async () => {
    if (!questionToDelete) return;
    setIsDeletingQuestionLoading(true);
    let success = false;
    if (onDeleteQuestion) {
      success = await onDeleteQuestion(questionToDelete.id, questionToDelete.classStandard);
    } else {
      // Fallback local API call if prop not directly passed
      try {
        const url = questionToDelete.classStandard
          ? `/api/questions/${questionToDelete.id}?classStandard=${questionToDelete.classStandard}`
          : `/api/questions/${questionToDelete.id}`;
        const res = await fetch(url, { method: 'DELETE' });
        success = res.ok;
      } catch (e) {
        console.error('Failed to delete question:', e);
      }
    }
    setIsDeletingQuestionLoading(false);
    if (success) {
      setQuestionToDelete(null);
    }
  };

  const handleConfirmClearQuestions = async () => {
    setIsClearingQuestions(true);
    let success = false;
    if (onClearClassQuestions) {
      success = await onClearClassQuestions(selectedQuestionStandard);
    } else {
      try {
        const res = await fetch(`/api/questions/class/${selectedQuestionStandard}`, { method: 'DELETE' });
        success = res.ok;
      } catch (e) {
        console.error('Failed to clear class questions:', e);
      }
    }
    setIsClearingQuestions(false);
    if (success) {
      setShowClearQuestionsModal(false);
    }
  };

  // Helper to parse student text/CSV input
  const parseBulkStudentText = (text: string) => {
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const validClasses = ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'];
    const validHouses = ['Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri'];

    const parsed: Array<{
      name: string;
      rollNo: string;
      classSection: ClassSection;
      house: HouseName;
      userId: string;
      password: string;
    }> = [];

    lines.forEach((line, idx) => {
      // Ignore header line if it looks like "Name, Roll, Class..."
      if (idx === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('roll'))) {
        return;
      }

      let name = '';
      let rollNo = `${601 + idx}`;
      let classSection: ClassSection = bulkDefaultClass;
      let house: HouseName = bulkDefaultHouse;
      let userId = '';
      let password = '';

      // Check if line contains commas or tabs
      const parts = line.includes('\t')
        ? line.split('\t').map((p) => p.trim())
        : line.includes(',')
        ? line.split(',').map((p) => p.trim())
        : [line.trim()];

      if (parts.length >= 1 && parts[0]) {
        name = parts[0];
      }

      if (parts.length >= 2 && parts[1]) {
        rollNo = parts[1];
      }

      if (parts.length >= 3 && parts[2]) {
        const foundClass = validClasses.find((c) => c.toLowerCase() === parts[2].toLowerCase());
        if (foundClass) classSection = foundClass as ClassSection;
      }

      if (parts.length >= 4 && parts[3]) {
        const foundHouse = validHouses.find((h) => h.toLowerCase() === parts[3].toLowerCase());
        if (foundHouse) house = foundHouse as HouseName;
      }

      if (parts.length >= 5 && parts[4]) {
        userId = parts[4];
      } else {
        userId = `JNV${classSection}${rollNo}`;
      }

      if (parts.length >= 6 && parts[5]) {
        password = parts[5];
      } else {
        password = `jnv${rollNo}2026`;
      }

      if (name) {
        parsed.push({ name, rollNo, classSection, house, userId, password });
      }
    });

    return parsed;
  };

  const handleConfirmClearAllStudents = async () => {
    setIsClearingAllStudentsLoading(true);
    let success = false;
    if (onClearAllStudents) {
      success = await onClearAllStudents();
    } else {
      try {
        const res = await fetch('/api/students/clear-all', { method: 'POST' });
        success = res.ok;
      } catch (e) {
        console.error('Failed to clear all students:', e);
      }
    }
    setIsClearingAllStudentsLoading(false);
    if (success) {
      setShowClearAllStudentsModal(false);
    }
  };

  const handleConfirmBulkUpload = async () => {
    const studentList = parseBulkStudentText(bulkUploadText);
    if (studentList.length === 0) {
      setBulkError('Please enter or upload at least one student name.');
      return;
    }

    setIsBulkUploading(true);
    setBulkError('');
    setBulkSuccess('');

    let success = false;
    if (onBulkUploadStudents) {
      success = await onBulkUploadStudents(studentList, bulkReplaceAll);
    } else {
      try {
        const res = await fetch('/api/students/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students: studentList, replaceAll: bulkReplaceAll }),
        });
        success = res.ok;
      } catch (e) {
        console.error('Failed to bulk upload students:', e);
      }
    }

    setIsBulkUploading(false);
    if (success) {
      setBulkSuccess(`Successfully saved ${studentList.length} student names!`);
      setTimeout(() => {
        setShowBulkUploadModal(false);
        setBulkUploadText('');
        setBulkSuccess('');
      }, 1200);
    } else {
      setBulkError('Failed to save student roster. Please check details and try again.');
    }
  };

  const handleConfirmResetAttempt = async () => {
    if (!resettingAttemptStudent) return;
    setIsResetAttemptLoading(true);
    let success = false;
    if (onUpdateStudent) {
      success = await onUpdateStudent(resettingAttemptStudent.id, {
        hasTakenExam: false,
        mathScore: 0,
        scienceScore: 0,
        englishScore: 0,
      });
    } else {
      success = await onUpdateScore(resettingAttemptStudent.id, 0, 0, 0, false);
    }
    setIsResetAttemptLoading(false);
    if (success) {
      setResettingAttemptStudent(null);
    }
  };

  const handleResetAllContest = async () => {
    setIsResetLoading(true);
    setResetSuccessMsg('');
    const success = await onResetMonthlyContest();
    setIsResetLoading(false);
    if (success) {
      setResetSuccessMsg('Monthly contest reset successfully! All student exam scores set to 0 and submission status reset to pending.');
    }
  };

  // ================= SMART PDF / TEXT PARSER FOR QUESTION & ANSWER PDF =================
  const parseAnswerKey = (aText: string): Record<number, number> => {
    const keyMap: Record<number, number> = {};
    if (!aText.trim()) return keyMap;

    const optionLetterToIndex = (letter: string): number => {
      const clean = letter.toUpperCase().trim();
      if (clean === 'A' || clean === '1') return 0;
      if (clean === 'B' || clean === '2') return 1;
      if (clean === 'C' || clean === '3') return 2;
      if (clean === 'D' || clean === '4') return 3;
      return 0;
    };

    const regex = /(?:Q|\b)?(\d+)\s*[\.\)\:\-]\s*\(?([A-Da-d1-4])\)?/g;
    let match;
    while ((match = regex.exec(aText)) !== null) {
      const qNum = parseInt(match[1], 10);
      const optStr = match[2];
      if (qNum >= 1 && qNum <= 100) {
        keyMap[qNum] = optionLetterToIndex(optStr);
      }
    }

    return keyMap;
  };

  const handleParsePdfContent = () => {
    setImportError('');
    setImportSuccess('');

    if (!questionPdfText.trim()) {
      setImportError('Please paste the content from the Question PDF.');
      return;
    }

    const answerKey = parseAnswerKey(answerPdfText);

    const questionBlocks = questionPdfText
      .split(/(?:\r?\n|^)(?:Q\.?\s*)?(\d+)[\.\)\:\-]\s+/i)
      .filter((block) => block.trim().length > 0);

    const parsedList: MCQQuestion[] = [];

    if (questionBlocks.length >= 2) {
      let currentNum = 1;
      for (let i = 0; i < questionBlocks.length; i += 2) {
        let qNum = parseInt(questionBlocks[i], 10);
        let blockText = questionBlocks[i + 1] || '';

        if (isNaN(qNum)) {
          qNum = currentNum;
        }

        const optionRegex = /(?:\r?\n|^|\s)(?:\(?([A-Da-d])[\)\.\:]\s*)([\s\S]*?)(?=(?:\r?\n|^|\s)\(?[A-Da-d][\)\.\:]|\s*$)/gi;
        const optionsFound: string[] = [];
        let cleanQuestionText = blockText;

        const firstOptIndex = blockText.search(/(?:\r?\n|^|\s)\(?[A-Da-d][\)\.\:]\s*/i);
        if (firstOptIndex !== -1) {
          cleanQuestionText = blockText.substring(0, firstOptIndex).trim();
          const optionsText = blockText.substring(firstOptIndex);

          let optMatch;
          while ((optMatch = optionRegex.exec(optionsText)) !== null) {
            if (optMatch[2] && optMatch[2].trim()) {
              optionsFound.push(optMatch[2].trim().replace(/\n+/g, ' '));
            }
          }
        }

        while (optionsFound.length < 4) {
          optionsFound.push(`Option ${String.fromCharCode(65 + optionsFound.length)}`);
        }

        let subject: SubjectCategory = 'Math';
        if (qNum > 20 && qNum <= 40) subject = 'Science';
        else if (qNum > 40) subject = 'English';

        if (/math/i.test(cleanQuestionText)) subject = 'Math';
        else if (/science/i.test(cleanQuestionText)) subject = 'Science';
        else if (/english/i.test(cleanQuestionText)) subject = 'English';

        const correctOpt = answerKey[qNum] !== undefined ? answerKey[qNum] : 0;

        parsedList.push({
          id: qNum,
          subject,
          questionText: cleanQuestionText || `Question ${qNum}`,
          options: optionsFound.slice(0, 4) as [string, string, string, string],
          correctOptionIndex: correctOpt,
          explanation: `Solution for Class ${importClassStandard} standard question #${qNum}.`,
          classStandard: importClassStandard,
        });

        currentNum++;
      }
    } else {
      const lines = questionPdfText.split('\n').map((l) => l.trim()).filter(Boolean);
      let qNum = 1;

      lines.forEach((line) => {
        if (line.length > 5 && qNum <= 60) {
          let subject: SubjectCategory = 'Math';
          if (qNum > 20 && qNum <= 40) subject = 'Science';
          else if (qNum > 40) subject = 'English';

          const correctOpt = answerKey[qNum] !== undefined ? answerKey[qNum] : 0;

          parsedList.push({
            id: qNum,
            subject,
            questionText: line,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctOptionIndex: correctOpt,
            explanation: `Solution for Class ${importClassStandard} question #${qNum}.`,
            classStandard: importClassStandard,
          });
          qNum++;
        }
      });
    }

    if (parsedList.length === 0) {
      setImportError('Could not parse questions from the provided text. Please check formatting and retry.');
      return;
    }

    parsedList.sort((a, b) => a.id - b.id);

    setParsedQuestions(parsedList);
    setImportStep('preview');
    setImportSuccess(`Successfully parsed ${parsedList.length} questions for Class ${importClassStandard}! Review below before saving.`);
  };

  const handleSaveParsedQuestions = async () => {
    if (parsedQuestions.length === 0) return;
    setIsSavingQuestions(true);

    const success = await onSetClassQuestions(importClassStandard, parsedQuestions);
    setIsSavingQuestions(false);

    if (success) {
      setImportSuccess(`Questions for Class ${importClassStandard} saved successfully to the master question bank!`);
      setSelectedQuestionStandard(importClassStandard);
      setTimeout(() => {
        setShowPdfModal(false);
        setImportStep('paste');
        setQuestionPdfText('');
        setAnswerPdfText('');
      }, 1200);
    } else {
      setImportError('Failed to save questions to the server. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 border border-purple-500/30 p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <NvsLogo size="sm" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Staff Admin Panel
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Teacher & Staff Admin Control Center
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Manage student profiles (edit name, roll no, class, house, credentials), set standard-wise Question & Answer PDFs for Classes 6, 7, and 8, and manage monthly reset competitions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Upload className="w-4 h-4 text-purple-200" />
              <span>Upload Student Names & Roster</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Single Student ID</span>
            </button>

            <button
              onClick={() => {
                setShowPdfModal(true);
                setImportStep('paste');
                setImportError('');
                setImportSuccess('');
              }}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Paste Question & Answer PDF (Classes 6, 7, 8)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'students'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Roster ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'questions'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Question Bank ({filteredQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reset')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'reset'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Monthly Reset</span>
        </button>
      </div>

      {/* TAB 1: Student Roster & ID Management */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
          {/* Class Section Selection Bar (6A, 6B, 7A, 7B, 8A, 8B, 9A, 9B) */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-black text-slate-600 dark:text-slate-300 px-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-purple-500" /> Class Section Roster:
            </span>
            <button
              onClick={() => setSelectedClassFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedClassFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              All Sections
            </button>
            {CLASSES.map((c) => {
              const isActive = selectedClassFilter === c;
              const sectionCount = students.filter((s) => s.classSection === c).length;

              return (
                <button
                  key={c}
                  onClick={() => setSelectedClassFilter(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>Class {c}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-purple-800 text-purple-100'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {sectionCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, ID, or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowBulkUploadModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Student List</span>
              </button>

              {students.length > 0 && (
                <button
                  onClick={() => setShowClearAllStudentsModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Remove demo student names to start fresh"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Clear All Demo Students</span>
                </button>
              )}

              {/* Class Filter */}
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Active Classes (6A - 9B)</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>

              {/* House Filter */}
              <select
                value={selectedHouseFilter}
                onChange={(e) => setSelectedHouseFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Houses</option>
                {HOUSES.map((h) => (
                  <option key={h} value={h}>{h} House</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Student Name</th>
                  <th className="pb-3">User ID & Password</th>
                  <th className="pb-3">Class & House</th>
                  <th className="pb-3 text-center">Exam Status</th>
                  <th className="pb-3 text-center">Scores (M / S / E)</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredStudents.map((student) => {
                  const houseBadge = HOUSE_BADGES[student.house];

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-slate-900 dark:text-white">
                        <div>{student.name}</div>
                        <div className="text-xs text-slate-400 font-normal">Roll No: {student.rollNo}</div>
                      </td>

                      <td className="py-3.5 font-mono text-xs">
                        <div className="font-bold text-purple-600 dark:text-purple-400">{student.userId}</div>
                        <div className="text-slate-400">Pass: {student.password}</div>
                      </td>

                      <td className="py-3.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Class {student.classSection}</div>
                        <div className="mt-0.5">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-black rounded border ${houseBadge.bg} ${houseBadge.text} ${houseBadge.border}`}>
                            {student.house} House
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 text-center">
                        {student.hasTakenExam ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 text-center">
                        <div className="font-black text-slate-900 dark:text-white">
                          {student.totalScore} / 60
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ({student.mathScore} / {student.scienceScore} / {student.englishScore})
                        </div>
                      </td>

                      <td className="py-3.5 text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Full Edit Button */}
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
                            title="Edit Student Details & Score"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Reset Attempt Button */}
                          {student.hasTakenExam && (
                            <button
                              onClick={() => setResettingAttemptStudent(student)}
                              className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
                              title="Reset Student Exam Attempt"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset</span>
                            </button>
                          )}

                          {/* Delete Student Button */}
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
                            title="Delete Student Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Standard-Wise Question Bank Inspection & Management */}
      {activeTab === 'questions' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                <span>Standard-Wise Question Bank</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Questions are mapped standard-wise for Class 6, Class 7, Class 8, and Class 9.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowClearQuestionsModal(true)}
                disabled={filteredQuestions.length === 0}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-extrabold text-xs shadow flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove questions for this standard to load new ones"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Clear {selectedQuestionStandard === 'all' ? 'All' : `Class ${selectedQuestionStandard}`} Questions</span>
              </button>

              <button
                onClick={() => {
                  setShowPdfModal(true);
                  setImportStep('paste');
                  setImportError('');
                  setImportSuccess('');
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Set Question & Answer PDF (Classes 6, 7, 8)</span>
              </button>
            </div>
          </div>

          {/* Standard Filter Tabs: Class 6, Class 7, Class 8, Class 9, All */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Filter Standard:
            </span>

            {['6', '7', '8', '9', 'all'].map((std) => {
              const isActive = selectedQuestionStandard === std;
              return (
                <button
                  key={std}
                  onClick={() => setSelectedQuestionStandard(std)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {std === 'all' ? 'All Classes' : `Class ${std}`}
                </button>
              );
            })}
          </div>

          {/* Question List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No questions currently loaded for Class {selectedQuestionStandard}.
                </p>
                <button
                  onClick={() => {
                    setImportClassStandard((selectedQuestionStandard === 'all' ? '6' : selectedQuestionStandard) as any);
                    setShowPdfModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-black shadow"
                >
                  Paste Question PDF & Answer PDF for Class {selectedQuestionStandard === 'all' ? '6' : selectedQuestionStandard}
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div
                  key={`${q.classStandard || 'std'}-${q.id}`}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-purple-600 dark:text-purple-400">
                        Q{q.id} • Section: {q.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-500/20">
                        Class {q.classStandard || 'All'} Standard
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Correct Option: {['A', 'B', 'C', 'D'][q.correctOptionIndex]}
                      </span>

                      <button
                        onClick={() => setQuestionToDelete(q)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
                        title="Remove question for new other question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Question</span>
                      </button>
                    </div>
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
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Reset Monthly Contest */}
      {activeTab === 'reset' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-md text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center">
            <RotateCcw className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Reset Monthly Contest for New Cycle
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Clicking reset will set all student test scores back to 0 and reset submission status to pending so students can attempt the new monthly test.
          </p>

          {resetSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-left flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{resetSuccessMsg}</span>
            </div>
          )}

          <button
            onClick={handleResetAllContest}
            disabled={isResetLoading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
          >
            {isResetLoading ? 'Resetting All Records...' : 'Confirm Reset All Student Exam Records'}
          </button>
        </div>
      )}

      {/* Modal: Full Edit Student Details & Scores */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-500" />
                <span>Edit Student Profile: {editingStudent.name}</span>
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {editModalError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
                {editModalError}
              </div>
            )}

            {editModalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {editModalSuccess}
              </div>
            )}

            <form onSubmit={handleSaveStudentEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editRollNo}
                    onChange={(e) => setEditRollNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class & Section *
                  </label>
                  <select
                    value={editClassSection}
                    onChange={(e) => setEditClassSection(e.target.value as ClassSection)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    House Assignment *
                  </label>
                  <select
                    value={editHouse}
                    onChange={(e) => setEditHouse(e.target.value as HouseName)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {HOUSES.map((h) => (
                      <option key={h} value={h}>{h} House</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    User ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserId}
                    onChange={(e) => setEditUserId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    Exam Performance Scores
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-600 dark:text-emerald-400">
                    <input
                      type="checkbox"
                      checked={editHasTakenExam}
                      onChange={(e) => setEditHasTakenExam(e.target.checked)}
                    />
                    <span>Exam Completed</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Math (0-20)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={editMath}
                      onChange={(e) => setEditMath(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Science (0-20)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={editScience}
                      onChange={(e) => setEditScience(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      English (0-20)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={editEnglish}
                      onChange={(e) => setEditEnglish(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div className="text-right text-xs font-extrabold text-amber-500">
                  Total Score: {editMath + editScience + editEnglish} / 60 Marks
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow disabled:opacity-50"
                >
                  {isSavingEdit ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Delete Student Confirmation */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Delete Student Profile?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to permanently delete student profile <strong>{deletingStudent.name}</strong> (Roll No: {deletingStudent.rollNo}, Class: {deletingStudent.classSection}, House: {deletingStudent.house})?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingStudent(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteStudent}
                disabled={isDeletingLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow disabled:opacity-50"
              >
                {isDeletingLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Custom Reset Student Attempt Confirmation */}
      {resettingAttemptStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Reset Student Exam Attempt?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Reset exam submission for <strong>{resettingAttemptStudent.name}</strong>? Their scores will return to 0 and status will become pending.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setResettingAttemptStudent(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResetAttempt}
                disabled={isResetAttemptLoading}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow disabled:opacity-50"
              >
                {isResetAttemptLoading ? 'Resetting...' : 'Confirm Reset Attempt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Paste Question PDF & Answer PDF (Standard-Wise) */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span>Paste Question PDF & Answer PDF</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Set standard-wise question and answer keys for Class 6, Class 7, or Class 8.
                </p>
              </div>

              <button
                onClick={() => setShowPdfModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {importError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
                {importError}
              </div>
            )}

            {importSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {importSuccess}
              </div>
            )}

            {/* STEP 1: Paste Text */}
            {importStep === 'paste' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                    Select Class / Standard *
                  </label>
                  <select
                    value={importClassStandard}
                    onChange={(e) => setImportClassStandard(e.target.value as any)}
                    className="w-full sm:w-64 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-sm"
                  >
                    <option value="6">Class 6 Standard</option>
                    <option value="7">Class 7 Standard</option>
                    <option value="8">Class 8 Standard</option>
                    <option value="9">Class 9 Standard</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Question PDF Text Box */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      1. Paste Question PDF Text *
                    </label>
                    <textarea
                      rows={10}
                      placeholder={`Paste text copied from Question PDF for Class ${importClassStandard}:\n\n1. What is 12 + 18?\n(A) 25  (B) 30  (C) 35  (D) 40\n\n2. Which organelle is the powerhouse of the cell?\n(A) Ribosome (B) Mitochondria (C) Lysosome (D) Golgi body`}
                      value={questionPdfText}
                      onChange={(e) => setQuestionPdfText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Answer PDF Text Box */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      2. Paste Answer PDF Text / Key *
                    </label>
                    <textarea
                      rows={10}
                      placeholder={`Paste text copied from Answer PDF for Class ${importClassStandard}:\n\n1-B\n2-B\n3-A\n4-C\n5-D\n...\n\n(Supports 1-A, 1. B, Q1: C formats)`}
                      value={answerPdfText}
                      onChange={(e) => setAnswerPdfText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleParsePdfContent}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow flex items-center gap-2"
                  >
                    <span>Parse & Preview Questions</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Preview & Editable Table */}
            {importStep === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                    Preview Parsed Questions for Class {importClassStandard} ({parsedQuestions.length} Items)
                  </span>

                  <button
                    onClick={() => setImportStep('paste')}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    ← Edit Pasted Text
                  </button>
                </div>

                <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1">
                  {parsedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-purple-600 dark:text-purple-400">
                          Q{q.id} • Class {importClassStandard}
                        </span>

                        <div className="flex items-center gap-2">
                          <span>Section:</span>
                          <select
                            value={q.subject}
                            onChange={(e) => {
                              const updated = [...parsedQuestions];
                              updated[idx].subject = e.target.value as SubjectCategory;
                              setParsedQuestions(updated);
                            }}
                            className="p-1 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold"
                          >
                            <option value="Math">Math</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                          </select>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) => {
                          const updated = [...parsedQuestions];
                          updated[idx].questionText = e.target.value;
                          setParsedQuestions(updated);
                        }}
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold"
                      />

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">
                              Option {['A', 'B', 'C', 'D'][optIdx]}
                            </label>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const updated = [...parsedQuestions];
                                const opts = [...updated[idx].options] as [string, string, string, string];
                                opts[optIdx] = e.target.value;
                                updated[idx].options = opts;
                                setParsedQuestions(updated);
                              }}
                              className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-bold text-slate-600 dark:text-slate-400">
                          Correct Option:
                        </span>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3].map((optIdx) => (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                const updated = [...parsedQuestions];
                                updated[idx].correctOptionIndex = optIdx;
                                setParsedQuestions(updated);
                              }}
                              className={`px-2.5 py-1 rounded font-black ${
                                q.correctOptionIndex === optIdx
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {['A', 'B', 'C', 'D'][optIdx]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setImportStep('paste')}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    Back to Paste
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveParsedQuestions}
                    disabled={isSavingQuestions}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingQuestions ? 'Saving...' : `Save Question Set for Class ${importClassStandard}`}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Student Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-500" />
                <span>Create Student Profile</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleCreateStudentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yashvi Solanki"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Roll No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 809"
                    value={formRollNo}
                    onChange={(e) => setFormRollNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class *
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value as ClassSection)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    House *
                  </label>
                  <select
                    value={formHouse}
                    onChange={(e) => setFormHouse(e.target.value as HouseName)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {HOUSES.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    User Credentials
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-purple-600 dark:text-purple-400">
                    <input
                      type="checkbox"
                      checked={isAutoCreds}
                      onChange={(e) => setIsAutoCreds(e.target.checked)}
                    />
                    <span>Auto-generate User ID & Pass</span>
                  </label>
                </div>

                {!isAutoCreds && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        User ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. JNV8A09"
                        value={formUserId}
                        onChange={(e) => setFormUserId(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Password
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. jnv8092026"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Single Question Delete Confirmation */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Remove Question #{questionToDelete.id}?
            </h3>

            <div className="text-xs text-slate-600 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-left border border-slate-200 dark:border-slate-700 font-medium">
              <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                Class {questionToDelete.classStandard || 'All'} • Section: {questionToDelete.subject}
              </span>
              <MathRenderer text={questionToDelete.questionText} />
            </div>

            <p className="text-xs text-slate-500">
              Are you sure you want to remove this question from the question bank to add a new question?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setQuestionToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteSingleQuestion}
                disabled={isDeletingQuestionLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow disabled:opacity-50"
              >
                {isDeletingQuestionLoading ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Clear Questions for Standard Confirmation */}
      {showClearQuestionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Clear Questions for {selectedQuestionStandard === 'all' ? 'All Classes' : `Class ${selectedQuestionStandard}`}?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              This will remove all {filteredQuestions.length} questions for {selectedQuestionStandard === 'all' ? 'all classes' : `Class ${selectedQuestionStandard}`} from the question bank so you can upload or set new questions.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowClearQuestionsModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearQuestions}
                disabled={isClearingQuestions}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow disabled:opacity-50"
              >
                {isClearingQuestions ? 'Clearing...' : 'Confirm Clear Questions'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Clear All Demo Students Confirmation */}
      {showClearAllStudentsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Remove All Existing Students?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to delete all {students.length} current student profiles? This will clear all demo names so you can upload your official student list.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowClearAllStudentsModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearAllStudents}
                disabled={isClearingAllStudentsLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow disabled:opacity-50"
              >
                {isClearingAllStudentsLoading ? 'Clearing...' : 'Confirm Remove All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bulk Upload Student Names & Roster */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Upload Student Names & Roster
                  </h3>
                  <p className="text-xs text-slate-500">
                    Paste student names or upload CSV file to save students to the database
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bulkError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bulkError}</span>
              </div>
            )}

            {bulkSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bulkSuccess}</span>
              </div>
            )}

            {/* Formatting Info */}
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-4 text-xs space-y-2 text-purple-900 dark:text-purple-200">
              <div className="font-bold flex items-center gap-1.5 text-purple-800 dark:text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-500" /> Format Options for Uploading:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-purple-800/90 dark:text-purple-300/90">
                <li><strong>Option 1 (Simple Names):</strong> Paste student names (one per line). Default Class & House selected below will be applied automatically.</li>
                <li><strong>Option 2 (CSV/Tab):</strong> <code className="bg-purple-100 dark:bg-purple-900/60 px-1 py-0.5 rounded">Name, RollNo, ClassSection, House</code> (e.g. <code className="bg-purple-100 dark:bg-purple-900/60 px-1 py-0.5 rounded">Rahul Sharma, 601, 6A, Aravali</code>).</li>
                <li>Credentials (User ID: <code className="bg-purple-100 dark:bg-purple-900/60 px-1 py-0.5 rounded">JNV6A601</code>, Password: <code className="bg-purple-100 dark:bg-purple-900/60 px-1 py-0.5 rounded">jnv6012026</code>) are generated automatically!</li>
              </ul>
            </div>

            {/* Quick Settings Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Class Section
                </label>
                <select
                  value={bulkDefaultClass}
                  onChange={(e) => setBulkDefaultClass(e.target.value as ClassSection)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default House
                </label>
                <select
                  value={bulkDefaultHouse}
                  onChange={(e) => setBulkDefaultHouse(e.target.value as HouseName)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {HOUSES.map((h) => (
                    <option key={h} value={h}>{h} House</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Replace / Append Option */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="bulkReplaceAll"
                checked={bulkReplaceAll}
                onChange={(e) => setBulkReplaceAll(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="bulkReplaceAll" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Clear all previous demo students and replace with this uploaded list
              </label>
            </div>

            {/* File Upload Input & Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Paste Student Names / CSV Content
                </label>
                <label className="cursor-pointer text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose CSV/Text File</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setBulkUploadText(String(event.target.result));
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>

              <textarea
                rows={6}
                value={bulkUploadText}
                onChange={(e) => setBulkUploadText(e.target.value)}
                placeholder={`Aarav Patel\nBhavya Shah\nChetan Sharma, 603, 6A, Shivalik\nDevi Patel, 604, 6A, Nilgiri`}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Parsed Live Preview Table */}
            {bulkUploadText.trim().length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">
                    Live Preview ({parseBulkStudentText(bulkUploadText).length} Students Parsed)
                  </span>
                  <span className="text-purple-600 dark:text-purple-400">
                    Target Section: Class {bulkDefaultClass}
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 p-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                        <th className="pb-1">#</th>
                        <th className="pb-1">Student Name</th>
                        <th className="pb-1">Roll No</th>
                        <th className="pb-1">Class</th>
                        <th className="pb-1">House</th>
                        <th className="pb-1">Generated User ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800">
                      {parseBulkStudentText(bulkUploadText).map((s, i) => (
                        <tr key={i} className="text-slate-800 dark:text-slate-200">
                          <td className="py-1 text-slate-400 font-bold">{i + 1}</td>
                          <td className="py-1 font-bold text-purple-600 dark:text-purple-400">{s.name}</td>
                          <td className="py-1 font-mono">{s.rollNo}</td>
                          <td className="py-1 font-bold">{s.classSection}</td>
                          <td className="py-1">{s.house}</td>
                          <td className="py-1 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{s.userId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkUpload}
                disabled={isBulkUploading || bulkUploadText.trim().length === 0}
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isBulkUploading ? (
                  <span>Saving Students...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save {parseBulkStudentText(bulkUploadText).length} Uploaded Students</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
