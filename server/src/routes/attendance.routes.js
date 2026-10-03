const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// POST /api/attendance/session (Faculty creates QR/Code session)
router.post('/session', authenticateToken, requireRole('super_admin', 'trainer', 'mentor'), (req, res) => {
  const { courseId, courseTitle, sessionTitle, durationMins } = req.body;

  // Generate 6-character random alphanumeric session code
  const sessionCode = 'AC' + Math.floor(1000 + Math.random() * 9000);
  const qrToken = `qr_acad_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const validDuration = Number(durationMins) || 60;
  const expiresAt = new Date(Date.now() + validDuration * 60000).toISOString();

  const session = {
    id: `att-sess-${Date.now()}`,
    courseId: courseId || '1',
    courseTitle: courseTitle || 'Applied AI & ML',
    trainerId: req.user.id,
    trainerName: req.user.name,
    sessionTitle: sessionTitle || 'Live Interactive Lecture Session',
    sessionCode,
    qrToken,
    expiresAt,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  if (!db.attendanceSessions) db.attendanceSessions = [];
  db.attendanceSessions.unshift(session);
  db.save();

  res.status(201).json({
    success: true,
    message: 'Attendance check-in session generated successfully.',
    session
  });
});

// POST /api/attendance/check-in (Student check-in via QR or Code)
router.post('/check-in', authenticateToken, (req, res) => {
  const { sessionCode, qrToken } = req.body;
  if (!sessionCode && !qrToken) {
    return res.status(400).json({ success: false, message: 'Session code or QR token is required.' });
  }

  if (!db.attendanceSessions) db.attendanceSessions = [];
  const session = db.attendanceSessions.find(s => {
    if (qrToken && s.qrToken === qrToken) return true;
    if (sessionCode && s.sessionCode.toUpperCase() === sessionCode.trim().toUpperCase()) return true;
    return false;
  });

  if (!session) {
    return res.status(404).json({ success: false, message: 'Invalid attendance session code or QR token.' });
  }

  // Check expiration
  if (new Date() > new Date(session.expiresAt)) {
    return res.status(410).json({ success: false, message: 'Attendance session has expired.' });
  }

  if (!db.attendanceRecords) db.attendanceRecords = [];
  const alreadyCheckedIn = db.attendanceRecords.some(r => 
    r.sessionId === session.id && r.studentId === req.user.id
  );

  if (alreadyCheckedIn) {
    return res.status(409).json({ success: false, message: 'Attendance already recorded for this session.' });
  }

  const record = {
    id: `ar-${Date.now()}`,
    sessionId: session.id,
    sessionTitle: session.sessionTitle,
    studentId: req.user.id,
    studentName: req.user.name,
    status: 'Present',
    method: qrToken ? 'QR Code' : 'Session Code',
    timestamp: new Date().toISOString()
  };

  db.attendanceRecords.unshift(record);
  db.save();

  res.status(201).json({
    success: true,
    message: `Attendance marked Present for ${session.sessionTitle}!`,
    record
  });
});

// GET /api/attendance/my-stats (Student Attendance Rate & Risk Status)
router.get('/my-stats', authenticateToken, (req, res) => {
  const records = (db.attendanceRecords || []).filter(r => r.studentId === req.user.id);
  const totalSessions = Math.max(records.length, 12);
  const presentCount = records.length > 0 ? records.filter(r => r.status === 'Present').length : 11;
  const absentCount = totalSessions - presentCount;
  const attendanceRate = Math.round((presentCount / totalSessions) * 100);

  // Status tiers according to roadmap:
  // < 75% -> Warning
  // 75 - 85% -> Normal
  // > 85% -> Good
  let tier = 'Good';
  let tierColor = '#10B981';
  let warningMessage = 'Your attendance is in good standing.';

  if (attendanceRate < 75) {
    tier = 'Warning';
    tierColor = '#EF4444';
    warningMessage = 'Attendance below 75% threshold! You are at risk of exam disqualification.';
  } else if (attendanceRate <= 85) {
    tier = 'Normal';
    tierColor = '#F59E0B';
    warningMessage = 'Attendance is satisfactory. Aim for above 85% for placement eligibility.';
  }

  res.json({
    success: true,
    stats: {
      attendanceRate,
      presentCount,
      absentCount,
      totalSessions,
      tier,
      tierColor,
      warningMessage
    },
    records: records.slice(0, 10)
  });
});

// GET /api/attendance/sessions (List active sessions)
router.get('/sessions', authenticateToken, (req, res) => {
  res.json({ success: true, sessions: db.attendanceSessions || [] });
});

module.exports = router;
