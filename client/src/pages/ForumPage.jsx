import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Full Stack');
  const [newTags, setNewTags] = useState('React, Architecture');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/forum/posts');
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch {
      // Fallback
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/forum/posts/${postId}/upvote`);
      if (res.data.success) {
        setPosts(posts.map(p => p.id === postId ? { ...p, upvotes: res.data.upvotes } : p));
      }
    } catch {
      // Optimistic update
      setPosts(posts.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
    }
  };

  const handleSendReply = async (postId) => {
    const text = replyText[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/forum/posts/${postId}/reply`, {
        content: text.trim(),
        author: user?.name || 'Alex Johnson',
        authorRole: user?.role || 'student',
        isVerifiedInstructor: ['trainer', 'mentor', 'super_admin'].includes(user?.role)
      });
      if (res.data.success) {
        setPosts(posts.map(p => p.id === postId ? res.data.post : p));
        setReplyText({ ...replyText, [postId]: '' });
      }
    } catch {
      setNotification('Failed to post reply.');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await axios.post('http://localhost:5000/api/forum/posts', {
        title: newTitle,
        content: newContent,
        category: newCategory,
        tags: tagsArray,
        author: user?.name || 'Alex Johnson',
        authorRole: user?.role || 'student'
      });
      if (res.data.success) {
        setPosts([res.data.post, ...posts]);
        setShowNewPostModal(false);
        setNewTitle('');
        setNewContent('');
        setNotification('Discussion thread published to community!');
        setTimeout(() => setNotification(''), 4000);
      }
    } catch {
      setNotification('Failed to publish discussion thread.');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F19', color: '#F3F4F6' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '36px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06B6D4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <span>COLLABORATION & KNOWLEDGE</span>
              <span>•</span>
              <span>PEER & MENTOR DISCUSSIONS</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
              Technical Discussion Forum
            </h1>
            <p style={{ color: '#9CA3AF', margin: '6px 0 0', fontSize: '0.95rem' }}>
              Connect with fellow developers, ask questions on architectural patterns, and get verified answers from instructors.
            </p>
          </div>

          <button
            onClick={() => setShowNewPostModal(true)}
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 22px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>+ Start New Discussion</span>
          </button>
        </div>

        {notification && (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#10B981', padding: '12px 18px', borderRadius: '10px', marginBottom: '24px', fontWeight: 600 }}>
            {notification}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Full Stack', 'AI & ML', 'Placements', 'General'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'linear-gradient(135deg, #4F46E5, #06B6D4)' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: '#FFF',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search questions, topics, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              minWidth: '280px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#FFF',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Discussions List */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            return (
              <div
                key={post.id}
                style={{
                  background: 'linear-gradient(145deg, #131B2E 0%, #0F172A 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  {/* Upvote Column */}
                  <button
                    onClick={() => handleUpvote(post.id)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#FFF',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>▲</span>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#06B6D4' }}>{post.upvotes}</span>
                  </button>

                  {/* Main Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: '#FFF'
                        }}>
                          {post.authorAvatar || 'U'}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>{post.author}</span>
                        <span style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'capitalize' }}>({post.authorRole})</span>
                      </div>

                      <span style={{
                        background: 'rgba(6,182,212,0.12)',
                        color: '#06B6D4',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {post.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', margin: '0 0 10px' }}>
                      {post.title}
                    </h3>

                    <p style={{ color: '#D1D5DB', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 16px' }}>
                      {post.content}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      {/* Tags */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {post.tags?.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              color: '#9CA3AF',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Reply Toggle */}
                      <button
                        onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#38BDF8',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>💬 {post.replies?.length || 0} Replies</span>
                        <span>{isExpanded ? '▲' : '▼'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Replies Section */}
                {isExpanded && (
                  <div style={{ marginTop: '22px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', paddingLeft: '56px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '14px' }}>
                      Thread Responses ({post.replies?.length || 0})
                    </h4>

                    {/* Replies List */}
                    <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
                      {post.replies?.map((rep) => (
                        <div
                          key={rep.id}
                          style={{
                            background: rep.isVerifiedInstructor ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${rep.isVerifiedInstructor ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: '12px',
                            padding: '16px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: rep.isVerifiedInstructor ? 'linear-gradient(135deg, #10B981, #059669)' : '#4B5563',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.72rem',
                                color: '#FFF',
                                fontWeight: 700
                              }}>
                                {rep.authorAvatar || 'U'}
                              </div>
                              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FFF' }}>{rep.author}</span>
                              {rep.isVerifiedInstructor && (
                                <span style={{
                                  background: 'rgba(16,185,129,0.2)',
                                  color: '#10B981',
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  fontSize: '0.68rem',
                                  fontWeight: 800
                                }}>
                                  ✓ VERIFIED INSTRUCTOR
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                              {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>

                          <p style={{ color: '#D1D5DB', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                            {rep.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add Reply Input */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Contribute your insight or answer..."
                        value={replyText[post.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply(post.id)}
                        style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          color: '#FFF',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => handleSendReply(post.id)}
                        style={{
                          background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 18px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Start New Discussion Modal */}
        {showNewPostModal && (
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
              maxWidth: '560px',
              width: '100%',
              padding: '28px'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 8px', color: '#FFF' }}>
                Start a New Discussion
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: '0 0 18px' }}>
                Post technical queries, architectural dilemmas, or placement interview strategies.
              </p>

              <form onSubmit={handleCreatePost}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Discussion Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. How does garbage collection work in V8 engine?"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none' }}
                  >
                    <option value="Full Stack">Full Stack Development</option>
                    <option value="AI & ML">AI, Machine Learning & LLMs</option>
                    <option value="Placements">Placements & Careers</option>
                    <option value="General">General Discussion</option>
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. Node.js, V8, Performance"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '6px' }}>Detailed Question / Context</label>
                  <textarea
                    rows={4}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Describe your question, provide code snippets or error logs..."
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: 'none', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#FFF', border: 'none', borderRadius: '8px', padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Publish Post
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
