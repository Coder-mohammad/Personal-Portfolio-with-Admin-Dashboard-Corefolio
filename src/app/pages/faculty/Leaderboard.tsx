import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataProvider';
import { ALL_EXPERTISE_TRACKS, ExpertiseTrack } from '../../types';
import { Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const Leaderboard = () => {
  const { currentUser, students, getRankings, computeRankings, getAssignedStudents } = useData();
  const [selectedTrack, setSelectedTrack] = useState<ExpertiseTrack>('Software Development');

  useEffect(() => { computeRankings(); }, []);

  // Faculty sees rankings only for their assigned students
  const assignedIds = getAssignedStudents(currentUser?.id || '').map(s => s.id);
  const rankings = getRankings(selectedTrack).filter(r => assignedIds.includes(r.studentId));

  const trackGradients: Record<string, string> = {
    'Software Development': 'from-blue-500 to-indigo-600',
    'Core Engineering': 'from-orange-500 to-red-600',
    'Data / AI / Analytics': 'from-emerald-500 to-teal-600',
    'Research & Higher Studies': 'from-purple-500 to-violet-600',
    'Management / Consulting': 'from-amber-500 to-yellow-600',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/faculty" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Rankings</h1>
          <p className="text-sm text-gray-500">Expertise-based rankings for your assigned students.</p>
        </div>
      </div>

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

      <div className="space-y-3">
        {rankings.map((entry, index) => {
          const student = students.find(s => s.id === entry.studentId);
          if (!student) return null;
          const isTop3 = index < 3;
          const medals = ['🥇', '🥈', '🥉'];

          return (
            <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
              className={`flex items-center p-5 rounded-2xl border transition-all ${isTop3 ? 'bg-gradient-to-r from-yellow-50/50 to-amber-50/50 border-yellow-200 shadow-md' : 'bg-white border-gray-100 hover:shadow-md'}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-lg font-bold mr-5 shadow-sm ${isTop3 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {isTop3 ? medals[index] : `#${index + 1}`}
              </div>
              <div className="flex items-center flex-1 gap-4">
                <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                  <ImageWithFallback src={student.avatarUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.branch} • Batch {student.batch}</p>
                </div>
              </div>
              <span className={`text-3xl font-black bg-gradient-to-r ${trackGradients[selectedTrack]} bg-clip-text text-transparent`}>{entry.totalScore}</span>
            </motion.div>
          );
        })}

        {rankings.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
            <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings</h3>
            <p className="text-gray-500">None of your assigned students have enrolled in this expertise track.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
