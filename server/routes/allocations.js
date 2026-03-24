import express from 'express';
import Allocation from '../models/Allocation.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/allocations — admin: all, faculty: own
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'faculty') filter.facultyId = req.user._id;
    // admin see all

    const allocations = await Allocation.find(filter)
      .populate('facultyId', 'name email branchId')
      .populate('studentId', 'name email')
      .populate('assignedBy', 'name');
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/allocations — admin only
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { facultyId, studentId } = req.body;
    const existing = await Allocation.findOne({ facultyId, studentId, active: true });
    if (existing) return res.status(400).json({ error: 'Already allocated' });

    const allocation = await Allocation.create({
      facultyId, studentId, assignedBy: req.user._id, active: true,
    });
    res.status(201).json(allocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/allocations/:id/deactivate — admin only
router.put('/:id/deactivate', auth, requireRole('admin'), async (req, res) => {
  try {
    const allocation = await Allocation.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!allocation) return res.status(404).json({ error: 'Not found' });
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
