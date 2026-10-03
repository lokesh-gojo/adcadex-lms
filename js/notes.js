/* ============================================================
   Prime Vector LMS — notes.js
   Interactive Class Notes & Faculty Review Engine
   ============================================================ */

const NOTES_STORAGE_KEY = 'acadex_student_notes_data';

const SUBJECT_STYLES = {
  'Web Development': { class: 'badge-primary', icon: 'fa-code', color: '#4F46E5', cardClass: '' },
  'Data Structures': { class: 'badge-success', icon: 'fa-sitemap', color: '#10B981', cardClass: 'subject-ds' },
  'Machine Learning': { class: 'badge-purple', icon: 'fa-cogs', color: '#8B5CF6', cardClass: 'subject-ml' },
  'Database Systems': { class: 'badge-warning', icon: 'fa-database', color: '#F59E0B', cardClass: 'subject-db' },
  'Algorithms': { class: 'badge-primary', icon: 'fa-line-chart', color: '#06B6D4', cardClass: 'subject-ds' }
};

let defaultNotesData = [
  {
    id: 1,
    title: 'Chapter 4 — React Hooks Deep Dive',
    subject: 'Web Development',
    desc: 'Comprehensive study notes on useState, useEffect lifecycle, useMemo optimization, and building reusable custom hooks.',
    date: 'Oct 15, 2026',
    status: 'Reviewed',
    reviewer: 'Prof. Sarah Jenkins',
    feedback: 'Good summary, but add more practical examples comparing useReducer with Redux Toolkit.',
    fileType: 'PDF Document',
    fileSize: '2.4 MB',
    content: `# Chapter 4: React Hooks Deep Dive\n\n## 1. useState & useEffect\nHooks allow functional components to manage local state and lifecycle side effects without class components.\n\n\`\`\`jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    document.title = \`Count: \${count}\`;\n  }, [count]);\n  return <button onClick={() => setCount(count + 1)}>Increment: {count}</button>;\n}\n\`\`\`\n\n## 2. useMemo & useCallback\n- useMemo memoizes computed values to prevent heavy re-evaluations.\n- useCallback memoizes callback references to prevent unneeded child component re-renders.`
  },
  {
    id: 2,
    title: 'Graph Traversal & Shortest Path Algorithms',
    subject: 'Data Structures',
    desc: 'Implementation notes and complexity analysis for BFS, DFS, Dijkstra, Bellman-Ford, and A* heuristic search algorithms.',
    date: 'Oct 14, 2026',
    status: 'Pending',
    reviewer: 'Awaiting Faculty Assignment',
    feedback: '',
    fileType: 'PDF Document',
    fileSize: '4.1 MB',
    content: `# Graph Algorithms\n\n## 1. Breadth-First Search (BFS)\n- Queue-based traversal.\n- Time Complexity: O(V + E)\n- Space Complexity: O(V)\n\n## 2. Dijkstra's Algorithm\n- Greedy single-source shortest path for non-negative edge weights using Min-Priority Queue.`
  },
  {
    id: 3,
    title: 'Neural Networks & Backpropagation Math',
    subject: 'Machine Learning',
    desc: 'Step-by-step mathematical derivation of gradient descent, matrix calculus for weights, and cross-entropy loss functions.',
    date: 'Oct 11, 2026',
    status: 'Reviewed',
    reviewer: 'Dr. Michael Chen',
    feedback: 'Exceptional mathematical rigor on the chain rule derivations. Full marks awarded (10/10).',
    fileType: 'DOCX Document',
    fileSize: '3.6 MB',
    content: `# Neural Networks & Backpropagation\n\n## Forward Pass\nZ = W * X + b\nA = sigma(Z)\n\n## Backward Pass\ndZ = A - Y\ndW = (1/m) * (dZ * X^T)\ndb = (1/m) * sum(dZ)`
  },
  {
    id: 4,
    title: 'Relational Schema Design & Normalization (1NF–BCNF)',
    subject: 'Database Systems',
    desc: 'Entity-Relationship mapping rules, functional dependencies, decomposition algorithms, and ACID transactions.',
    date: 'Oct 08, 2026',
    status: 'Reviewed',
    reviewer: 'Prof. David Vance',
    feedback: 'Well organized Boyce-Codd normal form decomposition steps.',
    fileType: 'PDF Document',
    fileSize: '1.8 MB',
    content: `# Database Normalization\n\n- 1NF: Atomic values only, unique rows.\n- 2NF: 1NF + No partial dependencies on composite keys.\n- 3NF: 2NF + No transitive dependencies (X -> Y and Y -> Z).\n- BCNF: For every functional dependency X -> Y, X must be a super key.`
  }
];

let notesData = [];
let currentSubjectFilter = 'all';

