import React from 'react';
import { useData } from '../../contexts/DataProvider';
import { ClipboardList, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const FeedbackView = () => {
  const { currentUser, getStudentData } = useData();
  const { evaluations } = getStudentData(currentUser?.id || '');
  const evaluation = evaluations[0];

  if (!evaluation) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Feedback Yet</h2>
        <p className="text-gray-500 mt-2">Your portfolio hasn't been evaluated by a faculty member yet.</p>
      </div>
    );
  }

  const maxScore = 80;
  const percentage = Math.round((evaluation.totalScore / maxScore) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
      >
        <div className={`p-6 border-b ${evaluation.status === 'Approved' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Evaluation</h1>
              <p className="text-sm text-gray-600 mt-1">Feedback received on {new Date(evaluation.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center shadow-sm ${evaluation.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
              {evaluation.status === 'Approved' ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
              {evaluation.status}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#feedbackGradient)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
                />
                <defs><linearGradient id="feedbackGradient" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{evaluation.totalScore}</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">/ {maxScore}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(evaluation.scores).map(([category, score], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100"
              >
                <div className="text-sm text-gray-500 capitalize mb-1">{category.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="font-bold text-xl text-gray-900">{score}/10</div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${(score as number) * 10}%` }} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">Faculty Comments</h3>
            <p className="text-indigo-800 italic leading-relaxed">"{evaluation.comments}"</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackView;
