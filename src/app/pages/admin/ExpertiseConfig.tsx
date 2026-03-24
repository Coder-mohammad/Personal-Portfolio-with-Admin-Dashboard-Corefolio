import React from 'react';
import { useData } from '../../contexts/DataProvider';
import { ALL_EXPERTISE_TRACKS } from '../../types';
import { BarChart3, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

const ExpertiseConfig = () => {
  const { students, projects, internships, certifications, achievements, evaluations, computeRankings, studentExpertise } = useData();

  const trackStats = ALL_EXPERTISE_TRACKS.map(track => {
    const enrolledStudents = students.filter(s => s.expertiseTracks.includes(track));
    const trackProjects = projects.filter(p => p.expertiseTrack === track);
    const trackRankings = studentExpertise.filter(e => e.track === track);
    const avgScore = trackRankings.length > 0 ? Math.round(trackRankings.reduce((a, e) => a + e.totalScore, 0) / trackRankings.length) : 0;

    return { track, enrolled: enrolledStudents.length, projects: trackProjects.length, avgScore, rankings: trackRankings.length };
  });

  const trackIcons: Record<string, string> = {
    'Software Development': '💻',
    'Core Engineering': '⚙️',
    'Data / AI / Analytics': '🤖',
    'Research & Higher Studies': '📚',
    'Management / Consulting': '📊',
  };

  const trackGradients: Record<string, string> = {
    'Software Development': 'from-blue-500 to-indigo-600',
    'Core Engineering': 'from-orange-500 to-red-600',
    'Data / AI / Analytics': 'from-emerald-500 to-teal-600',
    'Research & Higher Studies': 'from-purple-500 to-violet-600',
    'Management / Consulting': 'from-amber-500 to-yellow-600',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/dashboard/admin" className="text-sm text-gray-500 hover:text-gray-900">← Admin Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Expertise Tracks Configuration</h1>
          <p className="text-sm text-gray-500">Monitor and manage multi-track ranking system.</p>
        </div>
        <button onClick={computeRankings}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
          <Zap className="w-4 h-4 inline mr-1" /> Recompute Rankings
        </button>
      </div>

      {/* Scoring Formula */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Ranking Formula</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Academic GPA', weight: '×1.5', max: '15' },
            { label: 'Verified Projects', weight: '×5 each', max: '25' },
            { label: 'Verified Internships', weight: '×8 each', max: '16' },
            { label: 'Certifications', weight: '×4 each', max: '12' },
            { label: 'Faculty Evaluation', weight: 'Avg/80 ×20', max: '20' },
            { label: 'Achievements', weight: '×3 each', max: '12' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-3 border border-indigo-50">
              <p className="text-xs font-semibold text-gray-500">{item.label}</p>
              <p className="text-sm font-bold text-gray-900">{item.weight}</p>
              <p className="text-xs text-indigo-600">Max: {item.max} pts</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-indigo-700 mt-3 font-medium">Total: Max 100 pts (auto) + ±10 faculty boost = 110 max</p>
      </div>

      {/* Track Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trackStats.map((ts, idx) => (
          <motion.div key={ts.track} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className={`px-5 py-4 bg-gradient-to-r ${trackGradients[ts.track]} text-white`}>
              <span className="text-2xl">{trackIcons[ts.track]}</span>
              <h3 className="font-bold text-lg mt-1">{ts.track}</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Enrolled Students</span>
                <span className="font-bold text-gray-900">{ts.enrolled}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Related Projects</span>
                <span className="font-bold text-gray-900">{ts.projects}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ranked Students</span>
                <span className="font-bold text-gray-900">{ts.rankings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg. Score</span>
                <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg">{ts.avgScore}/100</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExpertiseConfig;
