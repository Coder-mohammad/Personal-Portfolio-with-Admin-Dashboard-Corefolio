import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { useNavigate, Link } from 'react-router';
import {
  GraduationCap, Mail, Lock, User, ArrowLeft, Eye, EyeOff,
  CheckCircle2, AlertCircle, GitBranch
} from 'lucide-react';
import corefolioLogo from '../../../assets/logo.png';

const Register = () => {
  const { branches } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    branchId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Full name is required.');
    if (!form.email.trim()) return setError('Email is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setIsLoading(true);
    try {
      // Call the public registration endpoint (no auth token required)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: 'student',
          branchId: form.branchId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Store the token returned by the server
      localStorage.setItem('corefolio_token', data.token);

      setSuccess(true);
      // Redirect to dashboard after showing success animation
      setTimeout(() => navigate('/dashboard/student'), 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative blobs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="fixed bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-center">
          <div className="mx-auto flex items-center justify-center mb-4">
            <img src={corefolioLogo} alt="Corefolio" className="h-14 w-auto brightness-0 invert" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
          <p className="mt-1 text-sm text-blue-100">Join Corefolio as a User</p>
        </div>

        <div className="px-8 pt-7 pb-7">
          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
              <h3 className="text-xl font-bold text-gray-900">Account Created!</h3>
              <p className="text-sm text-gray-500">Logging you in automatically…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error banner */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Your full name"
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Branch <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <GitBranch className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={form.branchId}
                    onChange={set('branchId')}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm appearance-none"
                  >
                    <option value="">Select your branch</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min. 6 characters"
                    className="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    placeholder="Re-enter password"
                    className="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  <>
                    <GraduationCap className="w-5 h-5" /> Create Account
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to login */}
          {!success && (
            <div className="mt-5 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Already have an account? Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
