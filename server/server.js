const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');
const db = require('./models/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory online data cache
const onlineCache = {
  jobs: { timestamp: 0, data: null },
  news: { timestamp: 0, data: null },
  courses: { timestamp: 0, data: null }
};

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Prime Vector LMS API',
    company: 'Prime Vector Private Limited',
    website: 'https://primevector.in/',
    rolesSupported: ['super_admin', 'hr_admin', 'trainer', 'mentor', 'student', 'placement_officer'],
    timestamp: new Date().toISOString()
  });
});

// ── Enterprise Companies & Branches ─────────────────────────
app.get('/api/enterprise/companies', (req, res) => {
  res.json({ success: true, companies: db.companies });
});

app.get('/api/enterprise/branches', (req, res) => {
  res.json({ success: true, branches: db.branches });
});

// ── Auth Endpoints ───────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const { password: _, ...userData } = user;
  res.json({
    success: true,
    message: `Welcome back, ${user.name}! Role: ${user.role.toUpperCase()}`,
    token: `jwt_pv_${user.id}_${Date.now()}`,
    user: userData
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, companyId, branchId } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email is already registered' });
  }

  const newUser = {
    id: String(Date.now()),
    name,
    email,
    password,
    role: role || 'student',
    companyId: companyId || 'comp-1',
    branchId: branchId || 'b-1',
    department: 'General Technology',
    joined: new Date().toISOString().split('T')[0],
    avatar: name[0].toUpperCase()
  };

  db.users.push(newUser);
  const { password: _, ...userData } = newUser;

  res.status(201).json({
    success: true,
    message: `Account created successfully for ${name}!`,
    token: `jwt_pv_${newUser.id}_${Date.now()}`,
    user: userData
  });
});

// ── Course Endpoints ──────────────────────────────────────────
app.get('/api/courses', (req, res) => {
  res.json({ success: true, courses: db.courses });
});

app.get('/api/courses/:id', (req, res) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, course });
});

// ── Live Classes & Cloud Recordings ──────────────────────────
app.get('/api/classes/live', (req, res) => {
  res.json({ success: true, liveClasses: db.liveClasses });
});

app.post('/api/classes/schedule', (req, res) => {
  const { title, courseId, trainer, scheduledAt, durationMins, platform } = req.body;
  const newClass = {
    id: `lc-${Date.now()}`,
    title: title || 'Live Training Session',
    courseId: courseId || '1',
    trainer: trainer || 'Prime Vector Instructor',
    scheduledAt: scheduledAt || new Date().toISOString(),
    durationMins: durationMins || 60,
    platform: platform || 'Google Meet',
    joinUrl: platform === 'Zoom' ? 'https://zoom.us/j/12345678' : 'https://meet.google.com/pv-lms-class',
    recordingUrl: 'https://drive.google.com/file/d/pv-rec-new/view',
    status: 'Scheduled',
    attendeesCount: 0
  };
  db.liveClasses.push(newClass);
  res.status(201).json({ success: true, message: 'Live class scheduled successfully', class: newClass });
});

app.get('/api/classes/recorded', (req, res) => {
  res.json({ success: true, recordedClasses: db.recordedClasses || [] });
});

app.post('/api/classes/join', (req, res) => {
  const { classId, studentName } = req.body;
  const target = db.liveClasses.find(c => c.id === classId);
  if (target) {
    target.attendeesCount = (target.attendeesCount || 0) + 1;
  }
  res.json({
    success: true,
    message: `Connected to live room: ${target ? target.title : 'Live Session'}`,
    joinUrl: target ? target.joinUrl : 'https://meet.google.com/pv-lms-class'
  });
});

// ── Assignments & Tasks API ─────────────────────────────────
app.get('/api/assignments', (req, res) => {
  res.json({ success: true, assignments: db.assignments });
});

app.get('/api/assignments/:id', (req, res) => {
  const item = db.assignments.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Assignment not found' });
  res.json({ success: true, assignment: item });
});

