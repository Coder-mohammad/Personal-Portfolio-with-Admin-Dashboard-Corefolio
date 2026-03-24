import express from 'express';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/users — admin: all
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    let filter = {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users — admin only
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create({ name, email, password: password || 'password123', role, branchId });

    if (user.role === 'student') {
      const branch = branchId ? await (await import('../models/Branch.js')).default.findById(branchId) : null;
      await StudentProfile.create({
        userId: user._id, name: user.name, email: user.email,
        branchId: user.branchId, branch: branch?.name || '', batch: new Date().getFullYear().toString(),
      });
    }

    res.status(201).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id — admin only
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, role, branchId } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, role, branchId }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:id — admin only
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await StudentProfile.findOneAndDelete({ userId: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
