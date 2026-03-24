import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { useData } from '../contexts/DataProvider';
import { Menu, X } from 'lucide-react';
import corefolioLogo from "../../assets/logo.png";

const PublicLayout = () => {
  const { currentUser } = useData();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'student') return '/dashboard/student';
    return '/dashboard/faculty';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group">
                <img src={corefolioLogo} alt="Corefolio" className="h-10 w-auto group-hover:scale-105 transition-transform" />
                <span className="text-xl font-extrabold text-gray-900 tracking-tight hidden sm:block">Corefolio</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Browse Students</Link>

              {currentUser ? (
                <Link
                  to={getDashboardPath()}
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg active:scale-[0.98]"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg active:scale-[0.98]"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse Students
              </Link>
              <Link
                to={getDashboardPath()}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {currentUser ? 'Dashboard' : 'Login'}
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center gap-3">
              <img src={corefolioLogo} alt="Corefolio" className="h-8 w-auto brightness-0 invert opacity-80" />
              <div>
                <h3 className="text-white text-lg font-bold">Corefolio</h3>
                <p className="text-sm text-slate-400">University Project Management & Portfolio System</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Corefolio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
