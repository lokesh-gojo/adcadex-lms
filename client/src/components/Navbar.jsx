import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 900,
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      background: 'rgba(11, 15, 25, 0.75)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--pv-gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(79,70,229,0.4)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--pv-font-display)' }}>
            PRIME <span style={{ color: 'var(--pv-accent)' }}>VECTOR</span>
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>About</Link>
          <Link to="/tutorials" style={{ color: '#04AA6D', fontSize: '0.9rem', fontWeight: 700 }}>Tutorials 📚</Link>
          <Link to="/courses" style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Bootcamps</Link>
          <Link to="/compiler" style={{ color: 'var(--pv-accent)', fontSize: '0.9rem', fontWeight: 700 }}>Try It Yourself ❯</Link>
          <Link to="/placements" style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Placements</Link>
          <Link to="/contact" style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Contact</Link>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <Link to={`/${user.role}`} className="btn btn-outline" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                Dashboard ({user.name})
              </Link>
              <button onClick={logout} className="btn" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', padding: '7px 14px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn" style={{ color: 'var(--pv-text-muted)' }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary">Join LMS</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
