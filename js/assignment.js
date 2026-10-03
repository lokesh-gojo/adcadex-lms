/* ============================================================
   Prime Vector LMS — assignment.js
   ============================================================ */

let assignmentsData = Store.get('assignments', null) || [
  { id: 1, title: 'Build a REST API', course: 'Web Development', description: 'Create a fully functional REST API with Node.js and Express. Implement CRUD operations for a blog platform.', points: 100, due: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'pending', type: 'project', priority: 'high', files: [] },
  { id: 2, title: 'Neural Network Report', course: 'Machine Learning', description: 'Write a detailed report on implementing a simple neural network from scratch using NumPy.', points: 80, due: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'pending', type: 'report', priority: 'medium', files: [] },
  { id: 3, title: 'Wireframe Design', course: 'UI/UX Design', description: 'Create wireframes for a mobile banking application with at least 8 screens.', points: 60, due: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'submitted', type: 'design', priority: 'low', files: ['wireframes.fig'] },
  { id: 4, title: 'Binary Trees Lab', course: 'Data Structures', description: 'Implement binary tree operations including insert, delete, search, and traversal methods.', points: 50, due: new Date(Date.now() + 86400000 * 1).toISOString(), status: 'pending', type: 'lab', priority: 'high', files: [] },
  { id: 5, title: 'SQL Database Design', course: 'Database Management', description: 'Design a normalized relational database schema for an e-commerce platform.', points: 75, due: new Date(Date.now() + 86400000 * 8).toISOString(), status: 'graded', type: 'project', priority: 'medium', grade: 'A', score: 92, files: ['erd.pdf'] }
];

let activeFilter = 'all';
let activeSort   = 'due';
let activeAssignment = null;

// ── Render Assignments ─────────────────────────────────────────
function renderAssignmentsList() {
  const container = document.getElementById('assignmentsList');
  if (!container) return;

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
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h3>No Assignments</h3>
        <p>No assignments found for this filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = data.map(a => renderAssignmentCard(a)).join('');
}

