import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_STUDENTS } from './src/data/initialStudents.js';
import { DEFAULT_QUESTIONS } from './src/data/defaultQuestions.js';
import { Student, MCQQuestion, HouseName, ClassSection } from './src/types.js';

// In-memory data persistence
let studentsStore: Student[] = [...INITIAL_STUDENTS];

// Initialize questions with default standard assignment
let questionsStore: MCQQuestion[] = DEFAULT_QUESTIONS.map((q) => ({
  ...q,
  classStandard: q.classStandard || 'all',
}));

let activeExamSessions: Record<string, { startTime: number; studentId: string }> = {};

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// ================= API ROUTES =================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password are required' });
  }

  const cleanUserId = String(userId).trim().toLowerCase().replace(/\s+/g, '');
  const cleanPassword = String(password).trim();

  // Teacher / Admin Check
  if (cleanUserId === 'staffadmin' && cleanPassword === '13/04/1986') {
    return res.json({
      role: 'teacher',
      user: {
        id: 'teacher-admin',
        userId: 'staffadmin',
        name: 'Teacher / Staff Admin',
      },
    });
  }

  // Student Check
  const student = studentsStore.find(
    (s) => s.userId.trim().toLowerCase() === cleanUserId && s.password.trim() === cleanPassword
  );

  if (student) {
    return res.json({
      role: 'student',
      user: student,
    });
  }

  return res.status(401).json({ error: 'Invalid User ID or Password' });
});

// Get all students
app.get('/api/students', (_req, res) => {
  res.json(studentsStore);
});

