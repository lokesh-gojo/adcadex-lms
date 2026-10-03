import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function LiveClassesPage() {
  const { user } = useAuth();
  const [liveSessions, setLiveSessions] = useState([
    {
      id: "lc-101",
      title: "Advanced Transformer Architectures & RAG",
      courseId: "1",
      trainer: "Dr. Sarah Chen",
      scheduledAt: "2026-07-28T10:00:00Z",
      time: "Today at 5:00 PM",
      durationMins: 90,
      platform: "Google Meet",
      status: "Live Soon",
      attendeesCount: 48,
      joinUrl: "https://meet.google.com/pv-lms-aiml"
    },
    {
      id: "lc-102",
      title: "Microservices Architecture & Event Loops in Node.js",
      courseId: "2",
      trainer: "Marcus Vance",
      scheduledAt: "2026-07-29T14:30:00Z",
      time: "Tomorrow at 2:30 PM",
      durationMins: 120,
      platform: "Zoom",
      status: "Upcoming",
      attendeesCount: 65,
      joinUrl: "https://zoom.us/j/9876543210"
    },
    {
      id: "lc-103",
      title: "PostgreSQL Query Optimization & Connection Pooling",
      courseId: "3",
      trainer: "Marcus Vance",
      scheduledAt: "2026-07-31T11:00:00Z",
      time: "Friday at 11:00 AM",
      durationMins: 75,
      platform: "Google Meet",
      status: "Upcoming",
      attendeesCount: 32,
      joinUrl: "https://meet.google.com/pv-lms-db"
    }
  ]);

  const [recordings, setRecordings] = useState([
    { id: "rec-101", title: 'React 18 Concurrent Rendering & Server Components', instructor: 'Dr. Sarah Chen', date: 'Oct 14, 2024', duration: '1h 45m', views: 320, category: 'Web Dev' },
    { id: "rec-102", title: 'Node.js Performance Tuning & Memory Profiling', instructor: 'Marcus Vance', date: 'Oct 12, 2024', duration: '2h 10m', views: 415, category: 'Backend' },
    { id: "rec-103", title: 'LLM Fine-Tuning with LoRA & Hugging Face', instructor: 'Dr. Sarah Chen', date: 'Oct 08, 2024', duration: '1h 50m', views: 580, category: 'AI & ML' },
    { id: "rec-104", title: 'PostgreSQL Indexing & Partitioning Strategies', instructor: 'Marcus Vance', date: 'Oct 04, 2024', duration: '1h 30m', views: 290, category: 'Database' }
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [joinNotice, setJoinNotice] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTrainer, setNewTrainer] = useState(user?.name || 'Dr. Sarah Chen');
  const [newPlatform, setNewPlatform] = useState('Google Meet');
  const [newDuration, setNewDuration] = useState('90');

  useEffect(() => {
    axios.get('/api/classes/live')
      .then(res => {
        if (res.data?.success && res.data.liveClasses?.length) {
          setLiveSessions(res.data.liveClasses);
        }
      })
      .catch(() => {});

    axios.get('/api/classes/recorded')
      .then(res => {
        if (res.data?.success && res.data.recordedClasses?.length) {
          setRecordings(res.data.recordedClasses);
        }
      })
      .catch(() => {});
  }, []);

  const handleJoinClass = async (session) => {
    try {
      const res = await axios.post('/api/classes/join', {
        classId: session.id,
        studentName: user?.name || 'Student'
      });
      setJoinNotice(`Connecting to "${session.title}"... Redirecting to ${session.platform}.`);
      setLiveSessions(prev => prev.map(s => s.id === session.id ? { ...s, attendeesCount: (s.attendeesCount || 0) + 1 } : s));
      setTimeout(() => {
        setJoinNotice('');
        window.open(res.data.joinUrl || session.joinUrl || 'https://meet.google.com', '_blank');
      }, 1200);
    } catch {
      setJoinNotice(`Launching "${session.title}" in new tab...`);
      setTimeout(() => {
        setJoinNotice('');
        window.open(session.joinUrl || 'https://meet.google.com', '_blank');
      }, 1000);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await axios.post('/api/classes/schedule', {
        title: newTitle,
        trainer: newTrainer,
        platform: newPlatform,
        durationMins: parseInt(newDuration, 10)
      });
      if (res.data?.success && res.data.class) {
        setLiveSessions(prev => [res.data.class, ...prev]);
      }
    } catch {
      const localClass = {
        id: `lc-${Date.now()}`,
        title: newTitle,
        trainer: newTrainer,
        time: 'Scheduled Session',
        durationMins: parseInt(newDuration, 10),
        platform: newPlatform,
        status: 'Scheduled',
        attendeesCount: 0,
        joinUrl: newPlatform === 'Zoom' ? 'https://zoom.us/j/12345678' : 'https://meet.google.com/pv-lms-class'
      };
      setLiveSessions(prev => [localClass, ...prev]);
    }

    setShowScheduleModal(false);
    setNewTitle('');
  };

  const filteredRecordings = recordings.filter(r => {
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--pv-bg)' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Live Classes & <span className="gradient-text">Cloud Recordings</span> 📹</h1>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem' }}>
              Attend interactive virtual lectures, interact with trainers, or re-watch high-definition archives.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['trainer', 'mentor', 'super_admin'].includes(user?.role) && (
              <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
                + Schedule Live Class
              </button>
            )}
            <span className="badge badge-success"><span className="pulse-dot"></span> Live Stream Hub Online</span>
          </div>
        </div>

        {/* Status / Join Notification Alert */}
        {joinNotice && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6EE7B7',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600
          }}>
            <span className="pulse-dot"></span> {joinNotice}
          </div>
        )}

        {/* Live & Upcoming Sessions Section */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem', color: '#EF4444' }}>●</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Upcoming & Active Training Rooms</h3>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)' }}>{liveSessions.length} sessions queued</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {liveSessions.map(session => (
              <div
                key={session.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 22px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '14px',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'var(--pv-primary-light)',
                    color: 'var(--pv-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}>
                    🎥
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{session.title}</h4>
                      <span className={`badge ${session.status === 'Live Soon' ? 'badge-warning' : 'badge-primary'}`}>
                        {session.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '18px', fontSize: '0.82rem', color: 'var(--pv-text-muted)', flexWrap: 'wrap' }}>
                      <span>👤 {session.trainer}</span>
                      <span>⏰ {session.time || `${session.durationMins || 60} mins`}</span>
                      <span>🌐 {session.platform}</span>
                      <span>👥 {session.attendeesCount || 0} attending</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleJoinClass(session)}
                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                  >
                    ▶ Join Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recorded Lectures Archive Header & Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>On-Demand Recorded Archive</h3>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem' }}>Browse past sessions, rewind code walkthroughs and study on your schedule.</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search lectures or mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '0.85rem',
                width: '220px'
              }}
            />

            {['All', 'Web Dev', 'Backend', 'AI & ML', 'Database'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  background: activeCategory === cat ? 'var(--pv-gradient-accent)' : 'rgba(255,255,255,0.03)',
                  color: activeCategory === cat ? '#000' : 'var(--pv-text-muted)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recordings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredRecordings.map(rec => (
            <div
              key={rec.id}
              className="glass-panel"
              onClick={() => setSelectedVideo(rec)}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                height: '150px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: '#fff'
                }}>
                  ▶
                </div>
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.8)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  {rec.duration}
                </span>
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '12px',
                  background: 'rgba(6, 182, 212, 0.25)',
                  color: '#67E8F9',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>
                  {rec.category || 'Lecture'}
                </span>
              </div>

              <div style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>
                  {rec.title}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--pv-text-muted)' }}>
                  <span>👤 {rec.instructor}</span>
                  <span>👁 {rec.views} views</span>
                </div>
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>📅 {rec.date}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--pv-accent)', fontWeight: 600 }}>Watch Now →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px'
          }}>
            <div style={{
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              maxWidth: '850px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedVideo.title}</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  &times;
                </button>
              </div>

              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--pv-primary-light)', color: 'var(--pv-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>
                    ▶
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>{selectedVideo.title}</h4>
                  <p style={{ fontSize: '0.9rem' }}>HD Cloud Streaming · {selectedVideo.duration} · Trainer: {selectedVideo.instructor}</p>
                </div>
              </div>

              <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span className="badge badge-accent">Category: {selectedVideo.category}</span>
                  <span className="badge badge-success">✓ 1080p Stream</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => setSelectedVideo(null)}>
                    Close
                  </button>
                  <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => alert('Lecture notes and slides downloaded to your machine.')}>
                    Download Lecture Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trainer Schedule Modal */}
        {showScheduleModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px'
          }}>
            <form onSubmit={handleScheduleSubmit} style={{
              background: '#151D2A',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>Schedule a Live Training Session</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)', marginBottom: '20px' }}>
                Broadcast virtual classroom details across all enrolled student portals.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Session Topic / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dockerizing Microservices with Kubernetes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0F19', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Instructor / Trainer</label>
                  <input
                    type="text"
                    value={newTrainer}
                    onChange={(e) => setNewTrainer(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0F19', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0F19', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom Meeting</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Duration (Minutes)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0F19', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Session
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
