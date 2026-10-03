import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('student@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const roleDefinitions = [
    {
      id: 'student',
      title: 'Student / Learner',
      icon: '👨‍🎓',
      badge: 'Academic Track',
      color: '#06B6D4',
      bgGlow: 'rgba(6,182,212,0.15)',
      email: 'student@demo.com',
      password: 'demo123',
      name: 'Alex Johnson',
      dest: '/student',
      description: 'Access enrolled courses, live lecture classrooms, technical quizzes, project tasks, certificates, and placement applications.'
    },
    {
      id: 'trainer',
      title: 'Faculty / Trainer',
      icon: '👩‍🏫',
      badge: 'Instruction & Evaluation',
      color: '#818CF8',
      bgGlow: 'rgba(129,140,248,0.15)',
      email: 'trainer@demo.com',
      password: 'demo123',
      name: 'Dr. Sarah Chen',
      dest: '/faculty',
      description: 'Manage course curriculum, schedule live sessions, grade assignments, launch quizzes, and issue student certificates.'
    },
    {
      id: 'hr_admin',
      title: 'HR / Recruiter',
      icon: '💼',
      badge: 'Talent Acquisition',
      color: '#10B981',
      bgGlow: 'rgba(16,185,129,0.15)',
      email: 'hr@demo.com',
      password: 'demo123',
      name: 'Jane Recruiter',
      dest: '/hr',
      description: 'Review candidate pipeline, evaluate ATS resume match scores, verify diplomas, and schedule interview rounds.'
    },
    {
      id: 'placement_officer',
      title: 'Placement Officer',
      icon: '🎯',
      badge: 'Corporate Relations',
      color: '#F59E0B',
      bgGlow: 'rgba(245,158,11,0.15)',
      email: 'placement@demo.com',
      password: 'demo123',
      name: 'Priya Sharma',
      dest: '/placements',
      description: 'Coordinate campus placement drives, publish job requirements, track applicant status, and review placement analytics.'
    },
    {
      id: 'super_admin',
      title: 'System Administrator',
      icon: '⚙️',
      badge: 'Enterprise Control',
      color: '#F87171',
      bgGlow: 'rgba(248,113,113,0.15)',
      email: 'superadmin@demo.com',
      password: 'demo123',
      name: 'Executive Chief Admin',
      dest: '/admin',
      description: 'Total administrative oversight: enterprise analytics, user RBAC privileges, branch data, and global LMS audit logs.'
    },
    {
      id: 'mentor',
      title: 'Technical Mentor',
      icon: '🤝',
      badge: 'Code & Doubt Guidance',
      color: '#C084FC',
      bgGlow: 'rgba(192,132,252,0.15)',
      email: 'mentor@demo.com',
      password: 'demo123',
      name: 'Marcus Vance',
      dest: '/mentor',
      description: 'Guide mentees through discussion forums, review code playground solutions, and provide personalized feedback.'
    }
  ];

  const currentRoleConfig = roleDefinitions.find(r => r.id === selectedRole) || roleDefinitions[0];

  const handleSelectRole = (role) => {
    setSelectedRole(role.id);
    setEmail(role.email);
    setPassword(role.password);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate(currentRoleConfig.dest);
    } else {
      setError(res.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickLoginAs = async (role) => {
    handleSelectRole(role);
    setError('');
    const res = await login(role.email, role.password);
    if (res.success) {
      navigate(role.dest);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '420px 1fr',
      background: '#0B0F19',
      color: '#F3F4F6'
    }}>
      {/* Left Branding Sidebar */}
      <div style={{
        background: 'linear-gradient(145deg, #0F172A 0%, #0B0F19 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: '48px 36px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '36px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
              PRIME <span style={{ color: '#06B6D4' }}>VECTOR</span>
            </span>
          </Link>

          <span style={{
            background: 'rgba(79,70,229,0.2)',
            color: '#818CF8',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Multi-Tenant Enterprise LMS
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', margin: '14px 0 10px', lineHeight: 1.25 }}>
            Role-Based Access <br />
            <span style={{ background: 'linear-gradient(135deg, #38BDF8, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Authentication Portal
            </span>
          </h1>

          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Choose your specific login category below. Each portal displays strictly dedicated capabilities and permissions tailored for your organization role.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#D1D5DB' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(6,182,212,0.15)', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✓</span>
              <span>Dedicated dashboards with custom sidebars</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#D1D5DB' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✓</span>
              <span>Encrypted JWT token authorization</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#D1D5DB' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(245,158,11,0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✓</span>
              <span>Instant one-click demo credentials</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px', fontSize: '0.8rem', color: '#6B7280' }}>
          Prime Vector Private Limited · Hosur Innovation Campus
        </div>
      </div>

      {/* Right Login Type Selector & Form */}
      <div style={{ padding: '48px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '780px', width: '100%', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFF', margin: '0 0 6px' }}>
              Select Your Login Type
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', margin: 0 }}>
              Each login type grants a different set of permissions and navigation tools.
            </p>
          </div>

          {/* 6 Role Selector Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '12px',
            marginBottom: '28px'
          }}>
            {roleDefinitions.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  style={{
                    background: isSelected ? role.bgGlow : 'rgba(255,255,255,0.03)',
                    border: isSelected ? `2px solid ${role.color}` : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{role.icon}</span>
                    <span style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: role.color,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.68rem',
                      fontWeight: 700
                    }}>
                      {role.badge}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? '#FFF' : '#E5E7EB', marginBottom: '4px' }}>
                    {role.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#9CA3AF', lineHeight: 1.4 }}>
                    Demo: {role.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Role Configuration Details Box */}
          <div style={{
            background: 'linear-gradient(145deg, #131B2E 0%, #0F172A 100%)',
            border: `1px solid ${currentRoleConfig.color}40`,
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '24px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{currentRoleConfig.icon}</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF' }}>
                    {currentRoleConfig.title} Authentication
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#9CA3AF' }}>
                  {currentRoleConfig.description}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickLoginAs(currentRoleConfig)}
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg, ${currentRoleConfig.color}, #4F46E5)`,
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>⚡ Instant One-Click Login</span>
              </button>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid #EF4444',
                color: '#EF4444',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px',
                fontWeight: 600
              }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@primevector.in"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#FFF',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#D1D5DB', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#FFF',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                  Target Dashboard: <strong style={{ color: currentRoleConfig.color }}>{currentRoleConfig.dest}</strong>
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 28px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Authenticating...' : `Sign In as ${currentRoleConfig.title} →`}
                </button>
              </div>
            </form>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#9CA3AF' }}>
            <span>Need a new account? <Link to="/register" style={{ color: '#06B6D4', fontWeight: 600 }}>Register Candidate</Link></span>
            <Link to="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>← Back to Public Website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
