import express from 'express';
import prisma from '../db.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'approved' },
      include: { user: { select: { name: true } }, firm: { select: { name: true, logo: true } } }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews.', error: error.message });
  }
});

// Admin: Get all reviews
router.get('/all', verifyToken, adminOnly, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { created_at: 'desc' },
      include: { user: { select: { name: true } }, firm: { select: { name: true, logo: true } } }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all reviews.', error: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const reviewData = req.body;
    const newReview = await prisma.review.create({
      data: {
        ...reviewData,
        user_id: req.user.id,
        status: 'pending' // Admin needs to approve
      }
    });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review.', error: error.message });
  }
});

// Admin: Update review status
router.put('/:id/status', verifyToken, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Get the current review to check its status before updating
    const existingReview = await prisma.review.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: req.params.id },
      data: { status }
    });

    // If review is being approved for the first time, award points
    if (status === 'approved' && existingReview.status !== 'approved') {
      await prisma.user.update({
        where: { id: existingReview.user_id },
        data: { points: { increment: 500 } }
      });
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review status.', error: error.message });
  }
});

export default router;
