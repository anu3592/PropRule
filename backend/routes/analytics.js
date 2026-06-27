import express from 'express';
import { readDb, writeDb } from '../data/dbHelper.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// POST - Track event
router.post('/track', async (req, res) => {
  try {
    const { type, label, url, metadata } = req.body;
    if (!type) {
      return res.status(400).json({ message: 'Event type is required.' });
    }

    const db = await readDb();
    if (!db.analytics) {
      db.analytics = [];
    }

    const newEvent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type,
      label: label || '',
      url: url || '',
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    };

    db.analytics.push(newEvent);
    await writeDb(db);

    res.status(201).json({ message: 'Event tracked.' });
  } catch (error) {
    // Fail silently or log error, don't crash
    console.error('Error tracking analytics event', error);
    res.status(500).json({ message: 'Error tracking event.' });
  }
});

// GET - Analytics Dashboard (Admin only)
router.get('/dashboard', adminOnly, async (req, res) => {
  try {
    const db = await readDb();
    const events = db.analytics || [];

    // 1. Total views
    const totalViews = events.filter(e => e.type === 'visit').length;

    // 2. Outbound clicks (affiliate clicks)
    const outboundClicks = events.filter(e => e.type === 'outbound_affiliate_click' || e.type === 'outbound_click').length;

    // 3. CTR
    const ctr = totalViews > 0 ? ((outboundClicks / totalViews) * 100).toFixed(1) : '0.0';

    // 4. Searches & Top Searched
    const searchEvents = events.filter(e => e.type === 'search_query');
    const searchCounts = {};
    searchEvents.forEach(e => {
      const q = e.label.trim().toLowerCase();
      if (q) {
        searchCounts[q] = (searchCounts[q] || 0) + 1;
      }
    });
    const topSearches = Object.entries(searchCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. Clicks by firm
    const firmClicks = {};
    events.filter(e => e.type === 'outbound_affiliate_click').forEach(e => {
      const firm = e.metadata?.firmId || 'Other';
      firmClicks[firm] = (firmClicks[firm] || 0) + 1;
    });

    // 6. Active sessions (simulated: events in last 15 minutes)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const activeSessions = new Set(
      events
        .filter(e => e.timestamp >= fifteenMinsAgo)
        .map(e => e.metadata?.sessionId || 'anonymous')
    ).size;

    // 7. Recent events
    const recentEvents = [...events]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    res.json({
      metrics: {
        totalViews,
        outboundClicks,
        ctr: `${ctr}%`,
        activeSessions
      },
      topSearches,
      firmClicks,
      recentEvents
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving analytics report.', error: error.message });
  }
});

export default router;