// Create new student
app.post('/api/students', (req, res) => {
  const { name, rollNo, userId, password, classSection, house } = req.body;

  if (!name || !rollNo || !classSection || !house) {
    return res.status(400).json({ error: 'All student details are required' });
  }

  // Validate Class (6A to 9B)
  const validClasses = ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'];
  if (!validClasses.includes(classSection)) {
    return res.status(400).json({ error: 'Invalid class section. Only 6A to 9B allowed.' });
  }

  // Validate House
  const validHouses = ['Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri'];
  if (!validHouses.includes(house)) {
    return res.status(400).json({ error: 'Invalid house. Choose Aravali, Nilgiri, Shivalik, or Udaygiri.' });
  }

  // Generate User ID and Password if not manually set
  const finalUserId = userId?.trim() || `JNV${classSection}${rollNo}`;
  const finalPassword = password?.trim() || `jnv${rollNo}2026`;

  // Check unique userId
  if (studentsStore.some((s) => s.userId.toLowerCase() === finalUserId.toLowerCase())) {
    return res.status(400).json({ error: 'User ID already exists. Please choose a different User ID.' });
  }

  const newStudent: Student = {
    id: `s-${Date.now()}`,
    userId: finalUserId,
    password: finalPassword,
    name: name.trim(),
    rollNo: String(rollNo).trim(),
    classSection: classSection as ClassSection,
    house: house as HouseName,
    mathScore: 0,
    scienceScore: 0,
    englishScore: 0,
    totalScore: 0,
    hasTakenExam: false,
  };

  studentsStore.push(newStudent);
  res.status(201).json(newStudent);
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;

  if (id === 'all' || id === 'ALL') {
    const deletedCount = studentsStore.length;
    studentsStore = [];
    activeExamSessions = {};
    return res.json({ message: 'All student profiles cleared successfully.', deletedCount });
  }

  const initialLength = studentsStore.length;
  studentsStore = studentsStore.filter((s) => s.id !== id);

  if (studentsStore.length < initialLength) {
    res.json({ message: 'Student deleted successfully', deletedId: id });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Clear all students endpoint
app.post('/api/students/clear-all', (_req, res) => {
  const deletedCount = studentsStore.length;
  studentsStore = [];
  activeExamSessions = {};
  res.json({ message: 'All student profiles cleared successfully.', deletedCount });
});

// Bulk Upload Students
app.post('/api/students/bulk', (req, res) => {
  const { students, replaceAll } = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'Please provide a valid list of student profiles to upload.' });
  }

  if (replaceAll) {
    studentsStore = [];
    activeExamSessions = {};
  }

  const validClasses = ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'];
  const validHouses = ['Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri'];

  let addedCount = 0;
  const createdStudents: Student[] = [];

  students.forEach((s: any, idx: number) => {
    if (!s.name || !s.name.trim()) return;

    const classSection = validClasses.includes(s.classSection) ? s.classSection : '6A';
    const house = validHouses.includes(s.house) ? s.house : 'Aravali';
    const rollNo = s.rollNo ? String(s.rollNo).trim() : `${601 + studentsStore.length + idx}`;
    const userId = s.userId?.trim() || `JNV${classSection}${rollNo}`;
    const password = s.password?.trim() || `jnv${rollNo}2026`;

    // Ensure unique userId
    let finalUserId = userId;
    let counter = 1;
    while (studentsStore.some((existing) => existing.userId.toLowerCase() === finalUserId.toLowerCase())) {
      finalUserId = `${userId}_${counter}`;
      counter++;
    }

    const newStudent: Student = {
      id: `s-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
      userId: finalUserId,
      password: password,
      name: String(s.name).trim(),
      rollNo: rollNo,
      classSection: classSection as ClassSection,
      house: house as HouseName,
      mathScore: Number(s.mathScore) || 0,
      scienceScore: Number(s.scienceScore) || 0,
      englishScore: Number(s.englishScore) || 0,
      totalScore: (Number(s.mathScore) || 0) + (Number(s.scienceScore) || 0) + (Number(s.englishScore) || 0),
      hasTakenExam: Boolean(s.hasTakenExam),
    };

    studentsStore.push(newStudent);
    createdStudents.push(newStudent);
    addedCount++;
  });

  res.status(201).json({
    message: `Successfully saved ${addedCount} student profiles!`,
    totalStudents: studentsStore.length,
    students: createdStudents,
  });
});

// Full update student details or reset score
app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, rollNo, classSection, house, userId, password, mathScore, scienceScore, englishScore, hasTakenExam } = req.body;

  const student = studentsStore.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Validate Class if provided
  const validClasses = ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'];
  if (classSection && !validClasses.includes(classSection)) {
    return res.status(400).json({ error: 'Invalid class section.' });
  }

  // Validate House if provided
  const validHouses = ['Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri'];
  if (house && !validHouses.includes(house)) {
    return res.status(400).json({ error: 'Invalid house name.' });
  }

  // Check unique userId if changed
  if (userId && userId.trim().toLowerCase() !== student.userId.toLowerCase()) {
    if (studentsStore.some((s) => s.id !== id && s.userId.toLowerCase() === userId.trim().toLowerCase())) {
      return res.status(400).json({ error: 'User ID is already in use by another student.' });
    }
    student.userId = userId.trim();
  }

  if (name) student.name = name.trim();
  if (rollNo) student.rollNo = String(rollNo).trim();
  if (classSection) student.classSection = classSection as ClassSection;
  if (house) student.house = house as HouseName;
  if (password) student.password = password.trim();

  if (hasTakenExam === false) {
    student.hasTakenExam = false;
    student.mathScore = 0;
    student.scienceScore = 0;
    student.englishScore = 0;
    student.totalScore = 0;
    student.examCompletedAt = undefined;
    student.timeTakenSeconds = undefined;
    delete activeExamSessions[id];
  } else if (hasTakenExam === true || mathScore !== undefined) {
    student.mathScore = Math.min(20, Math.max(0, Number(mathScore) || 0));
    student.scienceScore = Math.min(20, Math.max(0, Number(scienceScore) || 0));
    student.englishScore = Math.min(20, Math.max(0, Number(englishScore) || 0));
    student.totalScore = student.mathScore + student.scienceScore + student.englishScore;
    student.hasTakenExam = true;
    if (!student.examCompletedAt) {
      student.examCompletedAt = new Date().toISOString();
    }
  }

  res.json(student);
});

// Backward compatibility score update route
app.put('/api/students/:id/score', (req, res) => {
  const { id } = req.params;
  const { mathScore, scienceScore, englishScore, hasTakenExam } = req.body;

  const student = studentsStore.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  if (hasTakenExam === false) {
    student.hasTakenExam = false;
    student.mathScore = 0;
    student.scienceScore = 0;
    student.englishScore = 0;
    student.totalScore = 0;
    student.examCompletedAt = undefined;
    student.timeTakenSeconds = undefined;
    delete activeExamSessions[id];
  } else {
    student.mathScore = Math.min(20, Math.max(0, Number(mathScore) || 0));
    student.scienceScore = Math.min(20, Math.max(0, Number(scienceScore) || 0));
    student.englishScore = Math.min(20, Math.max(0, Number(englishScore) || 0));
    student.totalScore = student.mathScore + student.scienceScore + student.englishScore;
    student.hasTakenExam = true;
    student.examCompletedAt = new Date().toISOString();
  }

  res.json(student);
});

// Get current question bank (optionally filtered by class standard e.g. ?classStandard=6 or ?classSection=6A)
app.get('/api/questions', (req, res) => {
  const { classStandard, classSection } = req.query;
  let targetStandard = (classStandard as string) || '';

  if (!targetStandard && classSection) {
    // Extract standard from classSection e.g. "6A" -> "6"
    targetStandard = String(classSection).replace(/[^0-9]/g, '');
  }

  if (targetStandard) {
    const classSpecificQuestions = questionsStore.filter(
      (q) => q.classStandard === targetStandard
    );
    if (classSpecificQuestions.length > 0) {
      return res.json(classSpecificQuestions);
    }
  }

  // Fallback to all questions if no class-specific standard questions exist
  res.json(questionsStore);
});

// Update question bank for a specific class standard (Class 6, Class 7, Class 8, Class 9)
app.post('/api/questions/set-class-questions', (req, res) => {
  const { classStandard, questions } = req.body;

  if (!classStandard || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Valid class standard and non-empty questions array required.' });
  }

  const cleanStandard = String(classStandard).replace(/[^0-9]/g, '');

  // Remove existing questions for this standard if any
  questionsStore = questionsStore.filter((q) => q.classStandard !== cleanStandard);

  // Normalize and assign IDs and classStandard
  const formattedQuestions: MCQQuestion[] = questions.map((q: any, idx: number) => ({
    id: idx + 1,
    subject: q.subject || (idx < 20 ? 'Math' : idx < 40 ? 'Science' : 'English'),
    questionText: q.questionText || `Question ${idx + 1}`,
    options: (Array.isArray(q.options) && q.options.length === 4
      ? q.options
      : ['Option A', 'Option B', 'Option C', 'Option D']) as [string, string, string, string],
    correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex % 4 : 0,
    explanation: q.explanation || 'Solution provided in standard syllabus.',
    classStandard: cleanStandard as any,
  }));

  // Add formatted questions to store
  questionsStore = [...questionsStore, ...formattedQuestions];

  res.json({
    message: `Successfully set ${formattedQuestions.length} questions for Class ${cleanStandard}!`,
    classStandard: cleanStandard,
    questionsCount: formattedQuestions.length,
    questions: formattedQuestions,
  });
});

// Clear all questions for a specific class standard (or all standards)
app.delete('/api/questions/class/:standard', (req, res) => {
  const { standard } = req.params;

  if (standard === 'all' || standard === 'ALL') {
    const deletedCount = questionsStore.length;
    questionsStore = [];
    return res.json({
      message: 'Successfully cleared all questions from the question bank.',
      deletedCount,
    });
  }

  const cleanStandard = String(standard).replace(/[^0-9]/g, '');
  const initialCount = questionsStore.length;
  
  // Filter out questions matching this class standard OR default unassigned / 'all' questions
  questionsStore = questionsStore.filter((q) => {
    if (!q.classStandard || q.classStandard === 'all' || q.classStandard === cleanStandard) {
      return false; // delete this question
    }
    return true; // keep question belonging to a different specific class standard
  });
  const deletedCount = initialCount - questionsStore.length;

  res.json({
    message: `Successfully cleared questions for Class ${cleanStandard}!`,
    classStandard: cleanStandard,
    deletedCount,
  });
});

// Delete a single question by ID
app.delete('/api/questions/:id', (req, res) => {
  const qId = parseInt(req.params.id, 10);

  const initialCount = questionsStore.length;
  questionsStore = questionsStore.filter((q) => q.id !== qId);

  if (questionsStore.length < initialCount) {
    res.json({ message: `Question #${qId} removed successfully.` });
  } else {
    res.status(404).json({ error: 'Question not found.' });
  }
});

// Start Exam (Sets Unstoppable Timer timestamp)
app.post('/api/exam/start', (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: 'Student ID required' });
  }

  let session = activeExamSessions[studentId];
  if (!session) {
    session = {
      studentId,
      startTime: Date.now(),
    };
    activeExamSessions[studentId] = session;
  }

  res.json({
    startTime: session.startTime,
    durationSeconds: 3600, // 60 minutes
    now: Date.now(),
  });
});

