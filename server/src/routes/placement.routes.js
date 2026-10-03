const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

// GET /api/placements
router.get('/', (req, res) => {
  res.json({
    success: true,
    drives: db.placements || [],
    applicationsCount: (db.placementApplications || []).length
  });
});

// POST /api/placements/drives
router.post('/drives', authenticateToken, requireRole('super_admin', 'placement_officer', 'hr_admin'), (req, res) => {
  const { company, role, ctc, location, deadline, requirements, rounds } = req.body;
  if (!company || !role) {
    return res.status(400).json({ success: false, message: 'Company and Role are required.' });
  }

  const drive = {
    id: `p-${Date.now()}`,
    company: company.trim(),
    role: role.trim(),
    ctc: ctc || '10.0 LPA',
    location: location || 'Bangalore / Remote',
    status: 'Active Drives',
    deadline: deadline || new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],
    rounds: Array.isArray(rounds) ? rounds : ['Online Coding Test', 'Technical System Design', 'HR Round'],
    requirements: Array.isArray(requirements) ? requirements : ['JavaScript', 'React', 'SQL', 'Git'],
    publishedBy: req.user.name,
    createdAt: new Date().toISOString()
  };

  if (!db.placements) db.placements = [];
  db.placements.unshift(drive);
  db.save();

  res.status(201).json({
    success: true,
    message: 'Placement drive published successfully.',
    drive
  });
});

// POST /api/placements/apply
router.post('/apply', authenticateToken, (req, res) => {
  const { driveId, resumeUrl } = req.body;
  const drive = (db.placements || []).find(p => p.id === driveId);
  if (!drive) {
    return res.status(404).json({ success: false, message: 'Placement drive not found.' });
  }

  if (!db.placementApplications) db.placementApplications = [];
  const existing = db.placementApplications.find(a => a.driveId === driveId && a.studentId === req.user.id);
  if (existing) {
    return res.status(409).json({ success: false, message: 'You have already applied for this placement drive.' });
  }

  const application = {
    id: `app-${Date.now()}`,
    driveId: drive.id,
    company: drive.company,
    role: drive.role,
    studentId: req.user.id,
    studentName: req.user.name,
    studentEmail: req.user.email,
    resumeUrl: resumeUrl || 'https://lokesh-gojo.github.io/adcadex-lms/resume.html',
    status: 'Applied',
    appliedAt: new Date().toISOString()
  };

  db.placementApplications.unshift(application);
  db.save();

  res.status(201).json({
    success: true,
    message: `Application submitted successfully for ${drive.company} - ${drive.role}!`,
    application
  });
});

// POST /api/placements/skill-gap (AI Skill Gap Matcher)
router.post('/skill-gap', optionalAuth, (req, res) => {
  const { studentSkills, targetRole, requiredSkills } = req.body;

  // Default candidate skills if not specified
  const candidateSkills = Array.isArray(studentSkills) && studentSkills.length > 0
    ? studentSkills.map(s => s.trim().toLowerCase())
    : ['html', 'css', 'javascript', 'react', 'git', 'sql'];

  // Role target skills
  const targetReqs = Array.isArray(requiredSkills) && requiredSkills.length > 0
    ? requiredSkills.map(s => s.trim())
    : (targetRole?.toLowerCase().includes('ai')
        ? ['Python', 'PyTorch', 'FastAPI', 'SQL', 'Docker', 'Transformers']
        : ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']);

  const matched = [];
  const missing = [];

  targetReqs.forEach(reqSkill => {
    const isMatch = candidateSkills.some(cs => 
      cs === reqSkill.toLowerCase() || 
      cs.includes(reqSkill.toLowerCase()) || 
      reqSkill.toLowerCase().includes(cs)
    );
    if (isMatch) {
      matched.push(reqSkill);
    } else {
      missing.push(reqSkill);
    }
  });

  const total = targetReqs.length;
  const matchPercentage = Math.round((matched.length / total) * 100);

  // Recommendations based on missing skills
  const recommendations = missing.map(skill => ({
    skill,
    recommendedCourse: `Mastering ${skill} for Production Microservices`,
    duration: '10-15 hours',
    learningPriority: matchPercentage < 70 ? 'High Priority' : 'Medium Priority'
  }));

  res.json({
    success: true,
    targetRole: targetRole || 'Full Stack Engineer',
    matchPercentage,
    summary: matchPercentage >= 75 
      ? `Strong Fit: Candidate meets ${matchPercentage}% of foundational prerequisites.`
      : `Preparation Required: Candidate has a ${100 - matchPercentage}% skill gap in specialized tools.`,
    matchedSkills: matched,
    missingSkills: missing,
    recommendations
  });
});

module.exports = router;
