import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useData } from '../contexts/DataProvider';
import {
  LayoutDashboard, User, Briefcase, LogOut, FileText, Users, Award,
  ClipboardList, Trophy, Menu, X, GitBranch, UserCheck, BarChart3,
  Settings, Zap, GraduationCap, Building2
} from 'lucide-react';
import { clsx } from 'clsx';
import corefolioLogo from "../../assets/logo.png";

const DashboardLayout = () => {
  const { logout, currentUser } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  // ── Role-specific navigation ──
  const studentNavItems = [
    { path: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/student/profile', label: 'My Profile', icon: User },
    { path: '/dashboard/student/projects', label: 'My Projects', icon: Briefcase },
    { path: '/dashboard/student/experience', label: 'Experience & Awards', icon: Award },

    { path: '/dashboard/student/resume', label: 'Resume Builder', icon: FileText },
    { path: '/dashboard/student/feedback', label: 'Faculty Feedback', icon: ClipboardList },
  ];

  const facultyNavItems = [
    { path: '/dashboard/faculty', label: 'My Students', icon: Users, exact: true },
    { path: '/dashboard/faculty/leaderboard', label: 'Rankings', icon: Trophy },
  ];

  const adminNavItems = [
    { path: '/dashboard/admin', label: 'Admin Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/admin/branches', label: 'Branch Management', icon: Building2 },
    { path: '/dashboard/admin/users', label: 'User Management', icon: UserCheck },
    { path: '/dashboard/admin/allocations', label: 'Faculty Allocation', icon: Users },

    { path: '/dashboard/admin/rankings', label: 'Global Rankings', icon: BarChart3 },
  ];

  const navItems =
    currentUser?.role === 'admin' ? adminNavItems :
      currentUser?.role === 'faculty' ? facultyNavItems :
        studentNavItems;

  const portalLabel =
    currentUser?.role === 'admin' ? 'Admin Portal' :
      currentUser?.role === 'faculty' ? 'Faculty Portal' :
        'Student Portal';

  const portalGradient =
    currentUser?.role === 'admin' ? 'from-red-500/20 to-orange-500/20 border-red-400/20 text-red-300' :
      currentUser?.role === 'faculty' ? 'from-emerald-500/20 to-teal-500/20 border-emerald-400/20 text-emerald-300' :
        'from-indigo-500/20 to-purple-500/20 border-indigo-400/20 text-indigo-300';

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white flex-shrink-0 hidden md:flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={corefolioLogo} alt="Corefolio" className="h-8 w-auto brightness-0 invert group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-bold tracking-tight text-white">Corefolio</h1>
          </Link>
          <div className={`mt-3 px-3 py-1.5 rounded-full bg-gradient-to-r ${portalGradient} border inline-block`}>
            <p className="text-xs uppercase tracking-wider font-semibold">{portalLabel}</p>
          </div>
        </div>

        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/30">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path}
                className={clsx("flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white")}>
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200">
            <LogOut className="mr-3 h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-2">
            <img src={corefolioLogo} alt="Corefolio" className="h-6 w-auto brightness-0 invert" />
            <h1 className="text-lg font-bold">Corefolio</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${portalGradient} border`}>
              {currentUser?.role?.toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button onClick={handleLogout} className="p-2 hover:bg-red-500/20 rounded-lg text-red-300"><LogOut className="h-5 w-5" /></button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}
                  className={clsx("flex items-center px-3 py-2.5 text-sm font-medium rounded-lg",
                    location.pathname === item.path ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700")}>
                  <Icon className="mr-3 h-4 w-4" />{item.label}
                </Link>
              );
            })}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
};

export default DashboardLayout;
