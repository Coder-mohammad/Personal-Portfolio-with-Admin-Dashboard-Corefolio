import React, { useEffect } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Briefcase, FileText, ClipboardList, ExternalLink, Plus, Edit2, Award, Building2, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

const StudentDashboard = () => {
  const { currentUser, getStudentData, getPlacementReadiness, computeRankings, studentExpertise } = useData();
  const { profile, projects, evaluations, achievements, internships } = getStudentData(currentUser?.id || '');

  useEffect(() => { computeRankings(); }, []);

  const readiness = getPlacementReadiness(currentUser?.id || '');
  const myRankings = studentExpertise.filter(e => e.studentId === currentUser?.id);

  const averageScore = evaluations.length > 0
    ? (evaluations.reduce((acc, curr) => acc + curr.totalScore, 0) / evaluations.length).toFixed(1) : 'N/A';

  const statCards = [
    { to: '/dashboard/student/projects', label: 'Projects', value: projects.length, icon: Briefcase, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', color: 'text-blue-600' },
    { to: '/dashboard/student/experience', label: 'Experience & Awards', value: achievements.length + internships.length, icon: Award, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { to: '/dashboard/student/feedback', label: 'Faculty Score', value: averageScore, icon: ClipboardList, gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', color: 'text-amber-600' },

  ];

  const readinessBreakdown = [
    { label: 'Portfolio', score: readiness.portfolioScore, color: 'from-blue-400 to-indigo-500' },
    { label: 'Projects', score: readiness.projectScore, color: 'from-emerald-400 to-teal-500' },
    { label: 'Internships', score: readiness.internshipScore, color: 'from-purple-400 to-violet-500' },
    { label: 'Certifications', score: readiness.certificationScore, color: 'from-pink-400 to-rose-500' },
    { label: 'Faculty', score: readiness.facultyScore, color: 'from-amber-400 to-orange-500' },
    { label: 'Resume', score: readiness.resumeScore, color: 'from-cyan-400 to-blue-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.name} 👋</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your portfolio and track your placement readiness.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Link to={card.to} className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>{card.value}</p>
                  </div>
                  <div className={`p-3 ${card.bg} rounded-xl`}><Icon className={`h-6 w-6 ${card.color}`} /></div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        {/* Placement Readiness */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" /> Placement Readiness</h2>
            <span className={`text-2xl font-black ${readiness.overallIndex >= 70 ? 'text-green-600' : readiness.overallIndex >= 40 ? 'text-amber-600' : 'text-red-500'}`}>{readiness.overallIndex}%</span>
          </div>
          <div className="space-y-3">
            {readinessBreakdown.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-600">{item.label}</span>
                  <span className="font-bold text-gray-900">{item.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className={`bg-gradient-to-r ${item.color} h-1.5 rounded-full transition-all`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>


      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
        <h2 className="text-lg font-bold text-indigo-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/student/projects/new" className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all">
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Link>
          <Link to="/dashboard/student/profile" className="inline-flex items-center px-4 py-2.5 bg-white text-indigo-700 border border-indigo-200 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Link>
          <Link to={`/student/${currentUser?.id}`} target="_blank" className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <ExternalLink className="w-4 h-4 mr-2" /> View Portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
