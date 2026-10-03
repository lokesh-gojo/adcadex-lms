-- ====================================================================
-- Acadex LMS Enterprise Database Schema (PostgreSQL / Supabase)
-- Target: Supabase PostgreSQL + Row Level Security (RLS) Ready
-- ====================================================================

-- 1. Roles & Permissions Enum / Lookup
CREATE TYPE user_role AS ENUM (
    'student',
    'trainer',
    'faculty',
    'hr_admin',
    'placement_officer',
    'super_admin',
    'mentor'
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student' NOT NULL,
    company_id VARCHAR(64) DEFAULT 'comp-1',
    branch_id VARCHAR(64) DEFAULT 'b-1',
    department VARCHAR(255) DEFAULT 'General Technology',
    avatar VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Profiles & Gamification Metrics
CREATE TABLE IF NOT EXISTS profiles (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    weekly_streak INT DEFAULT 0,
    attendance_rate NUMERIC(5,2) DEFAULT 100.0,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    skills TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    instructor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) DEFAULT 0.00,
    duration VARCHAR(50) DEFAULT '40h',
    rating NUMERIC(3,2) DEFAULT 5.00,
    thumbnail_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Course Modules
CREATE TABLE IF NOT EXISTS course_modules (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_num INT DEFAULT 1,
    content_url TEXT,
    duration_mins INT DEFAULT 30
);

-- 6. Course Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    progress INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, dropped
    enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- 7. Assignments
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INT DEFAULT 100,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'published',
    created_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Assignment Submissions & Grading
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) REFERENCES assignments(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    submission_url TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, graded, resubmission_requested
    grade VARCHAR(10),
    score NUMERIC(5,2),
    feedback TEXT,
    graded_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMPTZ
);

-- 9. Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Computer Science',
    duration_mins INT DEFAULT 30,
    passing_score INT DEFAULT 70,
    total_questions INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Quiz Questions
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    quiz_id VARCHAR(64) REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INT NOT NULL,
    explanation TEXT
);

-- 11. Quiz Attempts & Scoring
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    quiz_id VARCHAR(64) REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    answers JSONB NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    passed BOOLEAN NOT NULL,
    xp_earned INT DEFAULT 0,
    attempt_number INT DEFAULT 1,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Attendance Sessions (QR & Code Generation)
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    trainer_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    session_title VARCHAR(255) NOT NULL,
    session_code VARCHAR(16) NOT NULL,
    qr_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Present', -- Present, Late, Excused
    method VARCHAR(50) DEFAULT 'QR Code', -- QR Code, Session Code, Manual
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, student_id)
);

-- 14. Certificates & Public Verification Proofs
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(64) PRIMARY KEY, -- Formatted: ACX-2026-XXXXXX
    student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    grade VARCHAR(10) DEFAULT 'A+',
    issued_date DATE DEFAULT CURRENT_DATE,
    verification_url TEXT NOT NULL,
    blockchain_proof VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. Campus Placement Drives
CREATE TABLE IF NOT EXISTS placements (
    id VARCHAR(64) PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    ctc VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active Drives',
    deadline DATE NOT NULL,
    rounds JSONB DEFAULT '["Coding Round", "Technical Interview", "HR Round"]',
    requirements JSONB DEFAULT '["JavaScript", "SQL", "Git"]',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. Placement Applications & Skill Gap Match
CREATE TABLE IF NOT EXISTS placement_applications (
    id VARCHAR(64) PRIMARY KEY,
    drive_id VARCHAR(64) REFERENCES placements(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    resume_url TEXT,
    match_percentage NUMERIC(5,2),
    status VARCHAR(50) DEFAULT 'Applied', -- Applied, Shortlisted, Interview Scheduled, Selected, Rejected
    applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. Discussion Forums
CREATE TABLE IF NOT EXISTS forum_posts (
    id VARCHAR(64) PRIMARY KEY,
    author_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    tags JSONB DEFAULT '["Discussion"]',
    upvotes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_replies (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) REFERENCES forum_posts(id) ON DELETE CASCADE,
    author_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(50) NOT NULL,
    is_verified_instructor BOOLEAN DEFAULT FALSE,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. User Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'In-App',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
