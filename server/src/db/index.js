const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'lms_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial state
const defaultStore = {
  users: [
    { id: "1", name: 'Alex Johnson', email: 'student@demo.com', password: 'demo123', role: 'student', companyId: 'comp-1', branchId: 'b-1', department: 'Computer Science', joined: '2024-09-01', avatar: 'A', weeklyStreak: 5, attendanceRate: 94, xp: 450 },
    { id: "2", name: 'Dr. Sarah Chen', email: 'trainer@demo.com', password: 'demo123', role: 'trainer', companyId: 'comp-1', branchId: 'b-1', department: 'AI & Data Science', joined: '2023-01-15', avatar: 'S', specialization: 'Neural Networks & LLMs' },
    { id: "3", name: 'Executive Chief Admin', email: 'superadmin@demo.com', password: 'demo123', role: 'super_admin', companyId: 'comp-1', branchId: 'b-1', department: 'Executive Management', joined: '2022-06-01', avatar: 'E' },
    { id: "4", name: 'Jane Recruiter', email: 'hr@demo.com', password: 'demo123', role: 'hr_admin', companyId: 'comp-1', branchId: 'b-2', department: 'Talent Acquisition', joined: '2025-01-10', avatar: 'J' },
    { id: "5", name: 'Marcus Vance', email: 'mentor@demo.com', password: 'demo123', role: 'mentor', companyId: 'comp-1', branchId: 'b-1', department: 'Full Stack Engineering', joined: '2024-03-20', avatar: 'M' },
    { id: "6", name: 'Priya Sharma', email: 'placement@demo.com', password: 'demo123', role: 'placement_officer', companyId: 'comp-1', branchId: 'b-1', department: 'Corporate Relations & Placements', joined: '2023-08-11', avatar: 'P' }
  ],
  courses: [
    { 
      id: "1", 
      title: 'Applied AI & Machine Learning Engineering', 
      instructor: 'Dr. Sarah Chen', 
      category: 'AI & ML', 
      price: 2499, 
      progress: 78, 
      lessons: 60, 
      duration: '60h', 
      rating: 4.9, 
      thumb: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80',
      description: 'Master supervised learning, neural networks, computer vision, and LLM agent integration with real-world enterprise projects.',
      modules: ['Foundations of AI', 'Deep Learning & PyTorch', 'NLP & Transformer Models', 'AI Agent Deployment']
    },
    { 
      id: "2", 
      title: 'Full-Stack Web Development & Microservices', 
      instructor: 'Marcus Vance', 
      category: 'Full Stack', 
      price: 1999, 
      progress: 88, 
      lessons: 75, 
      duration: '75h', 
      rating: 4.8, 
      thumb: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80',
      description: 'Build enterprise MERN applications, GraphQL APIs, Docker containers, and CI/CD pipelines with high performance.',
      modules: ['React & Vite Fundamentals', 'Node.js & Express Architecture', 'PostgreSQL & ORM', 'Cloud Deployment & Docker']
    },
    { 
      id: "3", 
      title: 'Data Science, Analytics & Big Data', 
      instructor: 'Prime Vector Data Lab', 
      category: 'Data Science', 
      price: 1899, 
      progress: 45, 
      lessons: 50, 
      duration: '50h', 
      rating: 4.9, 
      thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
      description: 'Exploratory data analysis, Pandas, SQL data warehousing, Tableau visualization, and predictive modeling.',
      modules: ['Data Wrangling with Pandas', 'SQL Analytics Engine', 'PowerBI & Tableau Dashboards', 'Predictive ML Pipelines']
    }
  ],
  assignments: [
    {
      id: "asg-1",
      courseId: "1",
      course: "Applied AI & ML",
      title: "Fine-tune LoRA Adapter for Domain Specific LLM",
      points: 100,
      due: "2026-10-15",
      description: "Implement a Parameter-Efficient Fine-Tuning (PEFT) pipeline using PyTorch and HuggingFace transformers.",
      status: "pending",
      studentId: "1"
    },
    {
      id: "asg-2",
      courseId: "2",
      course: "Full Stack Web",
      title: "Build RESTful RBAC Middleware & JWT Auth Service",
      points: 100,
      due: "2026-10-12",
      description: "Develop a secure Express backend implementing access and refresh tokens, bcrypt password hashing, and role checks.",
      status: "submitted",
      studentId: "1",
      submissionUrl: "https://github.com/student/acadex-auth-service",
      submittedAt: "2026-10-02T10:00:00Z",
      aiFeedback: "Submission queued for instructor review."
    }
  ],
  submissions: [],
  quizzes: [
    {
      id: "q-1",
      courseId: "2",
      title: "Full-Stack Web & Node.js Core Architecture",
      category: "Full Stack",
      durationMins: 20,
      passingScore: 70,
      totalQuestions: 5,
      questions: [
        {
          id: "q1_1",
          question: "Which Node.js core module is responsible for non-blocking I/O operations and event loops?",
          options: ["libuv", "V8 Engine", "Threadpool Manager", "Cluster API"],
          correctIndex: 0,
          explanation: "libuv is the multi-platform support library providing asynchronous I/O and the event loop in Node.js."
        },
        {
          id: "q1_2",
          question: "Which HTTP header is standard for transmitting JWT bearer authentication tokens?",
          options: ["X-Auth-Token", "Authorization", "Cookie", "Authentication"],
          correctIndex: 1,
          explanation: "Standard authorization header format is 'Authorization: Bearer <token>'."
        },
        {
          id: "q1_3",
          question: "In PostgreSQL, what is the best practice for hashing user passwords securely?",
          options: ["MD5 with salt", "SHA-256", "bcrypt / Argon2", "Base64 encoding"],
          correctIndex: 2,
          explanation: "bcrypt and Argon2 include configurable work factors and built-in salts to resist brute-force cracking."
        },
        {
          id: "q1_4",
          question: "What is the purpose of React key prop in lists?",
          options: ["Styling elements", "Helping React identify which items have changed, added, or removed", "Binding event handlers", "Passing props to children"],
          correctIndex: 1,
          explanation: "Keys give stable identity to elements inside the Virtual DOM reconciliation algorithm."
        },
        {
          id: "q1_5",
          question: "Which HTTP status code signifies Forbidden access when credentials are authenticated but lack required permissions?",
          options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "422 Unprocessable Entity"],
          correctIndex: 1,
          explanation: "401 indicates unauthenticated; 403 indicates authenticated but unauthorized (forbidden by RBAC)."
        }
      ]
    }
  ],
  quizAttempts: [],
  attendanceSessions: [
    {
      id: "att-sess-1",
      courseId: "1",
      courseTitle: "Applied AI & ML",
      trainerId: "2",
      sessionTitle: "Transformer Architecture & Attention Mechanisms",
      sessionCode: "ACAD94",
      qrToken: "qr_acad_session_att_sess_1_2026",
      expiresAt: "2026-10-04T18:00:00Z",
      status: "active"
    }
  ],
  attendanceRecords: [
    { id: "ar-1", sessionId: "att-sess-1", studentId: "1", studentName: "Alex Johnson", status: "Present", method: "QR Code", timestamp: "2026-10-03T09:05:00Z" }
  ],
  certificates: [
    {
      id: "ACX-2026-000123",
      studentId: "1",
      studentName: "Alex Johnson",
      course: "Applied AI & Machine Learning Engineering",
      grade: "A+",
      issuedDate: "2026-09-15",
      verificationUrl: "https://lokesh-gojo.github.io/adcadex-lms/certificates.html?id=ACX-2026-000123",
      blockchainProof: "0x7fa94cd01ee2834b92c8172901a"
    }
  ],
  placements: [
    {
      id: "p-1",
      company: "NeuroScale Technologies",
      role: "AI / Machine Learning Engineer",
      ctc: "14.5 LPA",
      location: "Bangalore / Remote",
      status: "Active Drives",
      deadline: "2026-10-25",
      rounds: ["Online Coding Test", "Technical System Design", "Culture Fit HR"],
      requirements: ["Python", "PyTorch", "FastAPI", "Transformers", "SQL"]
    },
    {
      id: "p-2",
      company: "CloudVanguard Enterprise",
      role: "Full Stack Engineer (React + Node.js)",
      ctc: "12.0 LPA",
      location: "Chennai / Hybrid",
      status: "Active Drives",
      deadline: "2026-10-30",
      rounds: ["DSA Assessment", "Full Stack Project Round", "Engineering Lead Interview"],
      requirements: ["React", "Node.js", "PostgreSQL", "Docker", "REST APIs"]
    }
  ],
  placementApplications: [],
  forumPosts: [
    {
      id: "fp-1",
      authorId: "1",
      author: "Alex Johnson",
      authorRole: "student",
      authorAvatar: "A",
      title: "Best practices for setting up Docker containers with Vite + Express in production?",
      content: "When deploying full-stack React + Express to container platforms (Render, Railway, VPS), do you prefer multi-stage Docker builds or serving the static build through an Nginx reverse proxy?",
      category: "Full Stack",
      tags: ["Docker", "Deployment", "Vite"],
      upvotes: 18,
      createdAt: "2026-10-01T14:30:00Z",
      replies: [
        {
          id: "fr-101",
          author: "Marcus Vance",
          authorRole: "mentor",
          authorAvatar: "M",
          content: "A multi-stage build is ideal: Stage 1 builds the Vite bundle (`npm run build`), Stage 2 takes a minimal Alpine Node image, installs only production dependencies, and either serves via Express static or an Nginx sidecar.",
          isVerifiedInstructor: true,
          upvotes: 15,
          createdAt: "2026-10-01T15:45:00Z"
        }
      ]
    }
  ],
  notifications: [
    {
      id: "notif-1",
      userId: "1",
      title: "New Quiz Available",
      message: "Full-Stack Web & Node.js Core Architecture quiz is now open for evaluation.",
      channel: "Academic",
      read: false,
      createdAt: new Date().toISOString()
    }
  ]
};

// Initialize or load state
let store = defaultStore;
if (fs.existsSync(STORE_FILE)) {
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    store = { ...defaultStore, ...parsed };
  } catch (err) {
    console.error('Error loading store, using defaults:', err.message);
  }
}

// Ensure passwords are consistently hashed
if (Array.isArray(store.users)) {
  store.users.forEach(u => {
    if (u.password && !u.password.startsWith('$2a$') && !u.password.startsWith('$2b$')) {
      u.password = bcrypt.hashSync(u.password, 10);
    }
  });
}

// Persistence Method
store.save = function() {
  try {
    const { save, ...toPersist } = store;
    fs.writeFileSync(STORE_FILE, JSON.stringify(toPersist, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to persist store:', err.message);
    return false;
  }
};

// Save initial snapshot
store.save();

module.exports = store;
