const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// GET /api/quizzes
router.get('/', (req, res) => {
  const quizzes = (db.quizzes || []).map(q => ({
    id: q.id,
    title: q.title,
    course: q.course,
    category: q.category,
    durationMins: q.durationMins,
    passingScore: q.passingScore,
    totalQuestions: q.questions ? q.questions.length : (q.totalQuestions || 5)
  }));
  res.json({ success: true, quizzes });
});

// GET /api/quizzes/:id
router.get('/:id', (req, res) => {
  const quiz = (db.quizzes || []).find(q => q.id === req.params.id);
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }

  // Sanitize: never reveal correct answer indices prior to submission
  const clientQuestions = (quiz.questions || []).map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  res.json({
    success: true,
    quiz: {
      id: quiz.id,
      title: quiz.title,
      category: quiz.category,
      durationMins: quiz.durationMins,
      passingScore: quiz.passingScore,
      questions: clientQuestions
    }
  });
});

// POST /api/quizzes/:id/submit (Server-Side Evaluation & Attempt Persistence)
router.post('/:id/submit', optionalAuth, (req, res) => {
  const { answers } = req.body; // map: { [questionId]: selectedOptionIndex }
  const quiz = (db.quizzes || []).find(q => q.id === req.params.id);
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }

  let correctCount = 0;
  const questions = quiz.questions || [];
  const review = questions.map(q => {
    const userAnswer = answers ? answers[q.id] : undefined;
    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      id: q.id,
      question: q.question,
      options: q.options,
      userAnswer,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const total = questions.length || 1;
  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= (quiz.passingScore || 70);
  const xpEarned = passed ? (150 + (percentage === 100 ? 100 : 0)) : 50;

  const studentId = req.user ? req.user.id : '1';
  const studentName = req.user ? req.user.name : 'Alex Johnson';

  if (!db.quizAttempts) db.quizAttempts = [];
  const previousAttempts = db.quizAttempts.filter(a => a.quizId === quiz.id && a.studentId === studentId);
  const attemptNumber = previousAttempts.length + 1;

  const attemptRecord = {
    id: `qa-${Date.now()}`,
    quizId: quiz.id,
    quizTitle: quiz.title,
    studentId,
    studentName,
    score: correctCount,
    total,
    percentage,
    passed,
    xpEarned,
    attemptNumber,
    submittedAt: new Date().toISOString()
  };

  db.quizAttempts.push(attemptRecord);

  // Update student XP in user profile & gamification
  const user = (db.users || []).find(u => u.id === studentId);
  if (user) {
    user.xp = (user.xp || 0) + xpEarned;
  }

  db.save();

  res.json({
    success: true,
    score: correctCount,
    total,
    percentage,
    passed,
    xpEarned,
    attemptNumber,
    feedback: passed 
      ? `Outstanding! You achieved ${percentage}% and exceeded the ${quiz.passingScore}% passing standard.`
      : `Passing threshold not met (${percentage}% vs ${quiz.passingScore}% required). Study the question explanations and reattempt.`,
    review,
    attempt: attemptRecord
  });
});

// GET /api/quizzes/attempts/my
router.get('/attempts/my', authenticateToken, (req, res) => {
  const attempts = (db.quizAttempts || []).filter(a => a.studentId === req.user.id);
  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter(a => a.passed).length;
  const avgScore = totalAttempts > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts) 
    : 0;

  res.json({
    success: true,
    stats: {
      totalAttempts,
      passedAttempts,
      passRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
      averagePercentage: avgScore
    },
    attempts: attempts.slice().reverse()
  });
});

// GET /api/quizzes/leaderboard
router.get('/leaderboard', (req, res) => {
  const users = (db.users || [])
    .filter(u => u.role === 'student')
    .map(u => ({
      id: u.id,
      name: u.name,
      department: u.department,
      xp: u.xp || 400,
      streak: u.weeklyStreak || 3,
      avatar: u.avatar || u.name[0]
    }))
    .sort((a, b) => b.xp - a.xp);

  res.json({ success: true, leaderboard: users });
});

module.exports = router;