function renderAssignmentCard(a) {
  const due     = new Date(a.due);
  const now     = new Date();
  const daysLeft = Math.ceil((due - now) / 86400000);
  const typeIcon = { project: '💻', report: '📄', design: '🎨', lab: '🔬', quiz: '📝' };
  const statusColor = { pending: 'warning', submitted: 'primary', graded: 'success', overdue: 'danger' };
  const status = a.status === 'pending' && daysLeft < 0 ? 'overdue' : a.status;

  let dueText, dueColor;
  if (status === 'graded')   { dueText = `Graded: ${a.grade || 'N/A'}`; dueColor = 'success'; }
  else if (status === 'submitted') { dueText = 'Submitted'; dueColor = 'primary'; }
  else if (status === 'overdue')   { dueText = 'Overdue!';  dueColor = 'danger'; }
  else if (daysLeft === 0)   { dueText = 'Due Today!'; dueColor = 'danger'; }
  else if (daysLeft === 1)   { dueText = 'Due Tomorrow'; dueColor = 'warning'; }
  else if (daysLeft <= 3)    { dueText = `Due in ${daysLeft}d`; dueColor = 'warning'; }
  else                       { dueText = Format.date(due); dueColor = 'text-muted'; }

  return `
    <div class="card" style="cursor:pointer;margin-bottom:0" onclick="openAssignmentDetail(${a.id})">
      <div class="card-body" style="padding:20px">
        <div class="flex items-center gap-16" style="margin-bottom:12px">
          <div style="font-size:1.5rem">${typeIcon[a.type] || '📋'}</div>
          <div style="flex:1;min-width:0">
            <div class="font-semi" style="font-size:0.95rem;color:var(--text)">${a.title}</div>
            <div class="text-xs text-muted">${a.course}</div>
          </div>
          <span class="badge badge-${statusColor[status]}">${status}</span>
        </div>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${a.description}</p>
        <div class="flex items-center" style="gap:16px;flex-wrap:wrap">
          <span style="font-size:0.78rem;color:var(--${dueColor === 'text-muted' ? 'text-muted' : dueColor})">
            <i class="fa fa-calendar"></i> ${dueText}
          </span>
          <span class="text-xs text-muted"><i class="fa fa-star"></i> ${a.points} pts</span>
          <span class="badge badge-${a.priority === 'high' ? 'danger' : a.priority === 'medium' ? 'warning' : 'gray'}" style="font-size:0.68rem">${a.priority}</span>
          ${a.score ? `<span class="text-xs" style="color:var(--success);font-weight:600">Score: ${a.score}/100</span>` : ''}
          <div style="margin-left:auto;display:flex;gap:8px">
            ${status === 'pending' || status === 'overdue'
              ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openSubmitModal(${a.id})">Submit</button>`
              : ''
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Assignment Detail ─────────────────────────────────────────
function openAssignmentDetail(id) {
  const a = assignmentsData.find(x => x.id === id);
  if (!a) return;
  activeAssignment = a;

  const panel = document.getElementById('assignmentDetail');
  if (!panel) return;

  const due = new Date(a.due);
  panel.innerHTML = `
    <div class="card-header">
      <div>
        <div class="card-title">${a.title}</div>
        <div class="text-xs text-muted">${a.course}</div>
      </div>
      ${a.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="openSubmitModal(${a.id})"><i class="fa fa-upload"></i> Submit</button>` : ''}
    </div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
        <div style="padding:14px;background:var(--bg);border-radius:var(--radius-md);border:1px solid var(--border)">
          <div class="text-xs text-muted">Due Date</div>
          <div class="font-semi" style="margin-top:4px">${Format.date(due)}</div>
        </div>
        <div style="padding:14px;background:var(--bg);border-radius:var(--radius-md);border:1px solid var(--border)">
          <div class="text-xs text-muted">Points</div>
          <div class="font-semi" style="margin-top:4px">${a.points} pts</div>
        </div>
        <div style="padding:14px;background:var(--bg);border-radius:var(--radius-md);border:1px solid var(--border)">
          <div class="text-xs text-muted">Status</div>
          <span class="badge badge-${a.status === 'pending' ? 'warning' : a.status === 'submitted' ? 'primary' : 'success'}" style="margin-top:4px;display:inline-flex">${a.status}</span>
        </div>
        <div style="padding:14px;background:var(--bg);border-radius:var(--radius-md);border:1px solid var(--border)">
          <div class="text-xs text-muted">Grade</div>
          <div class="font-semi" style="margin-top:4px;color:var(--success)">${a.grade ? `${a.grade} (${a.score}/100)` : 'Not graded'}</div>
        </div>
      </div>
      <div style="margin-bottom:20px">
        <div class="font-semi" style="margin-bottom:8px">Description</div>
        <p>${a.description}</p>
      </div>
      ${a.files.length ? `
        <div>
          <div class="font-semi" style="margin-bottom:8px">Submitted Files</div>
          ${a.files.map(f => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--primary-light);border-radius:var(--radius);margin-bottom:8px">
              <i class="fa fa-file-o" style="color:var(--primary)"></i>
              <span style="font-size:0.875rem">${f}</span>
              <button style="margin-left:auto;background:none;border:none;color:var(--primary);cursor:pointer;font-size:0.8rem"><i class="fa fa-download"></i></button>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  panel.classList.add('active');
}

// ── Submit Modal ───────────────────────────────────────────────
function openSubmitModal(id) {
  document.getElementById('submitAssignmentId').value = id;
  document.getElementById('submitText').value = '';
  document.getElementById('uploadedFiles').innerHTML = '';
  Modal.open('submitModal');
}

function submitAssignment() {
  const id   = parseInt(document.getElementById('submitAssignmentId').value);
  const text = document.getElementById('submitText').value.trim();

  if (!text) {
    Toast.warning('Please add a note or description for your submission');
    return;
  }

  const idx = assignmentsData.findIndex(a => a.id === id);
  if (idx >= 0) {
    assignmentsData[idx].status = 'submitted';
    assignmentsData[idx].files = ['submission.pdf'];
    Store.set('assignments', assignmentsData);
    renderAssignmentsList();
    Modal.close('submitModal');
    Toast.success('Assignment Submitted!', 'Your submission has been received & logged');

    // Sync with backend API
    try {
      fetch('http://localhost:5000/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId: id, notes: text, submissionUrl: 'submission.pdf' })
      }).catch(() => {});
    } catch(e) {}

    // Update detail panel
    if (activeAssignment?.id === id) openAssignmentDetail(id);
  }
}

// ── Filters & Sort ─────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderAssignmentsList();
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

// ── File Upload UI ─────────────────────────────────────────────
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
    item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--success-light);border-radius:var(--radius);margin-top:8px;font-size:0.875rem';
    item.innerHTML = `
      <i class="fa fa-file-o" style="color:var(--success)"></i>
      <span>${file.name}</span>
      <span style="color:var(--text-muted);font-size:0.75rem">(${(file.size / 1024).toFixed(1)} KB)</span>
      <button onclick="this.parentElement.remove()" style="margin-left:auto;background:none;border:none;color:var(--danger);cursor:pointer">×</button>
    `;
    list.appendChild(item);
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('assignmentPage')) return;
  if (!Auth.requireAuth()) return;

  renderAssignmentsList();
  initFilters();
  initUploadArea();
});
