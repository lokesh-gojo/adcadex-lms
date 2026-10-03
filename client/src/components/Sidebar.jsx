import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Role-specific navigation mapping
  const roleMenus = {
    student: [
      { section: 'Academic' },
      { label: 'Student Dashboard', path: '/student', icon: 'fa-th-large' },
      { label: 'My Courses & Lessons', path: '/courses', icon: 'fa-book' },
      { label: 'Live Classes', path: '/live-classes', icon: 'fa-video-camera' },
      { label: 'Quizzes & Tests', path: '/quizzes', icon: 'fa-question-circle' },
      { label: 'Tasks & Assignments', path: '/assignments', icon: 'fa-tasks' },
      { label: 'Training & Upskilling', path: '/training', icon: 'fa-rocket' },
      { section: 'Career & Achievements' },
      { label: 'Campus Placement Drives', path: '/placements', icon: 'fa-briefcase' },
      { label: 'Resume & Portfolio', path: '/resume-builder', icon: 'fa-id-card' },
      { label: 'Code Playground', path: '/compiler', icon: 'fa-code' },
      { label: 'My Certificates', path: '/certificates', icon: 'fa-certificate' },
      { label: 'Achievements & XP', path: '/gamification', icon: 'fa-trophy' },
      { section: 'Community & Support' },
      { label: 'AI Study Copilot', path: '/ai-assistant', icon: 'fa-robot' },
      { label: 'Attendance & QR Scan', path: '/attendance', icon: 'fa-qrcode' },
      { label: 'Discussion Forum', path: '/forum', icon: 'fa-comments' },
      { label: 'Contact Support', path: '/contact', icon: 'fa-envelope' }
    ],

    trainer: [
      { section: 'Instruction & Classes' },
      { label: 'Faculty Dashboard', path: '/faculty', icon: 'fa-th-large' },
      { label: 'Course Management', path: '/courses', icon: 'fa-book' },
      { label: 'Live Classes & Scheduling', path: '/live-classes', icon: 'fa-video-camera' },
      { label: 'Evaluate Assignments', path: '/assignments', icon: 'fa-tasks' },
      { label: 'Technical Quizzes', path: '/quizzes', icon: 'fa-question-circle' },
      { label: 'Training Cohorts', path: '/training', icon: 'fa-rocket' },
      { section: 'Grading & Certifications' },
      { label: 'Issue Certificates', path: '/certificates', icon: 'fa-certificate' },
      { label: 'Student Attendance Logs', path: '/attendance', icon: 'fa-qrcode' },
      { label: 'Instructor Q&A Forum', path: '/forum', icon: 'fa-comments' },
      { label: 'AI Teaching Suite', path: '/ai-assistant', icon: 'fa-robot' },
      { label: 'Code Sandbox', path: '/compiler', icon: 'fa-code' }
    ],

    hr_admin: [
      { section: 'Talent Acquisition' },
      { label: 'HR Talent Portal', path: '/hr', icon: 'fa-users' },
      { label: 'Candidate Pipeline & ATS', path: '/hr', icon: 'fa-address-card' },
      { label: 'Campus Placement Drives', path: '/placements', icon: 'fa-briefcase' },
      { section: 'Screening & Verification' },
      { label: 'Candidate Resumes', path: '/resume-builder', icon: 'fa-id-card' },
      { label: 'Verify Credentials', path: '/certificates', icon: 'fa-certificate' },
      { label: 'AI Candidate Screening', path: '/ai-assistant', icon: 'fa-robot' },
      { label: 'Talent Contact Desk', path: '/contact', icon: 'fa-envelope' }
    ],

    placement_officer: [
      { section: 'Placement Drives' },
      { label: 'Placement Drives Hub', path: '/placements', icon: 'fa-briefcase' },
      { label: 'Corporate Openings', path: '/placements', icon: 'fa-building' },
      { label: 'Candidate ATS Pipeline', path: '/hr', icon: 'fa-users' },
      { label: 'Student Resumes & ATS', path: '/resume-builder', icon: 'fa-id-card' },
      { section: 'Analytics & Verification' },
      { label: 'Verify Student Diplomas', path: '/certificates', icon: 'fa-certificate' },
      { label: 'Placement Analytics', path: '/analytics', icon: 'fa-chart-line' },
      { label: 'AI Career Readiness', path: '/ai-assistant', icon: 'fa-robot' },
      { label: 'Campus Discussions', path: '/forum', icon: 'fa-comments' }
    ],

    super_admin: [
      { section: 'Enterprise Governance' },
      { label: 'Executive Dashboard', path: '/admin', icon: 'fa-th-large' },
      { label: 'Enterprise Analytics', path: '/analytics', icon: 'fa-chart-line' },
      { label: 'User & RBAC Controls', path: '/admin', icon: 'fa-user-secret' },
      { label: 'Certificates Oversight', path: '/certificates', icon: 'fa-certificate' },
      { section: 'System Modules' },
      { label: 'Assessments Oversight', path: '/quizzes', icon: 'fa-question-circle' },
      { label: 'Live Training Oversight', path: '/live-classes', icon: 'fa-video-camera' },
      { label: 'Corporate Drives Audit', path: '/placements', icon: 'fa-briefcase' },
      { label: 'HR Talent Acquisition', path: '/hr', icon: 'fa-users' },
      { label: 'AI Platform Audit', path: '/ai-assistant', icon: 'fa-robot' }
    ],

    mentor: [
      { section: 'Mentorship & Guidance' },
      { label: 'Mentor Dashboard', path: '/mentor', icon: 'fa-th-large' },
      { label: 'Mentee Doubt Forum', path: '/forum', icon: 'fa-comments' },
      { label: 'Project Code Review', path: '/assignments', icon: 'fa-tasks' },
      { label: 'Code Playground Sandbox', path: '/compiler', icon: 'fa-code' },
      { label: 'Upskilling Programs', path: '/training', icon: 'fa-rocket' },
      { label: 'AI Mentor Copilot', path: '/ai-assistant', icon: 'fa-robot' }
    ]
  };

  const currentRole = user?.role || 'student';
  const roleNavItems = roleMenus[currentRole] || roleMenus['student'];

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    const roleRedirects = {
      student: '/student',
      trainer: '/faculty',
      faculty: '/faculty',
      hr_admin: '/hr',
      placement_officer: '/placements',
      super_admin: '/admin',
      mentor: '/mentor'
    };
    navigate(roleRedirects[newRole] || '/student');
  };

  const roleBadgeColors = {
    student: { bg: 'rgba(6,182,212,0.15)', text: '#06B6D4', label: 'Student Portal' },
    trainer: { bg: 'rgba(99,102,241,0.15)', text: '#818CF8', label: 'Faculty / Trainer Portal' },
    faculty: { bg: 'rgba(99,102,241,0.15)', text: '#818CF8', label: 'Faculty / Trainer Portal' },
    hr_admin: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', label: 'HR Recruiter Portal' },
    placement_officer: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', label: 'Placement Officer' },
    super_admin: { bg: 'rgba(239,68,68,0.15)', text: '#F87171', label: 'Super Admin Portal' },
    mentor: { bg: 'rgba(168,85,247,0.15)', text: '#C084FC', label: 'Mentor Portal' }
  };

  const badge = roleBadgeColors[currentRole] || roleBadgeColors.student;

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#0B0F19',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 600,
      padding: '20px 16px',
      overflowY: 'auto'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '0 8px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF' }}>
          PRIME <span style={{ color: '#06B6D4' }}>VECTOR</span>
        </span>
      </div>

      {/* Role Indicator Banner */}
      <div style={{
        background: badge.bg,
        border: `1px solid ${badge.text}40`,
        borderRadius: '8px',
        padding: '6px 10px',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: badge.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {badge.label}
        </span>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badge.text }}></span>
      </div>

      {/* Role Switcher & User Profile Box */}
      {user && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '18px'
        }}>
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', textDecoration: 'none', cursor: 'pointer' }} title="View & Edit Profile">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.name ? user.name[0].toUpperCase() : 'U'
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{user.department || user.branch}</div>
            </div>
          </Link>

          <div style={{ fontSize: '0.66rem', color: '#9CA3AF', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
            Switch Login View (RBAC):
          </div>
          <select
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '6px',
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFF',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="student">👨‍🎓 Student Login</option>
            <option value="trainer">👩‍🏫 Faculty / Trainer Login</option>
            <option value="hr_admin">💼 HR / Recruiter Login</option>
            <option value="placement_officer">🎯 Placement Officer Login</option>
            <option value="super_admin">⚙️ Admin Login</option>
            <option value="mentor">🤝 Mentor Login</option>
          </select>
        </div>
      )}

      {/* Role-Specific Navigation Menu */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {roleNavItems.map((item, idx) => {
          if (item.section) {
            return (
              <div
                key={`sec-${idx}`}
                style={{
                  fontSize: '0.63rem',
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginTop: idx > 0 ? '12px' : '4px',
                  marginBottom: '4px',
                  paddingLeft: '8px'
                }}
              >
                {item.section}
              </div>
            );
          }

          const isActive = location.pathname === item.path;
          return (
            <Link
              key={`nav-${idx}`}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'linear-gradient(135deg, rgba(79,70,229,0.35) 0%, rgba(6,182,212,0.2) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(79,70,229,0.4)' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <i className={`fa ${item.icon}`} style={{ color: isActive ? '#06B6D4' : 'inherit', width: '16px', textAlign: 'center' }}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: '8px',
          color: '#EF4444',
          background: 'rgba(239,68,68,0.1)',
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '16px',
          fontSize: '0.82rem'
        }}
      >
        <i className="fa fa-sign-out"></i> Logout
      </button>
    </aside>
  );
}
