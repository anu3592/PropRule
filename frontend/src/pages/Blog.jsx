import React, { useEffect, useState } from 'react';
import { BookOpen, User, Calendar, ArrowRight, X } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    trackEvent('visit', 'Blog Page', '/blog');
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (err) {
        console.error('Error fetching blogs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handlePostClick = (post) => {
    trackEvent('cta_click', `Read Post: ${post.title}`, `/blog/${post.id}`);
    setActivePost(post);
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '3rem', maxWidth: '900px' }}>
        <div style={{ margin: '1rem 0 2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-hi)', marginBottom: '0.5rem' }}>
            <BookOpen size={14} /> Rules Intelligence Blog
          </div>
          <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>PropRules Articles</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Deep-dives into prop trading contracts, drawdown math calculations, and hidden pitfalls to look out for.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[1, 2].map(n => (
              <div key={n} className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No articles found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Check back later for new insights.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
            {blogs.map(post => (
              <article
                key={post.id}
                onClick={() => handlePostClick(post)}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, border-color 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
                className="firm-card"
              >
                <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> {post.author}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {post.date}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)' }}>{post.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{post.summary}</p>
                <button
                  className="btn-ghost"
                  style={{
                    alignSelf: 'flex-start',
                    padding: 0,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--accent-hi)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Read full article <ArrowRight size={14} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* FULL POST DRAWER / DIALOG */}
      {activePost && (
        <>
          <div
            onClick={() => setActivePost(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 999
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '10vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              zIndex: 1000,
              overflowY: 'auto',
              boxShadow: 'var(--shadow)'
            }}
          >
            <button
              onClick={() => setActivePost(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> {activePost.author}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {activePost.date}</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', lineHeight: 1.25 }}>{activePost.title}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {activePost.content}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;
