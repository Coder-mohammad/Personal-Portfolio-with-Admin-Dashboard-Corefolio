import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { UserCheck, Plus, X, ArrowRight, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

const AllocationManager = () => {
  const { users, students, branches, allocations, allocateStudent, deallocateStudent } = useData();
  const [selFaculty, setSelFaculty] = useState('');
  const [selStudent, setSelStudent] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');

  const faculty = users.filter(u => u.role === 'faculty');
  const unallocatedStudents = students.filter(s => !allocations.some(a => a.studentId === s.id && a.active));

  const handleAllocate = () => {
    if (!selFaculty || !selStudent) return;
    allocateStudent(selFaculty, selStudent);
    setSelStudent('');
  };

  const filteredAllocations = allocations.filter(a => {
    if (!a.active) return false;
    if (filterBranch === 'All') return true;
    const student = students.find(s => s.id === a.studentId);
    return student?.branchId === filterBranch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link to="/dashboard/admin" className="text-sm text-gray-500 hover:text-gray-900">← Admin Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Student–Faculty Allocation</h1>
        <p className="text-sm text-gray-500">Assign students to faculty members for mentoring and evaluation.</p>
      </div>

      {/* Assignment Form */}
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-500" /> New Assignment
        </h3>
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Faculty Member</label>
            <select value={selFaculty} onChange={e => setSelFaculty(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 transition-all">
              <option value="">Select faculty</option>
              {faculty.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({branches.find(b => b.id === f.branchId)?.code || '—'})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Student (Unassigned)</label>
            <select value={selStudent} onChange={e => setSelStudent(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 transition-all">
              <option value="">Select student</option>
              {unallocatedStudents.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.branch})</option>
              ))}
              {/* Allow assigning already-allocated students to additional faculty */}
              <optgroup label="All Students">
                {students.map(s => (
                  <option key={`all-${s.id}`} value={s.id}>{s.name} ({s.branch})</option>
                ))}
              </optgroup>
            </select>
          </div>
          <button onClick={handleAllocate}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-[0.98] h-[42px]">
            <Plus className="w-4 h-4 inline mr-1" /> Assign
          </button>
        </div>
        {unallocatedStudents.length > 0 && (
          <p className="text-xs text-amber-600 mt-2">⚠ {unallocatedStudents.length} student(s) are not assigned to any faculty.</p>
        )}
      </div>

      {/* Branch Filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...branches.map(b => b.id)].map(bid => (
          <button key={bid} onClick={() => setFilterBranch(bid)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${filterBranch === bid ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {bid === 'All' ? 'All Branches' : branches.find(b => b.id === bid)?.name || bid}
          </button>
        ))}
      </div>

      {/* Active Allocations */}
      <div className="space-y-3">
        {faculty.map(fac => {
          const facAllocations = filteredAllocations.filter(a => a.facultyId === fac.id);
          if (facAllocations.length === 0) return null;

          return (
            <motion.div key={fac.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">{fac.name.charAt(0)}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{fac.name}</h3>
                  <p className="text-xs text-gray-500">{branches.find(b => b.id === fac.branchId)?.name} • {facAllocations.length} assigned</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {facAllocations.map(alloc => {
                  const student = students.find(s => s.id === alloc.studentId);
                  if (!student) return null;
                  return (
                    <div key={alloc.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 group">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.branch} • Batch {student.batch}</p>
                      </div>
                      <button onClick={() => deallocateStudent(alloc.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AllocationManager;
