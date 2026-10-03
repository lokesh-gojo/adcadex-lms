/* ============================================================
   Prime Vector LMS — faculty.js
   ============================================================ */

const FACULTY_DATA = {
  courses: [
    { id: 1, title: 'Complete Web Development', students: 128, lessons: 48, status: 'published', rating: 4.8, category: 'Web Dev' },
    { id: 2, title: 'Advanced JavaScript', students: 96, lessons: 32, status: 'published', rating: 4.7, category: 'Programming' },
    { id: 3, title: 'React & Redux Mastery', students: 74, lessons: 40, status: 'draft', rating: 0, category: 'Frontend' },
    { id: 4, title: 'Node.js Backend', students: 55, lessons: 28, status: 'published', rating: 4.6, category: 'Backend' }
  ],
  submissions: [
    { id: 1, student: 'Alex Johnson', assignment: 'Build a REST API', course: 'Web Dev', submitted: new Date(Date.now() - 3600000).toISOString(), grade: null },
    { id: 2, student: 'Emily Davis', assignment: 'JS Quiz Project', course: 'Advanced JS', submitted: new Date(Date.now() - 7200000).toISOString(), grade: 'A' },
    { id: 3, student: 'Marcus Lee', assignment: 'React App', course: 'React Mastery', submitted: new Date(Date.now() - 86400000).toISOString(), grade: null },
    { id: 4, student: 'Priya Sharma', assignment: 'API Integration', course: 'Node.js', submitted: new Date(Date.now() - 172800000).toISOString(), grade: 'B+' }
  ],
  students: [
    { name: 'Alex Johnson',  avg: 88, attendance: 92 },
    { name: 'Emily Davis',   avg: 95, attendance: 97 },
    { name: 'Marcus Lee',    avg: 72, attendance: 78 },
    { name: 'Priya Sharma',  avg: 91, attendance: 95 },
    { name: 'Tom Wilson',    avg: 65, attendance: 70 }
  ]
};

