const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  const { password: _, ...userData } = user;
  res.json({
    success: true,
    message: `Welcome back, ${user.name}! Role: ${user.role.toUpperCase()}`,
    token,
    user: userData
  });
});

// POST /api/auth/register
router.post('/register', authLimiter, (req, res) => {
  const { name, email, password, companyId, branchId } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email is already registered' });
  }

  // Security Rule: Public registration strictly assigns role 'student'.
  // Admin and faculty roles can only be granted by existing Super Admins.
  const assignedRole = 'student';
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: String(Date.now()),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: assignedRole,
    companyId: companyId || 'comp-1',
    branchId: branchId || 'b-1',
    department: 'General Technology',
    joined: new Date().toISOString().split('T')[0],
    avatar: name.trim()[0].toUpperCase(),
    weeklyStreak: 1,
    attendanceRate: 100,
    xp: 100
  };

  db.users.push(newUser);
  db.save();

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  const { password: _, ...userData } = newUser;
  res.status(201).json({
    success: true,
    message: `Account created successfully for ${name}!`,
    token,
    user: userData
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found' });
  }
  const { password: _, ...userData } = user;
  res.json({ success: true, user: userData });
});

module.exports = router;
