/* ============================================================
   Prime Vector LMS — parent.js (Parent Portal Logic)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Guard & Auth Check
  if (!Auth.requireAuth()) return;
  const user = Auth.getUser();
  if (user.role !== 'parent') {
    window.location.href = `${user.role}.html`;
    return;
  }

  // 2. Render Attendance Chart.js
  renderParentAttendanceChart();

  // 3. PTM Meeting Request Form Submission
  const ptmForm = document.getElementById('ptmForm');
  if (ptmForm) {
    ptmForm.addEventListener('submit', e => {
      e.preventDefault();
      
      const faculty = document.getElementById('ptmFaculty').value;
      const date = document.getElementById('ptmDate').value;
      const time = document.getElementById('ptmTime').value;
      const reason = document.getElementById('ptmReason').value.trim();

      if (!date) {
        Toast.warning('Select Date', 'Please pick a preferred date.');
        return;
      }

      // Add to list
      const ptmList = document.getElementById('ptmList');
      const item = document.createElement('div');
      item.style.padding = '10px';
      item.style.background = 'var(--bg)';
      item.style.borderRadius = 'var(--radius)';
      item.style.border = '1px solid var(--border)';
      item.style.fontSize = '0.8rem';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.animation = 'animate-fade-up 0.4s ease forwards';
      
      item.innerHTML = `
        <div>
          <strong style="color:var(--text)">${faculty}</strong><br>
          <span>${Format.date(date)} at ${time}</span>
          ${reason ? `<div class="text-xs text-muted" style="margin-top:4px">Agenda: "${reason}"</div>` : ''}
        </div>
        <span class="badge badge-warning">Pending Approval</span>
      `;

      ptmList.insertBefore(item, ptmList.firstChild);
      ptmForm.reset();
      Toast.success('PTM Requested', `A meeting request has been sent to ${faculty}.`);
    });
  }
});

/**
 * Render class attendance breakdown for parent view
 */
function renderParentAttendanceChart() {
  const canvas = document.getElementById('attendanceBreakdownChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const isDark = Theme.isDark();
  const textColor = isDark ? '#94A3B8' : '#64748B';

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Late', 'Absent'],
      datasets: [{
        data: [92, 5, 3],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
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
          labels: { color: textColor, font: { size: 12 } }
        }
      }
    }
  });
}

/**
 * Handle simulated fee payments
 */
window.triggerMockPayment = function() {
  const btn = document.getElementById('paymentSubmitBtn');
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing payment...';

  setTimeout(() => {
    // 1. Close modal
    Modal.close('paymentModal');

    // 2. Update UI values
    const pendingVal = document.getElementById('pendingFeesVal');
    if (pendingVal) pendingVal.textContent = '₹0';

    const indicator = document.getElementById('feeStatusIndicator');
    if (indicator) {
      indicator.className = 'stat-change text-success';
      indicator.innerHTML = '<i class="fa fa-check-circle"></i> Fully Paid';
    }

    const payBtn = document.getElementById('payFeesBtn');
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.className = 'btn btn-ghost';
      payBtn.style.width = '100%';
      payBtn.innerHTML = '<i class="fa fa-check-circle" style="color:var(--success)"></i> All Term Fees Cleared';
    }

    // 3. Notify Parent
    Toast.success('Payment Received', '₹12,500 has been successfully paid towards tuition and library fees.');
    
    // Add success notification in the top list
    const notifBtn = document.querySelector('.notif-badge');
    if (notifBtn) {
      let count = parseInt(notifBtn.textContent) || 0;
      notifBtn.textContent = count + 1;
    }
  }, 1500);
};