function loadStoredNotes() {
  const stored = localStorage.getItem(NOTES_STORAGE_KEY);
  if (stored) {
    try {
      notesData = JSON.parse(stored);
    } catch (e) {
      notesData = defaultNotesData;
    }
  } else {
    notesData = defaultNotesData;
    saveNotesToStorage();
  }
}

function saveNotesToStorage() {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesData));
}

function renderNotes(data) {
  const container = document.getElementById('notesGrid');
  if (!container) return;

  updateNotesCounters();

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px 20px;background:var(--surface);border-radius:var(--radius-lg);border:1px dashed var(--border)">
        <i class="fa fa-sticky-note-o" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:12px"></i>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:6px">No Notes Found</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px">No notes match your current search query or subject filter.</p>
        <button class="btn btn-primary btn-sm" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = data.map(n => {
    const subInfo = SUBJECT_STYLES[n.subject] || { class: 'badge-primary', icon: 'fa-book', cardClass: '' };
    const isReviewed = n.status === 'Reviewed';

    return `
      <div class="note-card ${subInfo.cardClass}">
        <div>
          <div class="note-header">
            <div>
              <span class="note-subject ${subInfo.class}">
                <i class="fa ${subInfo.icon}"></i> ${n.subject}
              </span>
              <h3 class="note-title" style="margin-top:8px">${n.title}</h3>
            </div>
            <span class="badge ${isReviewed ? 'badge-success' : 'badge-warning'}" style="font-size:0.72rem;padding:4px 8px;flex-shrink:0">
              <i class="fa ${isReviewed ? 'fa-check-circle' : 'fa-clock-o'}"></i> ${n.status}
            </span>
          </div>

          <p class="note-desc">${n.desc}</p>

          ${isReviewed ? `
            <div class="note-feedback-box">
              <i class="fa fa-commenting-o text-success" style="font-size:1.1rem;margin-top:2px"></i>
              <div>
                <div style="font-size:0.75rem;font-weight:700;color:var(--success);text-transform:uppercase;letter-spacing:0.5px">
                  Feedback from ${n.reviewer || 'Faculty Instructor'}
                </div>
                <div style="margin-top:2px;line-height:1.4">${n.feedback}</div>
              </div>
            </div>
          ` : `
            <div class="note-pending-box">
              <i class="fa fa-hourglass-half"></i>
              <div>
                <span style="font-weight:600">Pending Review:</span> Submitted for faculty feedback.
              </div>
            </div>
          `}
        </div>

        <div class="note-footer">
          <div class="note-date">
            <i class="fa fa-calendar-o text-primary"></i> ${n.date}
            <span style="color:var(--border);margin:0 4px">|</span>
            <i class="fa fa-file-pdf-o"></i> ${n.fileSize || '2.5 MB'}
          </div>

          <div class="note-actions">
            <button class="btn btn-outline btn-sm" onclick="readNote(${n.id})" title="Read & Preview Note" style="gap:4px">
              <i class="fa fa-eye"></i> Preview
            </button>
            <button class="btn btn-outline btn-sm" onclick="downloadNote(${n.id})" title="Download Note PDF">
              <i class="fa fa-download"></i>
            </button>
            <button class="btn btn-outline btn-sm text-danger" onclick="deleteNote(${n.id})" title="Delete Note">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateNotesCounters() {
  const totalCount = notesData.length;
  const reviewedCount = notesData.filter(n => n.status === 'Reviewed').length;
  const pendingCount = notesData.filter(n => n.status === 'Pending').length;

  const totalEl = document.getElementById('statTotalNotes');
  const reviewedEl = document.getElementById('statReviewedNotes');
  const pendingEl = document.getElementById('statPendingNotes');

  if (totalEl) totalEl.textContent = totalCount;
  if (reviewedEl) reviewedEl.textContent = reviewedCount;
  if (pendingEl) pendingEl.textContent = pendingCount;
}

function filterNotes() {
  const searchInput = document.getElementById('notesSearch');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = notesData.filter(n => {
    const matchesQuery = n.title.toLowerCase().includes(query) ||
                         n.subject.toLowerCase().includes(query) ||
                         n.desc.toLowerCase().includes(query);
    const matchesSubject = currentSubjectFilter === 'all' || n.subject.toLowerCase() === currentSubjectFilter.toLowerCase();
    return matchesQuery && matchesSubject;
  });

  renderNotes(filtered);
}

function filterBySubject(subject, btnEl) {
  currentSubjectFilter = subject;

  // Toggle active button style
  const filterBtns = document.querySelectorAll('.note-filter-bar .filter-btn');
  filterBtns.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  filterNotes();
}

function resetFilters() {
  currentSubjectFilter = 'all';
  const searchInput = document.getElementById('notesSearch');
  if (searchInput) searchInput.value = '';

  const filterBtns = document.querySelectorAll('.note-filter-bar .filter-btn');
  filterBtns.forEach((b, idx) => {
    if (idx === 0) b.classList.add('active');
    else b.classList.remove('active');
  });

  renderNotes(notesData);
}

// ── In-App Note Reader Modal ──
function readNote(id) {
  const note = notesData.find(n => n.id === id);
  if (!note) return;

  const modal = document.getElementById('readNoteModal');
  const titleEl = document.getElementById('readModalTitle');
  const subEl = document.getElementById('readModalSubject');
  const contentEl = document.getElementById('readModalContent');
  const feedbackEl = document.getElementById('readModalFeedback');

  if (titleEl) titleEl.textContent = note.title;
  if (subEl) subEl.innerHTML = `<span class="badge badge-primary"><i class="fa fa-book"></i> ${note.subject}</span> &nbsp; <span style="font-size:0.8rem;color:var(--text-muted)"><i class="fa fa-calendar"></i> ${note.date}</span>`;

  if (contentEl) {
    contentEl.innerHTML = `
      <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-md);padding:20px;font-family:var(--font-sans);line-height:1.6;font-size:0.95rem;white-space:pre-wrap;color:var(--text)">${note.content || note.desc}</div>
    `;
  }

  if (feedbackEl) {
    if (note.status === 'Reviewed') {
      feedbackEl.style.display = 'block';
      feedbackEl.innerHTML = `
        <div class="note-feedback-box">
          <i class="fa fa-check-circle text-success" style="font-size:1.3rem;margin-top:2px"></i>
          <div>
            <div style="font-weight:700;color:var(--success)">Faculty Endorsement (${note.reviewer || 'Faculty'})</div>
            <div style="margin-top:4px">${note.feedback}</div>
          </div>
        </div>
      `;
    } else {
      feedbackEl.style.display = 'block';
      feedbackEl.innerHTML = `
        <div class="note-pending-box">
          <i class="fa fa-clock-o" style="font-size:1.2rem"></i>
          <div>This submission is currently queued for faculty review and evaluation.</div>
        </div>
      `;
    }
  }

  if (modal) modal.classList.add('active');
}

function closeReadModal() {
  const modal = document.getElementById('readNoteModal');
  if (modal) modal.classList.remove('active');
}

// ── Upload Modal Controls ──
function openUploadModal() {
  const modal = document.getElementById('uploadModal');
  if (modal) modal.classList.add('active');
}

function closeUploadModal() {
  const modal = document.getElementById('uploadModal');
  if (modal) modal.classList.remove('active');
}

function submitNotes() {
  const title = document.getElementById('n_title').value.trim();
  const subject = document.getElementById('n_subject').value;
  const desc = document.getElementById('n_desc').value.trim();
  const fileInput = document.getElementById('n_file');

  if (!title || !desc) {
    alert("Please provide both a title and description for your notes.");
    return;
  }

  const fileName = fileInput.files && fileInput.files[0] ? fileInput.files[0].name : 'CourseNotes.pdf';
  const fileSize = fileInput.files && fileInput.files[0] ? `${(fileInput.files[0].size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB';

  const newNote = {
    id: Date.now(),
    title: title,
    subject: subject,
    desc: desc,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Pending',
    reviewer: 'Queued for Assignment',
    feedback: '',
    fileType: fileName.endsWith('.docx') ? 'DOCX Document' : 'PDF Document',
    fileSize: fileSize,
    content: `# ${title}\n\nSubject: ${subject}\n\n${desc}\n\n[Uploaded Document: ${fileName}]`
  };

  notesData.unshift(newNote);
  saveNotesToStorage();
  renderNotes(notesData);
  closeUploadModal();

  document.getElementById('n_title').value = '';
  document.getElementById('n_desc').value = '';
  if (fileInput) fileInput.value = '';

  if (window.showNotification) {
    showNotification('Success', 'Notes submitted successfully! Queued for faculty review.', 'success');
  } else {
    alert("Notes submitted successfully! Queued for faculty review.");
  }
}

function downloadNote(id) {
  const note = notesData.find(n => n.id === id);
  if (!note) return;

  const content = `${note.title}\nSubject: ${note.subject}\nDate: ${note.date}\nStatus: ${note.status}\nReviewer: ${note.reviewer}\nFeedback: ${note.feedback}\n\n---\n\n${note.content || note.desc}`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function deleteNote(id) {
  if (confirm("Are you sure you want to delete these notes?")) {
    notesData = notesData.filter(n => n.id !== id);
    saveNotesToStorage();
    filterNotes();
  }
}

// Global Exports
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.submitNotes = submitNotes;
window.filterNotes = filterNotes;
window.filterBySubject = filterBySubject;
window.resetFilters = resetFilters;
window.readNote = readNote;
window.closeReadModal = closeReadModal;
window.downloadNote = downloadNote;
window.deleteNote = deleteNote;

document.addEventListener('DOMContentLoaded', () => {
  loadStoredNotes();
  renderNotes(notesData);
});
