/* ============================================================
   Prime Vector LMS — notes.js
   ============================================================ */

let notesData = [
  { id: 1, title: 'Chapter 4 - React Hooks', subject: 'Web Development', desc: 'Detailed notes on useState, useEffect, and custom hooks.', date: 'Oct 15, 2024', status: 'Reviewed', feedback: 'Good summary, but add more examples on useReducer.' },
  { id: 2, title: 'Graph Algorithms', subject: 'Data Structures', desc: 'BFS, DFS, Dijkstra, and A* search algorithms.', date: 'Oct 14, 2024', status: 'Pending', feedback: '' }
];

function renderNotes(data) {
  const container = document.getElementById('notesGrid');
  if (!container) return;
  
  container.innerHTML = data.map(n => `
    <div class="note-card">
      <div class="note-header">
        <div class="note-title">${n.title}</div>
        <div class="note-subject">${n.subject}</div>
      </div>
      <div class="note-desc">${n.desc}</div>
      ${n.status === 'Reviewed' ? `<div style="background:var(--success-light);color:var(--success);padding:8px;border-radius:var(--radius-sm);margin-bottom:12px;font-size:0.85rem"><b>Feedback:</b> ${n.feedback}</div>` : `<div style="color:var(--warning);font-size:0.85rem;margin-bottom:12px"><i class="fa fa-clock-o"></i> Pending Review</div>`}
      <div class="note-footer">
        <div class="note-date">${n.date}</div>
        <div class="action-grid">
          <button class="btn btn-outline btn-sm" onclick="downloadNote(${n.id})"><i class="fa fa-download"></i></button>
          <button class="btn btn-outline btn-sm" onclick="deleteNote(${n.id})"><i class="fa fa-trash text-danger"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterNotes() {
  const query = document.getElementById('notesSearch').value.toLowerCase();
  const filtered = notesData.filter(n => n.title.toLowerCase().includes(query) || n.subject.toLowerCase().includes(query));
  renderNotes(filtered);
}

function openUploadModal() {
  document.getElementById('uploadModal').style.display = 'flex';
}

function closeUploadModal() {
  document.getElementById('uploadModal').style.display = 'none';
}

function submitNotes() {
  const title = document.getElementById('n_title').value;
  const subject = document.getElementById('n_subject').value;
  const desc = document.getElementById('n_desc').value;
  const fileInput = document.getElementById('n_file');
  
  if (!title || !desc || fileInput.files.length === 0) {
    alert("Please fill all fields and select a file.");
    return;
  }
  
  const newNote = {
    id: Date.now(),
    title: title,
    subject: subject,
    desc: desc,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Pending',
    feedback: ''
  };
  
  notesData.unshift(newNote);
  renderNotes(notesData);
  closeUploadModal();
  
  document.getElementById('n_title').value = '';
  document.getElementById('n_desc').value = '';
  fileInput.value = '';
  
  alert("Notes submitted successfully!");
}

function downloadNote(id) {
  alert("Downloading note ID: " + id);
}

function deleteNote(id) {
  if (confirm("Are you sure you want to delete these notes?")) {
    notesData = notesData.filter(n => n.id !== id);
    renderNotes(notesData);
  }
}

window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.submitNotes = submitNotes;
window.filterNotes = filterNotes;
window.downloadNote = downloadNote;
window.deleteNote = deleteNote;

document.addEventListener('DOMContentLoaded', () => {
  renderNotes(notesData);
});
