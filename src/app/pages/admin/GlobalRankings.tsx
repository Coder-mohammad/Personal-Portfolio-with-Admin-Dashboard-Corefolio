import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataProvider';
import { ALL_EXPERTISE_TRACKS, ExpertiseTrack } from '../../types';
import { Trophy, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const GlobalRankings = () => {
  const { students, branches, getRankings, computeRankings, studentExpertise } = useData();
  const [selectedTrack, setSelectedTrack] = useState<ExpertiseTrack>('Software Development');
  const [selectedBranch, setSelectedBranch] = useState('All');

  useEffect(() => { computeRankings(); }, []);

  const rankings = getRankings(selectedTrack, selectedBranch === 'All' ? undefined : selectedBranch);

  const trackGradients: Record<string, string> = {
    'Software Development': 'from-blue-500 to-indigo-600',
    'Core Engineering': 'from-orange-500 to-red-600',
    'Data / AI / Analytics': 'from-emerald-500 to-teal-600',
    'Research & Higher Studies': 'from-purple-500 to-violet-600',
    'Management / Consulting': 'from-amber-500 to-yellow-600',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link to="/dashboard/admin" className="text-sm text-gray-500 hover:text-gray-900">← Admin Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Global Rankings</h1>
        <p className="text-sm text-gray-500">Cross-branch, expertise-specific student rankings.</p>
      </div>

      {/* Track Selector */}
      <div className="flex flex-wrap gap-2">
        {ALL_EXPERTISE_TRACKS.map(track => (
          <button key={track} onClick={() => setSelectedTrack(track)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${selectedTrack === track
              ? `bg-gradient-to-r ${trackGradients[track]} text-white border-transparent shadow-md`
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {track}
          </button>
        ))}
      </div>

      {/* Branch Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all">
          <option value="All">All Branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <span className="text-sm text-gray-500">{rankings.length} students ranked</span>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankings.map((entry, index) => {
          const student = students.find(s => s.id === entry.studentId);
          if (!student) return null;
          const isTop3 = index < 3;
          const medals = ['🥇', '🥈', '🥉'];

          return (
            <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
              className={`flex items-center p-5 rounded-2xl border transition-all duration-300 ${isTop3 ? 'bg-gradient-to-r from-yellow-50/50 to-amber-50/50 border-yellow-200 shadow-md' : 'bg-white border-gray-100 hover:shadow-md'}`}>

              <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-lg font-bold mr-5 shadow-sm ${isTop3 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {isTop3 ? medals[index] : `#${index + 1}`}
              </div>

              <div className="flex items-center flex-1 gap-4">
                <div className={`${isTop3 ? 'h-14 w-14' : 'h-12 w-12'} rounded-2xl overflow-hidden border-2 ${isTop3 ? 'border-white shadow-lg' : 'border-gray-200'} bg-gray-50`}>
                  <ImageWithFallback src={student.avatarUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className={`${isTop3 ? 'text-lg' : 'text-base'} font-bold text-gray-900`}>{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.branch} • Batch {student.batch}</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6 mr-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Auto</p>
                  <p className="text-sm font-bold text-gray-700">{entry.autoScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Boost</p>
                  <p className={`text-sm font-bold ${entry.facultyBoost > 0 ? 'text-green-600' : entry.facultyBoost < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {entry.facultyBoost > 0 ? '+' : ''}{entry.facultyBoost}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`block ${isTop3 ? 'text-4xl' : 'text-3xl'} font-black bg-gradient-to-r ${trackGradients[selectedTrack]} bg-clip-text text-transparent`}>
                  {entry.totalScore}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">/ 110</span>
              </div>
            </motion.div>
          );
        })}

        {rankings.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
            <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings Yet</h3>
            <p className="text-gray-500">Click "Recompute Rankings" on the Expertise Config page to generate rankings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalRankings;
