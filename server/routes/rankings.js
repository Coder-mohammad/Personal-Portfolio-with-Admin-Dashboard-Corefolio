import express from 'express';
import StudentProfile from '../models/StudentProfile.js';
import Project from '../models/Project.js';
import Internship from '../models/Internship.js';
import Achievement from '../models/Achievement.js';
import Evaluation from '../models/Evaluation.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/rankings/compute — recalculate all rankings
router.get('/compute', auth, async (req, res) => {
  try {
    const students = await StudentProfile.find();
    const allProjects = await Project.find();
    const allInternships = await Internship.find();
    const allAchievements = await Achievement.find();
    const allEvaluations = await Evaluation.find();

    const rankings = [];

    for (const student of students) {
      for (const track of (student.expertiseTracks || [])) {
        const sProjects = allProjects.filter(p => p.studentId.toString() === student.userId.toString());
        const verifiedCount = sProjects.filter(p => p.verified).length;
        const sInternships = allInternships.filter(i => i.studentId.toString() === student.userId.toString());
        const sAchievements = allAchievements.filter(a => a.studentId.toString() === student.userId.toString());
        const sEvals = allEvaluations.filter(e => e.studentId.toString() === student.userId.toString());

        const academicScore = Math.min((student.gpa || 0) * 1.5, 15);
        const projectScore = Math.min(verifiedCount * 5, 25);
        const internScore = Math.min(sInternships.filter(i => i.verified).length * 8, 16);
        const certScore = Math.min(sAchievements.filter(a => a.category === 'Certification').length * 4, 12);
        const facultyAvg = sEvals.length > 0 ? sEvals.reduce((a, e) => a + e.totalScore, 0) / sEvals.length : 0;
        const facultyScore = Math.min((facultyAvg / 80) * 20, 20);
        const leaderScore = Math.min(sAchievements.length * 3, 12);

        const autoScore = Math.round(academicScore + projectScore + internScore + certScore + facultyScore + leaderScore);
        const totalScore = Math.min(autoScore, 110);

        rankings.push({
          studentId: student.userId.toString(),
          studentName: student.name,
          branchId: student.branchId?.toString(),
          track,
          autoScore,
          facultyBoost: 0,
          totalScore,
        });
      }
    }

    // Compute ranks per track per branch
    const tracks = [...new Set(rankings.map(r => r.track))];
    for (const track of tracks) {
      const branchIds = [...new Set(rankings.filter(r => r.track === track).map(r => r.branchId))];
      for (const branchId of branchIds) {
        const group = rankings.filter(r => r.track === track && r.branchId === branchId)
          .sort((a, b) => b.totalScore - a.totalScore);
        group.forEach((r, i) => { r.rank = i + 1; });
      }
    }

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rankings — query with ?track=&branchId=
router.get('/', auth, async (req, res) => {
  try {
    // Re-compute on-the-fly (light version)
    const { track, branchId } = req.query;
    const filter = {};
    if (branchId) filter.branchId = branchId;
    if (track) filter.expertiseTracks = track;

    const students = await StudentProfile.find(filter);
    const allProjects = await Project.find();
    const allInternships = await Internship.find();
    const allAchievements = await Achievement.find();
    const allEvaluations = await Evaluation.find();

    const rankings = [];
    for (const student of students) {
      if (track && !(student.expertiseTracks || []).includes(track)) continue;

      const sProjects = allProjects.filter(p => p.studentId.toString() === student.userId.toString());
      const verifiedCount = sProjects.filter(p => p.verified).length;
      const sInternships = allInternships.filter(i => i.studentId.toString() === student.userId.toString());
      const sAchievements = allAchievements.filter(a => a.studentId.toString() === student.userId.toString());
      const sEvals = allEvaluations.filter(e => e.studentId.toString() === student.userId.toString());

      const academicScore = Math.min((student.gpa || 0) * 1.5, 15);
      const projectScore = Math.min(verifiedCount * 5, 25);
      const internScore = Math.min(sInternships.filter(i => i.verified).length * 8, 16);
      const certScore = Math.min(sAchievements.filter(a => a.category === 'Certification').length * 4, 12);
      const facultyAvg = sEvals.length > 0 ? sEvals.reduce((a, e) => a + e.totalScore, 0) / sEvals.length : 0;
      const facultyScore = Math.min((facultyAvg / 80) * 20, 20);
      const leaderScore = Math.min(sAchievements.length * 3, 12);

      const totalScore = Math.min(Math.round(academicScore + projectScore + internScore + certScore + facultyScore + leaderScore), 110);

      rankings.push({
        studentId: student.userId.toString(),
        studentName: student.name,
        branchId: student.branchId?.toString(),
        track: track || student.expertiseTracks?.[0],
        autoScore: totalScore,
        facultyBoost: 0,
        totalScore,
      });
    }

    rankings.sort((a, b) => b.totalScore - a.totalScore);
    rankings.forEach((r, i) => { r.rank = i + 1; });

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
