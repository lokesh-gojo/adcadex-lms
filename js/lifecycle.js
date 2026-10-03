/* ============================================================
   Prime Vector LMS — lifecycle.js
   ============================================================ */

/**
 * Simulates Student Lifecycle Management
 * Calculates durations, updates statuses, and triggers auto-certifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Enrollment Form Auto-Calculation
  const enrollmentForm = document.getElementById('enrollmentForm');
  if (enrollmentForm) {
    const courseDurationEl = enrollmentForm.querySelector('select:nth-of-type(1)'); // roughly
    const enrollDateEl = enrollmentForm.querySelector('input[type="date"]');
    const expectedDateEl = enrollmentForm.querySelectorAll('input[type="date"]')[1];
    
    if (enrollDateEl && expectedDateEl) {
      enrollDateEl.addEventListener('change', () => {
        if (!enrollDateEl.value) return;
        
        let date = new Date(enrollDateEl.value);
        // default 3 months for demo
        date.setMonth(date.getMonth() + 3);
        expectedDateEl.value = date.toISOString().split('T')[0];
      });
    }
  }

  // 2. Student Dashboard Countdown Simulation
  const countdownEl = document.getElementById('lifecycleCountdown');
  if (countdownEl) {
    // Just a visual simulation ticking down seconds if we wanted to, 
    // but a static "45 Days" was requested. We can animate it for effect.
    let days = 45;
    countdownEl.textContent = `${days} Days Remaining`;
  }
});

/**
 * Simulates the backend check for course completion
 */
function checkAutoCompletion(studentId) {
  console.log(`Checking completion rules for student ${studentId}...`);
  // Simulated DB check
  const modulesDone = true;
  const assignmentsDone = true;
  const projectDone = true;
  
  if (modulesDone && assignmentsDone && projectDone) {
    console.log(`Student ${studentId} has completed all requirements.`);
    console.log(`Status changed to: Completed`);
    console.log(`Auto-generating Certificates...`);
    // Notify
    if (typeof showToast === 'function') {
      showToast('Course Completed! Certificates Auto-Generated.', 'success');
    }
  }
}
