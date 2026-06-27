import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Bookmark, Star } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const FindMyFirm = () => {
  const { user, saveQuiz, toggleWatchlist } = useAuth();
  const { showToast } = useToast();

  const [allFirms, setAllFirms] = useState([]);
  const [loadingFirms, setLoadingFirms] = useState(true);

  // Quiz state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    trackEvent('visit', 'Find My Firm Quiz', '/find-my-firm');
    const fetchFirms = async () => {
      try {
        const res = await fetch('/api/firms');
        if (res.ok) {
          const data = await res.json();
          setAllFirms(data.filter(f => f.status === 'Active'));
        }
      } catch (err) {
        console.error('Error fetching firms for quiz', err);
      } finally {
        setLoadingFirms(false);
      }
    };
    fetchFirms();
  }, []);

  const questions = [
    {
      id: 'budget',
      title: 'What is your target challenge fee budget?',
      options: [
        { text: 'Under $400 (Budget Challenges)', value: 'under_400', boosts: ['fpips', 'blue', 'e8'] },
        { text: '$400 – $600 (Standard Challenges)', value: '400_600', boosts: ['ftmo', 'acg', 'tff', 'apex'] },
        { text: 'Above $600 (Large Capital)', value: 'above_600', boosts: ['ftmo', 'tft', 'fundednext'] }
      ]
    },
    {
      id: 'markets',
      title: 'Which markets do you primarily trade?',
      options: [
        { text: 'Forex & Global Indices', value: 'forex', boosts: ['ftmo', 'fundednext', 'tff', 'acg', 'blue', 'e8'] },
        { text: 'CME Futures (Nasdaq, Gold, etc.)', value: 'futures', boosts: ['apex'] },
        { text: 'Crypto Assets', value: 'crypto', boosts: ['fundednext', 'tff', 'tft', 'e8', 'blue'] }
      ]
    },
    {
      id: 'holding',
      title: 'What is your typical trade holding duration?',
      options: [
        { text: 'Scalper (Hold for seconds to minutes)', value: 'scalper', boosts: ['fpips', 'fundednext', 'blue'] },
        { text: 'Day Trader (Close all trades before market close)', value: 'day', boosts: ['ftmo', 'fundednext', 'tff', 'acg', 'e8', 'apex'] },
        { text: 'Swing Trader (Hold for days or weekends)', value: 'swing', boosts: ['ftmo', 'acg', 'fundednext', 'blue'] }
      ]
    },
    {
      id: 'news',
      title: 'How do you trade around high-impact economic news releases?',
      options: [
        { text: 'I actively trade news volatility (News trading allowed)', value: 'trade_news', boosts: ['fundednext', 'tff', 'acg', 'e8', 'fpips', 'blue'] },
        { text: 'I avoid trading during news events (Restrictions are okay)', value: 'avoid_news', boosts: ['ftmo', 'apex'] }
      ]
    },
    {
      id: 'focus',
      title: 'What is your primary preference when choosing a partner firm?',
      options: [
        { text: 'Safety: Low risk, no hidden clauses, reliable payouts', value: 'safety', boosts: ['ftmo', 'acg', 'e8', 'blue'] },
        { text: 'Aggressive: High profit splits, loose parameters, scaling', value: 'split', boosts: ['fundednext', 'tft', 'apex', 'tff'] }
      ]
    }
  ];

  const handleOptionSelect = (option) => {
    const questionId = questions[currentStep].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleNext = () => {
    if (!answers[questions[currentStep].id]) {
      showToast('Please select an option to proceed.', 'warn');
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = async () => {
    trackEvent('quiz_submitted', 'Completed Quiz', '/find-my-firm');

    // Initialize scores
    const scores = {};
    allFirms.forEach(f => {
      scores[f.id] = 0;
    });

    // Score based on selected answer boosts
    Object.entries(answers).forEach(([qId, option]) => {
      option.boosts.forEach(firmId => {
        if (scores[firmId] !== undefined) {
          scores[firmId] += 20; // add weights
        }
      });
    });

    // Sort matching results
    const sortedMatches = Object.entries(scores)
      .map(([firmId, score]) => {
        const firm = allFirms.find(f => f.id === firmId);
        return {
          firmId,
          name: firm?.name || firmId,
          tagline: firm?.tagline || '',
          score: Math.min(score, 100), // Max 100%
          riskScore: firm?.riskScore || 'Low',
          maxAccount: firm?.maxAccount || 200000,
          profitSplit: firm?.profitSplit || 80,
          payoutFreq: firm?.payoutFreq || 'Bi-weekly'
        };
      })
      .sort((a, b) => b.score - a.score);

    setMatches(sortedMatches);
    setQuizFinished(true);

    // Save to user account if logged in
    if (user) {
      const saved = await saveQuiz(answers, sortedMatches);
      if (saved) {
        showToast('Quiz results saved to your dashboard.', 'success');
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setQuizFinished(false);
    setMatches([]);
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

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  if (quizFinished) {
    const topMatch = matches[0];
    const restMatches = matches.slice(1, 4);

    return (
      <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '3rem', maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>Your Prop Firm Matches</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Based on your budget, news preferences, holding periods, and goals.</p>
          </div>

          {/* TOP MATCH */}
          {topMatch && (
            <div
              className="result-card best-match"
              style={{
                backgroundColor: 'var(--surface)',
                border: '2px solid var(--accent-hi)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow)',
                marginBottom: '2rem',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', backgroundColor: 'var(--accent-hi)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                98% Match Rate
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{topMatch.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>{topMatch.tagline}</p>
                </div>
                <button
                  onClick={(e) => handleWatchlistToggle(e, topMatch.firmId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: user?.watchlist?.includes(topMatch.firmId) ? 'var(--accent-hi)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  <Star size={22} fill={user?.watchlist?.includes(topMatch.firmId) ? 'var(--accent-hi)' : 'none'} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', backgroundColor: 'var(--bg-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1.5rem 0' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Profit Split</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{topMatch.profitSplit}%</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Max Capital</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{formatCurrency(topMatch.maxAccount)}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Payout Schedule</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{topMatch?.payoutFreq ? topMatch.payoutFreq.split('/')[0] : '—'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to={`/compare?c1=${topMatch.firmId}`} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>View Verified Rules</Link>
                <button onClick={handleRestart} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={16} /> Retake Quiz
                </button>
              </div>
            </div>
          )}

          {/* OTHER RUNNERS UP */}
          {restMatches.length > 0 && (
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>Other Recommended Fits</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {restMatches.map(m => (
                  <div key={m.firmId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{m.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{m.tagline}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Rate</span>
                        <strong style={{ color: 'var(--accent-hi)' }}>{m.score}%</strong>
                      </div>
                      <Link to={`/compare?c1=${m.firmId}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-md)' }}>Rules</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--warn-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--warn)', marginBottom: '4rem' }}>
              <AlertCircle size={20} />
              <div style={{ fontSize: '0.9rem' }}>
                You are currently logged out. <Link to="/signup" style={{ textDecoration: 'underline', fontWeight: 700 }}>Create an account</Link> or <Link to="/login" style={{ textDecoration: 'underline', fontWeight: 700 }}>Log in</Link> to permanently save these quiz recommendations to your account profile.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const activeQuestion = questions[currentStep];

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '4rem', maxWidth: '640px' }}>
        {/* QUIZ HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-hi)', marginBottom: '0.5rem' }}>
            <Target size={14} /> Firm Finder Wizard
          </div>
          <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Find Your Ideal Prop Firm</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Answer 5 questions. We will audit your habits against actual trading agreements.</p>
        </div>

        {/* PROGRESS BAR */}
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} />
        </div>

        {/* QUESTION PANEL */}
        {loadingFirms ? (
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center' }}>
            <RefreshCw size={24} className="empty-state-icon" style={{ color: 'var(--accent-hi)' }} />
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>Loading comparison parameters...</p>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Question {currentStep + 1} of {questions.length}</span>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{activeQuestion.title}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = answers[activeQuestion.id]?.value === opt.value;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    style={{ padding: '1rem 1.25rem', fontSize: '0.95rem', fontWeight: 500 }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {/* NAV ACTIONS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="btn btn-ghost"
                style={{ opacity: currentStep === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem' }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button
                onClick={handleNext}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.6rem 1.5rem' }}
              >
                {currentStep === questions.length - 1 ? 'Calculate Results' : 'Next'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMyFirm;
