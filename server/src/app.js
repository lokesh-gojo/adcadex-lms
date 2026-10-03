const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const db = require('./db');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import Modular Route Handlers
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const quizRoutes = require('./routes/quiz.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const certificateRoutes = require('./routes/certificate.routes');
const placementRoutes = require('./routes/placement.routes');
const aiRoutes = require('./routes/ai.routes');
const compilerRoutes = require('./routes/compiler.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || config.corsOrigins.includes(origin) || origin.endsWith('.github.io')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));
app.use(generalLimiter);

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Acadex LMS Production API',
    version: '2.1.0-modular',
    timestamp: new Date().toISOString()
  });
});

// ── Register Feature Route Handlers ─────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Backwards Compatible Aliases ────────────────────────────
// Backward compatibility for static HTML frontend pages
app.use('/api/student/dashboard', (req, res, next) => {
  req.url = '/student';
  dashboardRoutes(req, res, next);
});
app.use('/api/faculty/dashboard', (req, res, next) => {
  req.url = '/faculty';
  dashboardRoutes(req, res, next);
});
app.use('/api/admin/dashboard', (req, res, next) => {
  req.url = '/admin';
  dashboardRoutes(req, res, next);
});

// Forum Endpoints
app.get('/api/forum/posts', (req, res) => {
  res.json({ success: true, posts: db.forumPosts || [] });
});

app.post('/api/forum/posts', (req, res) => {
  const { title, content, category, tags, author, authorRole } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const newPost = {
    id: `fp-${Date.now()}`,
    author: author || 'Alex Johnson',
    authorRole: authorRole || 'student',
    authorAvatar: (author || 'A')[0].toUpperCase(),
    title: title.trim(),
    content: content.trim(),
    category: category || 'General',
    tags: Array.isArray(tags) ? tags : ['Discussion'],
    upvotes: 1,
    createdAt: new Date().toISOString(),
    replies: []
  };

  if (!db.forumPosts) db.forumPosts = [];
  db.forumPosts.unshift(newPost);
  db.save();

  res.status(201).json({ success: true, message: 'Discussion post created successfully', post: newPost });
});

app.post('/api/forum/posts/:id/reply', (req, res) => {
  const { content, author, authorRole, isVerifiedInstructor } = req.body;
  const post = (db.forumPosts || []).find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const newReply = {
    id: `fr-${Date.now()}`,
    author: author || 'Alex Johnson',
    authorRole: authorRole || 'student',
    authorAvatar: (author || 'A')[0].toUpperCase(),
    content: (content || '').trim(),
    isVerifiedInstructor: Boolean(isVerifiedInstructor || authorRole === 'trainer' || authorRole === 'mentor'),
    upvotes: 0,
    createdAt: new Date().toISOString()
  };

  if (!post.replies) post.replies = [];
  post.replies.push(newReply);
  db.save();

  res.status(201).json({ success: true, message: 'Reply added successfully', reply: newReply, post });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, notifications: db.notifications || [] });
});

// Global 404 Handler for Unhandled API Routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint '${req.originalUrl}' not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Acadex Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

module.exports = app;
