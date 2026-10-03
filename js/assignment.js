/* ============================================================
   Prime Vector LMS — assignment.js
   Interactive Assignment Management & Submission Engine
   ============================================================ */

const COURSE_TRACK_TAGS = {
  'Web Development': { color: '#4F46E5', icon: 'fa-code', badge: 'badge-primary' },
  'Machine Learning': { color: '#8B5CF6', icon: 'fa-cogs', badge: 'badge-purple' },
  'UI/UX Design': { color: '#EC4899', icon: 'fa-paint-brush', badge: 'badge-warning' },
  'Data Structures': { color: '#10B981', icon: 'fa-sitemap', badge: 'badge-success' },
  'Database Management': { color: '#F59E0B', icon: 'fa-database', badge: 'badge-warning' }
};

let assignmentsData = Store.get('assignments', null) || [
  {
    id: 1,
    title: 'Build a REST API with Express & Node.js',
    course: 'Web Development',
    description: 'Design and implement a complete RESTful API with Node.js and Express. Include CRUD endpoints for a blogging platform with token-based auth and PostgreSQL/MongoDB integration.',
    points: 100,
    due: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'pending',
    type: 'project',
    priority: 'high',
    files: [],
    githubUrl: '',
    feedback: ''
  },
  {
    id: 2,
    title: 'Neural Network Report & Backprop Derivation',
    course: 'Machine Learning',
    description: 'Write a comprehensive analytical report deriving backpropagation algorithms from scratch using NumPy. Include training loss curves and confusion matrix evaluations.',
    points: 80,
    due: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'pending',
    type: 'report',
    priority: 'medium',
    files: [],
    githubUrl: '',
    feedback: ''
  },
  {
    id: 3,
    title: 'Wireframe Design: Mobile Banking App',
    course: 'UI/UX Design',
    description: 'Create high-fidelity interactive wireframes for an accessible mobile banking dashboard featuring transaction history, biometric login, and send money workflows with at least 8 screens.',
    points: 60,
    due: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'submitted',
    type: 'design',
    priority: 'low',
    files: ['banking_app_wireframes.fig'],
    githubUrl: 'https://figma.com/@student/banking-wireframes',
    feedback: 'Currently under faculty evaluation.'
  },
  {
    id: 4,
    title: 'Binary Search Trees & AVL Tree Rotations Lab',
    course: 'Data Structures',
    description: 'Implement self-balancing AVL binary search trees in C++ or Python with insert, delete, and balancing rotations (LL, RR, LR, RL) benchmarked against unbalanced BSTs.',
    points: 50,
    due: new Date(Date.now() + 86400000 * 1).toISOString(),
    status: 'pending',
    type: 'lab',
    priority: 'high',
    files: [],
    githubUrl: '',
    feedback: ''
  },
  {
    id: 5,
    title: 'E-Commerce Normalized Relational Database Schema',
    course: 'Database Management',
    description: 'Design a normalized 3NF relational database schema for an enterprise e-commerce platform. Provide full DDL scripts, ER diagrams, and indexed analytical SQL queries.',
    points: 75,
    due: new Date(Date.now() - 86400000 * 8).toISOString(),
    status: 'graded',
    type: 'project',
    priority: 'medium',
    grade: 'A+',
    score: 96,
    files: ['ecommerce_erd_schema.pdf', 'queries.sql'],
    githubUrl: 'https://github.com/lokesh-gojo/adcadex-lms',
    feedback: 'Flawless BCNF decomposition and query indexing optimization. Full marks awarded on ACID transactions!'
  }
];

let activeFilter = 'all';
let activeSort = 'due';
let activeAssignment = null;

