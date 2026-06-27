import express from 'express';
import prisma from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /loyalty/points
router.get('/points', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching points', error: error.message });
  }
});

// POST /loyalty/redeem
router.post('/redeem', verifyToken, async (req, res) => {
  try {
    const { reward_id, points_cost } = req.body;
    
    // In a real app, you'd fetch the reward_id from a Rewards table and verify points_cost
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.points < points_cost) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    // Deduct points
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { points: user.points - points_cost }
    });
    
    // We would also create a record of the redemption here (e.g., generate a promo code)
    
    res.json({ 
      message: 'Reward redeemed successfully', 
      points_remaining: updatedUser.points,
      reward_code: 'UNLOCK-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error redeeming reward', error: error.message });
  }
});

export default router;
