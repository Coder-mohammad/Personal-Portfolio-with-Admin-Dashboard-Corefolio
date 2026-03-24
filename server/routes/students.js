import express from 'express';
import StudentProfile from '../models/StudentProfile.js';
import Allocation from '../models/Allocation.js';
import { auth } from '../middleware/auth.js';
import { requireAllocationAccess } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/students — RBAC filtered
router.get('/', auth, requireAllocationAccess, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'admin') {
      // see all
    } else if (req.user.role === 'faculty' && req.allocatedStudentIds) {
      filter.userId = { $in: req.allocatedStudentIds };
    } else if (req.user.role === 'student') {
      filter.userId = req.user._id;
    }

    const students = await StudentProfile.find(filter).populate('branchId', 'name code');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/public/all — public portfolios (no auth needed)
router.get('/public/all', async (req, res) => {
  try {
    const students = await StudentProfile.find({ isPublished: true }).populate('branchId', 'name code');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/:id — single student (public for published, auth for private)
router.get('/:id', async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ userId: req.params.id }).populate('branchId', 'name code');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/students/:id — student updates own profile
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Can only edit own profile' });
    }
    const profile = await StudentProfile.findOneAndUpdate({ userId: req.params.id }, req.body, { new: true });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
