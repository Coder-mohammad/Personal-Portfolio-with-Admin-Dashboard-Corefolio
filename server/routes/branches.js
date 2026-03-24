import express from 'express';
import Branch from '../models/Branch.js';
import Course from '../models/Course.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/branches — all authenticated users
router.get('/', auth, async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/branches — admin only
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/branches/:id — admin only
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/branches/:id — admin only
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    await Course.deleteMany({ branchId: req.params.id });
    res.json({ message: 'Branch deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Courses ──
router.get('/:branchId/courses', auth, async (req, res) => {
  try {
    const courses = await Course.find({ branchId: req.params.branchId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:branchId/courses', auth, requireRole('admin'), async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, branchId: req.params.branchId });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/courses/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
