import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TutorialPage() {
  const navigate = useNavigate();

  const lessons = [
    {
      id: 'html-intro',
      category: 'HTML5',
      title: 'HTML5 Introduction & Syntax',
      summary: 'HTML is the standard markup language for Web pages.',
      code: `<!DOCTYPE html>
<html>
<head>
  <title>Prime Vector Page</title>
</head>
<body>
  <h1>My First Heading</h1>
  <p>Welcome to Prime Vector Private Limited.</p>
</body>
</html>`
    },
    {
      id: 'react-intro',
      category: 'React.js (MERN)',
      title: 'React Components & JSX Syntax',
      summary: 'React lets you build user interfaces out of individual pieces called components.',
      code: `function WelcomeMessage() {
  return (
    <div className="card">
      <h1>Hello, MERN Student!</h1>
      <p>Welcome to Prime Vector React Training.</p>
    </div>
  );
}`
    },
    {
      id: 'express-intro',
      category: 'Express.js (MERN)',
      title: 'Express REST API Routing',
      summary: 'Express is a minimal and flexible Node.js web application framework.',
      code: `const express = require('express');
const app = express();

app.get('/api/greeting', (req, res) => {
  res.json({ message: "Hello from Prime Vector Backend!" });
});

app.listen(5000);`
    },
    {
      id: 'mongo-intro',
      category: 'MongoDB (MERN)',
      title: 'Mongoose Schemas & CRUD Queries',
      summary: 'MongoDB is a document-based distributed database designed for modern apps.',
      code: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
});

const User = mongoose.model('User', userSchema);`
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeLesson = lessons[activeIdx];

  const handleTryIt = (codeSnippet) => {
    navigate('/compiler', { state: { initialCode: codeSnippet } });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pv-bg)', color: '#fff' }}>
      <Navbar />

      <div style={{ paddingTop: '100px', display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        {/* W3Schools Style Topic Sidebar */}
        <aside style={{
          width: '280px',
          background: '#070A11',
          borderRight: '1px solid var(--pv-border)',
          padding: '24px 16px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            📚 MERN & Web Tutorials
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {lessons.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeIdx === idx ? 600 : 400,
                  color: activeIdx === idx ? '#fff' : 'var(--pv-text-muted)',
                  background: activeIdx === idx ? 'var(--pv-primary)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{item.title}</span>
                <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>{item.category}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Lesson Content Area */}
        <main style={{ flex: 1, padding: '40px 48px', maxWidth: '960px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>{activeLesson.category} TUTORIAL</span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{activeLesson.title}</h1>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                disabled={activeIdx === 0}
                onClick={() => setActiveIdx(prev => prev - 1)}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                ❮ Previous
              </button>
              <button
                disabled={activeIdx === lessons.length - 1}
                onClick={() => setActiveIdx(prev => prev + 1)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Next ❯
              </button>
            </div>
          </div>

          <p style={{ color: 'var(--pv-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            {activeLesson.summary}
          </p>

          {/* W3Schools Style Example Box */}
          <div className="glass-panel" style={{ padding: '24px', background: '#0D131F', borderLeft: '5px solid #04AA6D', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#04AA6D' }}>W3Schools Example Reference</h3>
            <pre style={{
              background: '#05080E',
              padding: '16px',
              borderRadius: '8px',
              color: '#38BDF8',
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.9rem',
              overflowX: 'auto',
              marginBottom: '16px'
            }}>
              {activeLesson.code}
            </pre>
            <button className="btn" style={{ background: '#04AA6D', color: '#fff', padding: '10px 20px', fontWeight: 700 }} onClick={() => handleTryIt(activeLesson.code)}>
              Try It Yourself ❯
            </button>
          </div>

          {/* Quick Knowledge Check Quiz */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Test Yourself With Exercises</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)', marginBottom: '16px' }}>What is the primary role of this component in the MERN architecture?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => alert('Correct! 10 XP awarded.')}>A) Front-end UI Rendering</button>
              <button className="btn btn-outline" onClick={() => alert('Try again!')}>B) Database Storage</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
