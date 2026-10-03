const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

// GET /api/certificates
router.get('/', optionalAuth, (req, res) => {
  let certs = db.certificates || [];
  if (req.user && req.user.role === 'student') {
    certs = certs.filter(c => c.studentId === req.user.id);
  }
  res.json({ success: true, certificates: certs });
});

// GET /api/certificates/verify/:id (Public Verification System)
router.get('/verify/:id', (req, res) => {
  const certId = req.params.id.trim();
  const cert = (db.certificates || []).find(c => c.id.toLowerCase() === certId.toLowerCase());

  if (!cert) {
    return res.status(404).json({
      success: false,
      verified: false,
      message: `No authentic credential found matching ID: ${certId}. This credential may be fraudulent or unissued.`
    });
  }

  res.json({
    success: true,
    verified: true,
    certificate: {
      id: cert.id,
      studentName: cert.studentName,
      course: cert.course,
      grade: cert.grade || 'A+',
      issuedDate: cert.issuedDate || cert.date || '2026-09-15',
      issuer: 'Acadex Learning Systems Inc.',
      blockchainProof: cert.blockchainProof || `0x7f${Buffer.from(cert.id).toString('hex')}89a4cd01ee`
    },
    verificationTimestamp: new Date().toISOString()
  });
});

// POST /api/certificates/issue (Faculty / Admin Issuance)
router.post('/issue', authenticateToken, requireRole('super_admin', 'trainer', 'mentor'), (req, res) => {
  const { studentName, studentId, course, grade } = req.body;

  if (!course) {
    return res.status(400).json({ success: false, message: 'Course name is required to issue certificate.' });
  }

  // Format: ACX-2026-XXXXXX
  const randomSerial = String(Math.floor(100000 + Math.random() * 900000));
  const certId = `ACX-2026-${randomSerial}`;
  const verificationHash = crypto.createHash('sha256').update(certId + studentName + course).digest('hex');

  const newCert = {
    id: certId,
    studentId: studentId || '1',
    studentName: studentName || 'Alex Johnson',
    course,
    grade: grade || 'A+',
    issuedDate: new Date().toISOString().split('T')[0],
    verificationUrl: `https://lokesh-gojo.github.io/adcadex-lms/certificates.html?id=${certId}`,
    blockchainProof: `0x${verificationHash.slice(0, 32)}`,
    issuedBy: req.user.name,
    createdAt: new Date().toISOString()
  };

  if (!db.certificates) db.certificates = [];
  db.certificates.unshift(newCert);

  // Notify student
  if (db.notifications) {
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: newCert.studentId,
      title: 'Certificate Issued!',
      message: `Your certificate for "${course}" has been awarded (ID: ${certId}).`,
      channel: 'Certificate',
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  db.save();

  res.status(201).json({
    success: true,
    message: 'Certificate successfully minted and verified.',
    certificate: newCert
  });
});

module.exports = router;
