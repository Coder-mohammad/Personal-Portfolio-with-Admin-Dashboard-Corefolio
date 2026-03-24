import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Plus, Trash2, Search, UserPlus, Save, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { UserRole } from '../../types';

const UserManager = () => {
  const { users, branches, addUser, deleteUser } = useData();
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [form, setForm] = useState({ name: '', email: '', role: 'student' as UserRole, branchId: '' });

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    addUser(form);
    setForm({ name: '', email: '', role: 'student', branchId: '' });
    setAdding(false);
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'All' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleColors: Record<string, string> = {
    admin: 'bg-red-50 text-red-700 border-red-200',
    faculty: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    student: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/dashboard/admin" className="text-sm text-gray-500 hover:text-gray-900">← Admin Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">User Management</h1>
          <p className="text-sm text-gray-500">{users.length} total users</p>
        </div>
        <button onClick={() => setAdding(true)} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md">
          <UserPlus className="w-4 h-4 inline mr-1" /> Add User
        </button>
      </div>

      {/* Add Form */}
      {adding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Create New User</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role *</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Branch</label>
              <select value={form.branchId} onChange={e => setForm(f => ({ ...f, branchId: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all">
                <option value="">Select branch</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md">
              <Save className="w-4 h-4 inline mr-1" /> Create User
            </button>
            <button onClick={() => setAdding(false)} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
        </div>
        <div className="flex gap-2">
          {['All', 'student', 'faculty', 'admin'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${filterRole === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {r === 'All' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Branch</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((user, idx) => (
              <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{user.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${roleColors[user.role] || 'bg-gray-50 text-gray-600'}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {branches.find(b => b.id === user.branchId)?.name || '—'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { if (confirm(`Delete ${user.name}?`)) deleteUser(user.id); }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
