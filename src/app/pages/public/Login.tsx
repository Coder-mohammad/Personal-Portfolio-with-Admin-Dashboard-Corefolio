import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { useNavigate } from 'react-router';
import { GraduationCap, Users, Shield, Settings, Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import corefolioLogo from "../../../assets/logo.png";

type RoleOption = {
  key: 'student' | 'faculty' | 'admin';
  label: string;
  icon: React.ElementType;
  defaultEmail: string;
};

const ROLES: RoleOption[] = [
  { key: 'student', label: 'STUDENT', icon: GraduationCap, defaultEmail: 'mohammad@corefolio.com' },
  { key: 'faculty', label: 'FACULTY', icon: Users, defaultEmail: 'faculty@corefolio.com' },
  { key: 'admin', label: 'ADMIN', icon: Settings, defaultEmail: 'admin@corefolio.com' },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<RoleOption>(ROLES[0]);
  const [email, setEmail] = useState('mohammad@corefolio.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, currentUser } = useData();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      const dashMap: Record<string, string> = {
        student: '/dashboard/student',
        faculty: '/dashboard/faculty',
        admin: '/dashboard/admin',
      };
      navigate(dashMap[currentUser.role] || '/dashboard/student');
    }
  }, [currentUser, navigate]);

  const handleRoleSwitch = (role: RoleOption) => {
    setSelectedRole(role);
    setEmail(role.defaultEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, selectedRole.key);
      if (success) {
        const dashMap: Record<string, string> = {
          student: '/dashboard/student',
          faculty: '/dashboard/faculty',
          admin: '/dashboard/admin',
        };
        navigate(dashMap[selectedRole.key]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative blurred circles */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="fixed bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative z-10">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-center">
          <div className="mx-auto flex items-center justify-center mb-4">
            <img src={corefolioLogo} alt="Corefolio" className="h-14 w-auto brightness-0 invert" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to Corefolio</h2>
          <p className="mt-1 text-sm text-blue-100">
            Access your dashboard based on your role
          </p>
        </div>

        <div className="px-8 pt-8 pb-6">
          {/* Role Tabs */}
          <div className="flex gap-2 mb-2">
            {ROLES.map(role => (
              <button
                key={role.key}
                onClick={() => handleRoleSwitch(role)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 border-2 tracking-wide ${selectedRole.key === role.key
                  ? 'bg-blue-50 text-blue-600 border-blue-500 shadow-sm'
                  : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200 hover:text-gray-700'
                  }`}
              >
                {role.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-6">Select your role to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
                  placeholder="e.g. mohammad@corefolio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> Signing in...</span>
              ) : (
                <><User className="w-5 h-5 mr-2" /> Sign in</>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Demo credentials: any email above with password <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">password</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