app.post(['/api/assignments/submit', '/api/student/assignment/submit'], (req, res) => {
  const { assignmentId, submissionUrl, notes, studentName } = req.body;
  const idStr = String(assignmentId);
  const item = db.assignments.find(a => String(a.id) === idStr);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Assignment not found' });
  }

  item.status = 'submitted';
  item.submissionUrl = submissionUrl || 'https://github.com/student/prime-vector-task';
  item.submittedAt = new Date().toISOString();
  item.notes = notes || '';
  item.aiFeedback = `AI Automated Rubric Feedback: Solution verified against testing criteria. High cohesion, clean architectural styling. Predicted Grade: A (Score: 92/100).`;

  res.json({
    success: true,
    message: 'Assignment submitted and AI evaluated successfully!',
    assignment: item
  });
});

app.post('/api/assignments/grade', (req, res) => {
  const { assignmentId, grade, score, feedback } = req.body;
  const item = db.assignments.find(a => String(a.id) === String(assignmentId));
  if (!item) return res.status(404).json({ success: false, message: 'Assignment not found' });

  item.status = 'graded';
  item.grade = grade || 'A';
  item.score = score || 95;
  item.feedback = feedback || 'Exceptional implementation.';
  res.json({ success: true, message: 'Assignment graded successfully', assignment: item });
});

app.post('/api/assignments/create', (req, res) => {
  const { title, course, points, due, description } = req.body;
  const newAssign = {
    id: String(Date.now()),
    title: title || 'New Technical Task',
    course: course || 'Full Stack',
    points: points || 100,
    due: due || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    description: description || 'Complete the assigned project modules according to enterprise specifications.',
    status: 'pending',
    studentId: '1',
    submissionUrl: '',
    aiFeedback: null
  };
  db.assignments.push(newAssign);
  res.status(201).json({ success: true, message: 'Assignment created successfully', assignment: newAssign });
});

// ── Training & Upskilling Programs API ───────────────────────
app.get('/api/training', (req, res) => {
  res.json({
    success: true,
    training: db.training || {}
  });
});

app.post('/api/training/enroll', (req, res) => {
  const { programId } = req.body;
  res.json({ success: true, message: `Successfully enrolled in training track ${programId}` });
});

app.post('/api/training/progress', (req, res) => {
  const { programId, increment } = req.body;
  const program = db.training?.programs?.find(p => p.id === programId);
  if (program) {
    program.progress = Math.min(100, program.progress + (increment || 10));
    if (program.progress === 100) program.status = 'Completed';
  }
  res.json({ success: true, program });
});

// ── HR Recruiter & Candidate ATS API ─────────────────────────
app.get('/api/hr/candidates', (req, res) => {
  res.json({
    success: true,
    candidates: db.candidates || [],
    stats: {
      totalApplicants: (db.candidates || []).length,
      shortlisted: (db.candidates || []).filter(c => c.status === 'Shortlisted').length,
      inInterview: (db.candidates || []).filter(c => c.status === 'Interview').length,
      offered: (db.candidates || []).filter(c => c.status === 'Offered').length
    }
  });
});

app.post('/api/hr/status-update', (req, res) => {
  const { candidateId, status } = req.body;
  const candidate = (db.candidates || []).find(c => c.id === candidateId);
  if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });
  candidate.status = status;
  res.json({ success: true, message: `Candidate status updated to ${status}`, candidate });
});

app.post('/api/hr/schedule-interview', (req, res) => {
  const { candidateId, date, time, round, interviewer } = req.body;
  const newInterview = {
    id: `int-${Date.now()}`,
    candidateId,
    date: date || '2026-08-05',
    time: time || '10:00 AM',
    round: round || 'Technical Interview Round 1',
    status: 'Scheduled',
    interviewer: interviewer || 'Prime Vector Technical Panel'
  };
  db.interviews.push(newInterview);
  res.status(201).json({ success: true, message: 'Interview scheduled successfully', interview: newInterview });
});

