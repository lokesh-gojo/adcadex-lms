/* ============================================================
   Prime Vector LMS — Calendar Engine
   ============================================================ */

const CalendarEngine = (() => {
  const EVENTS_KEY = 'Prime Vector_calendar_events';

  /* ── Default Events ──────────────────────────────────────── */
  function getDefaultEvents() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    return [
      { id: 1, title: 'Web Dev Live Class', type: 'class', date: new Date(y,m,now.getDate()+1).toISOString().slice(0,10), time: '10:00', desc: 'React Hooks Deep Dive' },
      { id: 2, title: 'Assignment Due: REST API', type: 'assignment', date: new Date(y,m,now.getDate()+2).toISOString().slice(0,10), time: '23:59', desc: 'Web Development Course' },
      { id: 3, title: 'ML Quiz — Supervised Learning', type: 'exam', date: new Date(y,m,now.getDate()+3).toISOString().slice(0,10), time: '14:00', desc: '45 minutes, 20 questions' },
      { id: 4, title: 'UI/UX Live Class', type: 'class', date: new Date(y,m,now.getDate()+5).toISOString().slice(0,10), time: '11:00', desc: 'Figma Prototyping' },
      { id: 5, title: 'DSA Assignment Due', type: 'assignment', date: new Date(y,m,now.getDate()+6).toISOString().slice(0,10), time: '23:59', desc: 'Binary Trees Implementation' },
      { id: 6, title: 'Placement Webinar', type: 'event', date: new Date(y,m,now.getDate()+8).toISOString().slice(0,10), time: '15:00', desc: 'Guest Lecture: TechCorp HR' },
      { id: 7, title: 'Mid-Term Examination', type: 'exam', date: new Date(y,m,now.getDate()+12).toISOString().slice(0,10), time: '09:00', desc: 'All subjects' },
      { id: 8, title: 'Internship Report Due', type: 'assignment', date: new Date(y,m,now.getDate()+15).toISOString().slice(0,10), time: '23:59', desc: 'Week 3 logbook' },
      { id: 9, title: 'Project Milestone 2', type: 'assignment', date: new Date(y,m,now.getDate()+18).toISOString().slice(0,10), time: '23:59', desc: 'Backend API submission' },
      { id: 10, title: 'Mock Interview Session', type: 'event', date: new Date(y,m,now.getDate()+20).toISOString().slice(0,10), time: '13:00', desc: 'Placement Training' }
    ];
  }

  function getEvents() {
    try { return JSON.parse(localStorage.getItem(EVENTS_KEY)) || getDefaultEvents(); }
    catch { return getDefaultEvents(); }
  }
  function saveEvents(evts) { localStorage.setItem(EVENTS_KEY, JSON.stringify(evts)); }

  function addEvent(evt) {
    const evts = getEvents();
    evt.id = Date.now();
    evts.push(evt);
    saveEvents(evts);
    return evt;
  }
  function deleteEvent(id) {
    const evts = getEvents().filter(e => e.id !== id);
    saveEvents(evts);
  }

  /* ── Render Calendar ─────────────────────────────────────── */
  function renderCalendar(containerId, year, month) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const now = new Date();
    const today = now.toISOString().slice(0,10);
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const events = getEvents();
    const eventDates = new Set(events.map(e => e.date));

    const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    let html = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <button id="calPrev" class="btn btn-ghost" style="padding:8px 14px">
          <i class="fa fa-chevron-left"></i>
        </button>
        <h3 style="font-family:var(--font-display);font-weight:800">${MONTHS[month]} ${year}</h3>
        <button id="calNext" class="btn btn-ghost" style="padding:8px 14px">
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
      <div class="calendar-grid" style="margin-bottom:4px">
        ${DAYS.map(d => `<div class="cal-header-day">${d}</div>`).join('')}
      </div>
      <div class="calendar-grid">
    `;

    // Previous month padding
    const prevLast = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      html += `<div class="cal-day other-month">${prevLast - i}</div>`;
    }

    // Current month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday = dateStr === today;
      const hasEvt  = eventDates.has(dateStr);
      html += `<div class="cal-day${isToday?' today':''}${hasEvt?' has-event':''}" data-date="${dateStr}">${d}</div>`;
    }

    // Next month padding
    const remaining = 42 - (startDow + totalDays);
    for (let d = 1; d <= remaining; d++) {
      html += `<div class="cal-day other-month">${d}</div>`;
    }

    html += `</div>`;
    el.innerHTML = html;

    // Navigate
    document.getElementById('calPrev')?.addEventListener('click', () => {
      const nm = month === 0 ? 11 : month - 1;
      const ny = month === 0 ? year - 1 : year;
      renderCalendar(containerId, ny, nm);
      renderEvents(eventsContainerId, nm === 11 ? ny : year, nm);
    });
    document.getElementById('calNext')?.addEventListener('click', () => {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      renderCalendar(containerId, ny, nm);
      renderEvents(eventsContainerId, nm === 0 ? ny : year, nm);
    });

    // Click on day
    el.querySelectorAll('.cal-day:not(.other-month)').forEach(day => {
      day.addEventListener('click', () => {
        el.querySelectorAll('.cal-day.selected').forEach(d => d.classList.remove('selected'));
        day.classList.add('selected');
        const date = day.dataset.date;
        if (date && eventsContainerId) renderEventsForDate(eventsContainerId, date);
      });
    });
  }

  let eventsContainerId = null;

  function setEventsContainer(id) { eventsContainerId = id; }

  /* ── Render Events for Date ──────────────────────────────── */
  function renderEventsForDate(containerId, date) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const evts = getEvents().filter(e => e.date === date);

    if (evts.length === 0) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa fa-calendar-o"></i></div>
          <div class="empty-state-title">No events</div>
          <div class="empty-state-desc">No events scheduled for this day</div>
        </div>`;
      return;
    }

    const icons = { class:'fa-video-camera', exam:'fa-pencil', assignment:'fa-tasks', event:'fa-star' };
    const colors = { class:'var(--primary)', exam:'var(--danger)', assignment:'var(--warning)', event:'var(--success)' };

    el.innerHTML = evts.map(e => `
      <div class="event-item ${e.type}">
        <div style="width:36px;height:36px;border-radius:var(--radius);background:${colors[e.type]}20;display:flex;align-items:center;justify-content:center;color:${colors[e.type]};flex-shrink:0">
          <i class="fa ${icons[e.type] || 'fa-calendar'}"></i>
        </div>
        <div style="flex:1">
          <div class="event-title">${e.title}</div>
          <div class="event-subtitle">${e.time} · ${e.desc}</div>
        </div>
        <button onclick="CalendarEngine.deleteEventAndRefresh(${e.id},'${date}')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.9rem;padding:4px" title="Delete">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    `).join('');
  }

  function deleteEventAndRefresh(id, date) {
    deleteEvent(id);
    if (eventsContainerId) renderEventsForDate(eventsContainerId, date);
    const now = new Date();
    renderCalendar('calendarGrid', now.getFullYear(), now.getMonth());
  }

  /* ── Render Upcoming Events ──────────────────────────────── */
  function renderEvents(containerId, year, month) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const today = new Date().toISOString().slice(0,10);
    const evts = getEvents()
      .filter(e => e.date >= today)
      .sort((a,b) => a.date.localeCompare(b.date))
      .slice(0, 8);

    if (!evts.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-state-title">No upcoming events</div></div>`;
      return;
    }

    const icons  = { class:'fa-video-camera', exam:'fa-pencil', assignment:'fa-tasks', event:'fa-star' };
    const colors = { class:'var(--primary)', exam:'var(--danger)', assignment:'var(--warning)', event:'var(--success)' };

    el.innerHTML = `<div class="event-list">` + evts.map(e => {
      const d = new Date(e.date + 'T00:00');
      const label = d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
      return `
        <div class="event-item ${e.type}">
          <div class="event-time">${label}</div>
          <div style="flex:1">
            <div class="event-title">${e.title}</div>
            <div class="event-subtitle">${e.time}</div>
          </div>
          <div style="width:8px;height:8px;border-radius:50%;background:${colors[e.type]};flex-shrink:0;margin-top:6px"></div>
        </div>
      `;
    }).join('') + `</div>`;
  }

  return {
    getEvents, addEvent, deleteEvent, deleteEventAndRefresh,
    renderCalendar, renderEvents, renderEventsForDate, setEventsContainer
  };
})();
