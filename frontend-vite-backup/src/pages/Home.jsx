import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ChevronDown, FileText, AlertTriangle, CalendarClock, Shield, Plus, Star } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const { user, toggleWatchlist } = useAuth();
  const { showToast } = useToast();
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    trackEvent('visit', 'Home Page', '/');
    const fetchFirms = async () => {
      try {
        const res = await fetch('/api/firms');
        if (res.ok) {
          const data = await res.json();
          // Take only popular/active ones
          setFirms(data.filter(f => f.status === 'Active').slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured firms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFirms();
  }, []);

  const handleCtaClick = (buttonText, dest) => {
    trackEvent('cta_click', buttonText, dest);
  };

  const handleWatchlistToggle = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please log in to save firms to your watchlist.', 'warn');
      return;
    }
    try {
      const isSaved = await toggleWatchlist(id);
      showToast(isSaved ? 'Added to watchlist' : 'Removed from watchlist', 'success');
    } catch (err) {
      showToast(err.message || 'Error updating watchlist', 'error');
    }
  };

  const toggleAccordion = (index) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const faqs = [
    {
      q: "What is a hidden rule in prop trading?",
      a: "A hidden rule is a condition buried inside a firm's terms of service that isn't highlighted in their main marketing pages. Common examples include consistency rules, news trading windows, weekend holding restrictions, and IP address logging limits. Breaching these causes automatic account termination, often without refund."
    },
    {
      q: "How does PropRules stay updated?",
      a: "Our community and research team monitor official prop firm Discord announcements, website updates, and legal changes. We update the rule database weekly. However, since firms can change rules suddenly, we recommend checking the official source before buying."
    },
    {
      q: "Is PropRules associated with any prop firm?",
      a: "No. PropRules is completely independent and unbiased. We do not offer financial advice, nor do we run a prop firm. We exist solely to help traders find transparent rules and avoid losing their payouts."
    }
  ];

  return (
    <div style={{ paddingTop: '64px' }} className="bg-grid">
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '5rem 1.5rem 4rem',
        }}
      >
        {/* 3-column hero layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr 200px',
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px',
          alignItems: 'center',
        }}>

          {/* LEFT CARDS */}
          <div aria-hidden="true" className="hero-side-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="rule-card" style={{ animation: 'float 7s ease-in-out infinite', width: '100%' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Daily Drawdown</div>
              <div style={{ color: 'var(--warn)', fontWeight: 700, fontSize: '0.9rem' }}>5% — STRICT</div>
            </div>
            <div className="rule-card" style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '0.8s', width: '100%' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>News Trading</div>
              <div style={{ color: 'var(--warn)', fontWeight: 700, fontSize: '0.9rem' }}>Restricted</div>
            </div>
          </div>

          {/* CENTER: HERO CONTENT */}
          <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
            <div
              className="hero-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: 'var(--accent-glow)',
                color: 'var(--accent-hi)',
                border: '1px solid rgba(20,184,166,0.25)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.5rem'
              }}
            >
              <ShieldCheck size={14} />
              Trusted by traders worldwide
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Stop Losing Payouts.<br />
              Know The <span style={{ color: 'var(--accent-hi)' }}>Rules</span> Before You Trade.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2rem' }}>
              We research and simplify prop firm rules so you never get blindsided by hidden clauses, vague conditions, or silent rule changes.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <Link
                to="/compare"
                onClick={() => handleCtaClick('Compare Prop Firms', '/compare')}
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
              >
                Compare Prop Firms
              </Link>
              <Link
                to="/find-my-firm"
                onClick={() => handleCtaClick('Find My Firm', '/find-my-firm')}
                className="btn btn-outline"
                style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
              >
                Find My Firm Quiz
              </Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} style={{ color: 'var(--accent-hi)' }} /> 15+ Firms Covered</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} style={{ color: 'var(--accent-hi)' }} /> Always Updated</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} style={{ color: 'var(--accent-hi)' }} /> Independent &amp; Unbiased</span>
            </div>
          </div>

          {/* RIGHT CARDS */}
          <div aria-hidden="true" className="hero-side-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="rule-card" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1.5s', width: '100%' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Profit Split</div>
              <div style={{ color: 'var(--success-text)', fontWeight: 700, fontSize: '0.9rem' }}>Up to 95%</div>
            </div>
            <div className="rule-card" style={{ animation: 'float 7.5s ease-in-out infinite', animationDelay: '2s', width: '100%' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Consistency Rule</div>
              <div style={{ color: 'var(--warn)', fontWeight: 700, fontSize: '0.9rem' }}>Yes — Hidden</div>
            </div>
          </div>

        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', opacity: 0.4 }} aria-hidden="true">
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Scroll Down</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section style={{ backgroundColor: 'var(--bg-alt)', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-hi)', marginBottom: '0.75rem' }}>The Problem</div>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Why Do Traders Lose Payouts?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' }}>
              Prop firms make money when you fail. Rules are intentionally complex, buried, and subject to change without notice.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderTop: '2px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-hi)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Rules Buried in Fine Print</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Critical trading conditions are hidden inside 20-page legal contracts. Many traders violate these rules before ever reading them.
              </p>
            </div>
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderTop: '2px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-hi)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <AlertTriangle size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Vague Consistency Clauses</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Subjective terms like 'fair trading style' give firms absolute authority to deny payout requests without objective proof.
              </p>
            </div>
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderTop: '2px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-hi)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CalendarClock size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Rules Change Mid-Challenge</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Firms often silently alter drawdown limits, leverage parameters, or EA permissions while users are actively trading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED FIRMS */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-hi)', marginBottom: '0.75rem' }}>Prop Firms</div>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Popular Firms — Rules Simplified</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' }}>
              Examine key stats and verified rule criteria for leading prop firms.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3].map(n => (
                <div key={n} className="firm-card skeleton" style={{ height: '300px', borderColor: 'transparent' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {firms.map(firm => {
                const userWatchlist = user?.watchlist || [];
                const isSaved = userWatchlist.includes(firm.id);
                return (
                  <div key={firm.id} className="firm-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {firm.name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{firm.tagline}</p>
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
                        title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star size={20} fill={isSaved ? 'var(--accent-hi)' : 'none'} className={isSaved ? 'star-bounce' : ''} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
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
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Max Acct</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatCurrency(firm.maxAccount)}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Max Split</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{firm.profitSplit}%</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Payouts</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{(firm.rules?.payoutFreq || '—').split('/')[0]}</span>
                      </div>
                    </div>

                    {firm.hiddenRules.length > 0 ? (
                      <div className="hidden-rules-indicator flagged" style={{ color: 'var(--warn)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)' }}>
                        Hidden rules flagged
                      </div>
                    ) : (
                      <div className="hidden-rules-indicator clean" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)' }}>
                        No hidden rules reported
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <Link to="/compare" onClick={() => handleCtaClick('Compare Card', '/compare')} className="btn btn-outline btn-full" style={{ padding: '0.5rem 0', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>Compare</Link>
                      <Link to="/compare" onClick={() => handleCtaClick('View Rules Card', '/compare')} className="btn btn-primary btn-full" style={{ padding: '0.5rem 0', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>View Rules</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/firms" onClick={() => handleCtaClick('View All Firms', '/firms')} className="btn btn-outline" style={{ padding: '0.8rem 1.8rem' }}>
              Browse All Prop Firms &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* AI MATCH TEASER */}
      <section style={{ backgroundColor: 'var(--bg-alt)', padding: '6rem 0' }}>
        <div className="container">
          <div
            className="match-inner"
            style={{
              background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%)',
              border: '1px solid rgba(20,184,166,0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '4rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>Which Prop Firm Fits Your Trading Style?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem', position: 'relative', zIndex: 1 }}>
              Take our interactive quiz. We check daily drawdowns, consistency factors, news trading limits, and overnight hold restrictions against your actual habits to find your matches.
            </p>
            <Link
              to="/find-my-firm"
              onClick={() => handleCtaClick('Start Finder Quiz', '/find-my-firm')}
              className="btn btn-primary btn-arrow"
              style={{ position: 'relative', zIndex: 1, padding: '0.9rem 2rem' }}
            >
              Start Firm Finder &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-hi)', marginBottom: '0.75rem' }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <button
                    onClick={() => toggleAccordion(i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '1.2rem 0',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? '300px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.35s ease'
                    }}
                  >
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', paddingBottom: '1.25rem', lineHeight: 1.7 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
