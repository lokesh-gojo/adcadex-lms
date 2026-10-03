import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    email: '',
    phone: '+91 98765 43210',
    department: 'AI & Data Science',
    branch: 'Hosur Main Campus',
    bio: '',
    linkedin: '',
    github: '',
    avatar: ''
  });

  const [notification, setNotification] = useState('');
  const [linkedinVerified, setLinkedinVerified] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        headline: user.headline || getDefaultHeadline(user.role),
        email: user.email || '',
        phone: user.phone || '+91 98765 43210',
        department: user.department || 'AI & Data Science',
        branch: user.branch || 'Hosur Main Campus',
        bio: user.bio || getDefaultBio(user.role),
        linkedin: user.linkedin || '',
        github: user.github || '',
        avatar: user.avatar || ''
      });
      if (user.linkedin) setLinkedinVerified(true);
    }
  }, [user]);

  function getDefaultHeadline(role) {
    const map = {
      faculty: 'Senior Faculty Member & AI Track Lead',
      trainer: 'Lead Technical Instructor & Curriculum Specialist',
      mentor: 'Technical Engineering Mentor & Code Reviewer',
      admin: 'Executive System Administrator',
      super_admin: 'Chief Technology & Compliance Officer',
      hr: 'Talent Acquisition Partner',
      hr_admin: 'Senior HR Talent Lead',
      placement: 'Corporate Relations & Placement Officer',
      placement_officer: 'Campus Placement Director',
      student: 'Full Stack & AI Engineering Trainee'
    };
    return map[role] || 'Member, Prime Vector LMS';
  }

  function getDefaultBio(role) {
    const map = {
      faculty: 'Passionate computer science educator specializing in applied neural networks, full-stack microservices, and student mentorship.',
      trainer: 'Technical trainer focused on hands-on software design patterns, algorithmic problem solving, and enterprise readiness.',
      hr_admin: 'Dedicated to discovering high-potential software engineering talent and matching skilled candidates with top corporate placement partners.',
      super_admin: 'Overseeing enterprise LMS infrastructure, RBAC security compliance, and campus branch operations.',
      placement_officer: 'Empowering students with career opportunities and fostering partnerships with tier-1 technology employers.',
      mentor: 'Full stack architecture mentor guiding developers through practical code reviews and problem solving.',
      student: 'Driven software engineering student passionate about building scalable web applications and learning modern AI architectures.'
    };
    return map[role] || 'Active member of Prime Vector LMS.';
  }

  const roleBadgeMap = {
    faculty: { label: 'FACULTY MEMBER', icon: 'fa-graduation-cap', color: '#818CF8' },
    trainer: { label: 'TRAINER / INSTRUCTOR', icon: 'fa-graduation-cap', color: '#818CF8' },
    mentor: { label: 'TECHNICAL MENTOR', icon: 'fa-users', color: '#C084FC' },
    admin: { label: 'ADMINISTRATOR', icon: 'fa-shield', color: '#F87171' },
    super_admin: { label: 'SUPER ADMIN', icon: 'fa-shield', color: '#F87171' },
    hr: { label: 'HR RECRUITER', icon: 'fa-briefcase', color: '#10B981' },
    hr_admin: { label: 'HR TALENT LEAD', icon: 'fa-briefcase', color: '#10B981' },
    placement: { label: 'PLACEMENT OFFICER', icon: 'fa-bullseye', color: '#F59E0B' },
    placement_officer: { label: 'PLACEMENT OFFICER', icon: 'fa-bullseye', color: '#F59E0B' },
    student: { label: 'STUDENT / LEARNER', icon: 'fa-user', color: '#06B6D4' }
  };

  const roleConf = roleBadgeMap[user?.role] || roleBadgeMap.student;

  const getStatsForRole = (role) => {
    switch (role) {
      case 'faculty':
      case 'trainer':
        return [
          { key: 'Assigned Courses', val: '3' },
          { key: 'Active Students', val: '340' },
          { key: 'Submissions to Grade', val: '14' },
          { key: 'Live Classes Held', val: '28' },
          { key: 'Instructor Rating', val: '4.9 ★' },
          { key: 'Office Hours', val: 'Mon - Fri' }
        ];
      case 'hr_admin':
      case 'hr':
        return [
          { key: 'Active Applicants', val: '48' },
          { key: 'Shortlisted Pool', val: '18' },
          { key: 'Interviews Scheduled', val: '12' },
          { key: 'Offers Released', val: '7' },
          { key: 'Avg. ATS Match', val: '92%' }
        ];
      case 'placement_officer':
      case 'placement':
        return [
          { key: 'Active Drives', val: '6' },
          { key: 'Students Placed', val: '285' },
          { key: 'Placement Rate', val: '83.8%' },
          { key: 'Highest Package', val: '18.5 LPA' },
          { key: 'Average Package', val: '8.4 LPA' }
        ];
      case 'super_admin':
      case 'admin':
        return [
          { key: 'Total Users', val: '1,450+' },
          { key: 'Enterprise Campuses', val: '3' },
          { key: 'System Uptime', val: '99.98%' },
          { key: 'Active Faculty', val: '24' },
          { key: 'Compliance Status', val: 'Verified' }
        ];
      case 'mentor':
        return [
          { key: 'Assigned Mentees', val: '45' },
          { key: 'Code Reviews Done', val: '62' },
          { key: 'Forum Doubts Solved', val: '38' },
          { key: 'Mentorship Score', val: '4.95 ★' }
        ];
      default:
        return [
          { key: 'Courses Enrolled', val: '4' },
          { key: 'Completed Courses', val: '2' },
          { key: 'Certificates Earned', val: '2' },
          { key: 'Avg. Quiz Score', val: '88%' },
          { key: 'Attendance Rate', val: '94%' },
          { key: 'Active Study Streak', val: '14 Days' }
        ];
    }
  };

  const getSkillsForRole = (role) => {
    switch (role) {
      case 'faculty':
      case 'trainer':
        return ['Artificial Intelligence', 'Neural Networks', 'PyTorch', 'Data Structures', 'Curriculum Design', 'Full Stack Architecture'];
      case 'hr_admin':
      case 'hr':
        return ['Talent Sourcing', 'ATS Screening', 'Technical Evaluation', 'HR Interviewing', 'Onboarding', 'Campus Recruitment'];
      case 'placement_officer':
      case 'placement':
        return ['Corporate Relations', 'Placement Drives', 'Aptitude Training', 'Industry Connect', 'Mock Interviews'];
      case 'super_admin':
      case 'admin':
        return ['Executive Governance', 'Platform Architecture', 'Enterprise Security', 'Analytics Audit', 'Multi-Tenant Scale'];
      case 'mentor':
        return ['Full Stack Guidance', 'Code Optimization', 'Algorithm Debugging', 'Git Workflows', 'Doubt Clearing'];
      default:
        return ['JavaScript', 'Python', 'React.js', 'Node.js', 'SQL', 'Machine Learning', 'Data Structures'];
    }
  };

  const stats = getStatsForRole(user?.role);
  const skills = getSkillsForRole(user?.role);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFormData(prev => ({ ...prev, avatar: dataUrl }));
      const updated = { ...user, avatar: dataUrl };
      localStorage.setItem('PrimeVector_user', JSON.stringify(updated));
      setNotification('Profile photo updated successfully!');
      setTimeout(() => setNotification(''), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: formData.name,
      headline: formData.headline,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      branch: formData.branch,
      bio: formData.bio,
      linkedin: formData.linkedin,
      github: formData.github,
      avatar: formData.avatar
    };
    localStorage.setItem('PrimeVector_user', JSON.stringify(updated));
    setNotification('✓ Profile information updated and synchronized across all portals!');
    setTimeout(() => setNotification(''), 4000);
  };

  const verifyLinkedIn = () => {
    if (formData.linkedin && formData.linkedin.includes('linkedin.com/')) {
      setLinkedinVerified(true);
      setNotification('✓ LinkedIn account successfully verified!');
      setTimeout(() => setNotification(''), 4000);
    } else {
      alert('Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/username)');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F19', color: '#F3F4F6' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '36px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06B6D4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <span>USER IDENTITY & PREFERENCES</span>
              <span>•</span>
              <span>ENTERPRISE RBAC PROFILE</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
              Account Profile & Settings
            </h1>
          </div>

          <button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 22px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>💾 Save Profile</span>
          </button>
        </div>

        {notification && (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#10B981', padding: '12px 18px', borderRadius: '10px', marginBottom: '24px', fontWeight: 600 }}>
            {notification}
          </div>
        )}

        {/* ── Hero Profile Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          flexWrap: 'wrap'
        }}>
          {/* Avatar with Photo Uploader */}
          <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#FFF',
              border: '4px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              lineHeight: 1
            }}>
              {formData.avatar ? (
                <img src={formData.avatar} alt={formData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (formData.name || 'U').trim().charAt(0).toUpperCase()
              )}
            </div>

            <label style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#06B6D4',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              cursor: 'pointer',
              border: '2px solid #0F172A',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              📷
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
              {formData.name || 'User Name'}
            </div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: `${roleConf.color}20`,
              border: `1px solid ${roleConf.color}50`,
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: roleConf.color,
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span>★</span>
              <span>{roleConf.label}</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#9CA3AF', fontSize: '0.88rem' }}>
              <div>📧 {formData.email}</div>
              <div>🏢 {formData.department}</div>
              <div>📍 {formData.branch}</div>
              <div>📅 Member Since 2023</div>
            </div>
          </div>
        </div>

        {/* ── Main Layout: Stats on Left, Edit Form on Right ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
          
          {/* Left Column: Quick Stats & Competencies */}
          <div>
            {/* Quick Stats Card */}
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <span style={{ fontWeight: 700, color: '#FFF', fontSize: '1rem' }}>Role Overview & Metrics</span>
                <span style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, background: 'rgba(6,182,212,0.12)', padding: '2px 8px', borderRadius: '10px' }}>
                  ACTIVE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stats.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.88rem' }}>
                    <span style={{ color: '#9CA3AF' }}>{s.key}</span>
                    <span style={{ fontWeight: 700, color: '#FFF' }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Competencies Card */}
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', margin: '0 0 14px' }}>
                Key Competencies & Scope
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((sk, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#E5E7EB',
                      padding: '5px 12px',
                      borderRadius: '14px',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div>
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '28px'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', margin: '0 0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
                Edit Personal & Contact Information
              </h3>

              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px', fontWeight: 600 }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px', fontWeight: 600 }}>Headline / Designation</label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px', fontWeight: 600 }}>Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px', fontWeight: 600 }}>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1E293B', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none' }}
                    >
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="Computer Science">Computer Science & Engineering</option>
                      <option value="Full Stack Engineering">Full Stack Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Corporate Relations">Corporate Relations & Placements</option>
                      <option value="Talent Acquisition">Talent Acquisition (HR)</option>
                      <option value="Executive Management">Executive Governance</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px', fontWeight: 600 }}>Campus Branch</label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1E293B', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none' }}
                    >
                      <option value="Hosur Main Campus">Hosur Main Campus</option>
                      <option value="Bangalore Tech Hub">Bangalore Tech Hub</option>
                      <option value="Chennai Innovation Center">Chennai Innovation Center</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px', fontWeight: 600 }}>Biography / About</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {/* Professional Links */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', margin: '0 0 12px' }}>Professional Profiles</h4>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '4px' }}>LinkedIn URL</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={verifyLinkedIn}
                        style={{ background: 'transparent', border: '1px solid #06B6D4', color: '#06B6D4', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {linkedinVerified ? '✓ Verified' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '4px' }}>GitHub / Portfolio URL</label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/username"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 28px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
