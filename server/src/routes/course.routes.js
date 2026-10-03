const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/courses
router.get('/', (req, res) => {
  res.json({ success: true, courses: db.courses });
});

// GET /api/courses/:id
router.get('/:id', (req, res) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.json({ success: true, course });
});

// POST /api/courses/:id/enroll
router.post('/:id/enroll', authenticateToken, (req, res) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  if (!db.enrollments) db.enrollments = [];
  const existing = db.enrollments.find(e => e.userId === req.user.id && e.courseId === req.params.id);
  if (existing) {
    return res.json({ success: true, message: 'Already enrolled in this course', enrollment: existing });
  }

  const newEnrollment = {
    id: `enr-${Date.now()}`,
    userId: req.user.id,
    userName: req.user.name,
    courseId: course.id,
    courseTitle: course.title,
    progress: 0,
    status: 'active',
    enrolledAt: new Date().toISOString()
  };

  db.enrollments.push(newEnrollment);
  db.save();

  res.status(201).json({
    success: true,
    message: `Successfully enrolled in ${course.title}!`,
    enrollment: newEnrollment
  });
});

// POST /api/courses/:id/progress
router.post('/:id/progress', authenticateToken, (req, res) => {
  const { progress } = req.body;
  if (!db.enrollments) db.enrollments = [];

  let enrollment = db.enrollments.find(e => e.userId === req.user.id && e.courseId === req.params.id);
  if (!enrollment) {
    enrollment = {
      id: `enr-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      courseId: req.params.id,
      progress: Number(progress) || 10,
      status: 'active',
      enrolledAt: new Date().toISOString()
    };
    db.enrollments.push(enrollment);
  } else {
    enrollment.progress = Math.min(100, Math.max(0, Number(progress) || 0));
    if (enrollment.progress === 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date().toISOString();
    }
  }

  db.save();
  res.json({ success: true, message: 'Progress updated', progress: enrollment.progress });
});

module.exports = router;
