/* ============================================================
   Prime Vector LMS — placement.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Placement Categories Data
  const categories = [
    { name: 'Aptitude Training', progress: 78 },
    { name: 'Technical Training', progress: 92 },
    { name: 'Coding Practice', progress: 85 },
    { name: 'Verbal Ability', progress: 70 },
    { name: 'Logical Reasoning', progress: 88 },
    { name: 'Communication Skills', progress: 75 },
    { name: 'Soft Skills', progress: 80 },
    { name: 'Group Discussion Prep', progress: 60 },
    { name: 'HR Interview Prep', progress: 55 },
    { name: 'Mock Interviews', progress: 65 }
  ];

  // Render Categories Progress
  const listContainer = document.getElementById('trainingCategoriesList');
  if (listContainer) {
    listContainer.innerHTML = categories.map(cat => `
      <div class="progress-item">
        <div class="progress-item-title" title="${cat.name}">
          <i class="fa fa-check-circle-o text-primary" style="margin-right:6px"></i>${cat.name}
        </div>
        <div class="progress" style="height: 8px; background: rgba(255,255,255,0.06);">
          <div class="progress-bar" style="width: ${cat.progress}%; background: linear-gradient(90deg, #4F46E5, #06B6D4)"></div>
        </div>
        <div class="progress-item-percent">${cat.progress}%</div>
      </div>
    `).join('');
  }

  // Profile Completion Chart
  const ctx = document.getElementById('profileChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Resume', 'Portfolio', 'LinkedIn', 'Certificates', 'Mock Interviews'],
        datasets: [{
          data: [90, 60, 100, 80, 50],
          backgroundColor: [
            '#4F46E5', '#06B6D4', '#6366F1', '#10B981', '#F59E0B'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#94a3b8',
              boxWidth: 12,
              padding: 10,
              font: {
                size: 12,
                family: 'Inter, sans-serif'
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  // Load Live Jobs from OnlineData Hub
  initLivePlacementBoard();
});

let liveJobsList = [];
let activeJobTag = 'all';

async function initLivePlacementBoard() {
  const container = document.getElementById('liveJobsContainer');
  if (!container) return;

  try {
    if (window.OnlineData) {
      liveJobsList = await OnlineData.fetchPlacementJobs({ limit: 12 });
      renderJobsList(liveJobsList);
    }
  } catch (err) {
    console.error('Failed to load live jobs:', err);
    if (container) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted)">Unable to load live jobs. Click Refresh to retry.</div>`;
    }
  }
}

function renderJobsList(jobs) {
  const container = document.getElementById('liveJobsContainer');
  if (!container) return;

  if (!jobs || jobs.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-muted)">
        <i class="fa fa-briefcase" style="font-size:2rem;margin-bottom:8px"></i>
        <p>No job openings found matching your criteria. Try another filter or keyword.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = jobs.map(j => {
    const isTracked = localStorage.getItem(`tracked_job_${j.id}`);
    return `
      <div class="card" style="border:1px solid var(--border);border-radius:var(--radius-md);padding:18px;display:flex;flex-direction:column;justify-content:space-between;transition:var(--transition);background:var(--surface)">
        <div>
          <div style="display:flex;align-items:start;justify-content:space-between;margin-bottom:10px">
            <div>
              <span class="badge badge-primary" style="font-size:0.7rem;margin-bottom:6px">${j.category || 'Tech'}</span>
              <h4 style="font-size:0.95rem;font-weight:700;margin:0 0 4px;color:var(--text);line-height:1.3">${j.title}</h4>
              <div style="font-size:0.85rem;font-weight:600;color:var(--primary)">${j.company}</div>
            </div>
          </div>

          <div style="font-size:0.8rem;color:var(--text-muted);display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
            <div><i class="fa fa-map-marker text-primary"></i> ${j.location}</div>
            <div><i class="fa fa-money text-success"></i> ${j.salary}</div>
            <div><i class="fa fa-calendar-o"></i> Posted: ${j.publicationDate}</div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
            ${(j.tags || []).map(t => `<span style="background:var(--bg);border:1px solid var(--border);padding:2px 8px;border-radius:4px;font-size:0.72rem;color:var(--text)">${t}</span>`).join('')}
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border);gap:8px">
          <button class="btn btn-sm ${isTracked ? 'btn-success' : 'btn-outline'}" onclick="toggleTrackJob('${j.id}', this)" title="Save to Placement Tracker">
            <i class="fa ${isTracked ? 'fa-check' : 'fa-bookmark-o'}"></i> ${isTracked ? 'Tracked' : 'Track'}
          </button>
          <a href="${j.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" onclick="logJobApplication('${j.title}', '${j.company}')">
            Apply <i class="fa fa-external-link" style="font-size:0.75rem"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function handleJobSearch() {
  const query = document.getElementById('jobSearchInput')?.value.toLowerCase() || '';
  filterAndRenderJobs(query, activeJobTag);
}

function filterJobsByTag(tag, btn) {
  document.querySelectorAll('#jobFilterTags .filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  activeJobTag = tag;
  const query = document.getElementById('jobSearchInput')?.value.toLowerCase() || '';
  filterAndRenderJobs(query, tag);
}

function filterAndRenderJobs(query, tag) {
  let filtered = liveJobsList;

  if (tag && tag !== 'all') {
    const t = tag.toLowerCase();
    filtered = filtered.filter(j => 
      j.title.toLowerCase().includes(t) ||
      (j.tags || []).some(x => x.toLowerCase().includes(t)) ||
      (j.category || '').toLowerCase().includes(t)
    );
  }

  if (query) {
    filtered = filtered.filter(j => 
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      (j.tags || []).some(x => x.toLowerCase().includes(query))
    );
  }

  renderJobsList(filtered);
}

async function reloadLiveJobs() {
  const icon = document.getElementById('jobRefreshIcon');
  if (icon) icon.className = 'fa fa-refresh fa-spin';

  try {
    if (window.OnlineData) {
      liveJobsList = await OnlineData.fetchPlacementJobs({ limit: 15, forceRefresh: true });
      filterAndRenderJobs('', activeJobTag);
      Toast.success('Openings Refreshed', `Loaded ${liveJobsList.length} live tech positions from Remotive.`);
    }
  } catch(e) {
    Toast.error('Sync Error', 'Could not refresh live jobs feed.');
  } finally {
    if (icon) icon.className = 'fa fa-refresh';
  }
}

function toggleTrackJob(jobId, btn) {
  const job = liveJobsList.find(j => j.id === jobId);
  if (!job) return;

  const key = `tracked_job_${jobId}`;
  const exists = localStorage.getItem(key);

  if (exists) {
    localStorage.removeItem(key);
    btn.className = 'btn btn-sm btn-outline';
    btn.innerHTML = '<i class="fa fa-bookmark-o"></i> Track';
    Toast.info('Removed', 'Removed from Placement Tracker');
  } else {
    localStorage.setItem(key, JSON.stringify({
      id: jobId,
      title: job.title,
      company: job.company,
      salary: job.salary,
      trackedAt: new Date().toISOString(),
      status: 'Applied'
    }));
    btn.className = 'btn btn-sm btn-success';
    btn.innerHTML = '<i class="fa fa-check"></i> Tracked';
    Toast.success('Job Tracked', `Added "${job.title}" to your Placement Tracker dashboard!`);
  }
}

function logJobApplication(title, company) {
  Toast.info('Opening Application', `Redirecting to official job portal for ${company}...`);
}

// Interactive Helpers for Placement Portal
window.scheduleMockInterview = function(companyName) {
  Toast.success('Mock Interview Scheduled!', `Slot confirmed for ${companyName} Technical Track.`);
};

window.analyzeResume = function() {
  Toast.info('Analyzing Resume...', 'Scanning ATS keywords and formatting...');
  setTimeout(() => {
    Toast.success('Resume Score: 92%', 'ATS Optimized! High match for AI & Full Stack roles.');
  }, 1200);
};

window.reloadLiveJobs = reloadLiveJobs;
window.handleJobSearch = handleJobSearch;
window.filterJobsByTag = filterJobsByTag;
window.toggleTrackJob = toggleTrackJob;
window.logJobApplication = logJobApplication;
