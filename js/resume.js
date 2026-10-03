/* ============================================================
   Prime Vector LMS — resume.js
   ============================================================ */

function updateResume() {
  const preview = document.getElementById('resumePreview');
  if (!preview) return;

  const name = document.getElementById('r_name')?.value || '';
  const title = document.getElementById('r_title')?.value || '';
  const email = document.getElementById('r_email')?.value || '';
  const phone = document.getElementById('r_phone')?.value || '';
  const linkedin = document.getElementById('r_linkedin')?.value || '';
  const location = document.getElementById('r_location')?.value || '';
  
  const summary = document.getElementById('r_summary')?.value || '';
  const exp = document.getElementById('r_exp')?.value || '';
  const edu = document.getElementById('r_edu')?.value || '';
  const skills = document.getElementById('r_skills')?.value || '';

  const formatText = (text) => {
    return text.split('\n').map(line => {
      if (line.startsWith('- ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      return `<p>${line}</p>`;
    }).join('');
  };

  preview.innerHTML = `
    <div style="text-align:center; margin-bottom: 20px;">
      <h1>${name}</h1>
      <div style="color: var(--primary); font-weight: bold; margin-bottom: 10px;">${title}</div>
      <div style="font-size: 0.85rem; color: #666;">
        ${email} &nbsp;|&nbsp; ${phone} &nbsp;|&nbsp; ${location} <br> ${linkedin}
      </div>
    </div>
    
    ${summary ? `
      <h3>Professional Summary</h3>
      <div style="margin-bottom: 15px;">
        ${formatText(summary)}
      </div>
    ` : ''}

    ${exp ? `
      <h3>Experience</h3>
      <div style="margin-bottom: 15px;">
        ${formatText(exp).replace(/<p>(.*?)( — .*?)\((.*?)\)<\/p>/g, '<strong>$1</strong>$2 <em>($3)</em><br>')}
      </div>
    ` : ''}

    ${edu ? `
      <h3>Education</h3>
      <div style="margin-bottom: 15px;">
        ${formatText(edu)}
      </div>
    ` : ''}

    ${skills ? `
      <h3>Skills</h3>
      <div style="margin-bottom: 15px;">
        <p>${skills}</p>
      </div>
    ` : ''}
  `;
}

function downloadPDF() {
  alert("PDF Download feature requires a library like html2pdf.js. Mock successful!");
}

window.updateResume = updateResume;
window.downloadPDF = downloadPDF;

document.addEventListener('DOMContentLoaded', () => {
  updateResume();
});
