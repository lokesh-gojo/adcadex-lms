/* ============================================================
   Prime Vector LMS — alumni.js (Alumni Portal Logic)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Guard & Auth Check
  if (!Auth.requireAuth()) return;
  const user = Auth.getUser();
  if (user.role !== 'alumni') {
    window.location.href = `${user.role}.html`;
    return;
  }

  // 2. Render Employer Doughnut Chart
  renderAlumniDistributionChart();
});

/**
 * Render alumni distribution by hiring companies
 */
function renderAlumniDistributionChart() {
  const canvas = document.getElementById('alumniDistributionChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Google', 'Microsoft', 'Meta', 'Amazon', 'Startups'],
      datasets: [{
        data: [35, 25, 15, 15, 10],
        backgroundColor: ['#4285F4', '#00A4EF', '#3b5998', '#FF9900', '#10B981'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, font: { size: 11 } }
        }
      }
    }
  });
}

/**
 * Mentorship Request Operations
 */
window.approveMentorship = function(reqId, name) {
  const box = document.getElementById(`mentorshipReq${reqId}`);
  if (!box) return;

  // Change style and label
  box.querySelector('.flex.gap-8').innerHTML = '';
  const tag = document.createElement('span');
  tag.className = 'badge badge-success';
  tag.innerHTML = 'Approved (Active Mentee)';
  box.appendChild(tag);

  // Increment stats
  const activeMenteesEl = document.getElementById('alumActiveMentees');
  if (activeMenteesEl) {
    let count = parseInt(activeMenteesEl.textContent) || 0;
    activeMenteesEl.textContent = count + 1;
  }

  Toast.success('Request Approved', `You are now mentoring ${name}. Meeting invites will sync to calendar.`);
};

window.rejectMentorship = function(reqId) {
  const box = document.getElementById(`mentorshipReq${reqId}`);
  if (box) {
    box.style.opacity = '0';
    box.style.transform = 'translateY(10px)';
    setTimeout(() => {
      box.remove();
      Toast.info('Request Declined', 'Mentorship request has been declined.');
    }, 400);
  }
};

/**
 * Referral posting handler
 */
window.submitAlumniReferral = function() {
  const title = document.getElementById('refTitle').value.trim();
  const company = document.getElementById('refCompany').value.trim();
  const loc = document.getElementById('refLoc').value.trim();
  const code = document.getElementById('refCode').value.trim();

  // Add to table
  const tbody = document.getElementById('referralsTableBody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-semi">${title}</td>
      <td>${company}</td>
      <td>${loc}</td>
      <td><code>${code}</code></td>
    `;
    tbody.insertBefore(tr, tbody.firstChild);
  }

  // Increment stats
  const referralsEl = document.getElementById('alumReferralsPosted');
  if (referralsEl) {
    let count = parseInt(referralsEl.textContent) || 0;
    referralsEl.textContent = count + 1;
  }

  Modal.close('referralModal');
  document.getElementById('referralForm').reset();
  Toast.success('Referral Posted', `Your job referral code ${code} was shared successfully.`);
};