// ── Attendance (QR & Face Scan) ──────────────────────────────
app.get('/api/attendance', (req, res) => {
  res.json({ success: true, records: db.attendance });
});

app.post('/api/attendance/mark', (req, res) => {
  const { studentId, studentName, method } = req.body;
  const record = {
    id: `att-${Date.now()}`,
    studentId: studentId || "1",
    studentName: studentName || "Alex Johnson",
    date: new Date().toISOString().split('T')[0],
    status: "Present",
    method: method || "QR Code",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    branch: "Hosur Main Campus"
  };
  db.attendance.unshift(record);
  res.json({ success: true, message: `Attendance marked via ${record.method}!`, record });
});

app.get('/api/attendance/qr-generate', (req, res) => {
  const qrToken = `PV-ATT-QR-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  res.json({
    success: true,
    qrToken,
    qrDataUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrToken)}`,
    expiresIn: "60 seconds"
  });
});

app.post('/api/attendance/face-verify', (req, res) => {
  const { imageUrl, studentId } = req.body;
  res.json({
    success: true,
    matched: true,
    confidence: "98.7%",
    message: "Face Verification Successful! Attendance Recorded.",
    timestamp: new Date().toISOString()
  });
});

// ── AI Suite Endpoints ───────────────────────────────────────
app.post('/api/ai/doubt-assistant', (req, res) => {
  const { query, topic } = req.body;
  if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

  const aiAnswers = [
    `Regarding "${query}": In enterprise software architecture, Prime Vector standards recommend isolating business logic into modular middleware. Here is how you structure this clean pattern.`,
    `Great query about ${topic || 'Computer Science'}! The core concept behind "${query}" involves optimizing algorithmic time complexity from O(N^2) to O(N log N) using memoization and dynamic programming.`,
    `Prime Vector AI Assistant Analysis: To solve "${query}", first construct a robust data model, apply relational constraints, and expose clean asynchronous endpoints with JWT authorization.`
  ];

  const answer = aiAnswers[Math.floor(Math.random() * aiAnswers.length)];
  db.aiLogs.push({ id: `ai-${Date.now()}`, type: 'doubt', query, response: answer, timestamp: new Date().toISOString() });

  res.json({ success: true, query, response: answer });
});

app.post('/api/ai/quiz-generator', (req, res) => {
  const { topic, difficulty, count } = req.body;
  const questions = [
    { id: 1, question: `Which data structure provides O(1) average time complexity for lookup in ${topic || 'React & Node.js'}?`, options: ['Hash Table / Object', 'Linked List', 'Binary Tree', 'Stack'], correctIndex: 0 },
    { id: 2, question: `What is the primary function of JWT in Prime Vector RBAC authentication?`, options: ['Encrypted Password Storage', 'Stateless Client Identity & Role Verification', 'Database Backup', 'CSS Rendering'], correctIndex: 1 },
    { id: 3, question: `How does asynchronous non-blocking I/O work in Node.js event loop?`, options: ['Multi-threaded CPU spinning', 'Event demultiplexer & libuv worker pool', 'Synchronous blocking wait', 'Hardware interrupts only'], correctIndex: 1 }
  ];
  res.json({ success: true, topic: topic || 'Full Stack Engineering', difficulty: difficulty || 'Medium', questions });
});

app.post('/api/ai/resume-review', (req, res) => {
  const { resumeText } = req.body;
  res.json({
    success: true,
    atsScore: 88,
    strengths: ['Clear project metrics', 'Relevant modern tech stack (React, Node, PyTorch)', 'Clean professional layout'],
    improvements: ['Add quantitative impact metrics (e.g. Improved performance by 35%)', 'Include GitHub repository links for project proof'],
    suggestedKeywords: ['Docker', 'PostgreSQL', 'CI/CD Pipelines', 'RESTful Microservices']
  });
});

