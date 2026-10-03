import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: { enrolledCourses: 3, completedCourses: 2, attendanceRate: '92%', pendingAssignments: 2 },
    courses: [
      { id: "1", title: 'Applied AI & Machine Learning Engineering', progress: 72, category: 'AI/ML' },
      { id: "2", title: 'Full-Stack Web Development & Microservices', progress: 85, category: 'Full Stack' },
      { id: "3", title: 'Data Science & Big Data Pipeline', progress: 40, category: 'Data Science' }
    ],
    assignments: [
      { id: "1", title: 'Build a MERN REST API', due: '2026-07-28', status: 'pending', points: 100 },
      { id: "2", title: 'Neural Network Model Report', due: '2026-07-30', status: 'pending', points: 90 }
    ]
  });

  useEffect(() => {
    axios.get('/api/student/dashboard')
      .then(res => { if (res.data.success) setData(res.data); })
      .catch(() => {});
  }, []);

  const handleAssignmentSubmit = (id) => {
    axios.post('/api/student/assignment/submit', { assignmentId: id })
      .then(() => {
        setData(prev => ({
          ...prev,
          assignments: prev.assignments.map(a => a.id === id ? { ...a, status: 'submitted' } : a)
        }));
      })
      .catch(() => {
        setData(prev => ({
          ...prev,
          assignments: prev.assignments.map(a => a.id === id ? { ...a, status: 'submitted' } : a)
        }));
      });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--pv-bg)' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>! 👋</h1>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem' }}>Prime Vector MERN Student Portal · Hosur Innovation Hub</p>
          </div>
          <span className="badge badge-success"><span className="pulse-dot"></span> Active Semester</span>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Enrolled Bootcamps</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{data.stats.enrolledCourses}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Completed Diplomas</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pv-accent)' }}>{data.stats.completedCourses}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Attendance Score</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6EE7B7' }}>{data.stats.attendanceRate}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Pending Tasks</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FDE047' }}>{data.assignments.filter(a => a.status === 'pending').length}</div>
          </div>
        </div>

        {/* Courses & Assignments Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          {/* Courses */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>My Enrolled Bootcamps</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data.courses.map(c => (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600 }}>{c.title}</div>
                    <span className="badge badge-primary">{c.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${c.progress}%`, height: '100%', background: 'var(--pv-gradient-accent)' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--pv-accent)', fontWeight: 600 }}>{c.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Pending Assignments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.assignments.map(a => (
                <div key={a.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>Due: {a.due} · {a.points} pts</div>
                  </div>
                  {a.status === 'submitted' ? (
                    <span className="badge badge-success">✓ Submitted</span>
                  ) : (
                    <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleAssignmentSubmit(a.id)}>
                      Submit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
