import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { DataProvider, useData } from './contexts/DataProvider';
import { Toaster } from 'sonner';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import StudentPortfolio from './pages/public/StudentPortfolio';
import ProjectDetails from './pages/public/ProjectDetails';
import Login from './pages/public/Login';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ProfileEditor from './pages/student/ProfileEditor';
import ProjectsManager from './pages/student/ProjectsManager';
import ProjectEditor from './pages/student/ProjectEditor';
import ResumeBuilder from './pages/student/ResumeBuilder';
import FeedbackView from './pages/student/FeedbackView';
import ExperiencePage from './pages/student/ExperiencePage';


// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import EvaluationPage from './pages/faculty/EvaluationPage';
import Leaderboard from './pages/faculty/Leaderboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BranchManager from './pages/admin/BranchManager';
import UserManager from './pages/admin/UserManager';
import AllocationManager from './pages/admin/AllocationManager';

import GlobalRankings from './pages/admin/GlobalRankings';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { currentUser } = useData();
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />;
  return children;
};

export default function AppRouter() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="student/:id" element={<StudentPortfolio />} />
            <Route path="student/:id/project/:projectId" element={<ProjectDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="admin/login" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* ── Student ── */}
            <Route path="student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="student/profile" element={<ProtectedRoute allowedRoles={['student']}><ProfileEditor /></ProtectedRoute>} />
            <Route path="student/projects" element={<ProtectedRoute allowedRoles={['student']}><ProjectsManager /></ProtectedRoute>} />
            <Route path="student/projects/new" element={<ProtectedRoute allowedRoles={['student']}><ProjectEditor /></ProtectedRoute>} />
            <Route path="student/projects/edit/:id" element={<ProtectedRoute allowedRoles={['student']}><ProjectEditor /></ProtectedRoute>} />
            <Route path="student/resume" element={<ProtectedRoute allowedRoles={['student']}><ResumeBuilder /></ProtectedRoute>} />
            <Route path="student/feedback" element={<ProtectedRoute allowedRoles={['student']}><FeedbackView /></ProtectedRoute>} />
            <Route path="student/experience" element={<ProtectedRoute allowedRoles={['student']}><ExperiencePage /></ProtectedRoute>} />
            {/* ── Faculty ── */}
            <Route path="faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
            <Route path="faculty/evaluate/:studentId" element={<ProtectedRoute allowedRoles={['faculty']}><EvaluationPage /></ProtectedRoute>} />
            <Route path="faculty/resume/:studentId" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><ResumeBuilder /></ProtectedRoute>} />
            <Route path="faculty/leaderboard" element={<ProtectedRoute allowedRoles={['faculty']}><Leaderboard /></ProtectedRoute>} />

            {/* ── Admin ── */}
            <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/branches" element={<ProtectedRoute allowedRoles={['admin']}><BranchManager /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManager /></ProtectedRoute>} />
            <Route path="admin/allocations" element={<ProtectedRoute allowedRoles={['admin']}><AllocationManager /></ProtectedRoute>} />

            <Route path="admin/rankings" element={<ProtectedRoute allowedRoles={['admin']}><GlobalRankings /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </DataProvider>
  );
}
