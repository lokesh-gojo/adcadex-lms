import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function GamificationPage() {
  const { user } = useAuth();
  const [gamification, setGamification] = useState({
    userXP: 3850,
    level: "Expert",
    levelNumber: 6,
    nextLevel: "Master",
    nextLevelXP: 5500,
    currentLevelMinXP: 3500,
    streakDays: 14,
    ranking: 4,
    totalBadgesEarned: 8,
    badges: [],
    leaderboard: []
  });

  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'leaderboard'
  const [filterDept, setFilterDept] = useState('All');
  const [claimedToday, setClaimedToday] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/gamification/stats');
      if (res.data.success && res.data.gamification) {
        setGamification(res.data.gamification);
      }
    } catch {
      // Keep initial mock
    }
  };

  const handleClaimDailyXP = () => {
    if (claimedToday) return;
    setClaimedToday(true);
    const addedXP = 100;
    setGamification((prev) => ({
      ...prev,
      userXP: prev.userXP + addedXP,
      streakDays: prev.streakDays + 1
    }));
    setNotification('🔥 Daily Study Streak Check-in! +100 XP added to your profile.');
    setTimeout(() => setNotification(''), 4000);
  };

  const currentLevelRange = (gamification.nextLevelXP || 5500) - (gamification.currentLevelMinXP || 3500);
  const currentProgressXP = (gamification.userXP || 3850) - (gamification.currentLevelMinXP || 3500);
  const levelPercentage = Math.min(100, Math.max(0, Math.round((currentProgressXP / currentLevelRange) * 100)));

  const filteredLeaderboard = gamification.leaderboard?.filter(
    item => filterDept === 'All' || item.dept.includes(filterDept)
  ) || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F19', color: '#F3F4F6' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '36px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06B6D4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <span>HONORS & RECOGNITION</span>
              <span>•</span>
              <span>CAMPUS LEADERBOARD & XP</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
              Gamification & Achievements Hub
            </h1>
            <p style={{ color: '#9CA3AF', margin: '6px 0 0', fontSize: '0.95rem' }}>
              Track technical milestones, unlock skill badges, and compete with peers across engineering tracks.
            </p>
          </div>

          <button
            onClick={handleClaimDailyXP}
            disabled={claimedToday}
            style={{
              background: claimedToday ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontWeight: 700,
              cursor: claimedToday ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{claimedToday ? '✓ Claimed Today' : '🔥 Daily Check-in (+100 XP)'}</span>
          </button>
        </div>

        {notification && (
          <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid #F59E0B', color: '#F59E0B', padding: '12px 18px', borderRadius: '10px', marginBottom: '24px', fontWeight: 600 }}>
            {notification}
          </div>
        )}

        {/* ── Top Level & Streak Overview Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
          border: '1px solid rgba(129,140,248,0.25)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Level Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}>
              ⭐
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#818CF8', fontWeight: 700, textTransform: 'uppercase' }}>
                Level {gamification.levelNumber || 6}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>
                {gamification.level || 'Expert'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                Rank #{gamification.ranking || 4} Overall
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div style={{ minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: '#E5E7EB', fontWeight: 600 }}>{gamification.userXP} XP</span>
              <span style={{ color: '#9CA3AF' }}>Next: {gamification.nextLevel} ({gamification.nextLevelXP} XP)</span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${levelPercentage}%`,
                background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
                borderRadius: '5px',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '6px' }}>
              {gamification.nextLevelXP - gamification.userXP} XP needed to reach {gamification.nextLevel}
            </div>
          </div>

          {/* Streak Counter */}
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ fontSize: '2.2rem' }}>🔥</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>
                {gamification.streakDays} Days
              </div>
              <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Active Study Streak</div>
            </div>
          </div>

          {/* Badges Earned */}
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ fontSize: '2.2rem' }}>🏆</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>
                {gamification.badges?.filter(b => b.unlocked).length || 8} / {gamification.badges?.length || 10}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Badges Unlocked</div>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('badges')}
            style={{
              background: activeTab === 'badges' ? 'rgba(79,70,229,0.2)' : 'transparent',
              border: activeTab === 'badges' ? '1px solid #4F46E5' : '1px solid transparent',
              color: activeTab === 'badges' ? '#818CF8' : '#9CA3AF',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🎖️ Skill Badges ({gamification.badges?.length || 10})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              background: activeTab === 'leaderboard' ? 'rgba(6,182,212,0.2)' : 'transparent',
              border: activeTab === 'leaderboard' ? '1px solid #06B6D4' : '1px solid transparent',
              color: activeTab === 'leaderboard' ? '#06B6D4' : '#9CA3AF',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📊 Campus Leaderboard
          </button>
        </div>

        {/* ── Badges Tab Content ── */}
        {activeTab === 'badges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {gamification.badges?.map((badge) => (
              <div
                key={badge.id}
                style={{
                  background: badge.unlocked ? 'linear-gradient(145deg, #131B2E 0%, #0F172A 100%)' : 'rgba(255,255,255,0.02)',
                  border: badge.unlocked ? '1px solid rgba(79,70,229,0.3)' : '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '22px',
                  opacity: badge.unlocked ? 1 : 0.55,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: badge.unlocked ? 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(6,182,212,0.3))' : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      border: badge.unlocked ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {badge.icon}
                    </div>

                    <span style={{
                      background: badge.unlocked ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                      color: badge.unlocked ? '#10B981' : '#9CA3AF',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', margin: '0 0 6px' }}>
                    {badge.name}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 600, marginBottom: '8px' }}>
                    {badge.category}
                  </div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.84rem', margin: '0 0 16px', lineHeight: 1.5 }}>
                    {badge.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    {badge.unlocked ? `Earned: ${badge.unlockedAt}` : 'Criteria pending'}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F59E0B' }}>
                    +{badge.xpValue} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Leaderboard Tab Content ── */}
        {activeTab === 'leaderboard' && (
          <div>
            {/* Filter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>
                Showing ranking for all active enterprise trainees
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Computer Science', 'AI & Data Science', 'Information Tech', 'Electronics'].map(dept => (
                  <button
                    key={dept}
                    onClick={() => setFilterDept(dept)}
                    style={{
                      background: filterDept === dept ? '#4F46E5' : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      color: '#FFF',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Podium for Top 3 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              {gamification.leaderboard?.slice(0, 3).map((lead, idx) => {
                const podiumColors = [
                  { bg: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(180,83,9,0.2))', border: '#F59E0B', label: '1ST PLACE' },
                  { bg: 'linear-gradient(135deg, rgba(148,163,184,0.2), rgba(100,116,139,0.2))', border: '#94A3B8', label: '2ND PLACE' },
                  { bg: 'linear-gradient(135deg, rgba(217,119,6,0.2), rgba(146,64,14,0.2))', border: '#D97706', label: '3RD PLACE' }
                ];
                const conf = podiumColors[idx] || podiumColors[0];

                return (
                  <div
                    key={lead.rank}
                    style={{
                      background: conf.bg,
                      border: `1px solid ${conf.border}`,
                      borderRadius: '16px',
                      padding: '24px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{lead.badge}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: conf.border, letterSpacing: '1px' }}>{conf.label}</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: '6px 0 2px' }}>{lead.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{lead.dept}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#06B6D4', marginTop: '12px' }}>
                      {lead.xp} XP
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Table */}
            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF' }}>
                    <th style={{ padding: '14px 20px' }}>Rank</th>
                    <th style={{ padding: '14px 20px' }}>Candidate Name</th>
                    <th style={{ padding: '14px 20px' }}>Department</th>
                    <th style={{ padding: '14px 20px' }}>Campus Hub</th>
                    <th style={{ padding: '14px 20px' }}>Tier Level</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Total XP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.map((item) => (
                    <tr
                      key={item.rank}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: item.name.includes('You') ? 'rgba(79,70,229,0.12)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '14px 20px', fontWeight: 800, color: item.rank <= 3 ? '#F59E0B' : '#9CA3AF' }}>
                        #{item.rank} {item.badge}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: item.name.includes('You') ? '#38BDF8' : '#FFF' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#D1D5DB' }}>{item.dept}</td>
                      <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{item.campus}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4', padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {item.level}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#FFF' }}>
                        {item.xp} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
