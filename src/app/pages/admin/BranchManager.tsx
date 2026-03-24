import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Plus, Edit2, Trash2, GitBranch, Save, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

const BranchManager = () => {
  const { branches, users, students, addBranch, updateBranch, deleteBranch } = useData();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', department: '' });

  const handleAdd = () => {
    if (!form.name || !form.code) return;
    addBranch(form);
    setForm({ name: '', code: '', department: '' });
    setAdding(false);
  };

  const startEdit = (b: typeof branches[0]) => {
    setEditing(b.id);
    setForm({ name: b.name, code: b.code, department: b.department });
  };

  const handleUpdate = () => {
    if (!editing) return;
    updateBranch(editing, form);
    setEditing(null);
    setForm({ name: '', code: '', department: '' });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/dashboard/admin" className="text-sm text-gray-500 hover:text-gray-900">← Admin Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Branch Management</h1>
        </div>
        <button onClick={() => { setAdding(true); setEditing(null); }} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4 inline mr-1" /> Add Branch
        </button>
      </div>

      {/* Add/Edit Form */}
      {(adding || editing) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">{editing ? 'Edit Branch' : 'Add New Branch'}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Branch Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="e.g., Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Code *</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all uppercase" placeholder="e.g., CSE" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
              <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="e.g., Engineering" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={editing ? handleUpdate : handleAdd}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md">
              <Save className="w-4 h-4 inline mr-1" /> {editing ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setAdding(false); setEditing(null); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Branch List */}
      <div className="space-y-3">
        {branches.map((branch, idx) => {
          const studentCount = students.filter(s => s.branchId === branch.id).length;
          const facultyCount = users.filter(u => u.role === 'faculty' && u.branchId === branch.id).length;

          return (
            <motion.div key={branch.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {branch.code}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{branch.name}</h3>
                  <p className="text-sm text-gray-500">{branch.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium mr-2">{studentCount} Students</span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-medium">{facultyCount} Faculty</span>
                </div>
                <button onClick={() => startEdit(branch)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm('Delete this branch?')) deleteBranch(branch.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BranchManager;