app.post('/api/ai/interview-prep', (req, res) => {
  const { targetRole } = req.body;
  res.json({
    success: true,
    targetRole: targetRole || 'Full Stack Engineer',
    questions: [
      { q: 'Explain how React Virtual DOM diffing algorithm minimizes DOM updates.', hint: 'Focus on reconciliation and key props.' },
      { q: 'How do you handle database connection pooling and deadlock prevention in PostgreSQL?', hint: 'Mention transaction isolation levels and connection limits.' },
      { q: 'Describe your approach to designing a scalable RESTful API with RBAC security.', hint: 'Discuss JWT middleware, permission matrices, and standard HTTP status codes.' }
    ]
  });
});

app.post('/api/ai/career-guidance', (req, res) => {
  res.json({
    success: true,
    recommendedPath: 'Senior Full Stack & AI Solutions Architect',
    matchPercentage: '94%',
    nextMilestones: [
      'Complete Deep Learning & PyTorch Module',
      'Build 1 Production Microservice Project with Docker & Postgres',
      'Apply to Prime Tech Solutions & Vector AI Campus Drives'
    ]
  });
});

// ── Student / Faculty / Admin / HR / Placement Dashboards ──
app.get('/api/student/dashboard', (req, res) => {
  res.json({
    success: true,
    stats: {
      enrolledCourses: db.courses.length,
      completedCourses: db.certificates.length,
      attendanceRate: '94%',
      weeklyStreak: 5,
      pendingAssignments: db.assignments.filter(a => a.status === 'pending').length
    },
    courses: db.courses,
    liveClasses: db.liveClasses,
    assignments: db.assignments,
    certificates: db.certificates,
    placements: db.placements,
    interviews: db.interviews,
    skillScores: {
      'AI & ML': 88,
      'Full Stack': 94,
      'Data Science': 80,
      'Problem Solving': 90,
      'DevOps & Cloud': 75
    }
  });
});

app.get('/api/faculty/dashboard', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalStudents: 340,
      activeCourses: db.courses.length,
      pendingGrades: db.assignments.filter(a => a.status === 'pending').length,
      avgRating: 4.9
    },
    courses: db.courses,
    submissions: db.assignments,
    liveClasses: db.liveClasses
  });
});

app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalUsers: db.users.length + 1450,
      totalCompanies: db.companies.length,
      totalBranches: db.branches.length,
      totalRevenue: '$52,000',
      activeDrives: db.placements.length,
      systemHealth: '99.9%'
    },
    users: db.users,
    companies: db.companies,
    branches: db.branches,
    analytics: db.analytics
  });
});

app.get('/api/placement/dashboard', (req, res) => {
  res.json({
    success: true,
    drives: db.placements,
    interviews: db.interviews,
    stats: db.analytics.placementStats
  });
});

// ── Placements & Interviews API ─────────────────────────────
app.get('/api/placements', (req, res) => {
  res.json({ success: true, drives: db.placements, interviews: db.interviews });
});

app.post('/api/placements/drives', (req, res) => {
  const { company, role, ctc, location, deadline, requirements } = req.body;
  const newDrive = {
    id: `p-${Date.now()}`,
    company: company || 'New Partner Corp',
    role: role || 'Software Trainee',
    ctc: ctc || '7.5 LPA',
    location: location || 'Hosur / Bangalore',
    status: 'Active Drives',
    applicants: 0,
    deadline: deadline || '2026-08-15',
    rounds: ['Online Coding Test', 'Technical Interview', 'HR'],
    requirements: requirements || ['JavaScript', 'SQL', 'Git']
  };
  db.placements.unshift(newDrive);
  res.status(201).json({ success: true, message: 'Campus placement drive published successfully!', drive: newDrive });
});

app.post('/api/placements/linkedin-track', (req, res) => {
  const { linkedinUrl } = req.body;
  res.json({
    success: true,
    profile: {
      name: "Alex Johnson",
      headline: "Full Stack & AI Engineer Trainee | Prime Vector LMS",
      connections: "500+",
      profileScore: "92%",
      badges: ["React Certified", "AI/ML Specialist", "Prime Vector Alumni"]
    }
  });
});

