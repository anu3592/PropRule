import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Info, ChevronDown, Layers, HelpCircle, Target } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useToast } from '../context/ToastContext';

const Compare = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [allFirms, setAllFirms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected column values
  const [col1, setCol1] = useState('none');
  const [col2, setCol2] = useState('none');
  const [col3, setCol3] = useState('none');
  const [col4, setCol4] = useState('none');

  // Highlights state
  const [showDiffsOnly, setShowDiffsOnly] = useState(false);
  const [highlightRisks, setHighlightRisks] = useState(false);

  useEffect(() => {
    trackEvent('visit', 'Compare Page', '/compare');
    const fetchFirms = async () => {
      try {
        const res = await fetch('/api/firms');
        if (res.ok) {
          const data = await res.json();
          setAllFirms(data);

          // Get pre-selection from query parameters
          const c1Param = searchParams.get('c1');
          const c2Param = searchParams.get('c2');
          const c3Param = searchParams.get('c3');
          const c4Param = searchParams.get('c4');

          if (c1Param && data.some(f => f.id === c1Param)) setCol1(c1Param);
          else if (data.length > 0) setCol1(data[0].id); // Default seed

          if (c2Param && data.some(f => f.id === c2Param)) setCol2(c2Param);
          else if (data.length > 1) setCol2(data[1].id); // Default seed

          if (c3Param && data.some(f => f.id === c3Param)) setCol3(c3Param);
          if (c4Param && data.some(f => f.id === c4Param)) setCol4(c4Param);
        }
      } catch (err) {
        console.error('Error fetching compare firms', err);
        showToast('Error loading comparison parameters.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFirms();
  }, [searchParams]);

  // Track select changes
  const handleSelectChange = (col, val) => {
    trackEvent('compare_selection_change', `Col ${col} changed to ${val}`, '/compare');
    if (col === 1) setCol1(val);
    if (col === 2) setCol2(val);
    if (col === 3) setCol3(val);
    if (col === 4) setCol4(val);
  };

  const handleClearAll = () => {
    setCol1('none');
    setCol2('none');
    setCol3('none');
    setCol4('none');
    showToast('Cleared all selections.', 'success');
  };

  // Get active firms
  const f1 = allFirms.find(f => f.id === col1);
  const f2 = allFirms.find(f => f.id === col2);
  const f3 = allFirms.find(f => f.id === col3);
  const f4 = allFirms.find(f => f.id === col4);

  const activeCols = [
    { id: 1, firm: f1, val: col1 },
    { id: 2, firm: f2, val: col2 },
    { id: 3, firm: f3, val: col3 },
    { id: 4, firm: f4, val: col4 }
  ].filter(c => c.firm);

  // Highlighting evaluation
  const getHighlightClass = (rowType, value, firm) => {
    if (!highlightRisks || !value) return '';

    const valLower = String(value).toLowerCase();

    switch (rowType) {
      case 'challenge':
        if (valLower.includes('1-step') || valLower.includes('instant')) return 'highlight-good';
        return '';
      case 'maxAccount':
        if (parseFloat(value) >= 300000) return 'highlight-good';
        return '';
      case 'profitSplit':
        if (parseFloat(value) >= 90) return 'highlight-good';
        return '';
      case 'targetP1':
        if (parseFloat(value) <= 8 && parseFloat(value) > 0) return 'highlight-good';
        if (parseFloat(value) >= 10) return 'highlight-warn';
        return '';
      case 'minDays':
        if (parseFloat(value) === 0) return 'highlight-good';
        return '';
      case 'dailyDdType':
        if (valLower.includes('balance')) return 'highlight-good';
        if (valLower.includes('higher') || valLower.includes('equity')) return 'highlight-warn';
        return '';
      case 'ddStyle':
        if (valLower.includes('static')) return 'highlight-good';
        if (valLower.includes('trailing') && !valLower.includes('intraday')) return 'highlight-warn';
        if (valLower.includes('intraday')) return 'highlight-bad';
        return '';
      case 'consistency':
        if (valLower.includes('none')) return 'highlight-good';
        if (valLower.includes('yes') || valLower.includes('required')) return 'highlight-bad';
        return '';
      case 'news':
      case 'weekend':
        if (valLower.includes('allowed') || valLower.includes('yes')) return 'highlight-good';
        if (valLower.includes('restricted')) return 'highlight-warn';
        if (valLower.includes('not allowed') || valLower.includes('no')) return 'highlight-bad';
        return '';
      case 'payout':
        if (valLower.includes('weekly') || valLower.includes('8 days') || valLower.includes('on demand')) return 'highlight-good';
        return '';
      case 'windfall':
        if (firm.flags?.windfall) return 'highlight-bad';
        return 'highlight-good';
      case 'changes':
        if (firm.flags?.changes) return 'highlight-bad';
        return 'highlight-good';
      case 'risk':
        if (valLower === 'low') return 'highlight-good';
        if (valLower === 'medium') return 'highlight-warn';
        if (valLower === 'high') return 'highlight-bad';
        return '';
      default:
        return '';
    }
  };

  // Difference filtering helper
  const isRowDifferent = (values) => {
    if (values.length <= 1) return false;
    const firstVal = String(values[0]).trim().toLowerCase();
    return values.some(v => String(v).trim().toLowerCase() !== firstVal);
  };

  const renderRow = (label, rowType, getter) => {
    const values = activeCols.map(c => getter(c.firm));
    if (showDiffsOnly && activeCols.length > 1 && !isRowDifferent(values)) {
      return null;
    }

    return (
      <tr className="data-row">
        <td>{label}</td>
        {col1 !== 'none' && (
          <td className="col-1">
            <div className={`td-value ${getHighlightClass(rowType, getter(f1), f1)}`}>
              {getter(f1) || '-'}
            </div>
          </td>
        )}
        {col2 !== 'none' && (
          <td className="col-2">
            <div className={`td-value ${getHighlightClass(rowType, getter(f2), f2)}`}>
              {getter(f2) || '-'}
            </div>
          </td>
        )}
        {col3 !== 'none' && (
          <td className="col-3">
            <div className={`td-value ${getHighlightClass(rowType, getter(f3), f3)}`}>
              {getter(f3) || '-'}
            </div>
          </td>
        )}
        {col4 !== 'none' && (
          <td className="col-4">
            <div className={`td-value ${getHighlightClass(rowType, getter(f4), f4)}`}>
              {getter(f4) || '-'}
            </div>
          </td>
        )}
      </tr>
    );
  };

  // Smart Recommendations Helper
  const getRecommendation = () => {
    if (activeCols.length < 2) return null;
    
    // Simple logic: pick the firm with the lowest risk and fewest windfall/drawdown restrictions
    const scoredFirms = activeCols.map(c => {
      const f = c.firm;
      let score = 100;
      if (f.riskScore === 'High') score -= 30;
      if (f.riskScore === 'Medium') score -= 10;
      if (f.flags?.windfall) score -= 25;
      if (f.flags?.vague) score -= 15;
      if (f.flags?.changes) score -= 20;
      if (f.rules?.ddStyle?.toLowerCase().includes('trailing')) score -= 20;
      if (f.rules?.ddStyle?.toLowerCase().includes('intraday')) score -= 40;
      if (f.rules?.consistency?.toLowerCase().includes('yes') || f.rules?.consistency?.toLowerCase().includes('required')) score -= 15;
      return { firm: f, score };
    });

    scoredFirms.sort((a, b) => b.score - a.score);
    const best = scoredFirms[0].firm;

    return (
      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        <div
          className="compare-summary-card"
          style={{
            background: 'var(--surface)',
            borderRadius: '14px',
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-hi)', marginBottom: '0.5rem' }}>Smart Recommendation</div>
            <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.35rem' }}>Best Match Based on Your Comparison</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Comparing rules, drawdowns, and windfall terms, <strong style={{ color: 'var(--accent-hi)' }}>{best.name}</strong> offers the safest objective criteria for standard trading styles.
            </p>
          </div>
          <Link to="/find-my-firm" className="btn btn-primary" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} /> Find My Best Fit
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      {/* PAGE INTRO */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ margin: '1rem 0 2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.5rem' }}>Compare Prop Firms Side by Side</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '1rem' }}>
            Select up to 4 prop firms to see their rules, targets, drawdowns, and hidden clauses side-by-side instantly.
          </p>
          <div className="info-note" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-hi)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600 }}>
            <Info size={16} /> Compare 2–3 firms at a time for optimal clarity.
          </div>
        </div>
      </div>

      {/* FIRM SELECTORS */}
      <section className="container">
        <div className="selection-area" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Select firms to compare</h3>
            <button onClick={handleClearAll} className="clear-all" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}>Clear all</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Select Col 1 */}
            <div className="select-wrapper" style={{ position: 'relative' }}>
              <select value={col1} onChange={(e) => handleSelectChange(1, e.target.value)} className="form-control" style={{ paddingRight: '2.5rem' }}>
                <option value="none">Select firm...</option>
                {allFirms.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>

            {/* Select Col 2 */}
            <div className="select-wrapper" style={{ position: 'relative' }}>
              <select value={col2} onChange={(e) => handleSelectChange(2, e.target.value)} className="form-control" style={{ paddingRight: '2.5rem' }}>
                <option value="none">Select firm...</option>
                {allFirms.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>

            {/* Select Col 3 */}
            <div className="select-wrapper" style={{ position: 'relative' }}>
              <select value={col3} onChange={(e) => handleSelectChange(3, e.target.value)} className="form-control" style={{ paddingRight: '2.5rem' }}>
                <option value="none">Select firm...</option>
                {allFirms.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>

            {/* Select Col 4 */}
            <div className="select-wrapper" style={{ position: 'relative' }}>
              <select value={col4} onChange={(e) => handleSelectChange(4, e.target.value)} className="form-control" style={{ paddingRight: '2.5rem' }}>
                <option value="none">Select firm...</option>
                {allFirms.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', smRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' } }} className="controls-area">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <label className="checkbox-label" style={{ fontWeight: 600 }}>
              <input type="checkbox" checked={showDiffsOnly} onChange={(e) => setShowDiffsOnly(e.target.checked)} />
              Show only differences
            </label>
            <label className="checkbox-label" style={{ fontWeight: 600 }}>
              <input type="checkbox" checked={highlightRisks} onChange={(e) => setHighlightRisks(e.target.checked)} />
              Highlight rules risk
            </label>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span> Better</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warn)' }}></span> Caution</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></span> Red Flag</div>
          </div>
        </div>
      </section>

      {/* EMPTY STATES */}
      <div className="container" style={{ marginTop: '2rem' }}>
        {activeCols.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <Layers size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No firms selected</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Choose at least two prop firms from the selectors above to initiate rule comparison.</p>
          </div>
        )}
        {activeCols.length === 1 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <HelpCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>Need one more</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Select another firm to see side-by-side rules metrics. You can compare up to 4 firms.</p>
          </div>
        )}
      </div>

      {/* COMPARISON TABLE */}
      {activeCols.length >= 2 && (
        <section className="container" style={{ marginTop: '1.5rem' }}>
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, backgroundColor: 'var(--surface)', zIndex: 10, width: '250px', minWidth: '250px', borderRight: '2px solid var(--border)', fontWeight: 700 }}>Rule Category</th>
                  {col1 !== 'none' && <th className="col-1">{f1?.name}</th>}
                  {col2 !== 'none' && <th className="col-2">{f2?.name}</th>}
                  {col3 !== 'none' && <th className="col-3">{f3?.name}</th>}
                  {col4 !== 'none' && <th className="col-4">{f4?.name}</th>}
                </tr>
              </thead>
              <tbody>
                {/* GROUP 1: Overview */}
                <tr className="group-row"><td colSpan={5} style={{ backgroundColor: 'var(--bg-alt)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.75rem 1.5rem' }}>Overview</td></tr>
                {renderRow('Challenge Style', 'challenge', f => f.challengeTypes.join(', '))}
                {renderRow('Markets Available', 'markets', f => f.markets.join(', '))}
                {renderRow('Max Account Size ($)', 'maxAccount', f => formatCurrency(f.maxAccount))}
                {renderRow('Profit Split Max (%)', 'profitSplit', f => `${f.profitSplit}%`)}

                {/* GROUP 2: Targets & Time */}
                <tr className="group-row"><td colSpan={5} style={{ backgroundColor: 'var(--bg-alt)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.75rem 1.5rem' }}>Targets & Time</td></tr>
                {renderRow('Phase 1 Profit Target (%)', 'targetP1', f => `${f.rules.p1Target}%`)}
                {renderRow('Phase 2 Profit Target (%)', 'targetP2', f => f.rules.p2Target !== '0' ? `${f.rules.p2Target}%` : 'N/A (1-Step)')}
                {renderRow('Min Trading Days', 'minDays', f => `${f.rules.minDays} Days`)}
                {renderRow('Max Trading Days', 'maxDays', f => f.rules.p1Days === '0' ? 'Unlimited' : `${f.rules.p1Days} Days`)}

                {/* GROUP 3: Risk & Drawdown */}
                <tr className="group-row"><td colSpan={5} style={{ backgroundColor: 'var(--bg-alt)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.75rem 1.5rem' }}>Risk & Drawdown</td></tr>
                {renderRow('Daily Drawdown Limit (%)', 'dailyDd', f => f.rules.dailyDd !== '0' ? `${f.rules.dailyDd}%` : 'None')}
                {renderRow('Daily Drawdown Calculation', 'dailyDdType', f => f.rules.dailyType)}
                {renderRow('Overall Drawdown Limit (%)', 'overallDd', f => `${f.rules.overallDd}%`)}
                {renderRow('Drawdown Style', 'ddStyle', f => f.rules.ddStyle)}
                {renderRow('Consistency Rule', 'consistency', f => f.rules.consistency)}

                {/* GROUP 4: Trading Conditions */}
                <tr className="group-row"><td colSpan={5} style={{ backgroundColor: 'var(--bg-alt)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.75rem 1.5rem' }}>Trading Conditions</td></tr>
                {renderRow('News Trading Allowed?', 'news', f => f.rules.newsFriendly || f.newsFriendly)}
                {renderRow('Weekend Holding?', 'weekend', f => f.rules.weekend)}
                {renderRow('Overnight holding?', 'overnight', f => f.rules.overnight)}
                {renderRow('EAs / Bots Permissions', 'ea', f => f.rules.eaFriendly || f.eaFriendly)}

                {/* GROUP 5: Payouts & Fees */}
                <tr className="group-row"><td colSpan={5} style={{ backgroundColor: 'var(--bg-alt)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.75rem 1.5rem' }}>Payouts & Fees</td></tr>
                {renderRow('Payout Frequency', 'payout', f => f.rules?.payoutFreq || '—')}
                {renderRow('First Payout Delay', 'firstPayout', f => f.rules.firstPayout)}
                {renderRow('Challenge Fee (100K)', 'fee', f => f.rules.challengeFee)}
                {renderRow('Fee Refund Policy', 'refund', f => f.rules.refund)}

                {/* GROUP 6: Hidden/Vague Rules */}
                <tr className="group-row"><td colSpan={5} style={{ backgroundColor: 'var(--bg-alt)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.75rem 1.5rem' }}>Hidden Rules & Flags</td></tr>
                {renderRow('Has Windfall Clause?', 'windfall', f => f.flags?.windfall ? 'Yes (Subjective reduction)' : 'No')}
                {renderRow('Silent mid-challenge changes?', 'changes', f => f.flags?.changes ? 'History of sudden changes' : 'No report')}
                {renderRow('Overall Risk Rating', 'risk', f => f.riskScore)}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* RECENT RECS */}
      {getRecommendation()}

      {/* HIDDEN DETAILED NOTIFICATIONS BOX */}
      {activeCols.length >= 2 && (
        <div className="container" style={{ paddingBottom: '4rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Active Hidden Clauses Observed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeCols.map(c => {
                const f = c.firm;
                if (f.hiddenRules.length === 0) return null;
                return (
                  <div key={f.id} style={{ borderLeft: '3px solid var(--warn)', paddingLeft: '1rem', margin: '0.5rem 0' }}>
                    <h4 style={{ fontSize: '1rem', margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>{f.name} — {f.hiddenRules[0].title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.hiddenRules[0].desc}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Source: {f.hiddenRules[0].source}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
