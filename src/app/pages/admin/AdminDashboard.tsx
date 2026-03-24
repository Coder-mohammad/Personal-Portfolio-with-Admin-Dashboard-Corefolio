import React from 'react';
import { useData } from '../../contexts/DataProvider';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, GitBranch, BookOpen, UserCheck, Trophy, BarChart3, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
  const { students, users, branches, courses, allocations, evaluations, projects, computeRankings } = useData();

  const stats = [
    { label: 'Total Students', value: users.filter(u => u.role === 'student').length, icon: Users, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20', bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Faculty Members', value: users.filter(u => u.role === 'faculty').length, icon: UserCheck, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20', bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Branches', value: branches.length, icon: GitBranch, gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20', bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Active Allocations', value: allocations.filter(a => a.active).length, icon: BookOpen, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20', bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  const quickLinks = [
    { label: 'Manage Branches', to: '/dashboard/admin/branches', icon: GitBranch },
    { label: 'Manage Users', to: '/dashboard/admin/users', icon: Users },
    { label: 'Student Allocations', to: '/dashboard/admin/allocations', icon: UserCheck },

    { label: 'Global Rankings', to: '/dashboard/admin/rankings', icon: Trophy },
  ];

  const publishedCount = students.filter(s => s.isPublished).length;
  const evaluatedCount = new Set(evaluations.map(e => e.studentId)).size;
  const totalProjects = projects.length;
  const verifiedProjects = projects.filter(p => p.verified).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">University-wide analytics and management.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
              className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg ${s.shadow} transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{s.label}</p>
                  <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.value}</p>
                </div>
                <div className={`p-3 ${s.bg} rounded-xl`}><Icon className={`h-6 w-6 ${s.color}`} /></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Published Portfolios</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: `${students.length ? (publishedCount / students.length) * 100 : 0}%` }} /></div>
                <span className="text-sm font-bold text-gray-900">{publishedCount}/{students.length}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Evaluated Students</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full" style={{ width: `${students.length ? (evaluatedCount / students.length) * 100 : 0}%` }} /></div>
                <span className="text-sm font-bold text-gray-900">{evaluatedCount}/{students.length}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Verified Projects</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-purple-400 to-violet-500 h-2 rounded-full" style={{ width: `${totalProjects ? (verifiedProjects / totalProjects) * 100 : 0}%` }} /></div>
                <span className="text-sm font-bold text-gray-900">{verifiedProjects}/{totalProjects}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Branch Distribution</h3>
          <div className="space-y-3">
            {branches.map(branch => {
              const count = students.filter(s => s.branchId === branch.id).length;
              return (
                <div key={branch.id} className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{branch.name}</span>
                    <span className="text-xs text-gray-400 ml-2">({branch.code})</span>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">{count} students</span>
                </div>
              );
            })}
          </div>

          <button onClick={computeRankings} className="mt-4 w-full py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100">
            🔄 Recompute Rankings
          </button>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickLinks.map(l => {
            const Icon = l.icon;
            return (
              <Link key={l.to} to={l.to} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-all group border border-gray-100">
                <Icon className="w-6 h-6 text-indigo-500 group-hover:text-indigo-700" />
                <span className="text-xs font-semibold text-gray-700 text-center">{l.label}</span>
                <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-indigo-500 transition-colors" />
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
