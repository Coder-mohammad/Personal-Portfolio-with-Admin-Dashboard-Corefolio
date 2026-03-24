import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Link } from 'react-router';
import { Search, Eye, CheckCircle, Clock, FileText, Users, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { motion } from 'motion/react';

const FacultyDashboard = () => {
  const { currentUser, getAssignedStudents, evaluations, projects } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Faculty can ONLY see assigned students
  const assignedStudents = getAssignedStudents(currentUser?.id || '');

  const filteredStudents = assignedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const evaluatedCount = assignedStudents.filter(s => evaluations.some(e => e.studentId === s.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assigned Students</h1>
          <p className="text-sm text-gray-500 mt-1">Review and evaluate only your assigned students.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm">
            <span className="text-gray-500">Evaluated: </span>
            <span className="font-bold text-indigo-600">{evaluatedCount}/{assignedStudents.length}</span>
          </div>
          <Link to="/dashboard/faculty/leaderboard" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-md transition-all">
            View Rankings
          </Link>
        </div>
      </div>

      {assignedStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Students Assigned</h2>
          <p className="text-gray-500">Contact the Admin to get students assigned to you.</p>
        </div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input type="text" placeholder="Search assigned students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Projects</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student, idx) => {
                  const studentProjects = projects.filter(p => p.studentId === student.id);
                  const isEvaluated = evaluations.some(e => e.studentId === student.id);

                  return (
                    <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                      className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                            <ImageWithFallback src={student.avatarUrl} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{student.branch}</p>
                        <p className="text-xs text-gray-500">Batch {student.batch}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{studentProjects.length}</td>
                      <td className="px-6 py-4">
                        {isEvaluated ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" /> Evaluated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 mr-1" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/dashboard/faculty/resume/${student.id}`} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                            <FileText className="w-3.5 h-3.5 mr-1" /> Resume
                          </Link>
                          <Link to={`/dashboard/faculty/evaluate/${student.id}`} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
                            <Eye className="w-3.5 h-3.5 mr-1" /> Review
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyDashboard;