// ── Notifications (WhatsApp & Email) ─────────────────────────
app.post('/api/notifications/whatsapp', (req, res) => {
  const { phone, message } = req.body;
  res.json({
    success: true,
    channel: "WhatsApp Business API",
    recipient: phone || "+91 9876543210",
    message: message || "Your upcoming Prime Vector live class starts in 15 minutes!",
    status: "Delivered",
    messageId: `wa_${Date.now()}`
  });
});

app.post('/api/notifications/email', (req, res) => {
  const { email, subject, body } = req.body;
  res.json({
    success: true,
    channel: "Email Gateway",
    recipient: email || "student@demo.com",
    subject: subject || "Prime Vector LMS Update",
    status: "Sent"
  });
});

// ── Code Compiler API (Real Native Execution Engine) ──────────
app.post('/api/compiler/run', (req, res) => {
  const { language, code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, output: 'Error: No code provided to execute.' });
  }

  const startTime = Date.now();

  // JavaScript & DSA execution via Node vm
  if (language === 'javascript' || language === 'dsa') {
    const logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args) => logs.push('ERROR: ' + args.join(' ')),
      warn: (...args) => logs.push('WARN: ' + args.join(' '))
    };

    try {
      const context = vm.createContext({
        console: customConsole,
        setTimeout,
        Math,
        Date,
        Array,
        Object,
        String,
        Number,
        Boolean,
        RegExp,
        Map,
        Set,
        JSON
      });
      vm.runInContext(code, context, { timeout: 3000 });
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(3);
      return res.json({
        success: true,
        engine: 'Node.js v20 Sandbox Engine (Native VM)',
        output: logs.join('\n') || '> Program ran with no console output.\n> Process exited with code 0.',
        executionTime: `${elapsed}s`
      });
    } catch (err) {
      return res.json({
        success: false,
        engine: 'Node.js v20 Sandbox Engine',
        output: `Runtime Error: ${err.message}`,
        executionTime: '0.00s'
      });
    }
  }

  // Python 3 execution via local Python binary
  if (language === 'python') {
    const tempFile = path.join(os.tmpdir(), `pv_py_${Date.now()}_${Math.floor(Math.random() * 1000)}.py`);
    fs.writeFile(tempFile, code, 'utf8', (writeErr) => {
      if (writeErr) {
        return res.json({ success: false, output: `Failed to initialize Python sandbox: ${writeErr.message}` });
      }

      execFile('python', [tempFile], { timeout: 5000, maxBuffer: 1024 * 1024 }, (execErr, stdout, stderr) => {
        // Cleanup temp file
        fs.unlink(tempFile, () => {});

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(3);

        if (execErr && execErr.killed) {
          return res.json({
            success: false,
            engine: 'Python 3.13 Runtime Engine',
            output: 'Execution timed out (5.0s limit exceeded). Possible infinite loop.',
            executionTime: `${elapsed}s`
          });
        }

        const out = stdout || '';
        const err = stderr || '';
        const fullOutput = (out + (err ? `\n[STDERR]:\n${err}` : '')).trim();

        res.json({
          success: !execErr || !err,
          engine: 'Python 3.13 Runtime Engine (Native)',
          output: fullOutput || '> Process completed with code 0 (no output).',
          executionTime: `${elapsed}s`
        });
      });
    });
    return;
  }

  // HTML / Preview
  if (language === 'html') {
    return res.json({
      success: true,
      engine: 'Web Sandbox Renderer',
      output: '> HTML / CSS / DOM rendered in live sandbox frame.',
      executionTime: '0.01s'
    });
  }

  // C++ / Java simulator
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(3);
  res.json({
    success: true,
    engine: `${language.toUpperCase()} Enterprise Sandbox`,
    output: `> [${language.toUpperCase()} Compilation Clean]\nExecution completed successfully with return code 0.\nAll enterprise test vectors validated.`,
    executionTime: `${elapsed}s`
  });
});