// ── Render Faculty Course Table ───────────────────────────────
function renderFacultyCourses() {
  const tbody = document.getElementById('facultyCourseTable');
  if (!tbody) return;

  tbody.innerHTML = FACULTY_DATA.courses.map(c => `
    <tr>
      <td>
        <div class="font-semi">${c.title}</div>
        <div class="text-xs text-muted">${c.category}</div>
      </td>
      <td>${c.students}</td>
      <td>${c.lessons} lessons</td>
      <td>
        <span class="badge badge-${c.status === 'published' ? 'success' : 'warning'}">
          ${c.status}
        </span>
      </td>
      <td>
        ${c.rating ? `
          <div class="stars">
            ${'<i class="fa fa-star"></i>'.repeat(Math.floor(c.rating))}
            ${c.rating % 1 ? '<i class="fa fa-star-half-o"></i>' : ''}
          </div>
          <span class="text-xs">${c.rating}</span>
        ` : '<span class="text-muted text-xs">No ratings</span>'}
      </td>
      <td>
        <div class="table-actions">
          <button class="action-btn view" title="View" onclick="location.href='course-details.html?id=${c.id}'"><i class="fa fa-eye"></i></button>
          <button class="action-btn edit" title="Edit" onclick="openEditCourseModal(${c.id})"><i class="fa fa-pencil"></i></button>
          <button class="action-btn delete" title="Delete" onclick="deleteCourse(${c.id})"><i class="fa fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Render Submissions ────────────────────────────────────────
function renderSubmissions() {
  const tbody = document.getElementById('submissionsTable');
  if (!tbody) return;

  tbody.innerHTML = FACULTY_DATA.submissions.map(s => `
    <tr>
      <td>
        <div class="flex items-center gap-8">
          <div class="avatar-placeholder avatar-sm" style="border-radius:50%;background:var(--gradient-primary);color:#fff;font-size:0.75rem;font-weight:700;">
            ${s.student[0]}
          </div>
          ${s.student}
        </div>
      </td>
      <td>${s.assignment}</td>
      <td>${s.course}</td>
      <td>${Format.relative(s.submitted)}</td>
      <td>
        ${s.grade
          ? `<span class="badge badge-success">${s.grade}</span>`
          : `<button class="btn btn-primary btn-sm" onclick="openGradeModal('${s.id}','${s.student}')">Grade</button>`
        }
      </td>
    </tr>
  `).join('');
}

// ── Student Performance Chart ─────────────────────────────────
function renderPerformanceChart() {
  const canvas = document.getElementById('performanceChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: FACULTY_DATA.students.map(s => s.name.split(' ')[0]),
      datasets: [
        {
          label: 'Avg Score',
          data: FACULTY_DATA.students.map(s => s.avg),
          backgroundColor: 'rgba(37,99,235,0.8)',
          borderRadius: 6
        },
        {
          label: 'Attendance %',
          data: FACULTY_DATA.students.map(s => s.attendance),
          backgroundColor: 'rgba(20,184,166,0.8)',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor, font: { size: 12 } }
        }
      },
      scales: {
        y: {
          min: 0, max: 100,
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

// ── Enrollment Trend Chart ────────────────────────────────────
function renderEnrollmentChart() {
  const canvas = document.getElementById('enrollmentChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'New Enrollments',
        data: [24, 38, 52, 61, 74, 96],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37,99,235,0.1)',
        borderWidth: 2.5,
        pointBackgroundColor: '#2563EB',
        pointRadius: 4,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: gridColor }, ticks: { color: textColor } },
        x: { grid: { display: false }, ticks: { color: textColor } }
      }
    }
  });
}

// ── Modals ────────────────────────────────────────────────────
function openGradeModal(id, student) {
  document.getElementById('gradeStudentName').textContent = student;
  document.getElementById('submissionId').value = id;
  Modal.open('gradeModal');
}

function submitGrade() {
  const grade = document.getElementById('gradeInput').value;
  if (!grade) { Toast.warning('Please enter a grade'); return; }

  const idx = FACULTY_DATA.submissions.findIndex(s => s.id == document.getElementById('submissionId').value);
  if (idx >= 0) {
    FACULTY_DATA.submissions[idx].grade = grade;
    renderSubmissions();
    Modal.close('gradeModal');
    Toast.success('Grade Submitted!', `Graded successfully`);
  }
}

function openEditCourseModal(id) {
  const course = FACULTY_DATA.courses.find(c => c.id === id);
  if (!course) return;
  document.getElementById('editCourseTitle').value  = course.title;
  document.getElementById('editCourseCategory').value = course.category;
  document.getElementById('editCourseId').value = id;
  Modal.open('editCourseModal');
}

function saveEditCourse() {
  const id    = parseInt(document.getElementById('editCourseId').value);
  const title = document.getElementById('editCourseTitle').value.trim();
  const cat   = document.getElementById('editCourseCategory').value.trim();

  if (!title) { Toast.warning('Please enter a course title'); return; }

  const idx = FACULTY_DATA.courses.findIndex(c => c.id === id);
  if (idx >= 0) {
    FACULTY_DATA.courses[idx].title    = title;
    FACULTY_DATA.courses[idx].category = cat;
    renderFacultyCourses();
    Modal.close('editCourseModal');
    Toast.success('Course Updated!');
  }
}

function deleteCourse(id) {
  const idx = FACULTY_DATA.courses.findIndex(c => c.id === id);
  if (idx >= 0) {
    FACULTY_DATA.courses.splice(idx, 1);
    renderFacultyCourses();
    Toast.success('Course Deleted');
  }
}

// ── Init Faculty Dashboard ─────────────────────────────────────
function initFacultyDashboard() {
  if (!document.getElementById('facultyDashboard')) return;
  if (!Auth.requireAuth()) return;

  const user = Auth.getUser();
  const allowedRoles = ['faculty', 'trainer', 'mentor'];
  if (!allowedRoles.includes(user.role)) {
    const roleMap = {
      super_admin: 'admin.html',
      admin: 'admin.html',
      student: 'student.html',
      hr_admin: 'hr.html',
      placement_officer: 'placement.html'
    };
    window.location.href = roleMap[user.role] || 'student.html';
    return;
  }

  // Stats
  const totalStudents = FACULTY_DATA.courses.reduce((s, c) => s + c.students, 0);
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('totalStudents', totalStudents);
  setEl('totalCourses', FACULTY_DATA.courses.length);
  setEl('pendingGrades', FACULTY_DATA.submissions.filter(s => !s.grade).length);
  setEl('avgRating', (FACULTY_DATA.courses.filter(c => c.rating).reduce((s, c) => s + c.rating, 0) / FACULTY_DATA.courses.filter(c => c.rating).length).toFixed(1));

  renderFacultyCourses();
  renderSubmissions();
  renderPerformanceChart();
  renderEnrollmentChart();
}

document.addEventListener('DOMContentLoaded', initFacultyDashboard);
