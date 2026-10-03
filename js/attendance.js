/* ============================================================
   Prime Vector LMS — attendance.js
   ============================================================ */

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// Generate realistic attendance for the current year
function generateAttendanceData() {
  const data = {};
  const now  = new Date();
  const year = now.getFullYear();

  for (let m = 0; m < now.getMonth() + 1; m++) {
    for (let d = 1; d <= 28; d++) {
      const date = new Date(year, m, d);
      if (date > now) break;
      const day = date.getDay();
      if (day === 0 || day === 6) continue; // Skip weekends

      const key = `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

      // Holidays
      if ((m === 0 && d === 1) || (m === 7 && d === 15) || (m === 9 && d === 2)) {
        data[key] = 'holiday';
        continue;
      }

      const rand = Math.random();
      if (rand < 0.80) data[key] = 'present';
      else if (rand < 0.90) data[key] = 'late';
      else data[key] = 'absent';
    }
  }

  return data;
}

let attendanceData = Store.get('attendance_data', null) || generateAttendanceData();
let viewYear   = new Date().getFullYear();
let viewMonth  = new Date().getMonth();
let viewSubject = 'all';

// ── Render Calendar ────────────────────────────────────────────
function renderAttendanceCalendar() {
  const calBody = document.getElementById('attendanceCal');
  if (!calBody) return;

  const monthTitle = document.getElementById('calMonthTitle');
  if (monthTitle) monthTitle.textContent = `${MONTHS[viewMonth]} ${viewYear}`;

  const firstDay   = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today       = new Date();

  let cells = '';

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells += '<div class="att-cell empty"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const key  = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const status = attendanceData[key] || '';
    const isToday = date.toDateString() === today.toDateString();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isFuture = date > today;

    let cls = 'att-cell';
    if (isToday)   cls += ' today';
    if (isWeekend) cls += ' weekend';
    if (!isWeekend && !isFuture && status) cls += ` ${status}`;
    if (isFuture)  cls += ' future';

    const title = isWeekend ? 'Weekend' : isFuture ? 'Upcoming' : status ? status.charAt(0).toUpperCase() + status.slice(1) : 'No class';

    cells += `<div class="${cls}" title="${title}: ${Format.date(date)}" onclick="showDayDetail('${key}', '${status}')">${d}</div>`;
  }

  calBody.innerHTML = cells;

  updateAttendanceSummary();
}

// ── Update Summary Stats ───────────────────────────────────────
function updateAttendanceSummary() {
  const monthKeys = Object.keys(attendanceData).filter(k => {
    const [y, m] = k.split('-').map(Number);
    return y === viewYear && m === viewMonth + 1;
  });

  const counts = { present: 0, absent: 0, late: 0, holiday: 0 };
  monthKeys.forEach(k => { if (counts[attendanceData[k]] !== undefined) counts[attendanceData[k]]++; });

  const total = counts.present + counts.absent + counts.late;
  const pct   = total ? Math.round((counts.present + counts.late * 0.5) / total * 100) : 0;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('attPresent',  counts.present);
  setEl('attAbsent',   counts.absent);
  setEl('attLate',     counts.late);
  setEl('attHoliday',  counts.holiday);
  setEl('attPercent',  pct + '%');
  setEl('attTotal',    total);

  // Update overall bar
  const bar = document.getElementById('attPercentBar');
  if (bar) {
    bar.style.width = pct + '%';
    bar.style.background = pct >= 85 ? 'var(--success)' : pct >= 70 ? 'var(--warning)' : 'var(--danger)';
  }

  // Update badge
  const badge = document.getElementById('attBadge');
  if (badge) {
    badge.textContent = pct >= 85 ? 'Excellent' : pct >= 70 ? 'Satisfactory' : 'At Risk';
    badge.className   = `badge badge-${pct >= 85 ? 'success' : pct >= 70 ? 'warning' : 'danger'}`;
  }
}

// ── Day Detail Modal ──────────────────────────────────────────
function showDayDetail(key, status) {
  if (!status) return;
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m-1, d);

  document.getElementById('dayDetailDate').textContent   = Format.date(date);
  document.getElementById('dayDetailStatus').textContent = status.charAt(0).toUpperCase() + status.slice(1);
  document.getElementById('dayDetailStatus').className = `badge badge-${status === 'present' ? 'success' : status === 'absent' ? 'danger' : status === 'late' ? 'warning' : 'primary'}`;
  Modal.open('dayDetailModal');
}

// ── Monthly Trend Chart ────────────────────────────────────────
function renderMonthlyTrendChart() {
  const canvas = document.getElementById('monthlyTrendChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const monthlyPct = [];
  for (let m = 0; m <= new Date().getMonth(); m++) {
    const keys = Object.keys(attendanceData).filter(k => {
      const [y, mo] = k.split('-').map(Number);
      return y === viewYear && mo === m + 1 && attendanceData[k] !== 'holiday';
    });
    const total = keys.length;
    const present = keys.filter(k => attendanceData[k] === 'present').length;
    const late    = keys.filter(k => attendanceData[k] === 'late').length;
    monthlyPct.push(total ? Math.round((present + late * 0.5) / total * 100) : 0);
  }

  const labels = MONTHS.slice(0, monthlyPct.length);

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Attendance %',
        data: monthlyPct,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37,99,235,0.08)',
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
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => `${ctx.raw}%` }
        }
      },
      scales: {
        y: {
          min: 0, max: 100,
          grid: { color: gridColor },
          ticks: { color: textColor, callback: v => v + '%' }
        },
        x: { grid: { display: false }, ticks: { color: textColor } }
      }
    }
  });
}

// ── Subject Breakdown ──────────────────────────────────────────
function renderSubjectAttendance() {
  const container = document.getElementById('subjectAttendance');
  if (!container) return;

  const subjects = [
    { name: 'Web Development', present: 22, total: 24 },
    { name: 'Machine Learning', present: 18, total: 22 },
    { name: 'UI/UX Design', present: 20, total: 20 },
    { name: 'Data Structures', present: 16, total: 20 },
    { name: 'Database Management', present: 14, total: 18 }
  ];

  container.innerHTML = subjects.map(s => {
    const pct = Math.round(s.present / s.total * 100);
    return `
      <div class="report-row">
        <div class="report-subject">${s.name}</div>
        <div class="report-bar" style="flex:2;padding:0 16px">
          <div class="progress">
            <div class="progress-bar ${pct >= 85 ? 'success' : pct >= 70 ? '' : 'warning'}"
                 data-width="${pct}" style="width:0%"></div>
          </div>
        </div>
        <div class="report-score" style="color:${pct >= 85 ? 'var(--success)' : pct >= 70 ? 'var(--primary)' : 'var(--warning)'}">${pct}%</div>
        <div style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap">${s.present}/${s.total}</div>
      </div>
    `;
  }).join('');

  initProgressBars();
}

// ── Month Navigation ───────────────────────────────────────────
function prevMonth() {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderAttendanceCalendar();
}

function nextMonth() {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  if (viewYear > new Date().getFullYear() || (viewYear === new Date().getFullYear() && viewMonth > new Date().getMonth())) {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    return;
  }
  renderAttendanceCalendar();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('attendancePage')) return;
  if (!Auth.requireAuth()) return;

  Store.set('attendance_data', attendanceData);

  document.getElementById('prevMonthBtn')?.addEventListener('click', prevMonth);
  document.getElementById('nextMonthBtn')?.addEventListener('click', nextMonth);

  renderAttendanceCalendar();
  renderMonthlyTrendChart();
  renderSubjectAttendance();
});