// ── Render Assignments List ─────────────────────────────────────
function renderAssignmentsList() {
  const container = document.getElementById('assignmentsList');
  if (!container) return;

  updateAssignmentStats();

  let data = [...assignmentsData];

  // Filter
  if (activeFilter !== 'all') {
    data = data.filter(a => a.status === activeFilter);
  }

  // Sort
  if (activeSort === 'due') {
    data.sort((a, b) => new Date(a.due) - new Date(b.due));
  } else if (activeSort === 'points') {
    data.sort((a, b) => b.points - a.points);
  } else if (activeSort === 'priority') {
    const p = { high: 0, medium: 1, low: 2 };
    data.sort((a, b) => p[a.priority] - p[b.priority]);
  }

  if (!data.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:48px 24px;background:var(--surface);border-radius:var(--radius-lg);border:1px dashed var(--border)">
        <i class="fa fa-folder-open-o" style="font-size:2.4rem;color:var(--text-muted);margin-bottom:12px"></i>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:6px">No Assignments Found</h3>
        <p style="color:var(--text-muted);font-size:0.88rem">There are no assignments matching the "${activeFilter}" filter.</p>
        <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="setFilter('all')">View All Assignments</button>
      </div>
    `;
    return;
  }

  container.innerHTML = data.map(a => renderAssignmentCard(a)).join('');

  // Auto-select first item if none active or current one filtered out
  if (!activeAssignment || !data.some(d => d.id === activeAssignment.id)) {
    openAssignmentDetail(data[0].id);
  }
}

function renderAssignmentCard(a) {
  const due = new Date(a.due);
  const now = new Date();
  const daysLeft = Math.ceil((due - now) / 86400000);
  const typeIcons = { project: 'fa-laptop', report: 'fa-file-text-o', design: 'fa-paint-brush', lab: 'fa-flask' };
  const statusBadges = {
    pending: '<span class="badge badge-warning"><i class="fa fa-clock-o"></i> Pending</span>',
    submitted: '<span class="badge badge-primary"><i class="fa fa-paper-plane"></i> Submitted</span>',
    graded: '<span class="badge badge-success"><i class="fa fa-check-circle"></i> Graded</span>',
    overdue: '<span class="badge badge-danger"><i class="fa fa-exclamation-triangle"></i> Overdue</span>'
  };

  const isOverdue = a.status === 'pending' && daysLeft < 0;
  const effectiveStatus = isOverdue ? 'overdue' : a.status;

  let dueBadgeText = '';
  if (effectiveStatus === 'graded') dueBadgeText = `<span style="color:var(--success);font-weight:700"><i class="fa fa-trophy"></i> Score: ${a.score}/100 (${a.grade})</span>`;
  else if (effectiveStatus === 'submitted') dueBadgeText = `<span style="color:var(--primary);font-weight:600"><i class="fa fa-check"></i> In Evaluation</span>`;
  else if (effectiveStatus === 'overdue') dueBadgeText = `<span style="color:var(--danger);font-weight:700"><i class="fa fa-calendar-times-o"></i> Past Due</span>`;
  else if (daysLeft === 0) dueBadgeText = `<span style="color:var(--danger);font-weight:700"><i class="fa fa-hourglass-end"></i> Due Today!</span>`;
  else if (daysLeft === 1) dueBadgeText = `<span style="color:var(--warning);font-weight:700"><i class="fa fa-hourglass-half"></i> Due Tomorrow</span>`;
  else dueBadgeText = `<span style="color:var(--text-muted)"><i class="fa fa-calendar"></i> Due in ${daysLeft} days</span>`;

  const trackInfo = COURSE_TRACK_TAGS[a.course] || { color: '#4F46E5', icon: 'fa-book', badge: 'badge-primary' };
  const isActive = activeAssignment && activeAssignment.id === a.id;

  return `
    <div class="assignment-card ${isActive ? 'active-assignment' : ''}" onclick="openAssignmentDetail(${a.id})">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:42px;height:42px;border-radius:var(--radius-md);background:${trackInfo.color}15;color:${trackInfo.color};display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">
            <i class="fa ${typeIcons[a.type] || 'fa-tasks'}"></i>
          </div>
          <div>
            <span class="badge ${trackInfo.badge}" style="font-size:0.7rem;padding:2px 8px;margin-bottom:4px;display:inline-block">
              ${a.course}
            </span>
            <h3 style="font-size:1.02rem;font-weight:700;margin:0;color:var(--text);line-height:1.3">
              ${a.title}
            </h3>
          </div>
        </div>
        <div style="flex-shrink:0">
          ${statusBadges[effectiveStatus]}
        </div>
      </div>

      <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.5;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
        ${a.description}
      </p>

      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding-top:12px;border-top:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:14px;font-size:0.8rem">
          ${dueBadgeText}
          <span style="color:var(--text-muted)"><i class="fa fa-star text-warning"></i> ${a.points} pts</span>
          <span class="badge badge-${a.priority === 'high' ? 'danger' : a.priority === 'medium' ? 'warning' : 'gray'}" style="font-size:0.68rem">
            ${a.priority.toUpperCase()} PRIORITY
          </span>
        </div>

        <div>
          ${effectiveStatus === 'pending' || effectiveStatus === 'overdue' ? `
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openSubmitModal(${a.id})">
              <i class="fa fa-upload"></i> Submit
            </button>
          ` : `
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openAssignmentDetail(${a.id})">
              <i class="fa fa-eye"></i> Details
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

// ── Update Top Stat Counters ────────────────────────────────────
function updateAssignmentStats() {
  const total = assignmentsData.length;
  const pending = assignmentsData.filter(a => a.status === 'pending').length;
  const submitted = assignmentsData.filter(a => a.status === 'submitted').length;
  const graded = assignmentsData.filter(a => a.status === 'graded').length;

  const totalEl = document.getElementById('statTotalAssignments');
  const pendingEl = document.getElementById('statPendingAssignments');
  const submittedEl = document.getElementById('statSubmittedAssignments');
  const gradedEl = document.getElementById('statGradedAssignments');

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (submittedEl) submittedEl.textContent = submitted;
  if (gradedEl) gradedEl.textContent = graded;
}

// ── Open Assignment Detail Panel ────────────────────────────────
function openAssignmentDetail(id) {
  const a = assignmentsData.find(x => x.id === id);
  if (!a) return;
  activeAssignment = a;

  // Re-highlight cards
  document.querySelectorAll('.assignment-card').forEach(el => el.classList.remove('active-assignment'));
  event?.currentTarget?.classList?.add('active-assignment');

  const panel = document.getElementById('assignmentDetail');
  if (!panel) return;

  const due = new Date(a.due);
  const trackInfo = COURSE_TRACK_TAGS[a.course] || { color: '#4F46E5', icon: 'fa-book' };

  panel.innerHTML = `
    <div class="card-header" style="padding:20px 24px">
      <div>
        <span class="badge badge-primary" style="font-size:0.75rem;margin-bottom:6px;display:inline-block">${a.course}</span>
        <h3 class="card-title" style="font-size:1.15rem;font-weight:800;color:var(--text);margin:0;line-height:1.3">${a.title}</h3>
      </div>
      <div style="flex-shrink:0">
        <span class="badge badge-${a.status === 'graded' ? 'success' : a.status === 'submitted' ? 'primary' : 'warning'}" style="font-size:0.8rem">
          ${a.status.toUpperCase()}
        </span>
      </div>
    </div>

    <div class="card-body" style="padding:22px 24px">
      <!-- 4-Stat Metric Box -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
        <div style="padding:12px 14px;background:var(--bg);border-radius:var(--radius-md);border:1px solid var(--border)">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase">Deadline</div>
          <div style="font-weight:700;margin-top:3px;font-size:0.9rem;color:var(--text)">${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
        <div style="padding:12px 14px;background:var(--bg);border-radius:var(--radius-md);border:1px solid var(--border)">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase">Weightage</div>
          <div style="font-weight:700;margin-top:3px;font-size:0.9rem;color:var(--primary)"><i class="fa fa-star text-warning"></i> ${a.points} Points</div>
        </div>
        <div style="padding:12px 14px;background:var(--bg);border-radius:var(--radius-md);border:1px solid var(--border)">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase">Priority</div>
          <div style="font-weight:700;margin-top:3px;font-size:0.9rem;text-transform:capitalize;color:${a.priority === 'high' ? 'var(--danger)' : 'var(--text)'}">${a.priority}</div>
        </div>
        <div style="padding:12px 14px;background:var(--bg);border-radius:var(--radius-md);border:1px solid var(--border)">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase">Faculty Grade</div>
          <div style="font-weight:700;margin-top:3px;font-size:0.9rem;color:var(--success)">${a.grade ? `${a.grade} (${a.score}/100)` : 'Not evaluated yet'}</div>
        </div>
      </div>

      <!-- Problem Statement -->
      <div style="margin-bottom:20px">
        <h4 style="font-size:0.92rem;font-weight:700;margin:0 0 8px;color:var(--text)"><i class="fa fa-file-text-o text-primary"></i> Assignment Objectives</h4>
        <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.6;margin:0">${a.description}</p>
      </div>

      <!-- Faculty Feedback if Graded -->
      ${a.feedback ? `
        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius-md);padding:14px;margin-bottom:20px">
          <div style="font-size:0.78rem;font-weight:700;color:var(--success);text-transform:uppercase;margin-bottom:4px;display:flex;align-items:center;gap:6px">
            <i class="fa fa-check-circle"></i> Faculty Evaluation Notes
          </div>
          <div style="font-size:0.85rem;color:var(--text);line-height:1.5">${a.feedback}</div>
        </div>
      ` : ''}

      <!-- Submitted Files / GitHub Links -->
      ${(a.files && a.files.length) || a.githubUrl ? `
        <div style="margin-bottom:20px">
          <h4 style="font-size:0.88rem;font-weight:700;margin:0 0 8px;color:var(--text)">Submitted Artifacts</h4>
          ${a.githubUrl ? `
            <a href="${a.githubUrl}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:8px;text-decoration:none;color:var(--text);font-size:0.85rem">
              <i class="fa fa-github" style="font-size:1.2rem"></i>
              <span style="flex:1;font-weight:600;color:var(--primary)">${a.githubUrl}</span>
              <i class="fa fa-external-link text-muted"></i>
            </a>
          ` : ''}
          ${(a.files || []).map(f => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:8px;font-size:0.85rem">
              <i class="fa fa-file-code-o text-primary"></i>
              <span style="flex:1">${f}</span>
              <span class="badge badge-success" style="font-size:0.7rem">Attached</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Action Footer -->
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border)">
        ${a.status === 'pending' || a.status === 'overdue' ? `
          <button class="btn btn-primary" style="width:100%;box-shadow:0 4px 14px rgba(79,70,229,0.3)" onclick="openSubmitModal(${a.id})">
            <i class="fa fa-upload"></i> Submit Solution Now
          </button>
        ` : `
          <button class="btn btn-outline" style="width:100%" onclick="openSubmitModal(${a.id})">
            <i class="fa fa-refresh"></i> Re-upload / Update Submission
          </button>
        `}
      </div>
    </div>
  `;
}

// ── Submit Modal Logic ──────────────────────────────────────────
function openSubmitModal(id) {
  const assignment = assignmentsData.find(a => a.id === id);
  if (!assignment) return;

  const idInput = document.getElementById('submitAssignmentId');
  const titleDisplay = document.getElementById('submitAssignmentTitle');
  const textInput = document.getElementById('submitText');
  const ghInput = document.getElementById('submitGithubUrl');
  const filesList = document.getElementById('uploadedFiles');

  if (idInput) idInput.value = id;
  if (titleDisplay) titleDisplay.textContent = assignment.title;
  if (textInput) textInput.value = '';
  if (ghInput) ghInput.value = assignment.githubUrl || '';
  if (filesList) filesList.innerHTML = '';

  const modal = document.getElementById('submitModal');
  if (modal) modal.classList.add('active');
}

function closeSubmitModal() {
  const modal = document.getElementById('submitModal');
  if (modal) modal.classList.remove('active');
}

function submitAssignment() {
  const idInput = document.getElementById('submitAssignmentId');
  const id = idInput ? parseInt(idInput.value) : null;
  const text = document.getElementById('submitText')?.value.trim() || '';
  const githubUrl = document.getElementById('submitGithubUrl')?.value.trim() || '';

  if (!id) return;

  const idx = assignmentsData.findIndex(a => a.id === id);
  if (idx >= 0) {
    assignmentsData[idx].status = 'submitted';
    assignmentsData[idx].githubUrl = githubUrl;
    if (!assignmentsData[idx].files.length) {
      assignmentsData[idx].files = ['Solution_Deliverable.zip'];
    }

    Store.set('assignments', assignmentsData);
    renderAssignmentsList();
    closeSubmitModal();

    if (window.showNotification) {
      showNotification('Assignment Submitted!', `"${assignmentsData[idx].title}" received for grading.`, 'success');
    } else {
      alert(`🎉 Assignment Submitted!\n"${assignmentsData[idx].title}" has been sent for faculty evaluation.`);
    }

    openAssignmentDetail(id);
  }
}

// ── Filter Buttons ──────────────────────────────────────────────
function setFilter(filterName) {
  activeFilter = filterName;
  document.querySelectorAll('[data-filter]').forEach(b => {
    if (b.dataset.filter === filterName) b.classList.add('active');
    else b.classList.remove('active');
  });
  renderAssignmentsList();
}

function initFilters() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });
  });

  const sortEl = document.getElementById('assignmentSort');
  if (sortEl) {
    sortEl.addEventListener('change', () => {
      activeSort = sortEl.value;
      renderAssignmentsList();
    });
  }
}

