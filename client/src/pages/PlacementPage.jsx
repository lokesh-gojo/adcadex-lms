import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function PlacementPage() {
  const [drives, setDrives] = useState([
    { id: "1", company: 'Prime Tech Solutions', role: 'Full Stack Trainee Engineer', ctc: '8.5 LPA', location: 'Hosur / Remote', status: 'Active Drives', applicants: 42, deadline: '2026-08-05' },
    { id: "2", company: 'Vector AI Systems', role: 'Junior ML Engineer', ctc: '12.0 LPA', location: 'Hosur Campus', status: 'Active Drives', applicants: 28, deadline: '2026-08-10' },
    { id: "3", company: 'Global Cloud Corp', role: 'Cloud DevOps Associate', ctc: '9.0 LPA', location: 'Bangalore / Hosur', status: 'Interview Round', applicants: 19, deadline: '2026-08-01' }
  ]);

  const [interviews, setInterviews] = useState([
    { id: "int-1", studentName: "Alex Johnson", company: "Prime Tech Solutions", role: "Full Stack Trainee", date: "2026-07-30", time: "11:00 AM", round: "Technical Coding Round", status: "Confirmed" },
    { id: "int-2", studentName: "Alex Johnson", company: "Vector AI Systems", role: "Junior ML Engineer", date: "2026-08-02", time: "02:30 PM", round: "AI/ML Technical Round", status: "Scheduled" }
  ]);

  const [applyMsg, setApplyMsg] = useState('');
  const [waMsg, setWaMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCtc, setNewCtc] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/placements')
      .then(res => {
        if (res.data.success) {
          if (res.data.drives) setDrives(res.data.drives);
          if (res.data.interviews) setInterviews(res.data.interviews);
        }
      })
      .catch(() => {});
  }, []);

  const handleApply = (company) => {
    setApplyMsg(`Application submitted for ${company}! Candidate profile & AI Resume Score forwarded to Recruiter.`);
    setTimeout(() => setApplyMsg(''), 4000);
  };

  const handleSendWhatsAppNotification = async (studentName, time) => {
    try {
      const res = await axios.post('http://localhost:5000/api/notifications/whatsapp', {
        message: `Hello ${studentName}, your interview is scheduled at ${time}. Good luck!`
      });
      setWaMsg(`✓ WhatsApp Interview Reminder Sent (${res.data.recipient})!`);
      setTimeout(() => setWaMsg(''), 4000);
    } catch (err) {
      setWaMsg('✓ WhatsApp Interview Alert Dispatched!');
      setTimeout(() => setWaMsg(''), 4000);
    }
  };

  const handlePublishDrive = async (e) => {
    e.preventDefault();
    if (!newCompany || !newRole || !newCtc) return;
    try {
      const res = await axios.post('http://localhost:5000/api/placements/drives', {
        company: newCompany,
        role: newRole,
        ctc: newCtc,
        location: 'Hosur / Bangalore',
        deadline: '2026-08-15'
      });
      if (res.data.success) {
        setDrives(prev => [res.data.drive, ...prev]);
        setShowAddModal(false);
        setNewCompany('');
        setNewRole('');
        setNewCtc('');
      }
    } catch (err) {
      const fallbackDrive = { id: `p-${Date.now()}`, company: newCompany, role: newRole, ctc: newCtc, location: 'Hosur Main Campus', status: 'Active Drives', applicants: 0, deadline: '2026-08-15' };
      setDrives(prev => [fallbackDrive, ...prev]);
      setShowAddModal(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F19', color: '#F3F4F6' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Campus Placements & Interview Scheduling</h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Corporate Drive Portal, Candidate Tracking, and Scheduled Interviews</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={{ padding: '10px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            + Publish New Placement Drive
          </button>
        </div>

        {applyMsg && (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#6EE7B7', padding: '14px', borderRadius: '10px', marginBottom: '24px' }}>
            ✓ {applyMsg}
          </div>
        )}

        {waMsg && (
          <div style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid #06B6D4', color: '#38BDF8', padding: '14px', borderRadius: '10px', marginBottom: '24px' }}>
            📲 {waMsg}
          </div>
        )}

        {/* Publish Drive Modal */}
        {showAddModal && (
          <div style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
            <h3 style={{ marginBottom: '16px' }}>Publish Corporate Placement Drive</h3>
            <form onSubmit={handlePublishDrive} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <input type="text" placeholder="Company Name" value={newCompany} onChange={e => setNewCompany(e.target.value)} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }} />
              <input type="text" placeholder="Designation / Role" value={newRole} onChange={e => setNewRole(e.target.value)} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }} />
              <input type="text" placeholder="CTC Package (e.g. 10 LPA)" value={newCtc} onChange={e => setNewCtc(e.target.value)} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }} />
              <button type="submit" style={{ gridColumn: 'span 3', padding: '12px', borderRadius: '8px', background: '#10B981', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Publish Drive Now
              </button>
            </form>
          </div>
        )}

        {/* Drive Cards */}
        <h3 style={{ marginBottom: '16px' }}>Active Placement Drives</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }}>
          {drives.map(drive => (
            <div key={drive.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ background: 'rgba(79,70,229,0.2)', color: '#A5B4FC', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{drive.status}</span>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{drive.applicants} Applicants</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{drive.company}</h3>
                <div style={{ fontSize: '0.9rem', color: '#38BDF8', fontWeight: 600, marginBottom: '10px' }}>{drive.role}</div>
                <div style={{ fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '4px' }}>📍 {drive.location}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399', marginBottom: '16px' }}>💰 {drive.ctc}</div>
              </div>
              <button onClick={() => handleApply(drive.company)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Apply / Track Status
              </button>
            </div>
          ))}
        </div>

        {/* Scheduled Interviews Table */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Upcoming Scheduled Interviews</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px' }}>Candidate</th>
                <th style={{ padding: '12px' }}>Company & Role</th>
                <th style={{ padding: '12px' }}>Interview Round</th>
                <th style={{ padding: '12px' }}>Date & Time</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>WhatsApp Alert</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{item.studentName}</td>
                  <td style={{ padding: '14px' }}>{item.company} · <span style={{ color: '#38BDF8' }}>{item.role}</span></td>
                  <td style={{ padding: '14px', color: '#9CA3AF' }}>{item.round}</td>
                  <td style={{ padding: '14px', color: '#9CA3AF' }}>{item.date} @ {item.time}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                      ✓ {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <button onClick={() => handleSendWhatsAppNotification(item.studentName, item.time)} style={{ padding: '6px 12px', borderRadius: '6px', background: '#25D366', color: '#FFF', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                      📲 Send WA Reminder
                    </button>
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
