import express from 'express';
import prisma from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany({
      include: { firm: true }
    });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenges.', error: error.message });
  }
});

export default router;
