import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function HrDashboard() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([
    { id: "cand-1", name: "Alex Johnson", email: "student@demo.com", role: "Full Stack Trainee", driveId: "p-1", company: "Prime Tech Solutions", atsScore: 92, status: "Shortlisted", phone: "+91 9876543210", appliedDate: "2026-07-21" },
    { id: "cand-2", name: "Pooja Reddy", email: "pooja.r@demo.com", role: "Junior ML Engineer", driveId: "p-2", company: "Vector AI Systems", atsScore: 89, status: "Interview", phone: "+91 9876543211", appliedDate: "2026-07-22" },
    { id: "cand-3", name: "Rohan Verma", email: "rohan.v@demo.com", role: "Cloud DevOps Associate", driveId: "p-3", company: "Global Cloud Corp", atsScore: 95, status: "Offered", phone: "+91 9876543212", appliedDate: "2026-07-19" },
    { id: "cand-4", name: "Sneha Nair", email: "sneha.n@demo.com", role: "Full Stack Trainee", driveId: "p-1", company: "Prime Tech Solutions", atsScore: 78, status: "Applied", phone: "+91 9876543213", appliedDate: "2026-07-24" }
  ]);

  const [stats, setStats] = useState({
    totalApplicants: 4,
    shortlisted: 1,
    inInterview: 1,
    offered: 1
  });

  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [scheduleModalCand, setScheduleModalCand] = useState(null);
  const [intDate, setIntDate] = useState('2026-08-05');
  const [intTime, setIntTime] = useState('11:00 AM');
  const [intRound, setIntRound] = useState('Technical Interview Round 1');

  useEffect(() => {
    axios.get('/api/hr/candidates')
      .then(res => {
        if (res.data?.success) {
          if (res.data.candidates) setCandidates(res.data.candidates);
          if (res.data.stats) setStats(res.data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateStatus = async (candidateId, newStatus) => {
    try {
      await axios.post('/api/hr/status-update', { candidateId, status: newStatus });
    } catch {
      // Local fallback
    }

    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c));
    setActionMsg(`✓ Candidate updated to: "${newStatus}"`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!scheduleModalCand) return;

    try {
      await axios.post('/api/hr/schedule-interview', {
        candidateId: scheduleModalCand.id,
        date: intDate,
        time: intTime,
        round: intRound
      });
      await axios.post('/api/hr/status-update', { candidateId: scheduleModalCand.id, status: 'Interview' });
    } catch {
      // fallback
    }

    setCandidates(prev => prev.map(c => c.id === scheduleModalCand.id ? { ...c, status: 'Interview' } : c));
    setActionMsg(`✓ Interview scheduled for ${scheduleModalCand.name} on ${intDate} at ${intTime}`);
    setScheduleModalCand(null);
    setTimeout(() => setActionMsg(''), 4500);
  };

  const filteredCandidates = candidates.filter(cand => {
    const matchesStatus = filterStatus === 'All' || cand.status === filterStatus;
    const matchesSearch = cand.name.toLowerCase().includes(search.toLowerCase()) ||
      cand.role.toLowerCase().includes(search.toLowerCase()) ||
      cand.company.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--pv-bg)' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>HR & <span className="gradient-text">Talent Acquisition</span> Portal 👔</h1>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem' }}>
              Manage recruitment pipelines, evaluate ATS resume match scores, and coordinate technical interview rounds.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="badge badge-accent">Role: HR Talent Director</span>
            <span className="badge badge-success"><span className="pulse-dot"></span> ATS Engine Synced</span>
          </div>
        </div>

        {/* Action / Success Banner */}
        {actionMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6EE7B7',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: 600
          }}>
            {actionMsg}
          </div>
        )}

        {/* Pipeline KPI Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Total Applicants</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{candidates.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pv-accent)', marginTop: '4px' }}>Across active campus drives</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Shortlisted (ATS &gt; 80%)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pv-accent)' }}>
              {candidates.filter(c => c.status === 'Shortlisted').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', marginTop: '4px' }}>Ready for technical rounds</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>In Interview Rounds</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FDE047' }}>
              {candidates.filter(c => c.status === 'Interview').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', marginTop: '4px' }}>Live coding & system design</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Offers Extended</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6EE7B7' }}>
              {candidates.filter(c => c.status === 'Offered').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', marginTop: '4px' }}>Accepted offers: 100%</div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filterStatus === status ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  background: filterStatus === status ? 'var(--pv-gradient-primary)' : 'rgba(255,255,255,0.03)',
                  color: '#fff'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search candidate name, role, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '0.85rem',
              width: '280px'
            }}
          />
        </div>

        {/* ATS Candidates Table */}
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--pv-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Candidate</th>
                <th style={{ padding: '12px 16px' }}>Drive / Company</th>
                <th style={{ padding: '12px 16px' }}>Target Role</th>
                <th style={{ padding: '12px 16px' }}>ATS Match</th>
                <th style={{ padding: '12px 16px' }}>Pipeline Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map(cand => (
                <tr key={cand.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{cand.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>{cand.email} · {cand.phone}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#E2E8F0', fontWeight: 500 }}>
                    {cand.company}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge badge-primary">{cand.role}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontWeight: 800,
                        color: cand.atsScore >= 90 ? '#6EE7B7' : cand.atsScore >= 80 ? 'var(--pv-accent)' : '#FDE047'
                      }}>
                        {cand.atsScore}%
                      </span>
                      <div style={{ width: '50px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${cand.atsScore}%`,
                          height: '100%',
                          background: cand.atsScore >= 90 ? '#10B981' : 'var(--pv-gradient-accent)'
                        }}></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${
                      cand.status === 'Offered' ? 'badge-success' :
                      cand.status === 'Interview' ? 'badge-warning' :
                      cand.status === 'Shortlisted' ? 'badge-accent' :
                      cand.status === 'Rejected' ? 'badge-warning' : 'badge-primary'
                    }`}>
                      {cand.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {cand.status !== 'Shortlisted' && cand.status !== 'Offered' && (
                        <button
                          className="btn btn-outline"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleUpdateStatus(cand.id, 'Shortlisted')}
                        >
                          Shortlist
                        </button>
                      )}
                      <button
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => setScheduleModalCand(cand)}
                      >
                        Interview
                      </button>
                      {cand.status !== 'Offered' && (
                        <button
                          className="btn btn-accent"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleUpdateStatus(cand.id, 'Offered')}
                        >
                          Offer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Schedule Interview Modal */}
        {scheduleModalCand && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px'
          }}>
            <form onSubmit={handleScheduleInterview} style={{
              background: '#151D2A',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
                Schedule Interview: {scheduleModalCand.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)', marginBottom: '20px' }}>
                For {scheduleModalCand.role} at {scheduleModalCand.company}.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Interview Round</label>
                <select
                  value={intRound}
                  onChange={(e) => setIntRound(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0F19', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  <option value="Technical Interview Round 1">Technical Coding Round 1</option>
                  <option value="System Design & Architecture">System Design & Architecture</option>
                  <option value="HR & Culture Fit Discussion">HR & Culture Fit Discussion</option>
                  <option value="Director Final Round">Director Final Round</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date</label>
                  <input
                    type="date"
                    value={intDate}
                    onChange={(e) => setIntDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0F19', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Time</label>
                  <input
                    type="text"
                    value={intTime}
                    onChange={(e) => setIntTime(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0F19', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setScheduleModalCand(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Dispatch Calendar Invite
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
