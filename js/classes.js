/* ============================================================
   Prime Vector LMS — classes.js
   Live Video Streaming & Masterclass Delivery Engine
   ============================================================ */

let recordedClasses = [];
let currentActiveVideo = null;
let currentTrackFilter = 'all';

const liveUpcomingClasses = [
  {
    id: 1,
    title: 'System Design: Caching, Sharding & Rate Limiting',
    instructor: 'Dr. Sarah Chen',
    instructorRole: 'Principal Cloud Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80',
    time: 'Today, 5:00 PM',
    duration: '2 Hours',
    track: 'Architecture',
    status: 'live-soon',
    statusText: 'Starts in 20m',
    registered: 142,
    link: 'https://meet.google.com/pv-lms-class'
  },
  {
    id: 2,
    title: 'Advanced Graph Theory & Network Flows',
    instructor: 'Prof. Tim Chen',
    instructorRole: 'Algorithms Research Lead',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    time: 'Tomorrow, 10:00 AM',
    duration: '1.5 Hours',
    track: 'Core CS',
    status: 'scheduled',
    statusText: 'Tomorrow, 10 AM',
    registered: 98,
    link: 'https://meet.google.com/pv-lms-class'
  },
  {
    id: 3,
    title: 'Microservices & Docker Container Orchestration',
    instructor: 'Marcus Vance',
    instructorRole: 'Staff DevOps Specialist',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    time: 'Friday, 3:30 PM',
    duration: '2 Hours',
    track: 'Cloud & DevOps',
    status: 'scheduled',
    statusText: 'Friday, 3:30 PM',
    registered: 165,
    link: 'https://meet.google.com/pv-lms-class'
  }
];

function initClassPage() {
  if (window.OnlineData) {
    recordedClasses = OnlineData.getCuratedVideoLectures();
  } else {
    recordedClasses = [
      {
        id: 'vid-1',
        title: 'System Design Interview & Scalable Architecture',
        instructor: 'Dr. Sarah Chen',
        duration: '1h 24m',
        date: 'Recent Stream',
        category: 'Architecture',
        youtubeId: 'm8Icp_Cid5o',
        thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80',
        notes: [
          'Load balancers distribute traffic across multiple app instances.',
          'Horizontal scaling is preferred over vertical scaling for resilience.',
          'Caching layer (Redis/Memcached) drastically reduces DB query overhead.'
        ]
      }
    ];
  }

  currentActiveVideo = recordedClasses[0];
  renderLiveClasses();
  renderRecordings(recordedClasses);
  updateActivePlayerDetails(currentActiveVideo);
  updateClassStats();
}

