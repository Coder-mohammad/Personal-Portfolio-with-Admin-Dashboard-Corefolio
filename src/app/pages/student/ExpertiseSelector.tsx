import React, { useEffect } from 'react';
import { useData } from '../../contexts/DataProvider';
import { ALL_EXPERTISE_TRACKS, ExpertiseTrack } from '../../types';
import { Zap, CheckCircle, Circle, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

const ExpertiseSelector = () => {
  const { currentUser, students, updateExpertiseTracks, computeRankings, getRankings, studentExpertise } = useData();
  const profile = students.find(s => s.id === currentUser?.id);
  const selectedTracks = profile?.expertiseTracks || [];

  useEffect(() => { computeRankings(); }, []);

  const toggleTrack = (track: ExpertiseTrack) => {
    const newTracks = selectedTracks.includes(track)
      ? selectedTracks.filter(t => t !== track)
      : [...selectedTracks, track];
    updateExpertiseTracks(newTracks);
    setTimeout(() => computeRankings(), 100);
  };

  const trackIcons: Record<string, string> = {
    'Software Development': '💻',
    'Core Engineering': '⚙️',
    'Data / AI / Analytics': '🤖',
    'Research & Higher Studies': '📚',
    'Management / Consulting': '📊',
  };

  const trackDescriptions: Record<string, string> = {
    'Software Development': 'Web, mobile, and software engineering projects',
    'Core Engineering': 'Hardware, embedded systems, circuit design',
    'Data / AI / Analytics': 'Machine learning, data science, analytics',
    'Research & Higher Studies': 'Research publications, thesis, higher education prep',
    'Management / Consulting': 'Business analysis, project management, consulting',
  };

  const trackGradients: Record<string, string> = {
    'Software Development': 'from-blue-500 to-indigo-600',
    'Core Engineering': 'from-orange-500 to-red-600',
    'Data / AI / Analytics': 'from-emerald-500 to-teal-600',
    'Research & Higher Studies': 'from-purple-500 to-violet-600',
    'Management / Consulting': 'from-amber-500 to-yellow-600',
  };

  // Get my rankings
  const myRankings = studentExpertise.filter(e => e.studentId === currentUser?.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Expertise Tracks</h1>
        <p className="text-sm text-gray-500 mt-1">Select the tracks you want to be ranked in. You can appear in multiple tracks.</p>
      </motion.div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100">
        <p className="text-sm text-indigo-800">
          <Zap className="w-4 h-4 inline mr-1" />
          <strong>How it works:</strong> Your rank is computed based on your GPA, verified projects, internships, certifications, faculty evaluations, and achievements — specific to each track.
        </p>
      </div>

      {/* Track Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {ALL_EXPERTISE_TRACKS.map((track, idx) => {
          const isSelected = selectedTracks.includes(track);
          const ranking = myRankings.find(r => r.track === track);

          return (
            <motion.button key={track} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
              onClick={() => toggleTrack(track)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 ${isSelected ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-500/10' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{trackIcons[track]}</span>
                {isSelected ? (
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{track}</h3>
              <p className="text-sm text-gray-500 mt-1">{trackDescriptions[track]}</p>

              {isSelected && ranking && (
                <div className="mt-4 pt-4 border-t border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Rank #{ranking.rank || '—'} in branch
                    </span>
                  </div>
                  <span className={`text-xl font-black bg-gradient-to-r ${trackGradients[track]} bg-clip-text text-transparent`}>
                    {ranking.totalScore}/110
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedTracks.length === 0 && (
        <p className="text-center text-gray-400 text-sm">Select at least one track to appear in the ranking system.</p>
      )}
    </div>
  );
};

export default ExpertiseSelector;
