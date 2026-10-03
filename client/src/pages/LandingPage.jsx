import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pv-bg)', color: '#fff' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        paddingTop: '140px',
        paddingBottom: '80px',
        background: 'var(--pv-gradient-hero)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(79,70,229,0.25)',
              border: '1px solid rgba(79,70,229,0.4)',
              color: '#A5B4FC',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '20px'
            }}>
              <span className="pulse-dot"></span>
              ⚡ Prime Vector Private Limited | Official MERN LMS
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px' }}>
              Bridging Academics & Industry with <span className="gradient-text">Prime Vector</span>
            </h1>

            <p style={{ color: 'var(--pv-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
              Empower your tech career with industry-crafted bootcamps in Artificial Intelligence, Machine Learning, Data Science, Full Stack Web Development, and IoT. Hands-on projects, live internships, and guaranteed campus placement support.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-accent" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                <i className="fa fa-rocket"></i> Get Started Free
              </Link>
              <Link to="/courses" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                <i className="fa fa-book"></i> Explore Bootcamps
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '36px', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--pv-accent)' }}>15,000+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)' }}>Students Trained</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#A5B4FC' }}>120+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)' }}>Hiring Partners</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6EE7B7' }}>96%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)' }}>Placement Record</div>
              </div>
            </div>
          </div>

          {/* Hero Card Visual */}
          <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="badge badge-primary">LIVE BOOTCAMP</span>
              <span className="badge badge-success"><span className="pulse-dot"></span> Active Track</span>
            </div>
            <div style={{
              height: '200px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(6,182,212,0.3) 100%), url("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80") center/cover',
              marginBottom: '20px'
            }}></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Full-Stack MERN & AI Agent Integration</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)', marginBottom: '16px' }}>
              Module 4 of 6 · Hosur Innovation Hub Capstone
            </p>
            <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'var(--pv-gradient-accent)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate About */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '12px' }}>CORPORATE ACADEMY</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Prime Vector Private Limited</h2>
          <p style={{ color: 'var(--pv-text-muted)', maxWidth: '650px', margin: '12px auto 0' }}>
            Headquartered in Hosur, Tamil Nadu (<a href="https://primevector.in/" target="_blank" rel="noreferrer" style={{ color: 'var(--pv-accent)', textDecoration: 'underline' }}>primevector.in</a>), we specialize in next-gen skill development, university campus drives, and enterprise tech bootcamps.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💻</div>
            <h3 style={{ marginBottom: '8px' }}>Try It Yourself IDE</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)' }}>Practice W3Schools style tutorials, Python, C++, Java, and MERN JavaScript with automated scoring and instant execution output.</p>
          </div>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💼</div>
            <h3 style={{ marginBottom: '8px' }}>Campus Placement Drives</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)' }}>Direct campus drives with partner universities & mock interview scheduling.</p>
          </div>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏆</div>
            <h3 style={{ marginBottom: '8px' }}>ISO Verified Certificates</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)' }}>Earn cryptographically verified QR-coded Prime Vector certificates backed by industry partners.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
