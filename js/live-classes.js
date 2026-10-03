/* ============================================================
   Prime Vector LMS — live-classes.js
   ============================================================ */

const liveSessions = [
  { id: 1, title: 'Advanced Full Stack System Design', instructor: 'Dr. Sarah Chen', time: 'Today at 5:00 PM', duration: '2 Hours', category: 'Web Dev', status: 'Live Soon' },
  { id: 2, title: 'Data Structures & Algorithms: Graphs & Trees', instructor: 'Prof. Tim Chen', time: 'Tomorrow at 10:00 AM', duration: '1.5 Hours', category: 'CS Core', status: 'Upcoming' },
  { id: 3, title: 'Cloud Native Microservices Architecture', instructor: 'Mark Zucker', time: 'Friday at 2:00 PM', duration: '2.5 Hours', category: 'DevOps', status: 'Upcoming' }
];

const recordedSessions = [
  { id: 101, title: 'React 18 Concurrent Rendering & Server Components', instructor: 'Sarah Jenkins', date: 'Oct 14, 2024', duration: '1h 45m', views: '240' },
  { id: 102, title: 'Node.js Performance Tuning & Memory Profiling', instructor: 'John Doe', date: 'Oct 12, 2024', duration: '2h 10m', views: '310' },
  { id: 103, title: 'Machine Learning Models Deployment with FastAPI', instructor: 'Dr. Kim', date: 'Oct 08, 2024', duration: '1h 30m', views: '185' },
  { id: 104, title: 'Database Indexing & Query Optimization in PostgreSQL', instructor: 'Alex Johnson', date: 'Oct 04, 2024', duration: '1h 15m', views: '420' }
];

function renderUpcomingClasses() {
  const container = document.getElementById('upcomingList');
  if (!container) return;

  container.innerHTML = liveSessions.map(c => `
    <div class="card" style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border:1px solid var(--border); border-radius:var(--radius-md);">
      <div style="display:flex; align-items:center; gap:16px;">
        <div style="width:44px; height:44px; border-radius:10px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:1.25rem;">
          <i class="fa fa-video-camera"></i>
        </div>
        <div>
          <h4 style="margin:0 0 4px 0; font-size:1rem; font-weight:700">${c.title}</h4>
          <div style="font-size:0.85rem; color:var(--text-muted); display:flex; gap:16px;">
            <span><i class="fa fa-user"></i> ${c.instructor}</span>
            <span><i class="fa fa-clock-o"></i> ${c.time}</span>
            <span><i class="fa fa-hourglass-half"></i> ${c.duration}</span>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="joinLiveSession('${c.title}')">
        <i class="fa fa-play-circle"></i> Join Class
      </button>
    </div>
  `).join('');
}

function renderRecordedClasses() {
  const container = document.getElementById('recordingList');
  if (!container) return;

  container.innerHTML = recordedSessions.map(r => `
    <div class="card" style="border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; transition:var(--transition); cursor:pointer;" onclick="openVideoModal('${r.title}')">
      <div style="height:140px; background:linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%); display:flex; align-items:center; justify-content:center; color:white; position:relative;">
        <i class="fa fa-play-circle-o" style="font-size:3rem; opacity:0.8;"></i>
        <span style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.75); color:white; font-size:0.75rem; padding:2px 8px; border-radius:4px;">${r.duration}</span>
      </div>
      <div style="padding:16px;">
        <h4 style="margin:0 0 6px 0; font-size:0.95rem; font-weight:700;">${r.title}</h4>
        <div style="font-size:0.8rem; color:var(--text-muted); display:flex; justify-content:space-between;">
          <span>${r.instructor}</span>
          <span>${r.date}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function joinLiveSession(title) {
  Toast.success('Joining Class', `Connecting to session: ${title}`);
  try {
    fetch('http://localhost:5000/api/classes/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId: title, studentName: 'Alex Johnson' })
    }).catch(() => {});
  } catch(e) {}
}

function openVideoModal(title) {
  const modalTitle = document.getElementById('modalVideoTitle');
  if (modalTitle) modalTitle.textContent = title;
  Modal.open('videoModal');
}

window.joinLiveSession = joinLiveSession;
window.openVideoModal = openVideoModal;

async function syncWithBackend() {
  try {
    const liveRes = await fetch('http://localhost:5000/api/classes/live');
    const liveData = await liveRes.json();
    if (liveData.success && liveData.liveClasses?.length) {
      liveData.liveClasses.forEach(item => {
        if (!liveSessions.some(s => s.title === item.title)) {
          liveSessions.unshift({
            id: item.id,
            title: item.title,
            instructor: item.trainer,
            time: item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Upcoming',
            duration: `${item.durationMins || 60} Mins`,
            category: 'Live Track',
            status: item.status || 'Upcoming'
          });
        }
      });
      renderUpcomingClasses();
    }
  } catch(e) {}

  try {
    const recRes = await fetch('http://localhost:5000/api/classes/recorded');
    const recData = await recRes.json();
    if (recData.success && recData.recordedClasses?.length) {
      recData.recordedClasses.forEach(item => {
        if (!recordedSessions.some(r => r.title === item.title)) {
          recordedSessions.unshift({
            id: item.id,
            title: item.title,
            instructor: item.instructor,
            date: item.date,
            duration: item.duration,
            views: item.views
          });
        }
      });
      renderRecordedClasses();
    }
  } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  renderUpcomingClasses();
  renderRecordedClasses();
  syncWithBackend();
});
