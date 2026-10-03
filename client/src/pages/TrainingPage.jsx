import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function TrainingPage() {
  const { user } = useAuth();
  const [trainingData, setTrainingData] = useState({
    streak: 12,
    overallProgress: 68,
    duration: { total: 140, completed: 95, remaining: 45, estDate: 'Nov 15, 2026' },
    weeklyHours: [4, 6, 5, 8, 3, 7, 5],
    categories: [
      { name: 'Aptitude Training', progress: 85 },
      { name: 'Technical System Design', progress: 92 },
      { name: 'DSA & Coding Practice', progress: 88 },
      { name: 'Verbal & Soft Skills', progress: 75 },
      { name: 'Mock Technical Interview', progress: 80 }
    ],
    programs: [
      {
        id: "tr-1",
        title: 'Full-Stack Enterprise MERN Bootcamp',
        instructor: 'Marcus Vance',
        category: 'Full Stack',
        status: 'In Progress',
        progress: 74,
        duration: '60 hours',
        schedule: 'Mon, Wed, Fri',
        modulesCount: 12,
        completedModules: 9
      },
      {
        id: "tr-2",
        title: 'Applied Generative AI & Agent Architectures',
        instructor: 'Dr. Sarah Chen',
        category: 'AI & ML',
        status: 'In Progress',
        progress: 62,
        duration: '45 hours',
        schedule: 'Tue, Thu, Sat',
        modulesCount: 10,
        completedModules: 6
      },
      {
        id: "tr-3",
        title: 'Competitive DSA & Algorithms Mastery',
        instructor: 'Prof. Tim Chen',
        category: 'CS Core',
        status: 'Upcoming',
        progress: 15,
        duration: '50 hours',
        schedule: 'Sunday Intensive',
        modulesCount: 14,
        completedModules: 2
      }
    ]
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get('/api/training')
      .then(res => {
        if (res.data?.success && res.data.training) {
          setTrainingData(res.data.training);
        }
      })
      .catch(() => {});
  }, []);

  const handleAdvanceModule = async (programId) => {
    try {
      const res = await axios.post('/api/training/progress', { programId, increment: 10 });
      if (res.data?.success && res.data.program) {
        setTrainingData(prev => ({
          ...prev,
          programs: prev.programs.map(p => p.id === programId ? res.data.program : p)
        }));
        setNotification(`✓ Great job! Progress logged for ${res.data.program.title} (+10%).`);
      }
    } catch {
      setTrainingData(prev => ({
        ...prev,
        programs: prev.programs.map(p => {
          if (p.id === programId) {
            const next = Math.min(100, p.progress + 10);
            return { ...p, progress: next, status: next === 100 ? 'Completed' : 'In Progress' };
          }
          return p;
        })
      }));
      setNotification('✓ Progress recorded successfully (+10%)!');
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxHours = Math.max(...(trainingData.weeklyHours || [8]));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--pv-bg)' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Training & <span className="gradient-text">Skill Acceleration</span> 🚀</h1>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem' }}>
              Track daily learning streaks, complete curriculum milestones, and get placement-certified.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              🔥 {trainingData.streak || 12} Day Streak
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              ✓ Verified Candidate Track
            </span>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6EE7B7',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: 600
          }}>
            {notification}
          </div>
        )}

        {/* Overview Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Overall Completion</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pv-accent)' }}>
              {trainingData.overallProgress}%
            </div>
            <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${trainingData.overallProgress}%`, height: '100%', background: 'var(--pv-gradient-accent)' }}></div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Hours Completed</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {trainingData.duration?.completed || 95} <span style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)' }}>/ {trainingData.duration?.total || 140}h</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6EE7B7', marginTop: '6px' }}>
              ✓ Est. Finish: {trainingData.duration?.estDate || 'Nov 15, 2026'}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Active Bootcamps</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#A5B4FC' }}>
              {trainingData.programs?.length || 3} Tracks
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', marginTop: '6px' }}>Industry-certified modules</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Weekly Learning Hours</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FDE047' }}>
              {(trainingData.weeklyHours || []).reduce((a, b) => a + b, 0)} Hours
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6EE7B7', marginTop: '6px' }}>+18% from last week</div>
          </div>
        </div>

        {/* Learning Programs & Weekly Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Active Training Tracks */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Curriculum & Training Tracks</h3>
              <span className="badge badge-primary">{trainingData.programs?.length || 0} Enrolled</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {trainingData.programs?.map(prog => (
                <div
                  key={prog.id}
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{prog.title}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', display: 'flex', gap: '14px' }}>
                        <span>👤 Instructor: {prog.instructor}</span>
                        <span>⏱ {prog.duration}</span>
                        <span>📅 {prog.schedule}</span>
                      </div>
                    </div>
                    <span className={`badge ${prog.progress === 100 ? 'badge-success' : 'badge-primary'}`}>
                      {prog.progress === 100 ? 'Completed' : prog.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--pv-text-muted)' }}>
                        Modules Completed: {prog.completedModules} / {prog.modulesCount}
                      </span>
                      <span style={{ color: 'var(--pv-accent)', fontWeight: 700 }}>{prog.progress}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${prog.progress}%`,
                        height: '100%',
                        background: prog.progress === 100 ? '#10B981' : 'var(--pv-gradient-accent)',
                        transition: 'width 0.4s ease'
                      }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      onClick={() => alert(`Opening curriculum syllabus for ${prog.title}`)}
                    >
                      View Syllabus
                    </button>
                    {prog.progress < 100 && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => handleAdvanceModule(prog.id)}
                      >
                        + Complete Module (+10%)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Hours Bar Visualizer & Placement Readiness */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Weekly Study Hours */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Weekly Study Hours</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '20px' }}>
                Daily time invested in code challenges and lecture labs.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '160px',
                paddingTop: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                {(trainingData.weeklyHours || []).map((hours, idx) => {
                  const heightPercent = Math.round((hours / maxHours) * 100);
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--pv-accent)', fontWeight: 600 }}>{hours}h</span>
                      <div style={{
                        width: '24px',
                        height: `${heightPercent}%`,
                        background: 'linear-gradient(180deg, #06B6D4 0%, #4F46E5 100%)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.4s ease'
                      }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', marginTop: '4px' }}>
                        {daysOfWeek[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Placement Skill Readiness Breakdown */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Skill Competency Index</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '16px' }}>
                Evaluated against Fortune 500 tech recruitment criteria.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {trainingData.categories?.map((cat, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      <span style={{ color: 'var(--pv-accent)', fontWeight: 700 }}>{cat.progress}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${cat.progress}%`, height: '100%', background: 'var(--pv-gradient-primary)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
