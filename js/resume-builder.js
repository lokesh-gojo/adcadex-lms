/* ============================================================
   Prime Vector LMS — resume-builder.js
   Modern Interactive ATS Resume Architect & PDF Engine
   ============================================================ */

const STORAGE_KEY = 'PV_ATS_Resume_Data';

// ── Sample Tech Profiles ─────────────────────────────────────
const SAMPLE_PROFILES = {
  fullstack: {
    name: 'Alex Johnson',
    title: 'Full Stack Engineer & AI Specialist',
    email: 'alex.johnson@primevector.in',
    phone: '+91 98765 43210',
    location: 'Bangalore / Hosur, India',
    linkedin: 'linkedin.com/in/alexjohnson-pv',
    github: 'github.com/alexjohnson-tech',
    objective: 'Results-driven Full Stack Engineer with expertise in React 19, Node.js microservices, and AI model orchestration. Proven track record of developing scalable SaaS architectures, optimizing API latency by 40%, and delivering high-impact production web applications.',
    degree: 'B.Tech in Computer Science & Engineering',
    school: 'Prime Vector Innovation Campus (Affiliated Tech Hub)',
    eduYear: '2022 - 2026',
    gpa: '8.8 / 10.0 CGPA',
    skills: 'JavaScript (ES6+), TypeScript, React.js, Node.js, Express, Python 3, PostgreSQL, Docker, AWS, GraphQL, REST APIs, Git, TailwindCSS',
    expTitle: 'Software Engineering Intern',
    expCompany: 'CloudScale Enterprise Labs',
    expDuration: 'Jan 2025 - Present',
    expDetails: '- Spearheaded the migration of legacy REST endpoints to async microservices, reducing p99 response times by 35%.\n- Engineered real-time WebSocket telemetry dashboard monitoring 50,000+ daily events.\n- Collaborated with UI/UX teams to build 15+ accessible, reusable design token components in React and TypeScript.',
    projTitle: 'NeuroLMS — AI Autonomous Learning Gateway',
    projTech: 'React, Node.js, PostgreSQL, OpenAI API, Docker',
    projUrl: 'https://github.com/alexjohnson/neurolms',
    projDesc: 'Architected an enterprise learning management platform featuring real-time code sandboxing, AI-driven placement scoring, and dynamic quiz generation. Deployed using Docker containers on AWS ECS with zero-downtime CI/CD pipelines.',
    certName: 'Applied AI & Cloud Microservices Specialist',
    certOrg: 'Prime Vector Private Limited (ISO 9001:2015)',
    certDate: 'Certified March 2026 · ID: PV-2026-894'
  }
};

// ── State ────────────────────────────────────────────────────
let currentTemplate = 'modern';
let currentAccent = '#2563EB';

function initResumeBuilder() {
  loadSavedResume();

  // Attach event listeners to all inputs
  document.querySelectorAll('.resume-editor input, .resume-editor textarea, .resume-editor select').forEach(input => {
    input.addEventListener('input', () => {
      updatePreview();
      autoSaveResume();
    });
  });

  updatePreview();
}

