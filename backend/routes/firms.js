import express from 'express';
import prisma from '../db.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET all firms
router.get('/', async (req, res) => {
  try {
    const firms = await prisma.firm.findMany({
      include: {
        rules: true
      }
    });
    res.json(firms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching firms list.', error: error.message });
  }
});

// GET single firm details
router.get('/:slug', async (req, res) => {
  try {
    const firm = await prisma.firm.findUnique({
      where: { slug: req.params.slug },
      include: {
        rules: true,
        challenges: true,
        offers: true
      }
    });
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

    const slug = firmData.name.toLowerCase().replace(/\s+/g, '-');
    const existingFirm = await prisma.firm.findUnique({ where: { slug } });
    if (existingFirm) {
      return res.status(400).json({ message: 'A firm with this name already exists.' });
    }

    const newFirm = await prisma.firm.create({
      data: {
        name: firmData.name,
        slug,
        logo: firmData.logo || null,
        country: firmData.country || null,
        founded_year: firmData.founded_year || null,
        assets: firmData.assets || [],
        platforms: firmData.platforms || [],
        max_allocation: firmData.max_allocation || null,
        description: firmData.description || null,
      }
    });

    res.status(201).json(newFirm);
  } catch (error) {
    res.status(500).json({ message: 'Error adding firm.', error: error.message });
  }
});

// PUT - Update a firm (Admin only)
router.put('/:slug', adminOnly, async (req, res) => {
  try {
    const updatedFirm = await prisma.firm.update({
      where: { slug: req.params.slug },
      data: req.body
    });
    res.json(updatedFirm);
  } catch (error) {
    res.status(500).json({ message: 'Error updating firm.', error: error.message });
  }
});

// DELETE - Delete a firm (Admin only)
router.delete('/:slug', adminOnly, async (req, res) => {
  try {
    await prisma.firm.delete({
      where: { slug: req.params.slug }
    });
    res.json({ message: 'Firm deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting firm.', error: error.message });
  }
});

export default router;
