const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/dashboard/student
router.get('/student', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const user = db.users.find(u => u.id === userId) || req.user;

  const enrollments = (db.enrollments || []).filter(e => e.userId === userId);
  const enrolledCourses = enrollments.length > 0 
    ? enrollments 
    : (db.courses || []).slice(0, 2).map(c => ({
        id: `enr-${c.id}`,
        courseId: c.id,
        courseTitle: c.title,
        progress: c.progress || 60,
        status: 'active'
      }));

  const pendingAssignments = (db.assignments || []).filter(a => a.status === 'pending');
  const certificates = (db.certificates || []).filter(c => c.studentId === userId);
  const records = (db.attendanceRecords || []).filter(r => r.studentId === userId);
  
  const presentCount = records.filter(r => r.status === 'Present').length;
  const totalSessions = Math.max(records.length, 12);
  const attendanceRate = Math.round((presentCount / totalSessions) * 100) || 92;

  res.json({
    success: true,
    student: {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department || 'Computer Science',
      weeklyStreak: user.weeklyStreak || 5,
      xp: user.xp || 450,
      avatar: user.avatar || user.name[0]
    },
    metrics: {
      enrolledCount: enrolledCourses.length,
      completedCoursesCount: certificates.length,
      attendanceRate,
      attendanceRisk: attendanceRate < 75 ? 'Warning' : (attendanceRate <= 85 ? 'Normal' : 'Good'),
      pendingAssignmentsCount: pendingAssignments.length,
      activeQuizzesCount: (db.quizzes || []).length
    },
    enrolledCourses,
    upcomingAssignments: pendingAssignments.slice(0, 3),
    certificates: certificates.slice(0, 3)
  });
});

// GET /api/dashboard/faculty
router.get('/faculty', authenticateToken, requireRole('super_admin', 'trainer', 'mentor'), (req, res) => {
  const pendingSubmissions = (db.assignments || []).filter(a => a.status === 'submitted');

  res.json({
    success: true,
    stats: {
      totalStudents: (db.users || []).filter(u => u.role === 'student').length + 340,
      activeCoursesCount: (db.courses || []).length,
      pendingGradesCount: pendingSubmissions.length,
      averageRating: 4.9
    },
    courses: db.courses || [],
    pendingSubmissions,
    liveClasses: db.liveClasses || []
  });
});

// GET /api/dashboard/admin
router.get('/admin', authenticateToken, requireRole('super_admin'), (req, res) => {
  const usersWithoutPasswords = (db.users || []).map(({ password, ...u }) => u);

  res.json({
    success: true,
    stats: {
      totalUsers: usersWithoutPasswords.length + 1450,
      totalCompanies: (db.companies || []).length,
      totalBranches: (db.branches || []).length,
      activePlacementDrives: (db.placements || []).length,
      systemHealth: '99.99%',
      activeSessions: 48
    },
    users: usersWithoutPasswords,
    companies: db.companies || [],
    branches: db.branches || []
  });
});

// GET /api/dashboard/placement
router.get('/placement', authenticateToken, requireRole('super_admin', 'placement_officer', 'hr_admin'), (req, res) => {
  res.json({
    success: true,
    drives: db.placements || [],
    applications: db.placementApplications || [],
    stats: {
      activeDrivesCount: (db.placements || []).length,
      totalApplicants: (db.placementApplications || []).length + 84,
      placedStudents: 142,
      averagePackage: '9.2 LPA'
    }
  });
});

module.exports = router;
