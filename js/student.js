/* ============================================================
   Prime Vector LMS — student.js
   ============================================================ */

// Sample data
const STUDENT_DATA = {
  courses: [
    { id: 1, title: 'Complete Web Development Bootcamp', instructor: 'Dr. Angela Yu', progress: 72, thumb: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80', category: 'Web Dev', lessons: 48, duration: '24h', rating: 4.8 },
    { id: 2, title: 'Machine Learning A-Z', instructor: 'Prof. Hadelin', progress: 35, thumb: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80', category: 'AI/ML', lessons: 36, duration: '18h', rating: 4.7 },
    { id: 3, title: 'UI/UX Design Fundamentals', instructor: 'Dr. Sarah Kim', progress: 90, thumb: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80', category: 'Design', lessons: 24, duration: '12h', rating: 4.9 },
    { id: 4, title: 'Data Structures & Algorithms', instructor: 'Prof. Tim Chen', progress: 55, thumb: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&q=80', category: 'CS', lessons: 60, duration: '30h', rating: 4.6 }
  ],
  assignments: [
    { id: 1, title: 'Build a REST API', course: 'Web Development', due: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'pending', points: 100 },
    { id: 2, title: 'Neural Network Report', course: 'Machine Learning', due: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'pending', points: 80 },
    { id: 3, title: 'Wireframe Design', course: 'UI/UX Design', due: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'submitted', points: 60 },
    { id: 4, title: 'Binary Trees Lab', course: 'DSA', due: new Date(Date.now() + 86400000 * 1).toISOString(), status: 'pending', points: 50 }
  ],
  quizResults: [
    { id: 1, title: 'JavaScript Fundamentals', course: 'Web Dev', score: 88, total: 100, date: '2024-12-01', grade: 'B+' },
    { id: 2, title: 'NumPy & Pandas Quiz', course: 'ML', score: 72, total: 100, date: '2024-12-05', grade: 'C+' },
    { id: 3, title: 'Color Theory Quiz', course: 'UI/UX', score: 95, total: 100, date: '2024-12-10', grade: 'A' }
  ],
  attendance: {
    present: 82, absent: 8, late: 6, total: 96,
    monthly: [85, 88, 79, 92, 86, 88]
  },
  certificates: [
    { id: 1, course: 'HTML & CSS Mastery', date: '2024-10-15', instructor: 'Dr. Web' },
    { id: 2, course: 'Python Basics', date: '2024-11-02', instructor: 'Prof. Guido' }
  ]
};

// ── Render Course Cards ──────────────────────────────────────
function renderCourseList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = STUDENT_DATA.courses.map(c => `
    <div class="enrolled-item" onclick="location.href='course-details.html?id=${c.id}'" style="cursor:pointer">
      <img src="${c.thumb}" class="enrolled-thumb" alt="${c.title}" onerror="this.src='https://via.placeholder.com/56x56/2563EB/ffffff?text=C'">
      <div class="enrolled-info">
        <div class="enrolled-title">${c.title}</div>
        <div class="enrolled-instructor">${c.instructor}</div>
        <div class="course-progress-wrap">
          <div class="course-progress-label">
            <span>Progress</span>
            <span class="course-progress-percent">${c.progress}%</span>
          </div>
          <div class="progress">
            <div class="progress-bar" data-width="${c.progress}" style="width:0%"></div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  initProgressBars();
}

// ── Render Assignments ────────────────────────────────────────
function renderAssignments(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = STUDENT_DATA.assignments.map(a => {
    const due = new Date(a.due);
    const now = new Date();
    const diff = due - now;
    const daysLeft = Math.ceil(diff / 86400000);
    let urgency = 'ok', urgencyText;

    if (a.status === 'submitted') {
      urgencyText = '✓ Submitted';
      urgency = 'ok';
    } else if (daysLeft < 0) {
      urgencyText = 'Overdue!';
      urgency = 'urgent';
    } else if (daysLeft <= 2) {
      urgencyText = `Due in ${daysLeft}d`;
      urgency = 'urgent';
    } else if (daysLeft <= 5) {
      urgencyText = `Due in ${daysLeft}d`;
      urgency = 'soon';
    } else {
      urgencyText = `Due ${Format.date(due)}`;
    }

    const colors = { pending: 'orange', submitted: 'green', overdue: 'red' };
    const icons  = { pending: 'fa-clock', submitted: 'fa-check-circle', overdue: 'fa-exclamation-circle' };
    const status = a.status === 'pending' && daysLeft < 0 ? 'overdue' : a.status;

    return `
      <div class="assignment-item">
        <div class="assignment-icon ${colors[status] || 'blue'}">
          <i class="fa ${icons[status] || 'fa-file'}"></i>
        </div>
        <div class="assignment-info">
          <div class="assignment-title">${a.title}</div>
          <div class="assignment-course">${a.course} · ${a.points} pts</div>
        </div>
        <div class="assignment-due ${urgency}">${urgencyText}</div>
      </div>
    `;
  }).join('');
}

// ── Render Quiz Results ───────────────────────────────────────
function renderQuizResults(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = STUDENT_DATA.quizResults.map(q => `
    <div class="report-row">
      <div class="report-subject">${q.title}<br><span class="text-xs text-muted">${q.course}</span></div>
      <div class="report-bar">
        <div class="progress">
          <div class="progress-bar ${q.score >= 90 ? 'success' : q.score >= 70 ? '' : 'warning'}"
               data-width="${q.score}" style="width:0%"></div>
        </div>
      </div>
      <div class="report-score">${q.score}%</div>
      <div class="report-grade">
        <span class="badge badge-${q.score >= 90 ? 'success' : q.score >= 70 ? 'primary' : 'warning'}">${q.grade}</span>
      </div>
    </div>
  `).join('');

  initProgressBars();
}

// ── Attendance Chart ──────────────────────────────────────────
function renderAttendanceChart() {
  const canvas = document.getElementById('attendanceChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const att = STUDENT_DATA.attendance;
  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Absent', 'Late'],
      datasets: [{
        data: [att.present, att.absent, att.late],
        backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            padding: 16,
            font: { size: 12 }
          }
        }
      }
    }
  });
}

// ── Progress Chart ────────────────────────────────────────────
function renderProgressChart() {
  const canvas = document.getElementById('progressChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Attendance %',
        data: STUDENT_DATA.attendance.monthly,
        backgroundColor: 'rgba(37,99,235,0.7)',
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 60,
          max: 100,
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor }
        }
      }
    }
  });
}

// ── Student Lifecycle Configuration ───────────────────────────
const LIFECYCLE_STAGES = [
  'Admission',
  'Course Enrollment',
  'Training Program',
  'Daily Classes',
  'Assignments',
  'Assessment',
  'Project',
  'Internship',
  'Certification',
  'Placement Training',
  'Interview Drive',
  'Placement Stage',
  'Alumni Network'
];

function renderLifecycleStepper() {
  const container = document.getElementById('lifecycleStepper');
  if (!container) return;

  const currentStageIndex = parseInt(localStorage.getItem('Prime Vector_lifecycle_stage')) || 6; // Default to 'Project' (index 6)
  
  // Set widgets
  updateLifecycleWidgets(currentStageIndex);

  container.innerHTML = LIFECYCLE_STAGES.map((stage, idx) => {
    let statusClass = '';
    if (idx < currentStageIndex) statusClass = 'completed';
    else if (idx === currentStageIndex) statusClass = 'active';

    return `
      <div class="lifecycle-step ${statusClass}" onclick="changeLifecycleStage(${idx})">
        <div class="lifecycle-step-num">
          ${idx < currentStageIndex ? '✓' : idx + 1}
        </div>
        <div class="lifecycle-step-label">${stage}</div>
      </div>
    `;
  }).join('');
}

window.changeLifecycleStage = function(index) {
  const oldIndex = parseInt(localStorage.getItem('Prime Vector_lifecycle_stage')) || 6;
  if (oldIndex === index) return;

  localStorage.setItem('Prime Vector_lifecycle_stage', index);
  renderLifecycleStepper();
  
  Toast.success(
    'Lifecycle Status Updated', 
    `Transitioned from ${LIFECYCLE_STAGES[oldIndex]} ➔ ${LIFECYCLE_STAGES[index]}.`
  );
};

function updateLifecycleWidgets(index) {
  const countdownEl = document.getElementById('lifecycleCountdown');
  const labelEl = document.getElementById('lifecycleStatusLabel');
  
  if (labelEl) labelEl.textContent = LIFECYCLE_STAGES[index];

  // Dynamic countdown days depending on index
  if (countdownEl) {
    const daysLeftMap = [120, 110, 95, 80, 70, 60, 45, 30, 20, 15, 10, 5, 0];
    const days = daysLeftMap[index] !== undefined ? daysLeftMap[index] : 0;
    countdownEl.textContent = days > 0 ? `${days} Days Remaining` : 'Completed';
  }
}

// ── Assignment Submission Interactive Handler ─────────────────
window.submitAssignment = function(id) {
  const item = STUDENT_DATA.assignments.find(a => a.id === id);
  if (!item) return;
  
  if (item.status === 'submitted') {
    Toast.info('Already Submitted', `You have submitted "${item.title}".`);
    return;
  }

  item.status = 'submitted';
  renderAssignments('assignmentList');
  
  const pendEl = document.getElementById('pendingAssignments');
  if (pendEl) {
    pendEl.textContent = STUDENT_DATA.assignments.filter(a => a.status === 'pending').length;
  }
  
  Toast.success('Assignment Submitted!', `Successfully submitted "${item.title}". 100 XP gained!`);
};

// ── Live Masterclass Launcher ─────────────────────────────────
window.joinLiveSession = function(sessionTitle) {
  Toast.info('Joining Live Masterclass', `Connecting to "${sessionTitle}" stream...`);
  setTimeout(() => {
    window.location.href = 'classes.html';
  }, 800);
};

// ── Skill Radar Chart ──────────────────────────────────────────
function renderSkillRadarChart() {
  const canvas = document.getElementById('skillRadarChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['AI & ML', 'Full Stack', 'Data Science', 'Problem Solving', 'Cloud & DevOps', 'Communication'],
      datasets: [{
        label: 'Prime Vector Skill Score',
        data: [85, 92, 78, 88, 70, 85],
        backgroundColor: 'rgba(79,70,229,0.25)',
        borderColor: '#4F46E5',
        borderWidth: 2,
        pointBackgroundColor: '#06B6D4',
        pointBorderColor: '#fff',
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: { color: textColor, font: { size: 11, weight: '600' } },
          ticks: { backdropColor: 'transparent', color: textColor }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ── Init Student Dashboard ─────────────────────────────────────
function initStudentDashboard() {
  if (!document.getElementById('studentDashboard')) return;
  if (!Auth.requireAuth()) return;

  const user = Auth.getUser();
  if (user.role !== 'student') {
    window.location.href = `${user.role}.html`;
    return;
  }

  // Populate stats
  const totalEl = document.getElementById('totalCourses');
  const doneEl  = document.getElementById('completedCourses');
  const attEl   = document.getElementById('attendancePercent');
  const pendEl  = document.getElementById('pendingAssignments');

  if (totalEl) totalEl.textContent = STUDENT_DATA.courses.length;
  if (doneEl)  doneEl.textContent  = STUDENT_DATA.certificates.length;
  if (attEl)   attEl.textContent   = Math.round(STUDENT_DATA.attendance.present / STUDENT_DATA.attendance.total * 100) + '%';
  if (pendEl)  pendEl.textContent  = STUDENT_DATA.assignments.filter(a => a.status === 'pending').length;

  renderCourseList('courseList');
  renderAssignments('assignmentList');
  renderQuizResults('quizResults');
  renderAttendanceChart();
  renderProgressChart();
  renderSkillRadarChart();
  renderLifecycleStepper();
}

document.addEventListener('DOMContentLoaded', initStudentDashboard);

