import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CompilerPage from './pages/CompilerPage';
import PlacementPage from './pages/PlacementPage';
import ContactPage from './pages/ContactPage';
import TutorialPage from './pages/TutorialPage';
import AiAssistantPage from './pages/AiAssistantPage';
import AttendancePage from './pages/AttendancePage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LiveClassesPage from './pages/LiveClassesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import TrainingPage from './pages/TrainingPage';
import HrDashboard from './pages/HrDashboard';
import CertificatesPage from './pages/CertificatesPage';
import QuizPage from './pages/QuizPage';
import GamificationPage from './pages/GamificationPage';
import ForumPage from './pages/ForumPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRedirectMap = {
      'student': '/student',
      'trainer': '/trainer',
      'super_admin': '/admin',
      'hr_admin': '/hr',
      'mentor': '/mentor',
      'placement_officer': '/placement'
    };
    return <Navigate to={roleRedirectMap[user.role] || '/student'} replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/compiler" element={<CompilerPage />} />
          <Route path="/tutorials" element={<TutorialPage />} />
          <Route path="/placements" element={<PlacementPage />} />
          <Route path="/live-classes" element={<LiveClassesPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/courses" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/analytics" element={<ProtectedRoute allowedRoles={['super_admin', 'hr_admin', 'placement_officer']}><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/quizzes" element={<QuizPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/achievements" element={<GamificationPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/discussions" element={<ForumPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Dashboards for 6 user roles */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student', 'super_admin']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/faculty" element={<ProtectedRoute allowedRoles={['trainer', 'faculty', 'mentor', 'super_admin']}><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/trainer" element={<ProtectedRoute allowedRoles={['trainer', 'faculty', 'mentor', 'super_admin']}><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/super_admin" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/hr" element={<ProtectedRoute allowedRoles={['hr_admin', 'super_admin']}><HrDashboard /></ProtectedRoute>} />
          <Route path="/hr_admin" element={<ProtectedRoute allowedRoles={['hr_admin', 'super_admin']}><HrDashboard /></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute allowedRoles={['mentor', 'trainer', 'super_admin']}><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/placement" element={<ProtectedRoute allowedRoles={['placement_officer', 'super_admin']}><PlacementPage /></ProtectedRoute>} />
          <Route path="/placement_officer" element={<ProtectedRoute allowedRoles={['placement_officer', 'super_admin']}><PlacementPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

