/* ============================================================
   Prime Vector LMS — training.js
   ============================================================ */

const TRAINING_DATA = {
  streak: 12,
  overallProgress: 65,
  duration: {
    total: 120,
    completed: 78,
    remaining: 42,
    estDate: 'Oct 15, 2026'
  },
  programs: [
    {
      id: 1,
      title: 'Full-Stack Web Development',
      instructor: 'Dr. Angela Yu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      status: 'In Progress',
      progress: 68,
      duration: '40 hours',
      schedule: 'Mon, Wed, Fri'
    },
    {
      id: 2,
      title: 'Advanced React patterns',
      instructor: 'Kent C. Dodds',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
      status: 'In Progress',
      progress: 42,
      duration: '20 hours',
      schedule: 'Tue, Thu'
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      instructor: 'Prof. Tim Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      status: 'Not Started',
      progress: 0,
      duration: '60 hours',
      schedule: 'Sat, Sun'
    }
  ],
  weeklyHours: [4, 6, 5, 8, 3, 7, 5]
};

function renderTrainingPrograms() {
  const container = document.getElementById('trainingList');
  if (!container) return;

  container.innerHTML = TRAINING_DATA.programs.map(p => {
    let statusClass = p.status === 'Completed' ? 'success' : p.status === 'In Progress' ? 'primary' : 'warning';
    return `
      <div class="training-card">
        <div class="training-header">
          <div>
            <div class="training-title">${p.title}</div>
            <div class="training-meta">
              <span><i class="fa fa-clock-o"></i> ${p.duration}</span>
              <span><i class="fa fa-calendar"></i> ${p.schedule}</span>
            </div>
          </div>
          <span class="badge badge-${statusClass}">${p.status}</span>
        </div>
        
        <div class="training-instructor">
          <img src="${p.avatar}" alt="${p.instructor}">
          <span style="font-size:0.85rem; font-weight:500;">${p.instructor}</span>
        </div>
        
        <div class="training-progress-section">
          <div class="course-progress-label">
            <span>Progress</span>
            <span class="course-progress-percent">${p.progress}%</span>
          </div>
          <div class="progress">
            <div class="progress-bar ${statusClass}" data-width="${p.progress}" style="width:0%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Re-init progress bars
  if(typeof initProgressBars === 'function') initProgressBars();
}

function renderWeeklyChart() {
  const canvas = document.getElementById('weeklyHoursChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Learning Hours',
        data: TRAINING_DATA.weeklyHours,
        backgroundColor: '#10B981',
        borderRadius: 6,
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

function initTrainingDashboard() {
  if (!document.getElementById('trainingPage')) return;
  
  // Set overall circular progress
  const ring = document.querySelector('#overallProgressRing .progress-circle');
  if(ring) {
    const offset = 251.2 - (251.2 * TRAINING_DATA.overallProgress) / 100;
    setTimeout(() => { ring.style.strokeDashoffset = offset; }, 100);
  }

  renderTrainingPrograms();
  renderWeeklyChart();
}

document.addEventListener('DOMContentLoaded', initTrainingDashboard);
