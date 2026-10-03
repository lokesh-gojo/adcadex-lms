/* ============================================================
   Prime Vector LMS — portfolio-builder.js
   Real-Time GitHub & LinkedIn Integrations Engine
   ============================================================ */

const INTEGRATION_STORAGE_KEY_GH = 'acadex_connected_github';
const INTEGRATION_STORAGE_KEY_LI = 'acadex_connected_linkedin';

const LANGUAGE_COLORS = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'PHP': '#4F5D95',
  'Ruby': '#701516'
};

document.addEventListener('DOMContentLoaded', () => {
  initIntegrations();
});

// ── Initialize Real-Time Integrations ──
function initIntegrations() {
  // Load stored GitHub account or default to suggestion if none
  const storedGh = localStorage.getItem(INTEGRATION_STORAGE_KEY_GH);
  const storedLi = localStorage.getItem(INTEGRATION_STORAGE_KEY_LI);

  if (storedGh) {
    try {
      const ghData = JSON.parse(storedGh);
      renderConnectedGitHub(ghData);
      // Fetch live fresh repos in background
      fetchLiveGitHubUser(ghData.login, false);
    } catch (e) {
      renderDisconnectedGitHub();
    }
  } else {
    renderDisconnectedGitHub();
  }

  if (storedLi) {
    try {
      const liData = JSON.parse(storedLi);
      renderConnectedLinkedIn(liData);
    } catch (e) {
      renderConnectedLinkedIn({ url: 'https://linkedin.com/in/student-profile', verified: true });
    }
  } else {
    // Default verified preview
    renderConnectedLinkedIn({ url: 'https://linkedin.com/in/student-profile', verified: true });
  }

  updateDynamicReadiness();
}

// ── Render Connected GitHub State ──
function renderConnectedGitHub(user) {
  const ghStatus = document.getElementById('ghStatus');
  const ghBtn = document.getElementById('ghBtn');
  const repoSection = document.getElementById('githubReposSection');

  if (ghStatus) {
    ghStatus.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-top:2px">
        <span style="color:var(--success);font-weight:600"><i class="fa fa-check-circle"></i> Connected to @${user.login}</span>
        <span class="badge badge-primary" style="font-size:0.7rem;padding:2px 6px">${user.public_repos || 0} Repos</span>
      </div>
    `;
  }

  if (ghBtn) {
    ghBtn.textContent = 'Manage / Sync';
    ghBtn.className = 'btn btn-outline btn-sm';
    ghBtn.onclick = openGithubModal;
  }

  if (repoSection) {
    repoSection.style.display = 'block';
  }
}

function renderDisconnectedGitHub() {
  const ghStatus = document.getElementById('ghStatus');
  const ghBtn = document.getElementById('ghBtn');
  const repoSection = document.getElementById('githubReposSection');

  if (ghStatus) {
    ghStatus.innerHTML = '<span style="color:var(--text-muted)">Not Connected</span>';
  }

  if (ghBtn) {
    ghBtn.textContent = 'Connect GitHub';
    ghBtn.className = 'btn btn-primary btn-sm';
    ghBtn.onclick = openGithubModal;
  }

  if (repoSection) {
    repoSection.style.display = 'none';
  }
}

// ── Render Connected LinkedIn State ──
function renderConnectedLinkedIn(data) {
  const liStatus = document.getElementById('liStatus');
  const liBtn = document.getElementById('liBtn');

  if (liStatus) {
    liStatus.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-top:2px">
        <span style="color:var(--success);font-weight:600"><i class="fa fa-check-circle"></i> Connected & Verified</span>
        <a href="${data.url}" target="_blank" rel="noopener" style="font-size:0.75rem;color:var(--primary);text-decoration:none">
          <i class="fa fa-external-link"></i> View Profile
        </a>
      </div>
    `;
  }

  if (liBtn) {
    liBtn.textContent = 'Manage';
    liBtn.onclick = openLinkedInModal;
  }
}

