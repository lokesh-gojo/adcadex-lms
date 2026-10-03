/* ============================================================
   Prime Vector LMS — Project Module
   ============================================================ */

const ProjectModule = (() => {
  const KEY = 'Prime Vector_project';

  const DEFAULT = {
    title: 'E-Commerce Platform with AI Recommendation Engine',
    description: 'A full-stack e-commerce application featuring AI-driven product recommendations, real-time inventory management, and comprehensive analytics dashboard.',
    guide: 'Dr. Priya Ramesh',
    guideEmail: 'p.ramesh@primevector.edu',
    domain: 'Full Stack Development + AI/ML',
    startDate: '2025-06-01',
    endDate: '2025-07-31',
    githubUrl: 'https://github.com/student/ecommerce-ai-project',
    docsUrl: '',
    status: 'active',
    overallProgress: 62,
    team: [
      { name:'Arjun Mehta',   role:'Team Leader / Full Stack',  avatar:'AM', color:'#2563EB' },
      { name:'Priya Sharma',  role:'Frontend Developer',         avatar:'PS', color:'#10B981' },
      { name:'Rohit Kumar',   role:'Backend Developer',          avatar:'RK', color:'#8B5CF6' },
      { name:'Sneha Nair',    role:'ML Engineer',                avatar:'SN', color:'#F59E0B' }
    ],
    milestones: [
      { id:1, title:'Requirements & System Design',  date:'2025-06-07', status:'done',    desc:'Completed SRS document, ER diagram, and system architecture design' },
      { id:2, title:'Database Schema & API Design',  date:'2025-06-14', status:'done',    desc:'Finalized database schema, REST API endpoints documented' },
      { id:3, title:'Frontend UI Development',       date:'2025-06-28', status:'done',    desc:'Built all React components, responsive design implemented' },
      { id:4, title:'Backend API Development',       date:'2025-07-10', status:'active',  desc:'Building Node.js REST APIs, currently 70% complete' },
      { id:5, title:'AI Recommendation Module',      date:'2025-07-18', status:'pending', desc:'Collaborative filtering algorithm implementation' },
      { id:6, title:'Integration & Testing',         date:'2025-07-25', status:'pending', desc:'End-to-end testing, bug fixes, performance optimization' },
      { id:7, title:'Final Submission & Viva',       date:'2025-07-31', status:'pending', desc:'Documentation, demo preparation, faculty review' }
    ],
    techStack: ['React', 'Node.js', 'MongoDB', 'Python', 'scikit-learn', 'Docker', 'AWS S3']
  };

  function getData() {
    try { return JSON.parse(localStorage.getItem(KEY)) || DEFAULT; }
    catch { return DEFAULT; }
  }
  function saveData(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

  function updateMilestoneStatus(id, status) {
    const d = getData();
    const m = d.milestones.find(x => x.id === id);
    if (m) { m.status = status; saveData(d); }
  }

  function calcProgress(data) {
    const total = data.milestones.length;
    const done  = data.milestones.filter(m => m.status === 'done').length;
    return Math.round((done / total) * 100);
  }

  function renderMilestones(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = getData();
    const statusConfig = {
      done:    { color:'var(--success)', label:'Completed',  icon:'fa-check' },
      active:  { color:'var(--primary)', label:'In Progress', icon:'fa-circle' },
      pending: { color:'var(--border)',  label:'Pending',    icon:'fa-clock-o' }
    };

    el.innerHTML = `<div class="milestone-timeline">` + data.milestones.map(m => {
      const cfg = statusConfig[m.status];
      return `
        <div class="milestone-item ${m.status === 'done' ? 'done' : m.status === 'active' ? 'active' : ''}">
          <div class="milestone-date"><i class="fa fa-calendar-o" style="margin-right:4px"></i>${m.date}</div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
            <div class="milestone-title">${m.title}</div>
            <span class="badge" style="background:${cfg.color}20;color:${cfg.color};font-size:0.68rem;padding:2px 8px;border-radius:999px;font-weight:700">${cfg.label}</span>
          </div>
          <div class="milestone-desc">${m.desc}</div>
        </div>
      `;
    }).join('') + `</div>`;
  }

  function renderTeam(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const { team } = getData();

    el.innerHTML = `<div class="team-grid">` + team.map(m => `
      <div class="team-card">
        <div class="team-avatar" style="background:${m.color}">${m.avatar}</div>
        <div class="team-name">${m.name}</div>
        <div class="team-role">${m.role}</div>
        <span class="team-role-badge" style="background:rgba(37,99,235,0.1);color:var(--primary)">${m.role.split('/')[0].trim()}</span>
      </div>
    `).join('') + `</div>`;
  }

  return { getData, saveData, calcProgress, updateMilestoneStatus, renderMilestones, renderTeam };
})();