// ── File Dropzone UI ────────────────────────────────────────────
function initUploadArea() {
  const area = document.getElementById('uploadArea');
  if (!area) return;

  const fileInput = document.getElementById('fileInput');
  area.addEventListener('click', () => fileInput?.click());

  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });

  fileInput?.addEventListener('change', () => handleFiles(fileInput.files));
}

function handleFiles(files) {
  const list = document.getElementById('uploadedFiles');
  if (!list) return;

  Array.from(files).forEach(file => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--success-light);border-radius:var(--radius-md);margin-top:8px;font-size:0.875rem';
    item.innerHTML = `
      <i class="fa fa-check-circle" style="color:var(--success)"></i>
      <span style="font-weight:600;flex:1">${file.name}</span>
      <span style="color:var(--text-muted);font-size:0.75rem">(${(file.size / 1024).toFixed(1)} KB)</span>
      <button type="button" onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:1.1rem">&times;</button>
    `;
    list.appendChild(item);
  });
}

// Global Exports
window.openAssignmentDetail = openAssignmentDetail;
window.openSubmitModal = openSubmitModal;
window.closeSubmitModal = closeSubmitModal;
window.submitAssignment = submitAssignment;
window.setFilter = setFilter;

document.addEventListener('DOMContentLoaded', () => {
  renderAssignmentsList();
  initFilters();
  initUploadArea();
});
