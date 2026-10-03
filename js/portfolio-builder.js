/* ============================================================
   Prime Vector LMS — portfolio-builder.js
   ============================================================ */

function connectGithub() {
  const ghStatus = document.getElementById('ghStatus');
  const ghBtn = document.getElementById('ghBtn');
  
  if (ghBtn.textContent === 'Connect GitHub') {
    ghStatus.innerHTML = '<i class="fa fa-check-circle"></i> Connected & Verified';
    ghStatus.style.color = 'var(--success)';
    ghBtn.textContent = 'Disconnect';
    ghBtn.className = 'btn btn-outline btn-sm';
    
    // update placement readiness
    updateReadiness(96);
  } else {
    ghStatus.textContent = 'Not Connected';
    ghStatus.style.color = 'var(--text-muted)';
    ghBtn.textContent = 'Connect GitHub';
    ghBtn.className = 'btn btn-primary btn-sm';
    
    // update placement readiness
    updateReadiness(92);
  }
}

function connectLinkedIn() {
  const liStatus = document.getElementById('liStatus');
  const liBtn = document.getElementById('liBtn');
  
  if (liBtn.textContent === 'Manage') {
    liStatus.textContent = 'Not Connected';
    liStatus.style.color = 'var(--text-muted)';
    liBtn.textContent = 'Connect LinkedIn';
    liBtn.className = 'btn btn-primary btn-sm';
    
    // update placement readiness
    updateReadiness(85);
  } else {
    liStatus.innerHTML = '<i class="fa fa-check-circle"></i> Connected & Verified';
    liStatus.style.color = 'var(--success)';
    liBtn.textContent = 'Manage';
    liBtn.className = 'btn btn-outline btn-sm';
    
    // update placement readiness
    updateReadiness(92);
  }
}

function updateReadiness(score) {
  const scoreEl = document.getElementById('readinessScore');
  const meterEl = document.getElementById('readinessMeter');
  const statusText = document.getElementById('readinessStatus');
  
  if (scoreEl && meterEl) {
    scoreEl.textContent = `${score}%`;
    meterEl.style.borderColor = score >= 90 ? 'var(--success)' : 'var(--warning)';
    
    if (score >= 95) {
      statusText.textContent = 'Excellent Preparation';
    } else if (score >= 90) {
      statusText.textContent = 'Highly Prepared';
    } else {
      statusText.textContent = 'Moderate Preparation';
    }
  }
}

function viewRequirements() {
  alert("Missing Requirements:\n- Complete all placement training mock interviews.\n- Obtain Faculty endorsement on E-Commerce final project.");
}

function publishPortfolio() {
  alert("Congratulations! Your developer portfolio is now live at: https://primevector.in/portfolio/student-name");
}

document.addEventListener('DOMContentLoaded', () => {
  // Bind Connect buttons
  const ghBtn = document.getElementById('ghBtn');
  if (ghBtn) {
    ghBtn.addEventListener('click', connectGithub);
  }

  const liBtn = document.getElementById('liBtn');
  if (liBtn) {
    liBtn.addEventListener('click', connectLinkedIn);
  }
});
