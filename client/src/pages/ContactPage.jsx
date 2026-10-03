import React from 'react';
import Navbar from '../components/Navbar';

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pv-bg)', color: '#fff' }}>
      <Navbar />

      <main style={{ paddingTop: '100px', paddingBottom: '40px', maxWidth: '1100px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '8px' }}>HOSUR CORPORATE OFFICE</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Contact Prime Vector Private Limited</h1>
          <p style={{ color: 'var(--pv-text-muted)' }}>Get in touch with our admissions, placement cell, or university partnership team.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px' }}>
          {/* Office Details */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--pv-accent)' }}>Corporate Headquarters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
              <div>
                <strong>📍 Address:</strong>
                <p style={{ color: 'var(--pv-text-muted)', marginTop: '4px' }}>
                  No. 74/22f11, 3rd Floor, HV Arcade, Bagalur Road, Hosur, Krishnagiri, Tamil Nadu - 635109
                </p>
              </div>
              <div>
                <strong>📞 Phone:</strong>
                <p style={{ color: 'var(--pv-text-muted)', marginTop: '4px' }}>+91 8220082896</p>
              </div>
              <div>
                <strong>✉️ Email:</strong>
                <p style={{ color: 'var(--pv-text-muted)', marginTop: '4px' }}>primevectorprivatelimited@gmail.com</p>
              </div>
              <div>
                <strong>🌐 Official Domain:</strong>
                <p style={{ color: 'var(--pv-accent)', marginTop: '4px' }}>
                  <a href="https://primevector.in/" target="_blank" rel="noreferrer">https://primevector.in/</a>
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Send an Inquiry</h3>
            <form onSubmit={e => { e.preventDefault(); alert('Inquiry submitted successfully! A Prime Vector academic advisor will contact you.'); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Your Name</label>
                <input type="text" required placeholder="Full Name" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--pv-border)', background: 'var(--pv-bg)', color: '#fff' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input type="email" required placeholder="your@email.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--pv-border)', background: 'var(--pv-bg)', color: '#fff' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Message</label>
                <textarea rows="4" required placeholder="Tell us about your skill training or hiring requirements..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--pv-border)', background: 'var(--pv-bg)', color: '#fff', resize: 'none' }}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
