import express from 'express';
import Evaluation from '../models/Evaluation.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/evaluations?studentId=xxx
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.facultyId) filter.facultyId = req.query.facultyId;
    const evaluations = await Evaluation.find(filter).populate('facultyId', 'name').populate('studentId', 'name');
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/evaluations — faculty only
router.post('/', auth, requireRole('faculty'), async (req, res) => {
  try {
    const evaluation = new Evaluation({ ...req.body, facultyId: req.user._id });
    await evaluation.save(); // triggers pre-save totalScore computation
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/evaluations/:id
router.delete('/:id', auth, requireRole('faculty', 'admin'), async (req, res) => {
  try {
    await Evaluation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Evaluation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