// Submit Exam
app.post('/api/exam/submit', (req, res) => {
  const { studentId, answers, timeTakenSeconds } = req.body;
  // answers is Record<questionId (1-60), selectedOptionIndex (0-3)>

  const student = studentsStore.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  let mathScore = 0;
  let scienceScore = 0;
  let englishScore = 0;

  questionsStore.forEach((q) => {
    const selected = answers?.[q.id];
    if (selected === q.correctOptionIndex) {
      if (q.subject === 'Math') mathScore++;
      else if (q.subject === 'Science') scienceScore++;
      else if (q.subject === 'English') englishScore++;
    }
  });

  const totalScore = mathScore + scienceScore + englishScore;

  student.hasTakenExam = true;
  student.mathScore = mathScore;
  student.scienceScore = scienceScore;
  student.englishScore = englishScore;
  student.totalScore = totalScore;
  student.examCompletedAt = new Date().toISOString();
  student.timeTakenSeconds = timeTakenSeconds || 3600;

  delete activeExamSessions[studentId];

  res.json({
    student,
    scores: {
      math: mathScore,
      science: scienceScore,
      english: englishScore,
      total: totalScore,
    },
    addedToHouse: student.house,
    addedToClass: student.classSection,
  });
});

// Teacher action: Reset entire monthly contest for all students
app.post('/api/exam/reset-month', (_req, res) => {
  studentsStore.forEach((s) => {
    s.hasTakenExam = false;
    s.mathScore = 0;
    s.scienceScore = 0;
    s.englishScore = 0;
    s.totalScore = 0;
    s.examCompletedAt = undefined;
    s.timeTakenSeconds = undefined;
  });
  activeExamSessions = {};
  res.json({ message: 'All student exam records reset for new monthly contest' });
});

// ================= VITE / STATIC SERVING =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JNV Best Day Server running at http://localhost:${PORT}`);
  });
}

startServer();
