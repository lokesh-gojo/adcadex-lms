import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: { totalStudents: 340, activeCourses: 3, pendingGrades: 2, avgRating: 4.8 },
    submissions: [
      { id: "1", student: 'Alex Johnson', assignment: 'Build a MERN REST API', course: 'Full Stack', submitted: '1 hour ago', grade: null },
      { id: "2", student: 'Emily Davis', assignment: 'Neural Network Report', course: 'AI & ML', submitted: '3 hours ago', grade: 'A' }
    ]
  });

  const [gradeInput, setGradeInput] = useState('');
  const [selectedSubId, setSelectedSubId] = useState(null);

  useEffect(() => {
    axios.get('/api/faculty/dashboard')
      .then(res => { if (res.data.success) setData(res.data); })
      .catch(() => {});
  }, []);

  const handleGradeSubmit = (id) => {
    if (!gradeInput) return;
    axios.post('/api/faculty/grade', { assignmentId: id, grade: gradeInput })
      .then(() => {
        setData(prev => ({
          ...prev,
          submissions: prev.submissions.map(s => s.id === id ? { ...s, grade: gradeInput } : s)
        }));
        setSelectedSubId(null);
        setGradeInput('');
      })
      .catch(() => {
        setData(prev => ({
          ...prev,
          submissions: prev.submissions.map(s => s.id === id ? { ...s, grade: gradeInput } : s)
        }));
        setSelectedSubId(null);
        setGradeInput('');
      });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--pv-bg)' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Trainer Portal — <span className="gradient-text">{user?.name || 'Faculty'}</span></h1>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem' }}>Prime Vector Private Limited · Instruction & Student Review Console</p>
          </div>
          <span className="badge badge-primary">Lead Instructor</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Total Students</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{data.stats.totalStudents}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Active Bootcamps</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pv-accent)' }}>{data.stats.activeCourses}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Pending Reviews</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FDE047' }}>{data.stats.pendingGrades}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Average Rating</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6EE7B7' }}>{data.stats.avgRating} ★</div>
          </div>
        </div>

        {/* Submissions Review Queue */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Student Submissions Review Queue</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--pv-text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px' }}>Student</th>
                <th style={{ padding: '12px' }}>Assignment</th>
                <th style={{ padding: '12px' }}>Bootcamp</th>
                <th style={{ padding: '12px' }}>Submitted</th>
                <th style={{ padding: '12px' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.submissions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{s.student}</td>
                  <td style={{ padding: '14px' }}>{s.assignment}</td>
                  <td style={{ padding: '14px' }}><span className="badge badge-accent">{s.course}</span></td>
                  <td style={{ padding: '14px', color: 'var(--pv-text-muted)', fontSize: '0.8rem' }}>{s.submitted}</td>
                  <td style={{ padding: '14px' }}>
                    {s.grade ? (
                      <span className="badge badge-success">{s.grade}</span>
                    ) : selectedSubId === s.id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" placeholder="Grade (e.g. A+)" value={gradeInput} onChange={e => setGradeInput(e.target.value)} style={{ padding: '4px 8px', borderRadius: '6px', width: '90px', background: 'var(--pv-bg)', color: '#fff', border: '1px solid var(--pv-border)' }} />
                        <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => handleGradeSubmit(s.id)}>Save</button>
                      </div>
                    ) : (
                      <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => setSelectedSubId(s.id)}>Grade</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