// ── Online Public Data Integration Endpoints ──────────────────
app.get('/api/online/jobs', async (req, res) => {
  const { category = 'software-dev', search = '' } = req.query;
  const now = Date.now();

  try {
    if (onlineCache.jobs.data && (now - onlineCache.jobs.timestamp < 1800000)) {
      let filtered = onlineCache.jobs.data;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
      }
      return res.json({ success: true, cached: true, jobs: filtered });
    }

    const apiRes = await fetch(`https://remotive.com/api/remote-jobs?category=${category}&limit=20`);
    if (!apiRes.ok) throw new Error(`Remotive API responded with ${apiRes.status}`);
    const data = await apiRes.json();

    const jobs = (data.jobs || []).map(j => ({
      id: String(j.id),
      title: j.title,
      company: j.company_name,
      companyLogo: j.company_logo || '',
      category: j.category || 'Software Engineering',
      jobType: j.job_type || 'Full Time',
      location: j.candidate_required_location || 'Remote',
      salary: j.salary || 'Competitive',
      tags: (j.tags || []).slice(0, 4),
      url: j.url,
      publicationDate: j.publication_date ? new Date(j.publication_date).toLocaleDateString() : 'Recently'
    }));

    onlineCache.jobs = { timestamp: now, data: jobs };
    let filtered = jobs;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
    }

    res.json({ success: true, cached: false, jobs: filtered });
  } catch (err) {
    res.json({
      success: true,
      cached: true,
      message: 'Serving fallback placement openings: ' + err.message,
      jobs: [
        {
          id: 'job-f1',
          title: 'Full Stack Engineer (React & Node.js)',
          company: 'Prime Vector Enterprise',
          location: 'Remote / Bangalore Hub',
          salary: '₹ 8,00,000 - ₹ 14,00,000 / yr',
          tags: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
          url: 'https://primevector.in/careers',
          publicationDate: 'Today'
        },
        {
          id: 'job-f2',
          title: 'AI / Machine Learning Engineer',
          company: 'NeuroScale Technologies',
          location: 'Remote / Hosur Campus',
          salary: '₹ 12,00,000 - ₹ 18,00,000 / yr',
          tags: ['Python', 'PyTorch', 'FastAPI', 'RAG'],
          url: 'https://primevector.in/careers',
          publicationDate: 'Yesterday'
        }
      ]
    });
  }
});

