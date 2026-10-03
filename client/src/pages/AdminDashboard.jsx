import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: { totalUsers: 1504, totalRevenue: '$42,500', activeDrives: 3, systemHealth: '99.9%' },
    users: [
      { id: "1", name: 'Alex Johnson', email: 'student@demo.com', role: 'student', department: 'Computer Science' },
      { id: "2", name: 'Dr. Sarah Chen', email: 'faculty@demo.com', role: 'faculty', department: 'Computer Science' },
      { id: "3", name: 'Executive Admin', email: 'admin@demo.com', role: 'admin', department: 'Administration' }
    ]
  });

  useEffect(() => {
    axios.get('/api/admin/dashboard')
      .then(res => { if (res.data.success) setData(res.data); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--pv-bg)' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Executive Suite — <span className="gradient-text">{user?.name || 'Admin'}</span></h1>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem' }}>Prime Vector Private Limited · System Health & Governance Console</p>
          </div>
          <span className="badge badge-accent"><span className="pulse-dot"></span> System Normal</span>
        </div>

        {/* Executive Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Total Registered Accounts</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{data.stats.totalUsers}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Total Revenue</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6EE7B7' }}>{data.stats.totalRevenue}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>Active Hiring Drives</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pv-accent)' }}>{data.stats.activeDrives}</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)', marginBottom: '4px' }}>LMS Uptime</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#A5B4FC' }}>{data.stats.systemHealth}</div>
          </div>
        </div>

        {/* User Governance Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Registered User Accounts</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--pv-text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px' }}>User Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Department</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '14px', color: 'var(--pv-text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${u.role === 'admin' ? 'warning' : u.role === 'faculty' ? 'primary' : 'accent'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>{u.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
