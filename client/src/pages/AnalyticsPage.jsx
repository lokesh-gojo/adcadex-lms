import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function AnalyticsPage() {
  const [data, setData] = useState({
    stats: { totalUsers: 1456, totalCompanies: 2, totalBranches: 3, totalRevenue: '$52,000', activeDrives: 3, systemHealth: '99.9%' },
    analytics: {
      monthlyRevenue: [
        { month: 'Jan', revenue: 24000, enrollments: 120 },
        { month: 'Feb', revenue: 31000, enrollments: 155 },
        { month: 'Mar', revenue: 28000, enrollments: 140 },
        { month: 'Apr', revenue: 39000, enrollments: 195 },
        { month: 'May', revenue: 45000, enrollments: 220 },
        { month: 'Jun', revenue: 52000, enrollments: 260 }
      ],
      placementStats: { totalRegistered: 340, totalPlaced: 285, placementRate: "83.8%", avgPackage: "8.4 LPA", highestPackage: "18.5 LPA" }
    }
  });

  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [exportMsg, setExportMsg] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/dashboard')
      .then(res => { if (res.data.success) setData(res.data); })
      .catch(() => {});
  }, []);

  const handleExportExcel = () => {
    window.open('http://localhost:5000/api/analytics/export/excel', '_blank');
    setExportMsg('✓ Excel Report Exported Successfully (.xlsx)');
    setTimeout(() => setExportMsg(null), 3000);
  };

  const handleExportPDF = () => {
    window.open('http://localhost:5000/api/analytics/export/pdf', '_blank');
    setExportMsg('✓ PDF Summary Report Exported Successfully (.pdf)');
    setTimeout(() => setExportMsg(null), 3000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F19', color: '#F3F4F6' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Admin & Enterprise Analytics</h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Revenue Intelligence, Branch Performance & Multi-Company Reports</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', background: '#111827', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}>
              <option>All Branches</option>
              <option>Hosur Main Campus</option>
              <option>Bangalore Tech Hub</option>
              <option>Chennai Innovation Center</option>
            </select>
            <button onClick={handleExportExcel} style={{ padding: '10px 18px', borderRadius: '10px', background: '#10B981', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              📊 Export Excel
            </button>
            <button onClick={handleExportPDF} style={{ padding: '10px 18px', borderRadius: '10px', background: '#EF4444', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              📄 Export PDF
            </button>
          </div>
        </div>

        {exportMsg && (
          <div style={{ padding: '12px 18px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34D399', fontWeight: 600, marginBottom: '24px' }}>
            {exportMsg}
          </div>
        )}

        {/* Top KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '4px' }}>Total Active Users</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{data.stats.totalUsers}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '4px' }}>Total Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399' }}>{data.stats.totalRevenue}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '4px' }}>Placement Rate</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38BDF8' }}>{data.analytics.placementStats.placementRate}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '4px' }}>Highest CTC Package</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24' }}>{data.analytics.placementStats.highestPackage}</div>
          </div>
        </div>

        {/* Revenue & Enrollment Chart Simulation */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Monthly Revenue & Enrollment Progression</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '220px', gap: '24px', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {data.analytics.monthlyRevenue.map((item, idx) => {
              const maxRev = 60000;
              const heightPct = (item.revenue / maxRev) * 100;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>${item.revenue / 1000}k</div>
                  <div style={{ width: '100%', height: `${heightPct}%`, background: 'linear-gradient(180deg, #4F46E5 0%, #06B6D4 100%)', borderRadius: '8px 8px 0 0' }}></div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600 }}>{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
