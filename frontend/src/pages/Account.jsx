import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Star, Target, ShieldAlert, Award, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { trackEvent } from '../utils/analytics';

const Account = () => {
  const { user, token, toggleWatchlist } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [allFirms, setAllFirms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent('visit', 'Account Dashboard', '/account');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFirms = async () => {
      try {
        const res = await fetch('/api/firms');
        if (res.ok) {
          const data = await res.json();
          setAllFirms(data);
        }
      } catch (err) {
        console.error('Error fetching watchlist firms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFirms();
  }, [token, navigate]);

  const handleWatchlistRemove = async (e, firmId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWatchlist(firmId);
      showToast('Removed from watchlist.', 'success');
    } catch (err) {
      showToast(err.message || 'Error updating watchlist.', 'error');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  if (!user) {
    return null;
  }

  // Get user watchlist firms
  const watchlistFirms = allFirms.filter(f => user.watchlist?.includes(f.id));

  // Determine user parameters
  const userProfile = user.lastQuizProfile;
  const userMatches = user.lastQuizMatches || [];

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        {/* ACCOUNT HEADER */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-glow)',
              color: 'var(--accent-hi)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <User size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{user.email}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-secondary)'
                }}
              >
                <Award size={12} /> Membership: {user.role === 'admin' ? 'Administrator' : 'Standard Trader'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', lgGrid: { gridTemplateColumns: '1.2fr 1fr' } }}>
          {/* WATCHLIST */}
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} fill="var(--accent-hi)" style={{ color: 'var(--accent-hi)' }} /> Saved Watchlist
            </h2>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2].map(n => (
                  <div key={n} className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }} />
                ))}
              </div>
            ) : watchlistFirms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <Star size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                <h3>Your watchlist is empty</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Save firms to watch their rules updates.</p>
                <Link to="/firms" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Browse Directory</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {watchlistFirms.map(firm => (
                  <div
                    key={firm.id}
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{firm.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{firm.tagline}</p>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        <span>Max Split: {firm.profitSplit}%</span>
                        <span>Daily DD: {firm.rules.dailyDd}%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/compare?c1=${firm.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-md)' }}>Rules</Link>
                      <button onClick={(e) => handleWatchlistRemove(e, firm.id)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-md)', color: 'var(--danger)', borderColor: 'var(--border)' }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QUIZ MATCH HISTORY */}
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} style={{ color: 'var(--accent-hi)' }} /> Latest Quiz Results
            </h2>

            {userProfile ? (
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Your Trader Profile</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {Object.entries(userProfile).map(([qId, option]) => (
                    <span key={qId} style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {option.text.split('(')[0].trim()}
                    </span>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Matching Recommendations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {userMatches.slice(0, 3).map((match, idx) => (
                    <div key={match.firmId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx < 2 ? '1px solid var(--border)' : 'none', paddingBottom: idx < 2 ? '0.75rem' : '0' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{idx + 1}. {match.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Rate: {match.score}%</span>
                      </div>
                      <Link to={`/compare?c1=${match.firmId}`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: 'var(--radius-md)' }}>Rules</Link>
                    </div>
                  ))}
                </div>

                <Link to="/find-my-firm" className="btn btn-primary" style={{ width: '100%', padding: '0.65rem', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                  Retake Finder Quiz &rarr;
                </Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <Target size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                <h3>No quiz profile yet</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Find which prop firm fits your personal strategy and restrictions.</p>
                <Link to="/find-my-firm" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Take Firm Finder Quiz</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
