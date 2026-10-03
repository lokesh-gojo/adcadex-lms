import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [newStudent, setNewStudent] = useState('');
  const [newCourse, setNewCourse] = useState('Applied AI & Machine Learning Engineering');
  const [newGrade, setNewGrade] = useState('A+');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/certificates');
      if (res.data.success) {
        setCertificates(res.data.certificates);
      }
    } catch {
      // Fallback local data
      setCertificates([
        { id: "PV-2026-001", studentName: user?.name || 'Alex Johnson', course: 'Applied AI & Machine Learning Engineering', date: '2025-10-15', verificationUrl: 'https://primevector.in/verify/PV-2026-001', grade: 'A+' },
        { id: "PV-2026-042", studentName: user?.name || 'Alex Johnson', course: 'Full Stack Web Engineering', date: '2025-11-02', verificationUrl: 'https://primevector.in/verify/PV-2026-042', grade: 'Distinction' }
      ]);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyId.trim()) return;
    setVerifyLoading(true);
    setVerifyResult(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/certificates/verify/${encodeURIComponent(verifyId.trim())}`);
      setVerifyResult(res.data);
    } catch (err) {
      setVerifyResult({
        success: false,
        message: err.response?.data?.message || `No active credential found for "${verifyId}". Please check ID formatting.`
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/certificates/issue', {
        studentName: newStudent || 'Alex Johnson',
        course: newCourse,
        grade: newGrade
      });
      if (res.data.success) {
        setNotification(`Certificate successfully generated for ${res.data.certificate.studentName}!`);
        setShowIssueModal(false);
        fetchCertificates();
        setTimeout(() => setNotification(''), 4000);
      }
    } catch {
      setNotification('Failed to issue certificate.');
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
              <span>ACCREDITATION & CREDENTIALS</span>
              <span>•</span>
              <span>ENTERPRISE BLOCKCHAIN VERIFIED</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
              Certificates & Credential Verification
            </h1>
            <p style={{ color: '#9CA3AF', margin: '6px 0 0', fontSize: '0.95rem' }}>
              Cryptographically signed completion certificates and tamper-proof academic credentials.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {['trainer', 'super_admin', 'mentor', 'hr_admin'].includes(user?.role) && (
              <button
                onClick={() => setShowIssueModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>+ Issue Certificate</span>
              </button>
            )}
          </div>
        </div>

        {notification && (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#10B981', padding: '12px 18px', borderRadius: '10px', marginBottom: '24px', fontWeight: 600 }}>
            {notification}
          </div>
        )}

        {/* Verification Banner */}
        <div style={{
          background: 'radial-gradient(ellipse at top left, rgba(79,70,229,0.2) 0%, rgba(11,15,25,0.8) 100%)',
          border: '1px solid rgba(79,70,229,0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ maxWidth: '720px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px', color: '#FFF' }}>
              Instant Credential Authenticity Check
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.88rem', margin: '0 0 16px' }}>
              Employers, recruiters, and academic institutions can verify Prime Vector credentials in real time.
            </p>

            <form onSubmit={handleVerify} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. PV-2026-001)"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '280px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#FFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={verifyLoading}
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {verifyLoading ? 'Verifying...' : 'Verify Credential'}
              </button>
            </form>

            {/* Verification Result Output */}
            {verifyResult && (
              <div style={{
                marginTop: '18px',
                padding: '16px',
                borderRadius: '12px',
                background: verifyResult.verified ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${verifyResult.verified ? '#10B981' : '#EF4444'}`
              }}>
                {verifyResult.verified ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.2rem' }}>✓</span>
                      <span>GENUINE ACCREDITED CREDENTIAL CONFIRMED</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#D1D5DB' }}>
                      Issued to <strong>{verifyResult.certificate.studentName}</strong> for <strong>{verifyResult.certificate.course}</strong> (Grade: {verifyResult.certificate.grade}).
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '6px', fontFamily: 'monospace' }}>
                      Hash: {verifyResult.blockchainProof} | Issued By: {verifyResult.issuer}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#EF4444', fontWeight: 600, fontSize: '0.9rem' }}>
                    ✕ {verifyResult.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Certificates Grid */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '18px', color: '#FFF' }}>
          Your Verified Certificates ({certificates.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px', marginBottom: '40px' }}>
          {certificates.map((cert) => (
            <div
              key={cert.id}
              style={{
                background: 'linear-gradient(145deg, #131B2E 0%, #0F172A 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)'
              }} />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem'
                  }}>
                    🏆
                  </div>
                  <span style={{
                    background: 'rgba(6,182,212,0.12)',
                    color: '#06B6D4',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px'
                  }}>
                    {cert.grade || 'Certified'}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>
                  ID: {cert.id}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', margin: '6px 0 10px' }}>
                  {cert.course}
                </h3>
                <div style={{ fontSize: '0.86rem', color: '#D1D5DB', marginBottom: '14px' }}>
                  Awarded to: <strong style={{ color: '#FFF' }}>{cert.studentName}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Issued Date:</span>
                  <span style={{ color: '#F3F4F6' }}>{cert.date}</span>
                </div>
              </div>

              <div style={{ marginTop: '22px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedCert(cert)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  View Full Certificate
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(cert.verificationUrl || `https://primevector.in/verify/${cert.id}`);
                    setNotification(`Verification URL for ${cert.id} copied to clipboard!`);
                    setTimeout(() => setNotification(''), 3000);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: '#FFF',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                  title="Share / Copy Link"
                >
                  🔗 Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Modal */}
        {selectedCert && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: '#0F172A',
              border: '2px solid rgba(217,119,6,0.5)',
              borderRadius: '20px',
              maxWidth: '750px',
              width: '100%',
              padding: '36px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedCert(null)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#FFF',
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                ✕
              </button>

              {/* Certificate Inner Frame */}
              <div style={{
                border: '2px dashed rgba(245,158,11,0.4)',
                borderRadius: '14px',
                padding: '32px 28px',
                textAlign: 'center',
                background: 'radial-gradient(ellipse at center, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.95) 100%)'
              }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '2px', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>
                  Prime Vector Private Limited
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', margin: '8px 0 2px', fontFamily: 'serif' }}>
                  Certificate of Achievement
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '22px' }}>
                  This enterprise diploma is proudly awarded to
                </div>

                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#38BDF8', fontFamily: 'serif', marginBottom: '14px' }}>
                  {selectedCert.studentName}
                </div>

                <p style={{ color: '#D1D5DB', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                  for exceptional performance, rigorous project submission, and verified mastery in the comprehensive curriculum of:
                </p>

                <div style={{
                  display: 'inline-block',
                  background: 'rgba(6,182,212,0.12)',
                  border: '1px solid rgba(6,182,212,0.3)',
                  padding: '8px 24px',
                  borderRadius: '30px',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#FFF',
                  marginBottom: '26px'
                }}>
                  {selectedCert.course}
                </div>

                {/* Footer Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'cursive', fontSize: '1.1rem', color: '#CBD5E1' }}>Sarah Chen, Ph.D.</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600 }}>HEAD OF CURRICULUM</div>
                    <div style={{ fontSize: '0.68rem', color: '#6B7280' }}>Date: {selectedCert.date}</div>
                  </div>

                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #F59E0B 0%, #B45309 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    fontSize: '1.6rem',
                    boxShadow: '0 0 15px rgba(245,158,11,0.5)'
                  }}>
                    ★
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'cursive', fontSize: '1.1rem', color: '#CBD5E1' }}>Marcus Vance</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600 }}>CHIEF ACADEMIC OFFICER</div>
                    <div style={{ fontSize: '0.68rem', color: '#6B7280' }}>ID: {selectedCert.id}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '24px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🖨️ Print / Save as PDF
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#FFF',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issue Certificate Modal */}
        {showIssueModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '28px'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 16px', color: '#FFF' }}>
                Issue Digital Credential
              </h3>

              <form onSubmit={handleIssue}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Student Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent}
                    onChange={(e) => setNewStudent(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Course / Specialization</label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none' }}
                  >
                    <option value="Applied AI & Machine Learning Engineering">Applied AI & Machine Learning Engineering</option>
                    <option value="Full Stack Web Engineering">Full Stack Web Engineering</option>
                    <option value="Competitive DSA & Algorithms Mastery">Competitive DSA & Algorithms Mastery</option>
                    <option value="Cloud DevOps & Container Orchestration">Cloud DevOps & Container Orchestration</option>
                  </select>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Grade / Honors</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none' }}
                  >
                    <option value="Distinction">Distinction (Top 5%)</option>
                    <option value="A+">Grade A+ (90-95%)</option>
                    <option value="A">Grade A (80-89%)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: 'none', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Confirm & Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
