import express from 'express';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import { auth, generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register (admin creates users, or self-register for students)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const user = await User.create({ name, email, password: password || 'password123', role: role || 'student', branchId });

    // If student, create profile
    if (user.role === 'student') {
      await StudentProfile.create({
        userId: user._id, name: user.name, email: user.email,
        branchId: user.branchId, branch: '', batch: new Date().getFullYear().toString(),
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
