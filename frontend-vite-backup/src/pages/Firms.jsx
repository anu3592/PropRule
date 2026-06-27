import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, Star, AlertCircle, Check } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Firms = () => {
  const { user, toggleWatchlist } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [firms, setFirms] = useState([]);
  const [filteredFirms, setFilteredFirms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [market, setMarket] = useState('All');
  const [challenge, setChallenge] = useState('All');
  const [risk, setRisk] = useState('All');
  const [status, setStatus] = useState('Active');
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [eaOnly, setEaOnly] = useState(false);
  const [sort, setSort] = useState('az');

  useEffect(() => {
    trackEvent('visit', 'Firms Directory', '/firms');
    fetchFirms();
  }, []);

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/firms');
      if (res.ok) {
        const data = await res.json();
        setFirms(data);
      }
    } catch (err) {
      console.error('Error fetching firms', err);
      showToast('Error loading firms directory.', 'error');
    } finally {
      setTimeout(() => setLoading(false), 500); // Shimmer effect delay
    }
  };

  useEffect(() => {
    let result = [...firms];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(q) || f.tagline.toLowerCase().includes(q));
      trackEvent('search_query', search, '/firms');
    }

    // Market filter
    if (market !== 'All') {
      result = result.filter(f => f.markets.includes(market));
    }

    // Challenge type filter
    if (challenge !== 'All') {
      result = result.filter(f => f.challengeTypes.includes(challenge));
    }

    // Risk Score filter
    if (risk !== 'All') {
      result = result.filter(f => f.riskScore === risk);
    }

    // Status filter
    if (status !== 'All') {
      result = result.filter(f => f.status === status);
    }

    // Beginner friendly
    if (beginnerOnly) {
      result = result.filter(f => f.beginnerFriendly === 'Yes');
    }

    // EA Friendly
    if (eaOnly) {
      result = result.filter(f => f.eaFriendly === 'Yes' || f.eaFriendly === 'Allowed');
    }

    // Sorting
    result.sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name);
      if (sort === 'risk_asc') return a.riskVal - b.riskVal;
      if (sort === 'risk_desc') return b.riskVal - a.riskVal;
      if (sort === 'max_desc') return b.maxAccount - a.maxAccount;
      if (sort === 'split_desc') return b.profitSplit - a.profitSplit;
      return 0;
    });

    setFilteredFirms(result);
  }, [firms, search, market, challenge, risk, status, beginnerOnly, eaOnly, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setMarket('All');
    setChallenge('All');
    setRisk('All');
    setStatus('Active');
    setBeginnerOnly(false);
    setEaOnly(false);
    setSort('az');
    showToast('Filters reset.', 'success');
  };

  const handleWatchlistToggle = async (e, firmId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please log in to save firms to your watchlist.', 'warn');
      return;
    }
    try {
      const isSaved = await toggleWatchlist(firmId);
      showToast(isSaved ? 'Added to watchlist' : 'Removed from watchlist', 'success');
    } catch (err) {
      showToast(err.message || 'Error updating watchlist', 'error');
    }
  };

  const handleCompareLink = (firmId) => {
    trackEvent('cta_click', 'Compare Redirect', `/compare?c1=${firmId}`);
    navigate(`/compare?c1=${firmId}`);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ margin: '1rem 0 2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.5rem' }}>All Researched Prop Firms</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '1rem' }}>
            An independent directory focused on rules transparency. We expose hidden clauses and evaluate daily drawdowns to save your account.
          </p>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            We monitor changes frequently, but always double-check the agreements on official channels.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem', mdRow: { display: 'flex', flexDirection: 'row' } }} className="directory-layout">
          {/* SIDEBAR FILTERS */}
          <aside
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              width: '100%',
              alignSelf: 'flex-start',
              position: 'sticky',
              top: '80px',
              zIndex: 10
            }}
            className="filters-sidebar"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Filter size={16} /> Filters</h3>
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-hi)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Reset filters
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Search box */}
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  placeholder="Search firms by name..."
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {/* Markets */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Markets</label>
                <select value={market} onChange={(e) => setMarket(e.target.value)} className="form-control">
                  <option value="All">All Markets</option>
                  <option value="Forex">Forex & Indices</option>
                  <option value="Futures">Futures</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Stocks">Stocks</option>
                </select>
              </div>

              {/* Challenge Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Challenge Type</label>
                <select value={challenge} onChange={(e) => setChallenge(e.target.value)} className="form-control">
                  <option value="All">All Types</option>
                  <option value="1-step">1-step</option>
                  <option value="2-step">2-step</option>
                  <option value="3-step">3-step</option>
                  <option value="Instant">Instant Funding</option>
                </select>
              </div>

              {/* Risk Level */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Level</label>
                <select value={risk} onChange={(e) => setRisk(e.target.value)} className="form-control">
                  <option value="All">All Risk Levels</option>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label className="checkbox-label">
                  <input type="checkbox" checked={beginnerOnly} onChange={(e) => setBeginnerOnly(e.target.checked)} />
                  Show only beginner-friendly
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={eaOnly} onChange={(e) => setEaOnly(e.target.checked)} />
                  Show only EA/Bot friendly
                </label>
              </div>
            </div>
          </aside>

          {/* MAIN LISTING AREA */}
          <main style={{ flexGrow: 1 }} className="listing-area">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-start', smRow: { display: 'flex', flexDirection: 'row', alignItems: 'center' } }} className="listing-toolbar">
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                {loading ? 'Loading firms...' : `Showing ${filteredFirms.length} firm${filteredFirms.length !== 1 ? 's' : ''}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label htmlFor="sortSelect" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort by:</label>
                <select
                  id="sortSelect"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <option value="az">Alphabetical (A–Z)</option>
                  <option value="risk_asc">Risk (Low to High)</option>
                  <option value="risk_desc">Risk (High to Low)</option>
                  <option value="max_desc">Max account size (High to Low)</option>
                  <option value="split_desc">Profit split (High to Low)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="firm-card skeleton" style={{ height: '320px', borderColor: 'transparent' }} />
                ))}
              </div>
            ) : filteredFirms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No firms match these filters.</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or resetting filters.</p>
                <button className="btn btn-outline" onClick={handleResetFilters} style={{ marginTop: '1.5rem' }}>Reset filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }} className="firms-grid">
                {filteredFirms.map(firm => {
                  const isInactive = firm.status === 'Inactive';
                  const userWatchlist = user?.watchlist || [];
                  const isSaved = userWatchlist.includes(firm.id);
                  return (
                    <div key={firm.id} className={`firm-card ${isInactive ? 'inactive' : ''}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {firm.name}
                          </h3>
                          {isInactive && (
                            <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1px solid var(--border)' }}>
                              Suspended
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleWatchlistToggle(e, firm.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: isSaved ? 'var(--accent-hi)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex'
                          }}
                          title="Save to Watchlist"
                        >
                          <Star size={20} fill={isSaved ? 'var(--accent-hi)' : 'none'} className={isSaved ? 'star-bounce' : ''} />
                        </button>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {firm.tagline}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <span className={`badge badge-risk-${firm.riskScore}`} style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
                          Risk: {firm.riskScore}
                        </span>
                        {firm.markets.slice(0, 2).map((m, idx) => (
                          <span key={idx} style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            {m}
                          </span>
                        ))}
                      </div>

                      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem', backgroundColor: 'var(--bg-alt)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Max Acct</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{formatCurrency(firm.maxAccount)}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Max Split</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{firm.profitSplit}%</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Payouts</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{(firm.rules?.payoutFreq || '—').split('/')[0]}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                        <div>EAs: <strong style={{ color: firm.eaFriendly === 'Allowed' || firm.eaFriendly === 'Yes' ? 'var(--success-text)' : 'var(--warn)' }}>{firm.eaFriendly}</strong></div>
                        <div>News: <strong style={{ color: firm.newsFriendly === 'Allowed' || firm.newsFriendly === 'Yes' ? 'var(--success-text)' : 'var(--warn)' }}>{firm.newsFriendly}</strong></div>
                      </div>

                      {(firm.hiddenRules?.length ?? 0) > 0 ? (
                        <div className="hidden-rules-indicator flagged" style={{ color: 'var(--warn)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)' }}>
                          Hidden rules flagged
                        </div>
                      ) : (
                        <div className="hidden-rules-indicator clean" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)' }}>
                          No hidden rules reported
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button onClick={() => handleCompareLink(firm.id)} className="btn btn-primary btn-full" style={{ padding: '0.6rem', fontSize: '0.875rem', borderRadius: 'var(--radius-md)' }}>View Rules</button>
                        <button onClick={() => navigate('/compare')} className="btn btn-outline btn-full" style={{ padding: '0.6rem', fontSize: '0.875rem', borderRadius: 'var(--radius-md)' }}>Compare</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Firms;
