import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, Trash2, Edit, X, FileText, CheckCircle2, ChevronRight, AlertCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { trackEvent } from '../utils/analytics';

const Admin = () => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'edit'

  // Editor states
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('tab-basic');

  // Form parameters
  const [fName, setFName] = useState('');
  const [fWebsite, setFWebsite] = useState('');
  const [fTagline, setFTagline] = useState('');
  const [fStatus, setFStatus] = useState('Active');
  const [fLogo, setFLogo] = useState('');
  const [fMarkets, setFMarkets] = useState([]);
  const [fChallenges, setFChallenges] = useState([]);
  const [fMaxAccount, setFMaxAccount] = useState('');
  const [fProfitSplit, setFProfitSplit] = useState('');

  const [fRiskScore, setFRiskScore] = useState('Low');
  const [fBeginner, setFBeginner] = useState('Yes');
  const [fEaFriendly, setFEaFriendly] = useState('Yes');
  const [fScalping, setFScalping] = useState('Yes');
  const [fNewsFriendly, setFNewsFriendly] = useState('Yes');
  const [fNotes, setFNotes] = useState('');

  // Rules parameters
  const [rP1Target, setRP1Target] = useState('');
  const [rP2Target, setRP2Target] = useState('');
  const [rP1Days, setRP1Days] = useState('');
  const [rMinDays, setRPMinDays] = useState('');
  const [rDailyDd, setRPDailyDd] = useState('');
  const [rDailyType, setRPDailyType] = useState('Equity');
  const [rOverallDd, setRPOverallDd] = useState('');
  const [rDdStyle, setRPDdStyle] = useState('Static');
  const [rConsistency, setRPConsistency] = useState('');
  const [rOvernight, setRPOvernight] = useState('Allowed');
  const [rWeekend, setRPWeekend] = useState('Allowed');
  const [rPayoutFreq, setRPPayoutFreq] = useState('Bi-weekly');
  const [rFirstPayout, setRPFirstPayout] = useState('');
  const [rRefund, setRPRefund] = useState('');
  const [rFee, setRPFee] = useState('');

  // Hidden Rules & flags
  const [hiddenRules, setHiddenRules] = useState([]);
  const [flagWindfall, setFlagWindfall] = useState(false);
  const [flagVague, setFlagVague] = useState(false);
  const [flagChanges, setFlagChanges] = useState(false);

  useEffect(() => {
    trackEvent('visit', 'Admin Panel', '/admin');
    if (!token || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchFirms();
  }, [user, token, navigate]);

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/firms');
      if (res.ok) {
        const data = await res.json();
        setFirms(data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error fetching firms list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = (firm = null) => {
    setActiveTab('tab-basic');
    if (firm) {
      setEditingId(firm.id);
      setFName(firm.name);
      setFWebsite(firm.website || '');
      setFTagline(firm.tagline || '');
      setFStatus(firm.status || 'Active');
      setFLogo(firm.logo || '');
      setFMarkets(firm.markets || []);
      setFChallenges(firm.challengeTypes || []);
      setFMaxAccount(firm.maxAccount || '');
      setFProfitSplit(firm.profitSplit || '');

      setFRiskScore(firm.riskScore || 'Low');
      setFBeginner(firm.beginnerFriendly || 'Yes');
      setFEaFriendly(firm.eaFriendly || 'Yes');
      setFScalping(firm.scalpingFriendly || 'Yes');
      setFNewsFriendly(firm.newsFriendly || 'Yes');
      setFNotes(firm.notes || '');

      const r = firm.rules || {};
      setRP1Target(r.p1Target || '');
      setRP1Target(r.p1Target || '');
      setRP2Target(r.p2Target || '');
      setRP1Days(r.p1Days || '');
      setRPMinDays(r.minDays || '');
      setRPDailyDd(r.dailyDd || '');
      setRPDailyType(r.dailyType || 'Equity');
      setRPOverallDd(r.overallDd || '');
      setRPDdStyle(r.ddStyle || 'Static');
      setRPConsistency(r.consistency || '');
      setRPOvernight(r.overnight || 'Allowed');
      setRPWeekend(r.weekend || 'Allowed');
      setRPPayoutFreq(r.payoutFreq || 'Bi-weekly');
      setRPFirstPayout(r.firstPayout || '');
      setRPRefund(r.refund || '');
      setRPFee(r.challengeFee || '');

      setHiddenRules(JSON.parse(JSON.stringify(firm.hiddenRules || [])));
      setFlagWindfall(firm.flags?.windfall || false);
      setFlagVague(firm.flags?.vague || false);
      setFlagChanges(firm.flags?.changes || false);
    } else {
      setEditingId(null);
      setFName('');
      setFWebsite('');
      setFTagline('');
      setFStatus('Active');
      setFLogo('');
      setFMarkets([]);
      setFChallenges([]);
      setFMaxAccount('');
      setFProfitSplit('');
      setFRiskScore('Low');
      setFBeginner('Yes');
      setFEaFriendly('Yes');
      setFScalping('Yes');
      setFNewsFriendly('Yes');
      setFNotes('');
      setRP1Target('');
      setRP2Target('');
      setRP1Days('');
      setRPMinDays('');
      setRPDailyDd('');
      setRPDailyType('Equity');
      setRPOverallDd('');
      setRPDdStyle('Static');
      setRPConsistency('');
      setRPOvernight('Allowed');
      setRPWeekend('Allowed');
      setRPPayoutFreq('Bi-weekly');
      setRPFirstPayout('');
      setRPRefund('');
      setRPFee('');
      setHiddenRules([]);
      setFlagWindfall(false);
      setFlagVague(false);
      setFlagChanges(false);
    }
    setView('edit');
  };

  const handleMarketCheckbox = (market) => {
    setFMarkets(prev =>
      prev.includes(market) ? prev.filter(m => m !== market) : [...prev, market]
    );
  };

  const handleChallengeCheckbox = (challenge) => {
    setFChallenges(prev =>
      prev.includes(challenge) ? prev.filter(c => c !== challenge) : [...prev, challenge]
    );
  };

  const handleAddHiddenRule = () => {
    setHiddenRules(prev => [
      ...prev,
      {
        id: 'hr_' + Date.now() + Math.random().toString(36).substr(2, 4),
        severity: 'Medium',
        title: '',
        desc: '',
        source: ''
      }
    ]);
  };

  const handleUpdateHiddenRule = (index, key, val) => {
    setHiddenRules(prev => {
      const copy = [...prev];
      copy[index][key] = val;
      return copy;
    });
  };

  const handleRemoveHiddenRule = (index) => {
    setHiddenRules(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    if (!fName || !fWebsite) {
      showToast('Firm Name and Website URL are required.', 'error');
      setActiveTab('tab-basic');
      return;
    }

    const payload = {
      name: fName,
      website: fWebsite,
      tagline: fTagline,
      status: fStatus,
      logo: fLogo,
      markets: fMarkets,
      challengeTypes: fChallenges,
      maxAccount: Number(fMaxAccount) || 200000,
      profitSplit: Number(fProfitSplit) || 80,
      riskScore: fRiskScore,
      beginnerFriendly: fBeginner,
      eaFriendly: fEaFriendly,
      scalpingFriendly: fScalping,
      newsFriendly: fNewsFriendly,
      notes: fNotes,
      rules: {
        p1Target: rP1Target,
        p2Target: rP2Target,
        p1Days: rP1Days,
        minDays: rMinDays,
        dailyDd: rDailyDd,
        dailyType: rDailyType,
        overallDd: rOverallDd,
        ddStyle: rDdStyle,
        consistency: rConsistency,
        overnight: rOvernight,
        weekend: rWeekend,
        payoutFreq: rPayoutFreq,
        firstPayout: rFirstPayout,
        refund: rRefund,
        challengeFee: rFee
      },
      hiddenRules: hiddenRules.filter(hr => hr.title.trim()),
      flags: {
        windfall: flagWindfall,
        vague: flagVague,
        changes: flagChanges
      }
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/firms/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/firms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error saving firm.');
      }

      showToast('Prop firm database successfully saved.', 'success');
      setView('list');
      fetchFirms();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this prop firm? This cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/firms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        showToast('Firm deleted successfully.', 'success');
        fetchFirms();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete firm.');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Discard unsaved modifications?')) {
      setView('list');
    }
  };

  if (view === 'edit') {
    return (
      <div style={{ paddingTop: '64px', minHeight: '100vh', backgroundColor: 'var(--bg-alt)' }}>
        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
          {/* EDITOR HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{editingId ? `Editing: ${fName}` : 'Add New Prop Firm'}</h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleCancel} className="btn btn-outline" style={{ borderRadius: 'var(--radius-md)', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Cancel</button>
              <button onClick={handleSave} className="btn btn-primary" style={{ borderRadius: 'var(--radius-md)', padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Save size={16} /> Save Firm</button>
            </div>
          </div>

          {/* TABS HEADER */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2rem', gap: '1.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
            <button onClick={() => setActiveTab('tab-basic')} className={`btn-ghost ${activeTab === 'tab-basic' ? 'active' : ''}`} style={{ borderBottom: activeTab === 'tab-basic' ? '2px solid var(--accent-hi)' : '2px solid transparent', padding: '0.75rem 0', fontWeight: 600, color: activeTab === 'tab-basic' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>A. Basic Info</button>
            <button onClick={() => setActiveTab('tab-risk')} className={`btn-ghost ${activeTab === 'tab-risk' ? 'active' : ''}`} style={{ borderBottom: activeTab === 'tab-risk' ? '2px solid var(--accent-hi)' : '2px solid transparent', padding: '0.75rem 0', fontWeight: 600, color: activeTab === 'tab-risk' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>B. Risk & Meta</button>
            <button onClick={() => setActiveTab('tab-rules')} className={`btn-ghost ${activeTab === 'tab-rules' ? 'active' : ''}`} style={{ borderBottom: activeTab === 'tab-rules' ? '2px solid var(--accent-hi)' : '2px solid transparent', padding: '0.75rem 0', fontWeight: 600, color: activeTab === 'tab-rules' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>C. Rules</button>
            <button onClick={() => setActiveTab('tab-hidden')} className={`btn-ghost ${activeTab === 'tab-hidden' ? 'active' : ''}`} style={{ borderBottom: activeTab === 'tab-hidden' ? '2px solid var(--accent-hi)' : '2px solid transparent', padding: '0.75rem 0', fontWeight: 600, color: activeTab === 'tab-hidden' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>D. Hidden Rules</button>
          </div>

          {/* TAB CONTENT: BASIC INFO */}
          {activeTab === 'tab-basic' && (
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Firm Name *</label>
                  <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} className="form-control" placeholder="e.g. FTMO" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Website URL *</label>
                  <input type="url" value={fWebsite} onChange={(e) => setFWebsite(e.target.value)} className="form-control" placeholder="https://..." />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Short Tagline</label>
                <input type="text" value={fTagline} onChange={(e) => setFTagline(e.target.value)} className="form-control" placeholder="e.g. The industry standard." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</label>
                  <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="form-control">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Logo Label</label>
                  <input type="text" value={fLogo} onChange={(e) => setFLogo(e.target.value)} className="form-control" placeholder="e.g. FT or /images/logo.png" />
                </div>
              </div>

              {/* Markets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Markets Traded</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {['Forex', 'Indices', 'Futures', 'Crypto', 'Stocks'].map(m => (
                    <label key={m} className="checkbox-label">
                      <input type="checkbox" checked={fMarkets.includes(m)} onChange={() => handleMarketCheckbox(m)} /> {m}
                    </label>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Challenge Models</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {['1-step', '2-step', '3-step', 'Instant'].map(c => (
                    <label key={c} className="checkbox-label">
                      <input type="checkbox" checked={fChallenges.includes(c)} onChange={() => handleChallengeCheckbox(c)} /> {c}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Max Account Capital ($)</label>
                  <input type="number" value={fMaxAccount} onChange={(e) => setFMaxAccount(e.target.value)} className="form-control" placeholder="e.g. 200000" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Max Profit Split (%)</label>
                  <input type="number" value={fProfitSplit} onChange={(e) => setFProfitSplit(e.target.value)} className="form-control" placeholder="e.g. 90" />
                </div>
              </div>
            </div>
          )}

          {/* TAB B: RISK & META */}
          {activeTab === 'tab-risk' && (
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Risk Assessment Score</label>
                  <select value={fRiskScore} onChange={(e) => setFRiskScore(e.target.value)} className="form-control">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Beginner Friendly?</label>
                  <select value={fBeginner} onChange={(e) => setFBeginner(e.target.value)} className="form-control">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>EA / Bots Permitted?</label>
                  <select value={fEaFriendly} onChange={(e) => setFEaFriendly(e.target.value)} className="form-control">
                    <option value="Yes">Yes</option>
                    <option value="Restricted">Restricted</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Scalping Permitted?</label>
                  <select value={fScalping} onChange={(e) => setFScalping(e.target.value)} className="form-control">
                    <option value="Yes">Yes</option>
                    <option value="Restricted">Restricted</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>News Trading Allowed?</label>
                  <select value={fNewsFriendly} onChange={(e) => setFNewsFriendly(e.target.value)} className="form-control">
                    <option value="Yes">Yes</option>
                    <option value="Restricted">Restricted</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Internal Notes & Auditing Log</label>
                <textarea value={fNotes} onChange={(e) => setFNotes(e.target.value)} className="form-control" rows={4} placeholder="Internal research observations..."></textarea>
              </div>
            </div>
          )}

          {/* TAB C: RULES */}
          {activeTab === 'tab-rules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Targets & Time parameters</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Phase 1 Target (%)</label>
                    <input type="text" value={rP1Target} onChange={(e) => setRP1Target(e.target.value)} className="form-control" placeholder="e.g. 8" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Phase 2 Target (%)</label>
                    <input type="text" value={rP2Target} onChange={(e) => setRP2Target(e.target.value)} className="form-control" placeholder="e.g. 5" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Max Days (P1)</label>
                    <input type="text" value={rP1Days} onChange={(e) => setRP1Days(e.target.value)} className="form-control" placeholder="0 for Unlimited" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Min Days Required</label>
                    <input type="text" value={rMinDays} onChange={(e) => setRPMinDays(e.target.value)} className="form-control" placeholder="e.g. 0 or 5" />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Drawdown & Risk margins</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Daily Drawdown (%)</label>
                    <input type="text" value={rDailyDd} onChange={(e) => setRPDailyDd(e.target.value)} className="form-control" placeholder="e.g. 5" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Daily DD Calculation</label>
                    <select value={rDailyType} onChange={(e) => setRPDailyType(e.target.value)} className="form-control">
                      <option value="Balance based">Balance based</option>
                      <option value="Equity based">Equity based</option>
                      <option value="Higher of both">Higher of both</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Overall Drawdown (%)</label>
                    <input type="text" value={rOverallDd} onChange={(e) => setRPOverallDd(e.target.value)} className="form-control" placeholder="e.g. 10" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Drawdown Type</label>
                    <select value={rDdStyle} onChange={(e) => setRPDdStyle(e.target.value)} className="form-control">
                      <option value="Static">Static</option>
                      <option value="Trailing">Trailing</option>
                      <option value="Intraday Trailing">Intraday Trailing</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Consistency Rule details</label>
                  <input type="text" value={rConsistency} onChange={(e) => setRPConsistency(e.target.value)} className="form-control" placeholder="e.g. None or Yes (Max 50% profit in 1 day)" />
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Holdings & Payout schedules</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Overnight Hold</label>
                    <select value={rOvernight} onChange={(e) => setRPOvernight(e.target.value)} className="form-control">
                      <option value="Allowed">Allowed</option>
                      <option value="Restricted">Restricted</option>
                      <option value="Not allowed">Not allowed</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Weekend Hold</label>
                    <select value={rWeekend} onChange={(e) => setRPWeekend(e.target.value)} className="form-control">
                      <option value="Allowed">Allowed</option>
                      <option value="Restricted">Restricted</option>
                      <option value="Not allowed">Not allowed</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Payout Frequency</label>
                    <input type="text" value={rPayoutFreq} onChange={(e) => setRPPayoutFreq(e.target.value)} className="form-control" placeholder="e.g. Bi-weekly" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>First Payout delay</label>
                    <input type="text" value={rFirstPayout} onChange={(e) => setRPFirstPayout(e.target.value)} className="form-control" placeholder="e.g. 14 Days" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Refund Policy</label>
                    <input type="text" value={rRefund} onChange={(e) => setRPRefund(e.target.value)} className="form-control" placeholder="e.g. 100% with first payout" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Challenge Fee (100K)</label>
                    <input type="text" value={rFee} onChange={(e) => setRPFee(e.target.value)} className="form-control" placeholder="e.g. $499" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB D: HIDDEN RULES */}
          {activeTab === 'tab-hidden' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Hidden Clauses Reported</h3>
                  <button onClick={handleAddHiddenRule} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Plus size={14} /> Add Hidden Clause</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {hiddenRules.map((hr, idx) => (
                    <div key={hr.id} style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', position: 'relative' }}>
                      <button onClick={() => handleRemoveHiddenRule(idx)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Clause Title *</label>
                          <input type="text" value={hr.title} onChange={(e) => handleUpdateHiddenRule(idx, 'title', e.target.value)} className="form-control" placeholder="e.g. News Windows" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Severity</label>
                          <select value={hr.severity} onChange={(e) => handleUpdateHiddenRule(idx, 'severity', e.target.value)} className="form-control">
                            <option value="Low">Low Risk</option>
                            <option value="Medium">Medium Warning</option>
                            <option value="High">High Danger</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Description Details</label>
                        <textarea value={hr.desc} onChange={(e) => handleUpdateHiddenRule(idx, 'desc', e.target.value)} className="form-control" rows={2} placeholder="Explain why this clause triggers breaches..."></textarea>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Source Contract citation</label>
                        <input type="text" value={hr.source} onChange={(e) => handleUpdateHiddenRule(idx, 'source', e.target.value)} className="form-control" placeholder="e.g. Section 9.2 of Terms & Conditions" />
                      </div>
                    </div>
                  ))}
                  {hiddenRules.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No hidden rules reported. Add one if any hidden blocker is found.</p>
                  )}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Red Flags</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={flagWindfall} onChange={(e) => setFlagWindfall(e.target.checked)} />
                    Has Windfall / Disproportionate profit subjective reduction clause
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={flagVague} onChange={(e) => setFlagVague(e.target.checked)} />
                    Has vague 'Fair Trading Style' language
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={flagChanges} onChange={(e) => setFlagChanges(e.target.checked)} />
                    Has history of sudden mid-evaluation parameter modifications
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {/* LIST TOOLBAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontSize: '2rem' }}>PropRules Admin Console</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage the global prop firms rules database.</p>
          </div>
          <button onClick={() => handleOpenEditor()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Plus size={16} /> Add New Firm</button>
        </div>

        {/* LIST TABLE */}
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <RefreshCw size={24} className="empty-state-icon" style={{ color: 'var(--accent-hi)', animation: 'btnSpin 1s linear infinite' }} />
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Fetching database records...</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-alt)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Firm Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Markets</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Challenge</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Risk Rating</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {firms.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>{f.name}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f.markets.slice(0, 3).join(', ')}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f.challengeTypes.join(', ')}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge badge-risk-${f.riskScore}`} style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 700 }}>
                        {f.riskScore}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: f.status === 'Active' ? 'var(--success-text)' : 'var(--danger-text)' }}>
                        {f.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => handleOpenEditor(f)} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Edit size={12} /> Edit</button>
                      <button onClick={() => handleDelete(f.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-md)', color: 'var(--danger)', borderColor: 'var(--border)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Trash2 size={12} /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
