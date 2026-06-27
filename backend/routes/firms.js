import express from 'express';
import { readDb, writeDb } from '../data/dbHelper.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET all firms
router.get('/', async (req, res) => {
  try {
    const db = await readDb();
    res.json(db.firms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching firms list.', error: error.message });
  }
});

// GET single firm details
router.get('/:id', async (req, res) => {
  try {
    const db = await readDb();
    const firm = db.firms.find(f => f.id === req.params.id);
    if (!firm) {
      return res.status(404).json({ message: 'Firm not found.' });
    }
    res.json(firm);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching firm details.', error: error.message });
  }
});

// POST - Add a new firm (Admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const firmData = req.body;
    if (!firmData.name) {
      return res.status(400).json({ message: 'Firm name is required.' });
    }

    const db = await readDb();
    const id = firmData.name.toLowerCase().replace(/\s+/g, '-');

    if (db.firms.some(f => f.id === id)) {
      return res.status(400).json({ message: 'A firm with this name or ID already exists.' });
    }

    // Set riskVal based on riskScore
    let riskVal = 1;
    if (firmData.riskScore === 'Medium') riskVal = 2;
    if (firmData.riskScore === 'High') riskVal = 3;

    const newFirm = {
      id,
      ...firmData,
      riskVal,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    db.firms.push(newFirm);
    await writeDb(db);

    res.status(201).json(newFirm);
  } catch (error) {
    res.status(500).json({ message: 'Error adding firm.', error: error.message });
  }
});

// PUT - Update a firm (Admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const db = await readDb();
    const idx = db.firms.findIndex(f => f.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Firm not found.' });
    }

    const updatedData = req.body;
    let riskVal = 1;
    if (updatedData.riskScore === 'Medium') riskVal = 2;
    if (updatedData.riskScore === 'High') riskVal = 3;

    const updatedFirm = {
      ...db.firms[idx],
      ...updatedData,
      riskVal,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    db.firms[idx] = updatedFirm;
    await writeDb(db);

    res.json(updatedFirm);
  } catch (error) {
    res.status(500).json({ message: 'Error updating firm.', error: error.message });
  }
});

// DELETE - Delete a firm (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const db = await readDb();
    const filteredFirms = db.firms.filter(f => f.id !== req.params.id);
    if (filteredFirms.length === db.firms.length) {
      return res.status(404).json({ message: 'Firm not found.' });
    }

    db.firms = filteredFirms;
    await writeDb(db);

    res.json({ message: 'Firm deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting firm.', error: error.message });
  }
});

// POST - Toggle Watchlist (Authenticated Users)
router.post('/:id/watchlist', verifyToken, async (req, res) => {
  try {
    const db = await readDb();
    const userIdx = db.users.findIndex(u => u.id === req.user.id);
    if (userIdx === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const firmId = req.params.id;
    if (!db.firms.some(f => f.id === firmId)) {
      return res.status(404).json({ message: 'Firm not found.' });
    }

    const watchlist = db.users[userIdx].watchlist || [];
    const index = watchlist.indexOf(firmId);
    let isSaved = false;

    if (index === -1) {
      watchlist.push(firmId);
      isSaved = true;
    } else {
      watchlist.splice(index, 1);
      isSaved = false;
    }

    db.users[userIdx].watchlist = watchlist;
    await writeDb(db);

    res.json({ isSaved, watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling watchlist.', error: error.message });
  }
});

export default router;