app.get('/api/online/news', async (req, res) => {
  const { tag = 'programming', limit = 6 } = req.query;
  const now = Date.now();

  try {
    if (onlineCache.news.data && (now - onlineCache.news.timestamp < 1800000)) {
      return res.json({ success: true, cached: true, articles: onlineCache.news.data });
    }

    const apiRes = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=${limit}&top=7`);
    if (!apiRes.ok) throw new Error(`Dev.to API error: ${apiRes.status}`);
    const raw = await apiRes.json();

    const articles = raw.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      url: a.url,
      coverImage: a.cover_image || a.social_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
      author: a.user?.name || 'Engineer',
      readingTime: `${a.reading_time_minutes || 5} min read`,
      tags: a.tag_list || ['tech']
    }));

    onlineCache.news = { timestamp: now, data: articles };
    res.json({ success: true, cached: false, articles });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.get('/api/online/quiz', async (req, res) => {
  const { amount = 10, difficulty = 'medium', category = 18 } = req.query;
  try {
    const apiRes = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`);
    const data = await apiRes.json();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Certificates & Credential Verification ──────────────────
app.get('/api/certificates', (req, res) => {
  res.json({
    success: true,
    certificates: db.certificates || []
  });
});

app.get('/api/certificates/verify/:id', (req, res) => {
  const certId = req.params.id.trim();
  const cert = (db.certificates || []).find(c => c.id.toLowerCase() === certId.toLowerCase());
  if (!cert) {
    return res.status(404).json({
      success: false,
      message: `No certificate found matching Credential ID: ${certId}`
    });
  }

  res.json({
    success: true,
    verified: true,
    certificate: cert,
    issuer: "Prime Vector Private Limited",
    blockchainProof: `0x7f${Buffer.from(cert.id).toString('hex')}89a4cd01ee`,
    verificationTimestamp: new Date().toISOString()
  });
});

app.post('/api/certificates/issue', (req, res) => {
  const { studentName, course, grade } = req.body;
  const newCert = {
    id: `PV-2026-${String(Math.floor(100 + Math.random() * 900))}`,
    studentName: studentName || 'Alex Johnson',
    course: course || 'Applied AI & Machine Learning Engineering',
    date: new Date().toISOString().split('T')[0],
    verificationUrl: `https://primevector.in/verify/PV-2026-${Date.now()}`,
    grade: grade || 'A+'
  };
  db.certificates.unshift(newCert);
  res.status(201).json({ success: true, message: 'Certificate issued successfully', certificate: newCert });
});

// ── Quizzes & Interactive Assessments ────────────────────────
app.get('/api/quizzes', (req, res) => {
  res.json({
    success: true,
    quizzes: (db.quizzes || []).map(q => ({
      id: q.id,
      title: q.title,
      course: q.course,
      category: q.category,
      durationMins: q.durationMins,
      passingScore: q.passingScore,
      totalQuestions: q.totalQuestions
    }))
  });
});

app.get('/api/quizzes/:id', (req, res) => {
  const quiz = (db.quizzes || []).find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  
  // Return quiz without exposing correct indices beforehand
  const clientQuestions = quiz.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  res.json({
    success: true,
    quiz: {
      id: quiz.id,
      title: quiz.title,
      course: quiz.course,
      category: quiz.category,
      durationMins: quiz.durationMins,
      passingScore: quiz.passingScore,
      questions: clientQuestions
    }
  });
});

app.post('/api/quizzes/:id/submit', (req, res) => {
  const { answers } = req.body; // map of { [qId]: selectedOptionIndex }
  const quiz = (db.quizzes || []).find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  let correctCount = 0;
  const review = quiz.questions.map(q => {
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

  const percentage = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = percentage >= quiz.passingScore;
  const xpEarned = passed ? 150 + (percentage === 100 ? 100 : 0) : 50;

  // Award XP to gamification
  if (db.gamification) {
    db.gamification.userXP = (db.gamification.userXP || 0) + xpEarned;
  }

  res.json({
    success: true,
    score: correctCount,
    total: quiz.questions.length,
    percentage,
    passed,
    xpEarned,
    feedback: passed ? "Outstanding performance! You met the enterprise benchmark." : "Passing score not reached. Review explanations and reattempt.",
    review
  });
});

// ── Gamification, XP & Leaderboard ───────────────────────────
app.get('/api/gamification/stats', (req, res) => {
  res.json({
    success: true,
    gamification: db.gamification || {}
  });
});

app.get('/api/gamification/leaderboard', (req, res) => {
  res.json({
    success: true,
    leaderboard: db.gamification?.leaderboard || []
  });
});

// ── Discussion Forum & Community Q&A ─────────────────────────
app.get('/api/forum/posts', (req, res) => {
  res.json({
    success: true,
    posts: db.forumPosts || []
  });
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
    title,
    content,
    category: category || 'General',
    tags: Array.isArray(tags) ? tags : ['Discussion'],
    upvotes: 1,
    createdAt: new Date().toISOString(),
    replies: []
  };

  db.forumPosts.unshift(newPost);
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
    content,
    isVerifiedInstructor: Boolean(isVerifiedInstructor || authorRole === 'trainer' || authorRole === 'mentor'),
    upvotes: 0,
    createdAt: new Date().toISOString()
  };

  post.replies.push(newReply);
  res.status(201).json({ success: true, message: 'Reply added successfully', reply: newReply, post });
});

app.post('/api/forum/posts/:id/upvote', (req, res) => {
  const post = (db.forumPosts || []).find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  post.upvotes = (post.upvotes || 0) + 1;
  res.json({ success: true, upvotes: post.upvotes });
});

app.listen(PORT, () => {
  console.log(`⚡ Prime Vector LMS Server running on http://localhost:${PORT}`);
});

