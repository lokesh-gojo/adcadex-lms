/* ============================================================
   Prime Vector LMS — Internship Module
   ============================================================ */

const InternshipModule = (() => {
  const KEY = 'Prime Vector_internship';

  const DEFAULT_DATA = {
    company: 'TechCorp Solutions Pvt. Ltd.',
    role: 'Full Stack Developer Intern',
    mentor: 'Rakesh Iyer',
    mentorEmail: 'r.iyer@techcorp.com',
    startDate: '2025-06-01',
    endDate: '2025-07-31',
    location: 'Bangalore, Karnataka',
    mode: 'On-site',
    stipend: '₹15,000 / month',
    progress: 65,
    tasks: [
      { id:1, title:'Setup development environment',     status:'done',       priority:'high',   due:'2025-06-03' },
      { id:2, title:'Complete React component library',  status:'done',       priority:'high',   due:'2025-06-15' },
      { id:3, title:'Build REST API endpoints',          status:'inprogress', priority:'high',   due:'2025-07-01' },
      { id:4, title:'Implement user authentication',     status:'inprogress', priority:'medium', due:'2025-07-05' },
      { id:5, title:'Database schema design',            status:'todo',       priority:'medium', due:'2025-07-10' },
      { id:6, title:'Write unit tests',                  status:'todo',       priority:'low',    due:'2025-07-15' },
      { id:7, title:'Deploy to staging server',          status:'todo',       priority:'high',   due:'2025-07-20' },
      { id:8, title:'Final presentation prep',           status:'todo',       priority:'high',   due:'2025-07-28' }
    ],
    logbook: [
      { date:'2025-07-10', hours:8, tasks:'Completed React component for user profile page; reviewed PR from teammate', highlight:'Merged first PR', mood:'😊' },
      { date:'2025-07-09', hours:7.5, tasks:'Built API endpoints for user CRUD operations; tested with Postman', highlight:'API working end-to-end', mood:'🚀' },
      { date:'2025-07-08', hours:8, tasks:'Attended team standup; fixed bug in login flow; updated documentation', highlight:'Fixed critical auth bug', mood:'💪' },
      { date:'2025-07-07', hours:6, tasks:'Reviewed codebase; started working on database schema design', highlight:'Good understanding of architecture', mood:'📖' },
      { date:'2025-07-04', hours:8, tasks:'Implemented JWT authentication system; wrote tests', highlight:'Auth system complete', mood:'🎉' },
      { date:'2025-07-03', hours:7, tasks:'Daily standup; worked on REST API for projects module', highlight:'Good progress on APIs', mood:'😊' }
    ],
    weeklyReports: [
      { week: 6, startDate: '2025-07-07', endDate: '2025-07-11', summary: 'Focused on API development and bug fixes. Completed authentication system.', rating: 4, mentorFeedback: 'Good progress. Keep it up!' },
      { week: 5, startDate: '2025-06-30', endDate: '2025-07-04', summary: 'Implemented core database schemas and began API development.', rating: 4, mentorFeedback: 'Excellent work on the schema design.' },
      { week: 4, startDate: '2025-06-23', endDate: '2025-06-27', summary: 'Completed React component library and started backend integration.', rating: 5, mentorFeedback: 'Outstanding performance this week!' }
    ]
  };

  function getData() {
    try { return JSON.parse(localStorage.getItem(KEY)) || DEFAULT_DATA; }
    catch { return DEFAULT_DATA; }
  }

  function saveData(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

  function addLogEntry(entry) {
    const d = getData();
    entry.date = new Date().toISOString().slice(0,10);
    d.logbook.unshift(entry);
    saveData(d);
  }

  function updateTaskStatus(id, status) {
    const d = getData();
    const t = d.tasks.find(x => x.id === id);
    if (t) { t.status = status; saveData(d); }
  }

  function calcProgress(data) {
    const total = data.tasks.length;
    const done  = data.tasks.filter(t => t.status === 'done').length;
    return total ? Math.round((done / total) * 100) : 0;
  }

  function calcDaysRemaining(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    return Math.max(0, Math.ceil((end - now) / 86400000));
  }

  function calcTotalDays(start, end) {
    return Math.ceil((new Date(end) - new Date(start)) / 86400000);
  }

  /* Render task board */
  function renderTaskBoard(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = getData();
    const cols = {
      todo:       { label:'To Do',      color:'var(--text-muted)',  badge:'var(--border)' },
      inprogress: { label:'In Progress', color:'var(--primary)',    badge:'rgba(37,99,235,0.2)' },
      done:       { label:'Done',       color:'var(--success)',     badge:'rgba(16,185,129,0.2)' }
    };
    const priority = { high:'var(--danger)', medium:'var(--warning)', low:'var(--success)' };

    el.innerHTML = `<div class="task-board">` + Object.entries(cols).map(([status, cfg]) => {
      const tasks = data.tasks.filter(t => t.status === status);
      return `
        <div class="task-column">
          <div class="task-column-header">
            <span class="task-column-title" style="color:${cfg.color}">${cfg.label}</span>
            <span class="task-count-badge" style="background:${cfg.badge};color:${cfg.color}">${tasks.length}</span>
          </div>
          ${tasks.map(t => `
            <div class="task-card" onclick="InternshipModule.cycleStatus(${t.id})">
              <div class="task-card-title">${t.title}</div>
              <div class="task-card-meta">
                <span style="color:${priority[t.priority]};font-weight:700;font-size:0.7rem;text-transform:uppercase">${t.priority}</span>
                <span><i class="fa fa-calendar-o" style="margin-right:3px"></i>${t.due}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('') + `</div>`;
  }

  function cycleStatus(id) {
    const data = getData();
    const t = data.tasks.find(x => x.id === id);
    if (!t) return;
    const cycle = { todo:'inprogress', inprogress:'done', done:'todo' };
    t.status = cycle[t.status];
    saveData(data);
    renderTaskBoard('taskBoard');
    if (typeof Toast !== 'undefined') Toast.success('Task Updated', `Status changed to ${t.status}`);
  }

  /* Render logbook */
  function renderLogbook(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = getData();

    el.innerHTML = `
      <table class="logbook-table">
        <thead>
          <tr>
            <th>Date</th><th>Hours</th><th>Tasks Completed</th><th>Highlight</th><th>Mood</th>
          </tr>
        </thead>
        <tbody>
          ${data.logbook.slice(0,10).map(l => `
            <tr>
              <td><strong>${l.date}</strong></td>
              <td><span class="badge badge-primary">${l.hours}h</span></td>
              <td>${l.tasks}</td>
              <td><span class="badge badge-success">${l.highlight}</span></td>
              <td style="font-size:1.2rem">${l.mood}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  return { getData, saveData, addLogEntry, updateTaskStatus, calcProgress, calcDaysRemaining, calcTotalDays, renderTaskBoard, renderLogbook, cycleStatus };
})();
