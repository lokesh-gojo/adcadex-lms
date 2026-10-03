# Acadex LMS (LayerIQ) — Next-Gen Learning Management System

Acadex LMS is a full-featured, modern Learning Management & Placement Preparation System built for students, instructors, and administrators. It integrates live web data, interactive code sandboxes, dynamic quizzes, real-time placement tracking, and an AI-assisted ATS Resume Architect.

---

## 🌟 Key Highlights & Features

### 🎓 Academic & Learning Ecosystem
- **Courses & Global MOOCs (`course.html`)**: Browse internal masterclasses alongside curated external programs (Harvard CS50, MIT OCW, FullStackOpen, Fast.ai) with syllabus previews and enrollment.
- **Interactive Video Classrooms (`classes.html`)**: Streamed lecture masterclasses with integrated key takeaways and progress milestones.
- **Multi-Language Online Code Sandbox (`compiler.html`)**: Real-time code execution sandbox for Python 3 and JavaScript with stdout, stderr, and benchmark metrics.
- **Dynamic Online Question Bank (`quiz.html`)**: Live trivia & CS assessment bank powered by the Open Trivia Database API with customizable difficulties, immediate score breakdowns, and XP rewards.

### 💼 Career & Placement Readiness
- **AI ATS Resume Architect (`resume-builder.html`)**:
  - Live split-screen interface with instant A4 sheet rendering on every keystroke.
  - Real-time ATS strength scoring (0–100%) checking keyword density, contact metrics, and action verbs.
  - 3 professional style presets (*Modern Professional*, *Ivy League Classic*, *Tech Minimalist*) and 5 accent palettes.
  - AI Bullet Point Optimizer converting basic responsibilities into high-impact achievements.
  - Clean PDF export via native A4 `@media print` rules.
- **Live Tech Placements Feed (`placement.html`)**: Real-time remote and tech job listings pulled live from the Remotive API with role filters, keyword search, and application tracking.

### 🛠️ Administrative & Portal Features
- **Student Dashboard (`student.html`)**: Academic tracking, enrolled courses, attendance metrics, and live tech news stream from Dev.to.
- **Faculty Portal (`faculty.html`, `faculty-classes.html`)**: Manage classes, publish assignments, grade quizzes, and upload lecture notes.
- **Admin Command Center (`admin.html`, `admin-analytics.html`)**: Manage departments, analyze student performance, and view system health metrics.
- **PWA Ready (`service-worker.js`, `manifest.json`)**: Offline caching support for uninterrupted learning.

---

## 📂 Project Structure

```
acadex-lms/
├── index.html               # Landing page with live dev news feed
├── student.html             # Student portal & learning dashboard
├── course.html              # Course catalog with global MOOC switcher
├── classes.html             # Lecture player & streaming masterclasses
├── compiler.html            # Python 3 & JavaScript execution sandbox
├── quiz.html                # Live dynamic question bank & assessments
├── placement.html           # Placement readiness & live job board
├── resume-builder.html      # AI ATS Resume Architect (live A4 editor)
├── resume.html              # Printable resume showcase
├── portfolio.html           # Student portfolio builder
├── faculty.html             # Faculty management portal
├── admin.html               # Administrative dashboard
│
├── css/                     # Vanilla CSS design system
│   ├── style.css            # Design tokens, variables & dark mode
│   ├── placement.css        # Placement & resume builder styling
│   ├── navbar.css           # Navigation headers
│   └── sidebar.css          # Portal sidebar menus
│
├── js/                      # Core application logic
│   ├── online-data.js       # Unified Gateway for public APIs
│   ├── resume-builder.js    # Live A4 resume renderer & ATS engine
│   ├── placement.js         # Live job search & placement analytics
│   ├── quiz.js              # Trivia assessment engine
│   ├── compiler.js          # Code editor & executor client
│   └── app.js               # Global UI utilities & notifications
│
├── server/                  # Backend Node.js & Express API
│   ├── server.js            # Sandboxed Python/JS execution & API proxy
│   └── package.json
│
└── client/                  # Vite-based client modules
```

---

## 🚀 Getting Started

### 1. Running the Frontend
The frontend runs on standard web technologies without mandatory build tools:
- Simply open `index.html` or `student.html` directly in your web browser.
- Or use any static file server:
  ```bash
  # Using Python
  python -m http.server 3000

  # Or using Node http-server / npx serve
  npx serve .
  ```

### 2. Running the Backend Server (Optional — for Python/JS Sandboxed Execution)
To enable server-side code execution:
```bash
cd server
npm install
npm start
```
The server will start on `http://localhost:5000`.

---

## 🌐 External APIs & Data Sources Integrated
- **[Remotive API](https://remotive.com/)**: Live remote tech and developer job openings.
- **[Open Trivia DB](https://opentdb.com/)**: Real-time computer science and tech quiz bank.
- **[Dev.to API](https://dev.to/)**: Trending developer articles and tutorials.
- **[Harvard CS50 / MIT OCW]**: Curated MOOC curriculum data and video masterclasses.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
