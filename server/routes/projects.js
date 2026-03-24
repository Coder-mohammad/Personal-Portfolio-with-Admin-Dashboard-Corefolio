import express from 'express';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Achievement from '../models/Achievement.js';
import Internship from '../models/Internship.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// ═══ Projects ═══

// GET /api/projects?studentId=xxx
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.query.studentId ? { studentId: req.query.studentId } : {};
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET public featured projects
router.get('/public/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true, status: 'published' });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all public skills
router.get('/public/skills', async (req, res) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all public achievements
router.get('/public/achievements', async (req, res) => {
  try {
    const achievements = await Achievement.find({});
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all public internships
router.get('/public/internships', async (req, res) => {
  try {
    const internships = await Internship.find({});
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET public projects for a student
router.get('/public/:studentId', async (req, res) => {
  try {
    const projects = await Project.find({ studentId: req.params.studentId, status: 'published' });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects
router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, studentId: req.user._id, verified: false });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects/:id/verify — faculty only
router.post('/:id/verify', auth, requireRole('faculty'), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { verified: true, verifiedBy: req.user._id }, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══ Skills ═══

router.get('/skills', auth, async (req, res) => {
  try {
    const filter = req.query.studentId ? { studentId: req.query.studentId } : {};
    res.json(await Skill.find(filter));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/skills', auth, async (req, res) => {
  try {
    const skill = await Skill.create({ ...req.body, studentId: req.user._id, endorsed: false });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/skills/:id', auth, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/skills/:id/endorse', auth, requireRole('faculty'), async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, { endorsed: true, endorsedBy: req.user._id }, { new: true });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══ Achievements ═══

router.get('/achievements', auth, async (req, res) => {
  try {
    const filter = req.query.studentId ? { studentId: req.query.studentId } : {};
    res.json(await Achievement.find(filter));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/achievements', auth, async (req, res) => {
  try {
    const count = await Achievement.countDocuments({ studentId: req.user._id, category: req.body.category });
    if (count >= 2) return res.status(400).json({ error: 'Max 2 per category' });
    const achievement = await Achievement.create({ ...req.body, studentId: req.user._id });
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/achievements/:id', auth, async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══ Internships ═══

router.get('/internships', auth, async (req, res) => {
  try {
    const filter = req.query.studentId ? { studentId: req.query.studentId } : {};
    res.json(await Internship.find(filter));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/internships', auth, async (req, res) => {
  try {
    const internship = await Internship.create({ ...req.body, studentId: req.user._id, verified: false });
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/internships/:id', auth, async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/internships/:id/verify', auth, requireRole('faculty'), async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, { verified: true, verifiedBy: req.user._id }, { new: true });
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
