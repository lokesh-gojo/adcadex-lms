/* ============================================================
   Prime Vector LMS — portfolio.js
   ============================================================ */

function updatePortfolio() {
  const preview = document.getElementById('portfolioPreview');
  if (!preview) return;

  const img = document.getElementById('p_img')?.value || '';
  const tag = document.getElementById('p_tag')?.value || '';
  const about = document.getElementById('p_about')?.value || '';
  const github = document.getElementById('p_github')?.value || '';
  const linkedin = document.getElementById('p_linkedin')?.value || '';
  const projects = document.getElementById('p_projects')?.value || '';
  
  // Dummy name from dashboard state or placeholder
  const name = "Jane Doe";

  const formatProjects = (text) => {
    const lines = text.split('\n');
    let html = '';
    lines.forEach(line => {
      if (line.startsWith('- ')) {
        html += `<li>${line.substring(2)}</li>`;
      } else if (line.trim() !== '') {
        html += `<h4 style="margin-top:15px; margin-bottom:5px; color:var(--primary)">${line}</h4>`;
      }
    });
    return html;
  };

  preview.innerHTML = `
    <div class="portfolio-hero">
      <img src="${img}" alt="Profile Picture">
      <h2>${name}</h2>
      <p style="font-size: 1.1rem; opacity: 0.9;">${tag}</p>
      <div style="margin-top: 15px; font-size: 1.2rem; display: flex; justify-content: center; gap: 15px;">
        ${github ? `<a href="https://${github}" target="_blank" style="color:#fff"><i class="fa fa-github"></i></a>` : ''}
        ${linkedin ? `<a href="https://${linkedin}" target="_blank" style="color:#fff"><i class="fa fa-linkedin"></i></a>` : ''}
      </div>
    </div>
    <div style="padding: 20px;">
      <h3 style="margin-bottom:10px; border-bottom: 2px solid #ddd; padding-bottom: 5px;">About Me</h3>
      <p style="color: #555; line-height: 1.6;">${about.replace(/\n/g, '<br>')}</p>
      
      <h3 style="margin-top: 25px; margin-bottom:10px; border-bottom: 2px solid #ddd; padding-bottom: 5px;">Projects</h3>
      <div style="color: #444; line-height: 1.5;">
        ${formatProjects(projects)}
      </div>
    </div>
  `;
}

function publishPortfolio() {
  alert("Portfolio published successfully! URL: https://primevector.edu/portfolio/janedoe");
}

document.addEventListener('DOMContentLoaded', () => {
  updatePortfolio();
});
