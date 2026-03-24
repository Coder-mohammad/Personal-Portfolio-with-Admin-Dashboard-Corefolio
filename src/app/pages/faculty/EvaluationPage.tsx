import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useData } from '../../contexts/DataProvider';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { RubricScore } from '../../types';
import { toast } from 'sonner';
import { ArrowLeft, ExternalLink, Save, FileText } from 'lucide-react';

const EvaluationPage = () => {
  const { studentId } = useParams();
  const { getStudentData, addEvaluation } = useData();
  const { profile, projects, evaluations } = getStudentData(studentId || '');

  const existingEval = evaluations[0];

  const [scores, setScores] = useState<RubricScore>(existingEval?.scores || {
    innovation: 5, complexity: 5, uiux: 5, backend: 5,
    database: 5, deployment: 5, documentation: 5, codeQuality: 5
  });

  const [comments, setComments] = useState(existingEval?.comments || '');
  const [status, setStatus] = useState<'Approved' | 'Needs Improvement'>(existingEval?.status || 'Needs Improvement');

  if (!profile) return <div className="p-8 text-center text-gray-500">Student not found</div>;

  const handleScoreChange = (key: keyof RubricScore, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvaluation({
      studentId: profile.id,
      scores,
      totalScore: Object.values(scores).reduce((a, b) => a + b, 0),
      comments,
      status
    });
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = 80;
  const percentage = Math.round((totalScore / maxScore) * 100);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Link to="/dashboard/faculty" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Student Portfolio View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                <ImageWithFallback src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-indigo-600 font-medium">{profile.headline}</p>
              </div>
              <div className="ml-auto flex flex-col items-end gap-2">
                <a href={`/student/${profile.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-indigo-600 hover:underline">
                  View Public Page <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <Link to={`/dashboard/faculty/resume/${profile.id}`} className="flex items-center text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <FileText className="w-3.5 h-3.5 mr-1" /> View Resume
                </Link>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Projects to Review</h3>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900">{project.title}</h4>
                    <div className="flex space-x-2">
                      {project.demoLink && <a href={project.demoLink} target="_blank" className="text-xs text-blue-600 hover:underline px-2 py-1 bg-blue-50 rounded-lg">Demo</a>}
                      {project.repoLink && <a href={project.repoLink} target="_blank" className="text-xs text-gray-600 hover:underline px-2 py-1 bg-gray-100 rounded-lg">Code</a>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.techStack.map(t => <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-medium">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Grading Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Evaluation Rubric</h2>

            {/* Score Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
                  />
                  <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-indigo-600">{totalScore}</span>
                  <span className="text-xs text-gray-400">/ {maxScore}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                {Object.keys(scores).map((key) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <label className="capitalize font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <span className="font-bold text-indigo-600">{scores[key as keyof RubricScore]}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="10"
                      value={scores[key as keyof RubricScore]}
                      onChange={(e) => handleScoreChange(key as keyof RubricScore, parseInt(e.target.value))}
                      className="w-full accent-indigo-600 h-2"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comments / Feedback</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all resize-none"
                    rows={4}
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    placeholder="Provide constructive feedback..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Final Status</label>
                  <div className="flex gap-3">
                    <label className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${status === 'Approved' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" checked={status === 'Approved'} onChange={() => setStatus('Approved')} className="sr-only" />
                      <span className="text-sm font-semibold">✓ Approved</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${status === 'Needs Improvement' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" checked={status === 'Needs Improvement'} onChange={() => setStatus('Needs Improvement')} className="sr-only" />
                      <span className="text-sm font-semibold">⚠ Needs Work</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4 mr-2" /> Submit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;
