import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDb, writeDb } from '../data/dbHelper.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = 'proprules_super_secret_key_123!';

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const db = await readDb();
    const userExists = db.users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';

    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      role,
      watchlist: [],
      lastQuizProfile: null,
      lastQuizMatches: []
    };

    db.users.push(newUser);
    await writeDb(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        watchlist: newUser.watchlist,
        lastQuizProfile: newUser.lastQuizProfile,
        lastQuizMatches: newUser.lastQuizMatches
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up user.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const db = await readDb();
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        watchlist: user.watchlist,
        lastQuizProfile: user.lastQuizProfile,
        lastQuizMatches: user.lastQuizMatches
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user.', error: error.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = await readDb();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      watchlist: user.watchlist,
      lastQuizProfile: user.lastQuizProfile,
      lastQuizMatches: user.lastQuizMatches
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
  }
});

export default router;
