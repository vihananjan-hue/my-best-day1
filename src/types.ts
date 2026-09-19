export type HouseName = 'Aravali' | 'Nilgiri' | 'Shivalik' | 'Udaygiri';

export type ClassSection = '6A' | '6B' | '7A' | '7B' | '8A' | '8B' | '9A' | '9B';

export type SubjectCategory = 'Math' | 'Science' | 'English';

export interface Student {
  id: string;
  userId: string;
  password: string;
  name: string;
  rollNo: string;
  classSection: ClassSection;
  house: HouseName;
  mathScore: number;
  scienceScore: number;
  englishScore: number;
  totalScore: number;
  hasTakenExam: boolean;
  examCompletedAt?: string;
  timeTakenSeconds?: number;
}

export interface MCQQuestion {
  id: number;
  subject: SubjectCategory;
  questionText: string; // supports LaTeX math like $x^2 + y^2 = z^2$ or \frac{a}{b}
  options: [string, string, string, string]; // 4 options
  correctOptionIndex: number; // 0, 1, 2, 3
  explanation: string;
  classStandard?: '6' | '7' | '8' | '9' | 'all';
}

export interface ExamSession {
  studentId: string;
  studentName: string;
  house: HouseName;
  classSection: ClassSection;
  startTime: number; // Epoch timestamp in ms
  answers: Record<number, number>; // questionId -> optionIndex
  flaggedQuestions: number[]; // array of question IDs
  isSubmitted: boolean;
  submittedAt?: number;
  scores?: {
    math: number;
    science: number;
    english: number;
    total: number;
  };
}

export interface HouseStats {
  house: HouseName;
  totalScore: number;
  studentCount: number;
  avgScore: number;
  isWinning: boolean;
  colorHex: string;
  bgGradient: string;
}

export interface ClassStats {
  classSection: ClassSection;
  totalScore: number;
  studentCount: number;
  avgScore: number;
  isWinning: boolean;
}

export interface MonthlyExamMetadata {
  monthYear: string;
  title: string;
  totalQuestions: number; // 60
  durationMinutes: number; // 60
  isActive: boolean;
  updatedAt: string;
}