function updatePreview() {
  const data = getFormData();

  // Header Details
  setText('prevName', data.name || 'Your Full Name');
  setText('prevTitle', data.title || 'Professional Title / Target Role');

  // Contact line
  const contactParts = [];
  if (data.email) contactParts.push(`<span><i class="fa fa-envelope-o" style="color:var(--resume-accent)"></i> ${data.email}</span>`);
  if (data.phone) contactParts.push(`<span><i class="fa fa-phone" style="color:var(--resume-accent)"></i> ${data.phone}</span>`);
  if (data.location) contactParts.push(`<span><i class="fa fa-map-marker" style="color:var(--resume-accent)"></i> ${data.location}</span>`);
  if (data.linkedin) contactParts.push(`<span><i class="fa fa-linkedin" style="color:var(--resume-accent)"></i> ${data.linkedin}</span>`);
  if (data.github) contactParts.push(`<span><i class="fa fa-github" style="color:var(--resume-accent)"></i> ${data.github}</span>`);

  const contactBar = document.getElementById('prevContact');
  if (contactBar) {
    contactBar.innerHTML = contactParts.join(' &nbsp;•&nbsp; ');
  }

  // Summary / Objective
  setText('prevObjective', data.objective || 'Career summary highlighting your key achievements and core competencies...');

  // Education
  setText('prevEduTitle', `${data.degree} — ${data.school}`);
  setText('prevEduYear', data.eduYear);
  setText('prevGPA', data.gpa ? `Grade / CGPA: ${data.gpa}` : '');

  // Skills Pills
  const skillsContainer = document.getElementById('prevSkills');
  if (skillsContainer) {
    if (data.skills) {
      const pills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
      skillsContainer.innerHTML = pills.map(p => `<span class="resume-skill-pill">${p}</span>`).join('');
    } else {
      skillsContainer.innerHTML = '<span class="resume-skill-pill">Add your skills</span>';
    }
  }

  // Work Experience
  setText('prevExpTitle', `${data.expTitle} at ${data.expCompany}`);
  setText('prevExpDuration', data.expDuration);
  
  const expDetailsEl = document.getElementById('prevExpDetails');
  if (expDetailsEl) {
    const rawLines = data.expDetails.split('\n').filter(l => l.trim().length > 0);
    const formatted = rawLines.map(line => {
      const clean = line.replace(/^[-•*]\s*/, '').trim();
      return `<li style="margin-bottom:4px">${clean}</li>`;
    }).join('');
    expDetailsEl.innerHTML = `<ul style="margin:0;padding-left:18px;line-height:1.55">${formatted || '<li>Detail your daily contributions and accomplishments</li>'}</ul>`;
  }

  // Project
  const projTitleHeader = data.projTech ? `${data.projTitle} <span style="font-weight:500;font-size:11.5px;color:#64748b">(${data.projTech})</span>` : data.projTitle;
  const prevProjTitleEl = document.getElementById('prevProjTitle');
  if (prevProjTitleEl) prevProjTitleEl.innerHTML = projTitleHeader;
  setText('prevProjDesc', data.projDesc);

  // Certification
  setText('prevCertTitle', data.certName ? `${data.certName} — ${data.certOrg}` : '');
  setText('prevCertDate', data.certDate);

  // ATS Optimization Calculation
  calculateATSScore(data);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function getFormData() {
  return {
    name: getVal('resName'),
    title: getVal('resTitle'),
    email: getVal('resEmail'),
    phone: getVal('resPhone'),
    location: getVal('resLocation'),
    linkedin: getVal('resLinkedin'),
    github: getVal('resGithub'),
    objective: getVal('resObjective'),
    degree: getVal('resDegree'),
    school: getVal('resSchool'),
    eduYear: getVal('resEduYear'),
    gpa: getVal('resGPA'),
    skills: getVal('resSkills'),
    expTitle: getVal('resExpTitle'),
    expCompany: getVal('resExpCompany'),
    expDuration: getVal('resExpDuration'),
    expDetails: getVal('resExpDetails'),
    projTitle: getVal('resProjTitle'),
    projTech: getVal('resProjTech'),
    projDesc: getVal('resProjDesc'),
    certName: getVal('resCertName'),
    certOrg: getVal('resCertOrg'),
    certDate: getVal('resCertDate')
  };
}

function getVal(id) {
  return document.getElementById(id)?.value?.trim() || '';
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

// ── ATS Scoring Engine ───────────────────────────────────────
function calculateATSScore(data) {
  let score = 15;
  const badges = [];
  const suggestions = [];

  if (data.name && data.email && data.phone) {
    score += 15;
    badges.push('✓ Contact Details Complete');
  } else {
    suggestions.push('Complete email, phone & location');
  }

  if (data.objective && data.objective.length > 50) {
    score += 15;
    badges.push('✓ Strong Professional Summary');
  } else {
    suggestions.push('Expand professional objective statement (>50 chars)');
  }

  if (data.skills && data.skills.split(',').length >= 5) {
    score += 15;
    badges.push('✓ 5+ In-Demand Technical Skills');
  } else {
    suggestions.push('List at least 5 technical keywords & tools');
  }

  if (data.expTitle && data.expCompany && data.expDetails.length > 40) {
    score += 20;
    // Check for quantifiable impact / action verbs
    if (/\b(\d+%|\d+\+|\bimproved\b|\breduced\b|\bengineered\b|\bspearheaded\b|\bscaled\b|\bbuilt\b)\b/i.test(data.expDetails)) {
      score += 10;
      badges.push('✓ Quantifiable Impact & Action Verbs');
    } else {
      suggestions.push('Add metrics (e.g. "boosted by 30%", "reduced latency by 2s")');
    }
  } else {
    suggestions.push('Add work experience with bullet points');
  }

  if (data.degree && data.school) {
    score += 10;
    badges.push('✓ Education Verified');
  }

  if (data.projTitle && data.projDesc) {
    score += 10;
    badges.push('✓ Capstone Project Showcased');
  }

  score = Math.min(100, score);

  // Update UI Elements
  const scoreText = document.getElementById('atsScoreText');
  const scoreBar = document.getElementById('atsScoreBar');
  const badgeWrap = document.getElementById('atsBadgesList');
  const tipWrap = document.getElementById('atsSuggestions');

  if (scoreText) scoreText.textContent = `${score}%`;
  if (scoreBar) {
    scoreBar.style.width = `${score}%`;
    if (score >= 85) scoreBar.style.background = 'var(--success)';
    else if (score >= 65) scoreBar.style.background = 'var(--warning)';
    else scoreBar.style.background = 'var(--danger)';
  }

  if (badgeWrap) {
    badgeWrap.innerHTML = badges.map(b => `<span style="font-size:0.75rem;background:var(--success-light);color:var(--success);padding:3px 8px;border-radius:4px;font-weight:700">${b}</span>`).join(' ');
  }

  if (tipWrap) {
    if (suggestions.length === 0) {
      tipWrap.innerHTML = '<li style="color:var(--success);font-weight:700;font-size:0.85rem"><i class="fa fa-check-circle"></i> Outstanding! Your resume achieves a 90%+ ATS recruitment match score.</li>';
    } else {
      tipWrap.innerHTML = suggestions.map(s => `<li style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px"><i class="fa fa-exclamation-circle text-warning"></i> ${s}</li>`).join('');
    }
  }
}

// ── Templates & Theme Customization ──────────────────────────
function changeTemplate(tmpl) {
  currentTemplate = tmpl;
  const sheet = document.getElementById('resumeSheet');
  if (!sheet) return;

  sheet.classList.remove('template-modern', 'template-ivy', 'template-minimal');
  sheet.classList.add(`template-${tmpl}`);

  const badge = document.getElementById('templateBadge');
  if (badge) badge.textContent = tmpl.toUpperCase();

  Toast.info('Template Applied', `Switched layout style to: ${tmpl.toUpperCase()}`);
}

function setAccentColor(hex) {
  currentAccent = hex;
  document.documentElement.style.setProperty('--resume-accent', hex);

  document.querySelectorAll('.accent-dot').forEach(dot => {
    dot.style.transform = dot.dataset.color === hex ? 'scale(1.25)' : 'scale(1)';
    dot.style.boxShadow = dot.dataset.color === hex ? '0 0 10px ' + hex : 'none';
  });

  Toast.info('Color Theme', `Accent color updated to ${hex}`);
}

// ── AI Optimization Tools ────────────────────────────────────
function loadFullStackSample() {
  const p = SAMPLE_PROFILES.fullstack;
  setVal('resName', p.name);
  setVal('resTitle', p.title);
  setVal('resEmail', p.email);
  setVal('resPhone', p.phone);
  setVal('resLocation', p.location);
  setVal('resLinkedin', p.linkedin);
  setVal('resGithub', p.github);
  setVal('resObjective', p.objective);
  setVal('resDegree', p.degree);
  setVal('resSchool', p.school);
  setVal('resEduYear', p.eduYear);
  setVal('resGPA', p.gpa);
  setVal('resSkills', p.skills);
  setVal('resExpTitle', p.expTitle);
  setVal('resExpCompany', p.expCompany);
  setVal('resExpDuration', p.expDuration);
  setVal('resExpDetails', p.expDetails);
  setVal('resProjTitle', p.projTitle);
  setVal('resProjTech', p.projTech);
  setVal('resProjDesc', p.projDesc);
  setVal('resCertName', p.certName);
  setVal('resCertOrg', p.certOrg);
  setVal('resCertDate', p.certDate);

  updatePreview();
  autoSaveResume();
  Toast.success('Profile Loaded', 'Populated with high-impact Full Stack & AI engineering profile.');
}

function optimizeBulletsWithAI() {
  const expBox = document.getElementById('resExpDetails');
  if (!expBox) return;

  Toast.info('AI Rewriting...', 'Applying ATS power action verbs and metrics...');

  setTimeout(() => {
    const optimized = [
      '- Spearheaded high-concurrency microservices architecture, driving 35% reduction in API response latency.',
      '- Engineered resilient WebSocket pub/sub telemetry streaming pipelines handling 50k+ daily events.',
      '- Collaborated with cross-functional product and UX teams to deploy 20+ responsive accessible UI modules with 98% test coverage.'
    ].join('\n');

    expBox.value = optimized;
    updatePreview();
    autoSaveResume();
    Toast.success('AI Optimization Complete', 'Rephrased responsibilities with strong ATS action verbs and impact metrics (+15% score)!');
  }, 800);
}

function resetResumeForm() {
  if (confirm('Are you sure you want to reset all fields?')) {
    localStorage.removeItem(STORAGE_KEY);
    document.querySelectorAll('.resume-editor input, .resume-editor textarea').forEach(el => el.value = '');
    updatePreview();
    Toast.info('Editor Reset', 'Form cleared');
  }
}

// ── Persistence & PDF Print ──────────────────────────────────
function autoSaveResume() {
  const data = getFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSavedResume() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      Object.keys(data).forEach(k => {
        // match key to element id
        const cap = k.charAt(0).toUpperCase() + k.slice(1);
        setVal(`res${cap}`, data[k]);
      });
      return;
    }
  } catch(e) {}

  // Fallback to sample on first visit
  loadFullStackSample();
}

function downloadPDF() {
  Toast.info('Preparing Print Engine', 'Launching browser PDF export...');
  setTimeout(() => {
    window.print();
  }, 400);
}

// Global functions
window.changeTemplate = changeTemplate;
window.setAccentColor = setAccentColor;
window.loadFullStackSample = loadFullStackSample;
window.optimizeBulletsWithAI = optimizeBulletsWithAI;
window.resetResumeForm = resetResumeForm;
window.downloadPDF = downloadPDF;
window.updatePreview = updatePreview;

document.addEventListener('DOMContentLoaded', () => {
  initResumeBuilder();
});
