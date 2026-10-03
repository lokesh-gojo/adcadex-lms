/* ============================================================
   Prime Vector LMS — classes.js
   Live Video Streaming & Masterclass Delivery Engine
   ============================================================ */

let recordedClasses = [];
let currentActiveVideo = null;

const liveUpcomingClasses = [
  { id: 1, title: 'System Design: Caching, Sharding & Rate Limiting', instructor: 'Dr. Sarah Chen', time: 'Today, 5:00 PM', duration: '2 Hours', link: 'https://meet.google.com/pv-lms-class' },
  { id: 2, title: 'Advanced Graph Theory & Network Flows', instructor: 'Prof. Tim Chen', time: 'Tomorrow, 10:00 AM', duration: '1.5 Hours', link: 'https://meet.google.com/pv-lms-class' },
  { id: 3, title: 'Microservices & Docker Container Orchestration', instructor: 'Marcus Vance', time: 'Friday, 3:30 PM', duration: '2 Hours', link: 'https://meet.google.com/pv-lms-class' }
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
        date: 'Oct 2026',
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
}

function renderLiveClasses() {
  const liveContainer = document.getElementById('liveClassesList');
  if (liveContainer) {
    liveContainer.innerHTML = liveUpcomingClasses.map(c => `
      <div class="class-item" style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:16px">
          <div class="class-item-thumb" style="width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--danger-light);color:var(--danger);font-size:1.5rem">
            <i class="fa fa-video-camera"></i>
          </div>
          <div class="class-item-info">
            <div class="class-item-title" style="font-weight:700;font-size:1rem;margin-bottom:4px">${c.title}</div>
            <div class="class-item-meta" style="font-size:0.85rem;color:var(--text-muted);display:flex;gap:16px">
              <span><i class="fa fa-user"></i> ${c.instructor}</span>
              <span><i class="fa fa-clock-o"></i> ${c.time}</span>
              <span><i class="fa fa-hourglass-half"></i> ${c.duration}</span>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" onclick="joinLiveRoom('${c.title}')">
          <i class="fa fa-play-circle"></i> Join Room
        </button>
      </div>
    `).join('');
  }
}

function renderRecordings(data) {
  const recContainer = document.getElementById('recordedClassesList');
  if (!recContainer) return;

  recContainer.innerHTML = data.map(c => {
    const isCompleted = localStorage.getItem(`class_completed_${c.id}`);
    const isCurrent = currentActiveVideo && currentActiveVideo.id === c.id;

    return `
      <div class="class-item ${isCurrent ? 'active-video-item' : ''}" 
           style="cursor:pointer;display:flex;gap:12px;padding:12px;border:1px solid ${isCurrent ? 'var(--primary)' : 'var(--border)'};border-radius:var(--radius-md);margin-bottom:10px;background:${isCurrent ? 'var(--primary-light)' : 'var(--surface)'};transition:var(--transition)"
           onclick="selectVideo('${c.id}')">
        <div style="position:relative;width:96px;height:64px;border-radius:6px;overflow:hidden;flex-shrink:0">
          <img src="${c.thumb}" style="width:100%;height:100%;object-fit:cover" alt="${c.title}">
          <span style="position:absolute;bottom:4px;right:4px;background:rgba(0,0,0,0.8);color:#fff;font-size:0.65rem;padding:1px 4px;border-radius:3px">${c.duration}</span>
        </div>
        <div class="class-item-info" style="flex:1">
          <div class="class-item-title" style="font-size:0.875rem;font-weight:700;line-height:1.3;margin-bottom:4px;color:var(--text)">${c.title}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${c.instructor}</div>
          ${isCompleted ? '<span style="color:var(--success);font-size:0.7rem;font-weight:700"><i class="fa fa-check-circle"></i> Completed</span>' : ''}
        </div>
        <div style="color:var(--primary);align-self:center">
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
  renderRecordings(recordedClasses);

  // If iframe was already active, auto-start new video
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
    metaEl.innerHTML = `Instructor: ${video.instructor} &nbsp;|&nbsp; Duration: ${video.duration} &nbsp;|&nbsp; Stream: Live HD Web Player`;
  }

  if (notesList && video.notes) {
    notesList.innerHTML = video.notes.map(n => `<li>${n}</li>`).join('');
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
    Toast.success('Streaming Lecture', `Now Playing: ${currentActiveVideo.title}`);
  }
}

function filterRecordings() {
  const query = document.getElementById('recordingsSearch')?.value.toLowerCase() || '';
  const filtered = recordedClasses.filter(c => 
    c.title.toLowerCase().includes(query) || 
    c.instructor.toLowerCase().includes(query)
  );
  renderRecordings(filtered);
}

function markCompleted() {
  if (!currentActiveVideo) return;
  const key = `class_completed_${currentActiveVideo.id}`;
  localStorage.setItem(key, 'true');
  renderRecordings(recordedClasses);
  Toast.success('Lecture Completed!', 'Recorded class marked as complete. XP and progress updated!');
}

function toggleBookmarkClass() {
  Toast.info('Bookmarked', 'Lecture saved to your personal study bookmarks.');
}

function joinLiveRoom(title) {
  Toast.success('Joining Live Room', `Connecting you to session: ${title}...`);
  setTimeout(() => {
    window.open('https://meet.google.com/pv-lms-class', '_blank');
  }, 1000);
}

window.selectVideo = selectVideo;
window.playCurrentVideo = playCurrentVideo;
window.filterRecordings = filterRecordings;
window.markCompleted = markCompleted;
window.toggleBookmarkClass = toggleBookmarkClass;
window.joinLiveRoom = joinLiveRoom;

document.addEventListener('DOMContentLoaded', () => {
  initClassPage();
});
