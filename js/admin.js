/* ============================================================
   Prime Vector LMS — admin.js
   ============================================================ */

let adminData = {
  users: Store ? Store.get('users', []) : [],
  departments: [
    { id: 1, name: 'Computer Science', head: 'Dr. Sarah Chen', students: 320, faculty: 12, courses: 28 },
    { id: 2, name: 'Mathematics', head: 'Prof. Alan Turing', students: 210, faculty: 8, courses: 18 },
    { id: 3, name: 'Physics', head: 'Dr. Richard Feyn', students: 180, faculty: 7, courses: 15 },
    { id: 4, name: 'Business', head: 'Prof. Peter Drucker', students: 450, faculty: 15, courses: 35 },
    { id: 5, name: 'Design', head: 'Dr. Steve Jobs', students: 145, faculty: 6, courses: 12 }
  ],
  enrollmentTrend: [120, 195, 280, 340, 410, 520, 610, 730, 820, 940, 1050, 1180],
  revenueData: [4200, 6800, 9500, 11200, 14000, 17500, 20100, 24300, 27800, 31200, 35600, 40100]
};

// ── Render Users Table ─────────────────────────────────────────
function renderUsersTable(filter = '') {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  let users = adminData.users;
  if (filter) {
    const f = filter.toLowerCase();
    users = users.filter(u =>
      u.name.toLowerCase().includes(f) ||
      u.email.toLowerCase().includes(f) ||
      u.role.toLowerCase().includes(f)
    );
  }

  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:32px">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div class="flex items-center gap-12">
          <div class="avatar-placeholder avatar-sm" style="border-radius:50%;background:var(--gradient-primary);color:#fff;font-size:0.8rem;font-weight:700;width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${u.name[0].toUpperCase()}
          </div>
          <div>
            <div class="font-semi" style="font-size:0.875rem">${u.name}</div>
            <div class="text-xs text-muted">${u.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-${roleColor(u.role)}">${u.role}</span></td>
      <td>${u.department || 'N/A'}</td>
      <td>${Format.date(u.joined || new Date())}</td>
      <td><span class="badge badge-${lifecycleColor(u.lifecycleStatus || 'Active')}">${u.lifecycleStatus || 'Active'}</span></td>
      <td>
        <div class="table-actions">
          <button class="action-btn edit" title="Edit" onclick="openEditUserModal(${u.id})"><i class="fa fa-pencil"></i></button>
          ${u.role === 'student' ? `<button class="action-btn" style="color:var(--info)" title="Extend Duration" onclick="alert('Duration Extended')"><i class="fa fa-clock-o"></i></button>` : ''}
          ${(u.lifecycleStatus === 'Archived') 
             ? `<button class="action-btn" style="color:var(--success)" title="Restore" onclick="alert('Student Restored')"><i class="fa fa-undo"></i></button>`
             : `<button class="action-btn" style="color:var(--warning)" title="Archive" onclick="alert('Student Archived')"><i class="fa fa-archive"></i></button>`
          }
          <button class="action-btn delete" title="Delete" onclick="deleteUser(${u.id})"><i class="fa fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function roleColor(role) {
  if (role === 'admin') return 'danger';
  if (role === 'faculty') return 'primary';
  return 'accent';
}

function lifecycleColor(status) {
  switch (status) {
    case 'Active': return 'success';
    case 'In Progress': return 'primary';
    case 'Completed': return 'accent';
    case 'Expired': return 'danger';
    case 'Archived': return 'muted';
    default: return 'success';
  }
}

// ── Render Departments ─────────────────────────────────────────
function renderDepartmentsTable() {
  const tbody = document.getElementById('deptTableBody');
  if (!tbody) return;

  tbody.innerHTML = adminData.departments.map(d => `
    <tr>
      <td class="font-semi">${d.name}</td>
      <td>${d.head}</td>
      <td>${d.students}</td>
      <td>${d.faculty}</td>
      <td>${d.courses}</td>
      <td>
        <div class="table-actions">
          <button class="action-btn edit" onclick="openEditDeptModal(${d.id})"><i class="fa fa-pencil"></i></button>
          <button class="action-btn delete" onclick="deleteDept(${d.id})"><i class="fa fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Charts ────────────────────────────────────────────────────
function renderEnrollmentTrendChart() {
  const canvas = document.getElementById('enrollmentTrendChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        {
          label: 'Students',
          data: adminData.enrollmentTrend,
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37,99,235,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#2563EB',
          pointRadius: 3,
          tension: 0.4,
          fill: true
        }
      ]
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

function renderRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Revenue ($)',
        data: adminData.revenueData,
        backgroundColor: 'rgba(20,184,166,0.8)',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => '$' + v.toLocaleString() } },
        x: { grid: { display: false }, ticks: { color: textColor } }
      }
    }
  });
}

function renderDeptPieChart() {
  const canvas = document.getElementById('deptPieChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: adminData.departments.map(d => d.name),
      datasets: [{
        data: adminData.departments.map(d => d.students),
        backgroundColor: ['#2563EB','#14B8A6','#F59E0B','#EF4444','#8B5CF6'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, padding: 12, font: { size: 11 } }
        }
      }
    }
  });
}

// ── Modals ────────────────────────────────────────────────────
function openAddUserModal() {
  document.getElementById('addUserForm').reset();
  Modal.open('addUserModal');
}

function saveNewUser() {
  const form = document.getElementById('addUserForm');
  const name  = form.querySelector('#newName').value.trim();
  const email = form.querySelector('#newEmail').value.trim();
  const role  = form.querySelector('#newRole').value;
  const dept  = form.querySelector('#newDept').value.trim();

  if (!name || !email || !role) {
    Toast.warning('Missing Fields', 'Please fill all required fields');
    return;
  }

  const allUsers = Store.get('users', []);
  const newUser = {
    id: Date.now(),
    name, email,
    password: 'change123',
    role, department: dept,
    joined: new Date().toISOString().slice(0, 10)
  };

  allUsers.push(newUser);
  Store.set('users', allUsers);
  adminData.users = allUsers;
  renderUsersTable();
  Modal.close('addUserModal');
  Toast.success('User Created!', `${name} has been added`);
}

function openEditUserModal(id) {
  const user = adminData.users.find(u => u.id === id);
  if (!user) return;
  document.getElementById('editUserId').value    = id;
  document.getElementById('editUserName').value  = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserRole').value  = user.role;
  document.getElementById('editUserDept').value  = user.department || '';
  Modal.open('editUserModal');
}

function saveEditUser() {
  const id    = parseInt(document.getElementById('editUserId').value);
  const name  = document.getElementById('editUserName').value.trim();
  const email = document.getElementById('editUserEmail').value.trim();
  const role  = document.getElementById('editUserRole').value;
  const dept  = document.getElementById('editUserDept').value.trim();

  if (!name || !email) { Toast.warning('Required fields missing'); return; }

  const allUsers = Store.get('users', []);
  const idx = allUsers.findIndex(u => u.id === id);
  if (idx >= 0) {
    allUsers[idx] = { ...allUsers[idx], name, email, role, department: dept };
    Store.set('users', allUsers);
    adminData.users = allUsers;
    renderUsersTable();
    Modal.close('editUserModal');
    Toast.success('User Updated!');
  }
}

function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  const allUsers = Store.get('users', []).filter(u => u.id !== id);
  Store.set('users', allUsers);
  adminData.users = allUsers;
  renderUsersTable();
  Toast.success('User Deleted');
}

function openEditDeptModal(id) {
  const dept = adminData.departments.find(d => d.id === id);
  if (!dept) return;
  document.getElementById('editDeptId').value   = id;
  document.getElementById('editDeptName').value = dept.name;
  document.getElementById('editDeptHead').value = dept.head;
  Modal.open('editDeptModal');
}

function saveEditDept() {
  const id   = parseInt(document.getElementById('editDeptId').value);
  const name = document.getElementById('editDeptName').value.trim();
  const head = document.getElementById('editDeptHead').value.trim();
  if (!name) return;
  const idx = adminData.departments.findIndex(d => d.id === id);
  if (idx >= 0) {
    adminData.departments[idx].name = name;
    adminData.departments[idx].head = head;
    renderDepartmentsTable();
    Modal.close('editDeptModal');
    Toast.success('Department Updated!');
  }
}

function deleteDept(id) {
  adminData.departments = adminData.departments.filter(d => d.id !== id);
  renderDepartmentsTable();
  Toast.success('Department Removed');
}

// ── Search ────────────────────────────────────────────────────
function initAdminSearch() {
  const searchInput = document.getElementById('userSearch');
  if (searchInput) {
    searchInput.addEventListener('input', e => renderUsersTable(e.target.value));
  }
}

// ── Init Admin Dashboard ───────────────────────────────────────
function initAdminDashboard() {
  if (!document.getElementById('adminDashboard')) return;
  if (!Auth.requireAuth()) return;

  const user = Auth.getUser();
  if (user && user.role !== 'admin') {
    window.location.href = `${user.role}.html`;
    return;
  }

  let users = Store.get('users', []);
  if (!users || !users.length) {
    users = [
      { id: 1, name: 'Alex Johnson',   email: 'student@demo.com', password: 'demo123', role: 'student', joined: '2024-09-01', department: 'Computer Science & AI', lifecycleStatus: 'Active' },
      { id: 2, name: 'Dr. Sarah Chen', email: 'faculty@demo.com', password: 'demo123', role: 'faculty', joined: '2023-01-15', department: 'Full Stack & Cloud', lifecycleStatus: 'Active' },
      { id: 3, name: 'Admin User',     email: 'admin@demo.com',   password: 'demo123', role: 'admin',   joined: '2022-06-01', department: 'Executive Governance', lifecycleStatus: 'Active' },
      { id: 4, name: 'Priya Sharma',   email: 'priya@demo.com',   password: 'demo123', role: 'student', joined: '2024-10-12', department: 'Data Science', lifecycleStatus: 'Active' },
      { id: 5, name: 'Rahul Kumar',    email: 'rahul@demo.com',   password: 'demo123', role: 'student', joined: '2024-11-05', department: 'Cybersecurity', lifecycleStatus: 'In Progress' },
      { id: 6, name: 'Prof. Drucker',  email: 'drucker@demo.com', password: 'demo123', role: 'faculty', joined: '2023-04-20', department: 'IoT & Robotics', lifecycleStatus: 'Active' },
      { id: 7, name: 'Ananya Roy',     email: 'ananya@demo.com',  password: 'demo123', role: 'student', joined: '2025-01-10', department: 'Full Stack Web', lifecycleStatus: 'Completed' }
    ];
    Store.set('users', users);
  }

  adminData.users = users;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  const totalStudents = adminData.users.filter(u => u.role === 'student').length;
  const totalFaculty  = adminData.users.filter(u => u.role === 'faculty').length;
  const totalUsers    = adminData.users.length;

  setEl('adminTotalStudents', totalStudents);
  setEl('adminTotalFaculty', totalFaculty);
  setEl('adminTotalDepts', adminData.departments.length);
  setEl('adminTotalUsers', totalUsers);

  renderUsersTable();
  renderDepartmentsTable();
  renderEnrollmentTrendChart();
  renderRevenueChart();
  renderDeptPieChart();
  initAdminSearch();
  initRealTimeStreamInAdmin();
}

function initRealTimeStreamInAdmin() {
  if (typeof RealTimeEngine === 'undefined') return;
  const container = document.getElementById('realtimeStreamList');
  if (!container) return;

  const renderStream = () => {
    const events = RealTimeEngine.events;
    container.innerHTML = events.slice(0, 6).map(ev => `
      <div style="display:flex; align-items:flex-start; gap:10px; padding:8px 12px; background:var(--bg); border-radius:var(--radius); border:1px solid var(--border); transition:var(--transition);">
        <div style="width:28px; height:28px; border-radius:50%; background:${ev.color}22; color:${ev.color}; display:flex; align-items:center; justify-content:center; font-size:0.8rem; flex-shrink:0; margin-top:2px;">
          <i class="fa ${ev.icon}"></i>
        </div>
        <div style="flex:1;">
          <div style="font-size:0.82rem; font-weight:600; color:var(--text); line-height:1.4;">${ev.text}</div>
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">${RealTimeEngine.formatRelativeTime(ev.timestamp)}</div>
        </div>
      </div>
    `).join('');
  };

  RealTimeEngine.subscribe((latestEvent, metrics) => {
    renderStream();
    const totalUsersEl = document.getElementById('adminTotalUsers');
    if (totalUsersEl) {
      totalUsersEl.innerHTML = `${metrics.activeUsers} <span style="font-size:0.75rem; font-weight:500; color:var(--success); display:block; margin-top:2px;"><i class="fa fa-circle" style="font-size:0.6rem"></i> Active Live</span>`;
    }
  });
}

document.addEventListener('DOMContentLoaded', initAdminDashboard);
