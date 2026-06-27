import express from 'express';
import prisma from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const payouts = await prisma.payout.findMany({
      include: { firm: true }
    });
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payouts.', error: error.message });
  }
});

export default router;
