import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Eye, ExternalLink, Activity, RefreshCw, Search, MousePointerClick, Hourglass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { trackEvent } from '../utils/analytics';

const AdminAnalytics = () => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent('visit', 'Admin Analytics Panel', '/admin-analytics');
    if (!token || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchReport();
  }, [user, token, navigate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const report = await res.json();
        setData(report);
      } else {
        throw new Error('Failed to load analytics data.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading report dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getEventTime = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContext: 'center' }}>
        <div style={{ textAlign: 'center', margin: '0 auto' }}>
          <RefreshCw size={32} className="empty-state-icon" style={{ color: 'var(--accent-hi)', animation: 'btnSpin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>Compiling analytics metrics...</p>
        </div>
      </div>
    );
  }

  const { metrics, topSearches, firmClicks, recentEvents } = data || {
    metrics: { totalViews: 0, outboundClicks: 0, ctr: '0%', activeSessions: 0 },
    topSearches: [],
    firmClicks: {},
    recentEvents: []
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', backgroundColor: 'var(--bg-alt)' }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={28} style={{ color: 'var(--accent-hi)' }} /> Platform Analytics
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Real-time user engagement and click tracking.</p>
          </div>
          <button
            onClick={fetchReport}
            className="btn btn-outline"
            style={{ borderRadius: 'var(--radius-md)', padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RefreshCw size={14} /> Refresh Report
          </button>
        </div>

        {/* METRICS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Card 1: Total Visits */}
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-hi)' }}><Eye size={22} /></div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Page Views</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{metrics.totalViews}</strong>
            </div>
          </div>

          {/* Card 2: Outbound Click */}
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-hi)' }}><ExternalLink size={22} /></div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Outbound Clicks</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{metrics.outboundClicks}</strong>
            </div>
          </div>

          {/* Card 3: CTR */}
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-hi)' }}><MousePointerClick size={22} /></div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Conversion (CTR)</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{metrics.ctr}</strong>
            </div>
          </div>

          {/* Card 4: Active unique sessions */}
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-hi)' }}><Hourglass size={22} /></div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Users</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{metrics.activeSessions}</strong>
            </div>
          </div>
        </div>

        {/* DETAILED STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', lgGrid: { gridTemplateColumns: '1fr 1fr' } }}>
          {/* Top searches & Outbound clicks progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Searches */}
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={18} /> Top Search Terms</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topSearches.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>"{s.query}"</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.count} searches</span>
                  </div>
                ))}
                {topSearches.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No search query events logged yet.</p>
                )}
              </div>
            </div>

            {/* Clicks By Firm */}
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ExternalLink size={18} /> Affiliate Clicks by Firm</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(firmClicks).map(([firm, count]) => {
                  const percent = metrics.outboundClicks > 0 ? (count / metrics.outboundClicks) * 100 : 0;
                  return (
                    <div key={firm}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <span style={{ textTransform: 'uppercase' }}>{firm}</span>
                        <span>{count} clicks</span>
                      </div>
                      <div className="match-bar-wrap">
                        <div className="match-bar-fill" style={{ width: `${percent}%`, transition: 'none' }} />
                      </div>
                    </div>
                  );
                })}
                {Object.keys(firmClicks).length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No outbound click events recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> Live Activity Log</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentEvents.map(e => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-alt)', whiteSpace: 'nowrap' }}>
                    {getEventTime(e.timestamp)}
                  </span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{e.type.replace(/_/g, ' ').toUpperCase()}</span>: {e.label || e.url}
                  </div>
                </div>
              ))}
              {recentEvents.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No platform events recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
