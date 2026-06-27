import express from 'express';
import prisma from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const offers = await prisma.offer.findMany({
      where: { is_active: true },
      include: { firm: true }
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers.', error: error.message });
  }
});

export default router;
