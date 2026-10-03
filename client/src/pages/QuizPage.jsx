import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function QuizPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('React Hooks & Concurrent Mode');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiLoading, setAiLoading] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    let timer;
    if (activeQuiz && !result && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, result, timeLeft]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/quizzes');
      if (res.data.success) {
        setQuizzes(res.data.quizzes);
      }
    } catch {
      setQuizzes([
        { id: "quiz-1", title: "JavaScript & Modern ES6+ Architecture", course: "Full Stack Engineering", category: "Frontend", durationMins: 10, passingScore: 70, totalQuestions: 5 },
        { id: "quiz-2", title: "Generative AI, Transformers & LLM Prompting", course: "Applied AI & Machine Learning Engineering", category: "AI & ML", durationMins: 15, passingScore: 75, totalQuestions: 4 },
        { id: "quiz-3", title: "Data Structures & Algorithmic Complexity", course: "Competitive DSA & Algorithms Mastery", category: "Algorithms", durationMins: 12, passingScore: 70, totalQuestions: 4 }
      ]);
    }
  };

  const startQuiz = async (quizId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/${quizId}`);
      if (res.data.success) {
        setActiveQuiz(res.data.quiz);
        setCurrentQIndex(0);
        setAnswers({});
        setResult(null);
        setTimeLeft(res.data.quiz.durationMins * 60);
      }
    } catch {
      setNotification('Failed to launch assessment engine.');
    }
  };

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/quizzes/${activeQuiz.id}/submit`, {
        answers
      });
      if (res.data.success) {
        setResult(res.data);
      }
    } catch {
      setNotification('Failed to submit assessment answers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAiQuiz = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/quiz-generator', {
        topic: aiTopic,
        difficulty: aiDifficulty,
        count: 3
      });
      if (res.data.success) {
        const customQuiz = {
          id: `ai-quiz-${Date.now()}`,
          title: `AI Generated: ${res.data.topic}`,
          course: 'Custom AI Diagnostic',
          category: 'Adaptive AI',
          durationMins: 8,
          passingScore: 70,
          questions: res.data.questions
        };
        setActiveQuiz(customQuiz);
        setCurrentQIndex(0);
        setAnswers({});
        setResult(null);
        setTimeLeft(8 * 60);
        setShowAiModal(false);
      }
    } catch {
      setNotification('AI quiz generation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F19', color: '#F3F4F6' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '36px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06B6D4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <span>ACADEMIC EVALUATION</span>
              <span>•</span>
              <span>TIMED TECHNICAL ASSESSMENTS</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
              Skill Quizzes & Benchmark Tests
            </h1>
            <p style={{ color: '#9CA3AF', margin: '6px 0 0', fontSize: '0.95rem' }}>
              Validate your technical competency, earn XP points, and qualify for placement drives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowAiModal(true)}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                color: '#FFF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>✨ AI Quiz Generator</span>
            </button>
          </div>
        </div>

        {notification && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#EF4444', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600 }}>
            {notification}
          </div>
        )}

        {/* ── Active Quiz Session ── */}
        {activeQuiz && !result && (
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
            {/* Top Bar with Timer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '18px', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span style={{ background: 'rgba(6,182,212,0.15)', color: '#06B6D4', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {activeQuiz.category}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFF', margin: '8px 0 0' }}>
                  {activeQuiz.title}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  background: timeLeft < 120 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${timeLeft < 120 ? '#EF4444' : 'rgba(255,255,255,0.12)'}`,
                  color: timeLeft < 120 ? '#EF4444' : '#FFF',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>⏱️</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>

                <button
                  onClick={() => setActiveQuiz(null)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#9CA3AF', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' }}
                >
                  Exit Quiz
                </button>
              </div>
            </div>

            {/* Question Progress Dots */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {activeQuiz.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    border: currentQIndex === idx ? '2px solid #06B6D4' : '1px solid rgba(255,255,255,0.1)',
                    background: answers[q.id] !== undefined ? '#4F46E5' : 'rgba(255,255,255,0.04)',
                    color: '#FFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Current Question Box */}
            {activeQuiz.questions[currentQIndex] && (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '6px' }}>
                  Question {currentQIndex + 1} of {activeQuiz.questions.length}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFF', lineHeight: 1.5, marginBottom: '24px' }}>
                  {activeQuiz.questions[currentQIndex].question}
                </h3>

                <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
                  {activeQuiz.questions[currentQIndex].options.map((opt, optIdx) => {
                    const isSelected = answers[activeQuiz.questions[currentQIndex].id] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => selectAnswer(activeQuiz.questions[currentQIndex].id, optIdx)}
                        style={{
                          background: isSelected ? 'rgba(79,70,229,0.2)' : 'rgba(255,255,255,0.03)',
                          border: isSelected ? '2px solid #4F46E5' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          padding: '14px 18px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #4F46E5' : '2px solid rgba(255,255,255,0.3)',
                          background: isSelected ? '#4F46E5' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span style={{ fontSize: '0.95rem', color: isSelected ? '#FFF' : '#D1D5DB' }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: currentQIndex === 0 ? '#4B5563' : '#FFF',
                      borderRadius: '8px',
                      padding: '10px 18px',
                      cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Previous
                  </button>

                  {currentQIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      style={{
                        background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 22px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={isSubmitting}
                      style={{
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 24px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {isSubmitting ? 'Evaluating...' : 'Submit Assessment ✓'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Quiz Evaluation Result ── */}
        {result && (
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '32px', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>
                {result.passed ? '🎉' : '📚'}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', margin: '0 0 6px' }}>
                {result.passed ? 'Assessment Passed with Distinction!' : 'Assessment Completed — Keep Practicing!'}
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', margin: 0 }}>
                {result.feedback}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>FINAL SCORE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: result.passed ? '#10B981' : '#F59E0B' }}>
                    {result.score} / {result.total} ({result.percentage}%)
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>XP EARNED</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#06B6D4' }}>
                    +{result.xpEarned} XP
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Question Review */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF', marginBottom: '18px' }}>
              Detailed Question Analysis & Explanations
            </h3>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '28px' }}>
              {result.review.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: item.isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                    border: `1px solid ${item.isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    borderRadius: '12px',
                    padding: '18px 22px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, color: '#FFF' }}>Question {idx + 1}</span>
                    <span style={{
                      color: item.isCorrect ? '#10B981' : '#EF4444',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {item.isCorrect ? '✓ Correct (+1 pt)' : '✕ Incorrect'}
                    </span>
                  </div>

                  <p style={{ color: '#E5E7EB', fontSize: '0.95rem', margin: '0 0 12px' }}>
                    {item.question}
                  </p>

                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '6px' }}>
                    Your answer: <strong style={{ color: item.isCorrect ? '#10B981' : '#EF4444' }}>{item.userAnswer !== undefined ? item.options[item.userAnswer] : 'No answer'}</strong>
                  </div>

                  {!item.isCorrect && (
                    <div style={{ fontSize: '0.85rem', color: '#10B981', marginBottom: '6px' }}>
                      Correct answer: <strong>{item.options[item.correctIndex]}</strong>
                    </div>
                  )}

                  <div style={{
                    marginTop: '10px',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#D1D5DB'
                  }}>
                    💡 <strong>Explanation:</strong> {item.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button
                onClick={() => {
                  setResult(null);
                  setActiveQuiz(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 28px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Back to All Quizzes
              </button>
            </div>
          </div>
        )}

        {/* ── Quizzes Catalog Grid ── */}
        {!activeQuiz && !result && (
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '18px', color: '#FFF' }}>
              Available Technical Assessments ({quizzes.length})
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  style={{
                    background: 'linear-gradient(145deg, #131B2E 0%, #0F172A 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{
                        background: 'rgba(79,70,229,0.15)',
                        color: '#818CF8',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {quiz.category}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                        Pass: {quiz.passingScore}%
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', margin: '0 0 8px' }}>
                      {quiz.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '16px' }}>
                      Course: {quiz.course}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#D1D5DB' }}>
                      <div>📝 {quiz.totalQuestions} Questions</div>
                      <div>⏱️ {quiz.durationMins} Minutes</div>
                      <div>🏆 +200 XP</div>
                    </div>
                  </div>

                  <button
                    onClick={() => startQuiz(quiz.id)}
                    style={{
                      marginTop: '22px',
                      background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Start Assessment →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Quiz Generator Modal */}
        {showAiModal && (
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
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 8px', color: '#FFF' }}>
                ✨ Prime Vector AI Assessment Generator
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: '0 0 18px' }}>
                Instantly generate a tailored technical test on any topic, framework, or algorithm.
              </p>

              <form onSubmit={handleGenerateAiQuiz}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Test Subject / Topic</label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. React 18, PyTorch, Docker, Binary Trees"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Difficulty Level</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none' }}
                  >
                    <option value="Beginner">Beginner (Foundations)</option>
                    <option value="Medium">Medium (Intermediate Core)</option>
                    <option value="Hard">Hard (Enterprise & Systems)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: 'none', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={aiLoading}
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: '#FFF', border: 'none', borderRadius: '8px', padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {aiLoading ? 'Generating...' : 'Launch AI Quiz'}
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
