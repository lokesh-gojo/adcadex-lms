import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password, role);
    if (res.success) {
      navigate(`/${role}`);
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pv-gradient-hero)', padding: '24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '40px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, textAlign: 'center', marginBottom: '6px' }}>Join Prime Vector LMS</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)', textAlign: 'center', marginBottom: '24px' }}>Create an account to access MERN stack bootcamps</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your Name" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--pv-border)', background: 'var(--pv-bg)', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--pv-border)', background: 'var(--pv-bg)', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--pv-border)', background: 'var(--pv-bg)', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Account Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--pv-border)', background: 'var(--pv-bg)', color: '#fff' }}>
              <option value="student">Student</option>
              <option value="faculty">Faculty / Trainer</option>
              <option value="admin">Administrator</option>
              <option value="hr">Recruiter / HR</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--pv-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--pv-accent)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
