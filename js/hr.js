/* ============================================================
   Prime Vector LMS — hr.js (HR & Recruiter Portal Logic)
   ============================================================ */

let hrData = {
  candidates: [
    { name: 'Alex Johnson', gpa: 8.8, resume: 88, skills: ['HTML', 'CSS', 'JavaScript', 'SQL'], readiness: 'Ready', dept: 'Computer Science' },
    { name: 'Emily Davis', gpa: 9.5, resume: 92, skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'], readiness: 'Ready', dept: 'Computer Science' },
    { name: 'Marcus Lee', gpa: 7.2, resume: 70, skills: ['HTML', 'CSS', 'React', 'Git'], readiness: 'In Progress', dept: 'Computer Science' },
    { name: 'Priya Sharma', gpa: 9.1, resume: 85, skills: ['Python', 'Django', 'SQL', 'PostgreSQL'], readiness: 'Ready', dept: 'Mathematics' },
    { name: 'Tom Wilson', gpa: 6.5, resume: 65, skills: ['Figma', 'UI/UX Design', 'HTML', 'CSS'], readiness: 'At-Risk', dept: 'Design' }
  ],
  interviewsCount: 2,
  invitesCount: 12
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Guard & Auth Check
  if (!Auth.requireAuth()) return;
  const user = Auth.getUser();
  if (user.role !== 'hr') {
    window.location.href = `${user.role}.html`;
    return;
  }

  // 2. Render Funnel Chart
  renderRecruitmentFunnel();

  // 3. Render Student Search Table
  renderCandidates();

  // 4. Hook Filters
  document.getElementById('filterKeyword').addEventListener('input', renderCandidates);
  document.getElementById('filterGpa').addEventListener('input', renderCandidates);
  document.getElementById('filterResume').addEventListener('input', renderCandidates);
  document.getElementById('filterDept').addEventListener('change', renderCandidates);

  // 5. Job Posting Form Submission
  const postJobForm = document.getElementById('postJobForm');
  if (postJobForm) {
    postJobForm.addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('jobTitle').value.trim();
      const lpa = document.getElementById('jobLpa').value.trim();
      
      const jobCountEl = document.getElementById('hrActiveJobs');
      if (jobCountEl) {
        let count = parseInt(jobCountEl.textContent) || 0;
        jobCountEl.textContent = count + 1;
      }

      Toast.success('Job Drive Published!', `"${title}" has been launched. Students with matching GPA criteria can apply.`);
      postJobForm.reset();
    });
  }
});

/**
 * Render dynamic student candidate search table
 */
function renderCandidates() {
  const tbody = document.getElementById('talentTableBody');
  if (!tbody) return;

  const keyword = document.getElementById('filterKeyword').value.toLowerCase().trim();
  const minGpa = parseFloat(document.getElementById('filterGpa').value) || 0;
  const minResume = parseInt(document.getElementById('filterResume').value) || 0;
  const dept = document.getElementById('filterDept').value;

  const filtered = hrData.candidates.filter(c => {
    // Keyword match (name or skills)
    const matchesKeyword = !keyword || 
      c.name.toLowerCase().includes(keyword) || 
      c.skills.some(s => s.toLowerCase().includes(keyword));

    const matchesGpa = c.gpa >= minGpa;
    const matchesResume = c.resume >= minResume;
    const matchesDept = dept === 'All' || c.dept === dept;

    return matchesKeyword && matchesGpa && matchesResume && matchesDept;
  });

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px">No candidate matching search criteria</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td>
        <div class="flex items-center gap-8">
          <div class="avatar-placeholder avatar-sm" style="border-radius:50%;background:var(--gradient-primary);color:#fff;font-weight:700;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
            ${c.name[0]}
          </div>
          <div>
            <div class="font-semi">${c.name}</div>
            <div class="text-xs text-muted">${c.dept}</div>
          </div>
        </div>
      </td>
      <td class="font-semi">${c.gpa} CGPA</td>
      <td class="font-semi" style="color:var(--primary)">${c.resume}%</td>
      <td>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${c.skills.map(s => `<span class="badge" style="background:var(--bg);color:var(--text);font-size:0.7rem;padding:2px 8px">${s}</span>`).join('')}
        </div>
      </td>
      <td>
        <span class="badge badge-${readinessColor(c.readiness)}">${c.readiness}</span>
      </td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-sm" onclick="openScheduleModal('${c.name}')"><i class="fa fa-envelope"></i> Invite</button>
          <button class="btn btn-accent btn-sm" onclick="sendMockOffer('${c.name}')"><i class="fa fa-handshake-o"></i> Offer</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function readinessColor(status) {
  if (status === 'Ready') return 'success';
  if (status === 'In Progress') return 'primary';
  return 'danger';
}

/**
 * Render horizontal funnel analytics
 */
function renderRecruitmentFunnel() {
  const canvas = document.getElementById('recruitmentFunnelChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Applied', 'Screened', 'Interviewed', 'Offered', 'Hired'],
      datasets: [{
        label: 'Candidates count',
        data: [45, 28, 12, 5, 2],
        backgroundColor: [
          'rgba(59, 130, 246, 0.85)',
          'rgba(20, 184, 166, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(139, 92, 246, 0.85)',
          'rgba(16, 185, 129, 0.85)'
        ],
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { display: false }, ticks: { color: textColor } }
      }
    }
  });
}

/**
 * Modal control & triggers
 */
window.openScheduleModal = function(name) {
  document.getElementById('schedStudentName').value = name;
  document.getElementById('schedDisplayStudent').value = name;
  Modal.open('scheduleModal');
};

window.submitScheduleInterview = function() {
  const name = document.getElementById('schedStudentName').value;
  const time = document.getElementById('schedDateTime').value;
  const type = document.getElementById('schedType').value;

  if (!time) {
    Toast.warning('Fill date/time', 'Please enter a valid date and time.');
    return;
  }

  // Add to interviews table
  const tbody = document.getElementById('interviewsTableBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="font-semi">${name}</td>
    <td>${Format.date(time)} - ${Format.time(time)}</td>
    <td>${type}</td>
    <td><span class="badge badge-primary">Scheduled</span></td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);

  // Increment invites stats
  const invitesEl = document.getElementById('hrTotalInvites');
  if (invitesEl) {
    hrData.invitesCount++;
    invitesEl.textContent = hrData.invitesCount;
  }

  Modal.close('scheduleModal');
  Toast.success('Interview scheduled', `Invitation email containing video room link sent to ${name}.`);
};

window.sendMockOffer = function(name) {
  if (!confirm(`Are you sure you want to extend an offer letter to ${name}?`)) return;

  const tbody = document.getElementById('offersTableBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="font-semi">${name}</td>
    <td>Associate Engineer</td>
    <td>12 LPA</td>
    <td><span class="badge badge-warning">Offered</span></td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);

  Toast.success('Offer Extended', `An official job offer has been dispatched to ${name}'s dashboard.`);
};
