const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/assignments
router.get('/', (req, res) => {
  res.json({ success: true, assignments: db.assignments || [] });
});

// GET /api/assignments/:id
router.get('/:id', (req, res) => {
  const item = (db.assignments || []).find(a => String(a.id) === String(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: 'Assignment not found' });
  }
  res.json({ success: true, assignment: item });
});

// POST /api/assignments/submit (Real Student Submission Workflow)
router.post('/submit', authenticateToken, (req, res) => {
  const { assignmentId, submissionUrl, notes } = req.body;
  const item = (db.assignments || []).find(a => String(a.id) === String(assignmentId));

  if (!item) {
    return res.status(404).json({ success: false, message: 'Assignment not found' });
  }

  if (!submissionUrl) {
    return res.status(400).json({ success: false, message: 'A valid submission URL or GitHub repository is required.' });
  }

  item.status = 'submitted';
  item.submissionUrl = submissionUrl;
  item.studentId = req.user.id;
  item.studentName = req.user.name;
  item.submittedAt = new Date().toISOString();
  item.notes = notes || '';
  item.aiFeedback = 'Submission received and verified. Pending faculty evaluation.';
  item.grade = null;
  item.score = null;

  // Record in submissions collection
  if (!db.submissions) db.submissions = [];
  const submissionRecord = {
    id: `sub-${Date.now()}`,
    assignmentId: item.id,
    assignmentTitle: item.title,
    studentId: req.user.id,
    studentName: req.user.name,
    submissionUrl,
    notes: notes || '',
    status: 'submitted',
    submittedAt: item.submittedAt
  };
  db.submissions.unshift(submissionRecord);

  // Add notification
  if (!db.notifications) db.notifications = [];
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: req.user.id,
    title: 'Assignment Submitted',
    message: `Your solution for "${item.title}" was submitted successfully.`,
    channel: 'Assignment',
    read: false,
    createdAt: new Date().toISOString()
  });

  db.save();

  res.json({
    success: true,
    message: 'Assignment submitted successfully. Awaiting faculty review.',
    assignment: item,
    submission: submissionRecord
  });
});

// POST /api/assignments/grade (Faculty Review & Evaluation)
router.post('/grade', authenticateToken, requireRole('super_admin', 'trainer', 'mentor'), (req, res) => {
  const { assignmentId, grade, score, feedback } = req.body;
  const item = (db.assignments || []).find(a => String(a.id) === String(assignmentId));

  if (!item) {
    return res.status(404).json({ success: false, message: 'Assignment not found' });
  }

  if (score === undefined || isNaN(Number(score)) || Number(score) < 0 || Number(score) > 100) {
    return res.status(400).json({ success: false, message: 'A valid numeric score between 0 and 100 is required.' });
  }

  const numScore = Number(score);
  const assignedGrade = grade || (numScore >= 90 ? 'A' : numScore >= 80 ? 'B' : numScore >= 70 ? 'C' : 'D');

  item.status = 'graded';
  item.score = numScore;
  item.grade = assignedGrade;
  item.feedback = feedback || 'Faculty evaluation completed.';
  item.gradedBy = req.user.name;
  item.gradedAt = new Date().toISOString();

  // Also update submissions collection record if matched
  if (db.submissions) {
    const sub = db.submissions.find(s => String(s.assignmentId) === String(item.id));
    if (sub) {
      sub.status = 'graded';
      sub.score = numScore;
      sub.grade = assignedGrade;
      sub.feedback = item.feedback;
      sub.gradedBy = req.user.name;
      sub.gradedAt = item.gradedAt;
    }
  }

  // Notify student
  if (item.studentId && db.notifications) {
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: item.studentId,
      title: 'Assignment Graded',
      message: `"${item.title}" has been graded: ${assignedGrade} (${numScore}/100).`,
      channel: 'Gradebook',
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  db.save();

  res.json({
    success: true,
    message: 'Assignment successfully evaluated and student notified.',
    assignment: item
  });
});

// POST /api/assignments/create (Faculty Assignment Publisher)
router.post('/create', authenticateToken, requireRole('super_admin', 'trainer', 'mentor'), (req, res) => {
  const { title, course, points, due, description } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Assignment title is required' });
  }

  const newAssign = {
    id: `asg-${Date.now()}`,
    title: title.trim(),
    course: course || 'General Engineering',
    points: Number(points) || 100,
    due: due || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    description: description || 'Complete the assigned project modules according to instructions.',
    status: 'pending',
    createdBy: req.user.name,
    createdAt: new Date().toISOString()
  };

  if (!db.assignments) db.assignments = [];
  db.assignments.push(newAssign);
  db.save();

  res.status(201).json({
    success: true,
    message: 'Assignment created and published to class.',
    assignment: newAssign
  });
});

module.exports = router;
