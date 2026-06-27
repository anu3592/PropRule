import express from 'express';
import { readDb, writeDb } from '../data/dbHelper.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/save', verifyToken, async (req, res) => {
  try {
    const { profile, matches } = req.body;
    if (!profile || !matches) {
      return res.status(400).json({ message: 'Profile and matches are required.' });
    }

    const db = await readDb();
    const userIdx = db.users.findIndex(u => u.id === req.user.id);
    if (userIdx === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    db.users[userIdx].lastQuizProfile = profile;
    db.users[userIdx].lastQuizMatches = matches;
    await writeDb(db);

    res.json({ message: 'Quiz profile and matches saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving quiz data.', error: error.message });
  }
});

export default router;