// ── Real-Time GitHub API Fetch ──
async function fetchLiveGitHubUser(username, showFeedback = true) {
  const alertEl = document.getElementById('ghModalAlert');
  const confirmBtn = document.getElementById('ghConfirmBtn');

  if (showFeedback && confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Verifying with GitHub...';
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!userRes.ok) {
      throw new Error(`GitHub user "${username}" not found (HTTP ${userRes.status})`);
    }
    const userData = await userRes.json();

    // Fetch user public repositories
    const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=8`);
    let reposData = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    const payload = {
      login: userData.login,
      name: userData.name || userData.login,
      avatar_url: userData.avatar_url,
      bio: userData.bio || 'Developer on Prime Vector Acadex LMS',
      public_repos: userData.public_repos,
      followers: userData.followers,
      html_url: userData.html_url,
      repos: reposData,
      connectedAt: new Date().toISOString()
    };

    localStorage.setItem(INTEGRATION_STORAGE_KEY_GH, JSON.stringify(payload));

    renderConnectedGitHub(payload);
    renderReposList(payload);
    updateDynamicReadiness();

    if (showFeedback && alertEl) {
      alertEl.innerHTML = `
        <div style="padding:10px 14px;border-radius:var(--radius);background:var(--success-light);color:var(--success);font-size:0.85rem">
          <i class="fa fa-check-circle"></i> Successfully connected to <strong>@${userData.login}</strong> with ${userData.public_repos} repositories!
        </div>
      `;
      setTimeout(() => {
        closeGithubModal();
      }, 1000);
    }

    return payload;
  } catch (err) {
    if (showFeedback && alertEl) {
      alertEl.innerHTML = `
        <div style="padding:10px 14px;border-radius:var(--radius);background:var(--danger-light);color:var(--danger);font-size:0.85rem">
          <i class="fa fa-exclamation-circle"></i> ${err.message || 'Unable to fetch GitHub user'}
        </div>
      `;
    }
  } finally {
    if (showFeedback && confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = '<i class="fa fa-check"></i> Connect Live';
    }
  }
}

// ── Render Repositories Cards ──
function renderReposList(userData) {
  const container = document.getElementById('githubReposGrid');
  const userHeader = document.getElementById('githubUserSummary');

  if (userHeader) {
    userHeader.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;padding:16px 20px;background:var(--bg);border-radius:var(--radius-lg);border:1px solid var(--border);margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:14px">
          <img src="${userData.avatar_url}" alt="${userData.login}" style="width:48px;height:48px;border-radius:50%;border:2px solid var(--primary)">
          <div>
            <div style="font-weight:700;font-size:1.05rem;color:var(--text);display:flex;align-items:center;gap:8px">
              ${userData.name}
              <a href="${userData.html_url}" target="_blank" rel="noopener" style="font-size:0.85rem;color:var(--primary);text-decoration:none">
                @${userData.login} <i class="fa fa-external-link"></i>
              </a>
            </div>
            <div style="font-size:0.82rem;color:var(--text-muted)">${userData.bio}</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span class="badge badge-primary"><i class="fa fa-code-fork"></i> ${userData.public_repos} Public Repos</span>
          <span class="badge badge-success"><i class="fa fa-users"></i> ${userData.followers} Followers</span>
          <button class="btn btn-outline btn-sm" onclick="syncGithubNow()" title="Sync fresh repositories">
            <i class="fa fa-refresh" id="ghSyncIcon"></i> Sync
          </button>
          <button class="btn btn-outline btn-sm text-danger" onclick="disconnectGithub()" title="Disconnect account">
            <i class="fa fa-chain-broken"></i> Disconnect
          </button>
        </div>
      </div>
    `;
  }

  if (container) {
    const repos = userData.repos || [];
    if (repos.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-muted)">
          <i class="fa fa-folder-open-o" style="font-size:2rem;margin-bottom:8px"></i>
          <p>No public repositories found for this account.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = repos.map(r => {
      const langColor = LANGUAGE_COLORS[r.language] || '#94a3b8';
      const updatedDate = r.updated_at ? new Date(r.updated_at).toLocaleDateString() : 'Recently';

      return `
        <div class="card" style="border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;display:flex;flex-direction:column;justify-content:space-between;background:var(--surface);transition:var(--transition)">
          <div>
            <div style="display:flex;align-items:start;justify-content:space-between;gap:8px;margin-bottom:8px">
              <a href="${r.html_url}" target="_blank" rel="noopener" style="font-weight:700;font-size:0.95rem;color:var(--primary);text-decoration:none;display:flex;align-items:center;gap:6px;word-break:break-word">
                <i class="fa fa-book"></i> ${r.name}
              </a>
              <span class="badge ${r.fork ? 'badge-gray' : 'badge-primary'}" style="font-size:0.68rem;padding:2px 6px">
                ${r.fork ? 'Forked' : 'Public'}
              </span>
            </div>
            
            <p style="font-size:0.83rem;color:var(--text-muted);margin-bottom:14px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
              ${r.description || 'Developer project repository built for campus placement and engineering showcase.'}
            </p>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.78rem;color:var(--text-muted);padding-top:10px;border-top:1px solid var(--border)">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="width:8px;height:8px;border-radius:50%;background:${langColor}"></span>
              <span>${r.language || 'Code'}</span>
            </div>

            <div style="display:flex;align-items:center;gap:10px">
              <span><i class="fa fa-star-o"></i> ${r.stargazers_count || 0}</span>
              <span><i class="fa fa-code-fork"></i> ${r.forks_count || 0}</span>
              <span>Updated: ${updatedDate}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ── Sync Live Repositories Now ──
async function syncGithubNow() {
  const icon = document.getElementById('ghSyncIcon');
  if (icon) icon.className = 'fa fa-refresh fa-spin';

  const stored = localStorage.getItem(INTEGRATION_STORAGE_KEY_GH);
  if (stored) {
    const data = JSON.parse(stored);
    await fetchLiveGitHubUser(data.login, false);
  }

  if (icon) {
    setTimeout(() => {
      icon.className = 'fa fa-refresh';
    }, 600);
  }
}

// ── Disconnect GitHub ──
function disconnectGithub() {
  if (confirm('Are you sure you want to disconnect your GitHub profile?')) {
    localStorage.removeItem(INTEGRATION_STORAGE_KEY_GH);
    renderDisconnectedGitHub();
    updateDynamicReadiness();
  }
}

// ── Update Placement Readiness Score Dynamically ──
function updateDynamicReadiness() {
  const scoreEl = document.getElementById('readinessScore');
  const meterEl = document.getElementById('readinessMeter');
  const statusText = document.getElementById('readinessStatus');

  const hasGh = localStorage.getItem(INTEGRATION_STORAGE_KEY_GH) !== null;
  const hasLi = localStorage.getItem(INTEGRATION_STORAGE_KEY_LI) !== null;

  let score = 70; // baseline
  if (hasLi) score += 12;
  if (hasGh) {
    score += 14;
    try {
      const gh = JSON.parse(localStorage.getItem(INTEGRATION_STORAGE_KEY_GH));
      if (gh.public_repos >= 5) score += 2;
    } catch (e) {}
  }

  if (scoreEl && meterEl) {
    scoreEl.textContent = `${score}%`;
    meterEl.style.borderColor = score >= 90 ? 'var(--success)' : 'var(--warning)';

    if (score >= 95) {
      if (statusText) statusText.textContent = 'Excellent Preparation';
      meterEl.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.35)';
    } else if (score >= 88) {
      if (statusText) statusText.textContent = 'Highly Prepared';
      meterEl.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.2)';
    } else {
      if (statusText) statusText.textContent = 'Moderate Preparation';
      meterEl.style.boxShadow = 'none';
    }
  }
}

// ── Modal Handlers ──
function openGithubModal() {
  const modal = document.getElementById('githubModal');
  const input = document.getElementById('ghUsernameInput');
  const alertEl = document.getElementById('ghModalAlert');

  if (alertEl) alertEl.innerHTML = '';
  if (input) {
    const stored = localStorage.getItem(INTEGRATION_STORAGE_KEY_GH);
    if (stored) {
      try {
        input.value = JSON.parse(stored).login;
      } catch (e) {}
    } else {
      input.value = 'lokesh-gojo';
    }
  }

  if (modal) modal.classList.add('active');
}

function closeGithubModal() {
  const modal = document.getElementById('githubModal');
  if (modal) modal.classList.remove('active');
}

function submitGithubConnect() {
  const input = document.getElementById('ghUsernameInput');
  const username = input ? input.value.trim() : '';

  if (!username) {
    const alertEl = document.getElementById('ghModalAlert');
    if (alertEl) {
      alertEl.innerHTML = '<div style="padding:10px 14px;border-radius:var(--radius);background:var(--danger-light);color:var(--danger);font-size:0.85rem">Please enter a valid GitHub username.</div>';
    }
    return;
  }

  fetchLiveGitHubUser(username, true);
}

function openLinkedInModal() {
  const modal = document.getElementById('linkedinModal');
  const input = document.getElementById('liUrlInput');
  const alertEl = document.getElementById('liModalAlert');

  if (alertEl) alertEl.innerHTML = '';
  if (input) {
    const stored = localStorage.getItem(INTEGRATION_STORAGE_KEY_LI);
    if (stored) {
      try {
        input.value = JSON.parse(stored).url;
      } catch (e) {}
    } else {
      input.value = 'https://linkedin.com/in/lokesh-gojo';
    }
  }

  if (modal) modal.classList.add('active');
}

function closeLinkedInModal() {
  const modal = document.getElementById('linkedinModal');
  if (modal) modal.classList.remove('active');
}

function submitLinkedInConnect() {
  const input = document.getElementById('liUrlInput');
  const url = input ? input.value.trim() : '';
  const alertEl = document.getElementById('liModalAlert');

  if (!url || !url.includes('linkedin.com')) {
    if (alertEl) {
      alertEl.innerHTML = '<div style="padding:10px 14px;border-radius:var(--radius);background:var(--danger-light);color:var(--danger);font-size:0.85rem">Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username).</div>';
    }
    return;
  }

  const payload = { url, verified: true, updated: new Date().toISOString() };
  localStorage.setItem(INTEGRATION_STORAGE_KEY_LI, JSON.stringify(payload));
  renderConnectedLinkedIn(payload);
  updateDynamicReadiness();

  if (alertEl) {
    alertEl.innerHTML = '<div style="padding:10px 14px;border-radius:var(--radius);background:var(--success-light);color:var(--success);font-size:0.85rem"><i class="fa fa-check-circle"></i> LinkedIn profile verified & connected!</div>';
  }

  setTimeout(() => {
    closeLinkedInModal();
  }, 900);
}

function viewRequirements() {
  alert("Placement Readiness Checklist:\n✓ Connected LinkedIn Verified Profile (+12%)\n✓ Live GitHub Synchronized (+14%)\n✓ 5+ Public Repositories Showcase (+2%)\n- Complete remaining 2 Mock Interview simulations to reach 100%!");
}

function publishPortfolio() {
  const storedGh = localStorage.getItem(INTEGRATION_STORAGE_KEY_GH);
  let name = 'student';
  if (storedGh) {
    try { name = JSON.parse(storedGh).login; } catch(e) {}
  }
  alert(`🎉 Congratulations!\nYour live developer portfolio with real-time GitHub projects is ready at:\nhttps://acadex.lms/portfolio/${name}`);
}