function renderLiveClasses() {
  const liveContainer = document.getElementById('liveClassesList');
  if (!liveContainer) return;

  liveContainer.innerHTML = liveUpcomingClasses.map(c => {
    const isLiveSoon = c.status === 'live-soon';

    return `
      <div class="live-session-card ${isLiveSoon ? 'status-live' : ''}">
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <span class="badge ${isLiveSoon ? 'badge-primary' : 'badge-gray'}" style="font-size:0.75rem;padding:3px 8px">
              ${c.track}
            </span>
            ${isLiveSoon ? `
              <span class="pulse-badge-live">
                <span class="pulse-badge-dot"></span> ${c.statusText}
              </span>
            ` : `
              <span class="badge badge-warning" style="font-size:0.72rem;padding:3px 8px">
                <i class="fa fa-calendar-check-o"></i> ${c.statusText}
              </span>
            `}
          </div>

          <h3 style="font-size:1.05rem;font-weight:700;line-height:1.35;margin:0 0 12px;color:var(--text)">
            ${c.title}
          </h3>

          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
            <img src="${c.instructorAvatar}" alt="${c.instructor}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid var(--border)">
            <div>
              <div style="font-size:0.85rem;font-weight:700;color:var(--text)">${c.instructor}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${c.instructorRole}</div>
            </div>
          </div>

          <div style="font-size:0.8rem;color:var(--text-muted);display:flex;align-items:center;gap:14px;margin-bottom:16px">
            <span><i class="fa fa-clock-o text-primary"></i> ${c.time}</span>
            <span><i class="fa fa-hourglass-half"></i> ${c.duration}</span>
            <span><i class="fa fa-users text-success"></i> ${c.registered} Registered</span>
          </div>
        </div>

        <div style="display:flex;gap:8px;align-items:center;padding-top:12px;border-top:1px solid var(--border)">
          <button class="btn ${isLiveSoon ? 'btn-primary' : 'btn-outline'} btn-sm" style="flex:1" onclick="joinLiveRoom('${c.title}')">
            <i class="fa ${isLiveSoon ? 'fa-video-camera' : 'fa-play-circle'}"></i> ${isLiveSoon ? 'Join Live Room' : 'Join Session'}
          </button>
          <button class="btn btn-outline btn-sm" onclick="setSessionReminder('${c.title}')" title="Set Calendar Reminder">
            <i class="fa fa-bell-o"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecordings(data) {
  const recContainer = document.getElementById('recordedClassesList');
  if (!recContainer) return;

  if (!data || data.length === 0) {
    recContainer.innerHTML = `
      <div style="text-align:center;padding:32px;color:var(--text-muted)">
        <i class="fa fa-film" style="font-size:2rem;margin-bottom:8px"></i>
        <p style="font-size:0.85rem">No recorded masterclasses match your search.</p>
      </div>
    `;
    return;
  }

  recContainer.innerHTML = data.map(c => {
    const isCompleted = localStorage.getItem(`class_completed_${c.id}`);
    const isCurrent = currentActiveVideo && currentActiveVideo.id === c.id;

    return `
      <div class="class-item ${isCurrent ? 'active-video-item' : ''}" 
           style="cursor:pointer;display:flex;gap:12px;padding:12px 14px;border:1px solid ${isCurrent ? 'var(--primary)' : 'var(--border)'};border-radius:var(--radius-lg);margin-bottom:10px;background:var(--surface);transition:all 0.2s ease"
           onclick="selectVideo('${c.id}')">
        <div style="position:relative;width:100px;height:68px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0;box-shadow:var(--shadow-sm)">
          <img src="${c.thumb}" style="width:100%;height:100%;object-fit:cover" alt="${c.title}">
          <span style="position:absolute;bottom:4px;right:4px;background:rgba(15,23,42,0.85);backdrop-filter:blur(4px);color:#fff;font-size:0.65rem;font-weight:700;padding:2px 5px;border-radius:3px">
            ${c.duration}
          </span>
        </div>
        <div class="class-item-info" style="flex:1;min-width:0">
          <div class="class-item-title" style="font-size:0.88rem;font-weight:700;line-height:1.3;margin-bottom:4px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ${c.title}
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:4px">${c.instructor}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="badge badge-gray" style="font-size:0.65rem;padding:1px 6px">${c.category || 'Tech'}</span>
            ${isCompleted ? '<span style="color:var(--success);font-size:0.72rem;font-weight:700"><i class="fa fa-check-circle"></i> Watched</span>' : ''}
          </div>
        </div>
        <div style="color:var(--primary);align-self:center;margin-left:4px">
          <i class="fa ${isCurrent ? 'fa-volume-up' : 'fa-play-circle-o'}" style="font-size:1.4rem"></i>
        </div>
      </div>
    `;
  }).join('');
}

function selectVideo(id) {
  const video = recordedClasses.find(c => c.id === id);
  if (!video) return;

  currentActiveVideo = video;
  updateActivePlayerDetails(video);
  filterRecordings();

  // If iframe was already active, start new video directly
  const iframe = document.getElementById('mainLectureIframe');
  if (iframe && iframe.style.display !== 'none') {
    playCurrentVideo();
  }
}

function updateActivePlayerDetails(video) {
  const titleEl = document.getElementById('currentPlayerTitle');
  const metaEl = document.getElementById('currentPlayerMeta');
  const overlayTitle = document.getElementById('overlayTitle');
  const notesList = document.getElementById('lectureNotesList');

  if (titleEl) titleEl.innerText = video.title;
  if (overlayTitle) overlayTitle.innerText = video.title;
  if (metaEl) {
    metaEl.innerHTML = `<i class="fa fa-user-circle-o text-primary"></i> ${video.instructor} &nbsp;|&nbsp; <i class="fa fa-clock-o"></i> ${video.duration} &nbsp;|&nbsp; <span class="badge badge-success" style="font-size:0.7rem"><i class="fa fa-wifi"></i> Live HD Stream</span>`;
  }

  if (notesList && video.notes) {
    notesList.innerHTML = video.notes.map(n => `
      <li style="margin-bottom:6px;display:flex;align-items:flex-start;gap:8px">
        <i class="fa fa-check text-success" style="margin-top:3px;font-size:0.8rem"></i>
        <span>${n}</span>
      </li>
    `).join('');
  }
}

function playCurrentVideo() {
  if (!currentActiveVideo) return;

  const iframe = document.getElementById('mainLectureIframe');
  const overlay = document.getElementById('videoOverlay');

  if (iframe && overlay) {
    iframe.src = `https://www.youtube-nocookie.com/embed/${currentActiveVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.style.display = 'block';
    overlay.style.display = 'none';
  }
}

function filterRecordings() {
  const query = document.getElementById('recordingsSearch')?.value.toLowerCase().trim() || '';

  const filtered = recordedClasses.filter(c => {
    const matchesQuery = c.title.toLowerCase().includes(query) ||
                         c.instructor.toLowerCase().includes(query) ||
                         (c.category && c.category.toLowerCase().includes(query));
    const matchesTrack = currentTrackFilter === 'all' || (c.category && c.category.toLowerCase() === currentTrackFilter.toLowerCase());
    return matchesQuery && matchesTrack;
  });

  renderRecordings(filtered);
}

function filterByTrack(track, btnEl) {
  currentTrackFilter = track;

  const buttons = document.querySelectorAll('#trackFilterBar .filter-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  filterRecordings();
}

function markCompleted() {
  if (!currentActiveVideo) return;
  const key = `class_completed_${currentActiveVideo.id}`;
  localStorage.setItem(key, 'true');
  renderRecordings(recordedClasses);
  updateClassStats();

  if (window.showNotification) {
    showNotification('Masterclass Completed!', `+50 XP awarded for watching: ${currentActiveVideo.title}`, 'success');
  } else {
    alert(`🎉 Masterclass Completed!\n+50 XP awarded for: ${currentActiveVideo.title}`);
  }
}

function updateClassStats() {
  const completedKeys = Object.keys(localStorage).filter(k => k.startsWith('class_completed_'));
  const completedCount = completedKeys.length;

  const completedEl = document.getElementById('statCompletedClasses');
  if (completedEl) {
    completedEl.textContent = `${completedCount} Finished`;
  }
}

function toggleBookmarkClass() {
  alert('📌 Masterclass saved to your personal LMS Study Library!');
}

function setSessionReminder(title) {
  alert(`🔔 Reminder Set!\nYou will receive a calendar notification 15 minutes before "${title}" starts.`);
}

function joinLiveRoom(title) {
  alert(`🚀 Connecting to Live Virtual Classroom for:\n"${title}"\nLaunching secure WebRTC streaming room...`);
  setTimeout(() => {
    window.open('https://meet.google.com/pv-lms-class', '_blank');
  }, 500);
}

window.selectVideo = selectVideo;
window.playCurrentVideo = playCurrentVideo;
window.filterRecordings = filterRecordings;
window.filterByTrack = filterByTrack;
window.markCompleted = markCompleted;
window.toggleBookmarkClass = toggleBookmarkClass;
window.setSessionReminder = setSessionReminder;
window.joinLiveRoom = joinLiveRoom;

document.addEventListener('DOMContentLoaded', () => {
  initClassPage();
});
