import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ThesisDocPage from './pages/ThesisDocPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExamsPage from './pages/ExamsPage';
import ScantronGenPage from './pages/ScantronGenPage';
import ScannerPage from './pages/ScannerPage';
import GradebookPage from './pages/GradebookPage';
import StudentsPage from './pages/StudentsPage';
import RequireAuth from './components/RequireAuth';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Visitor Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/thesis-docs" element={<ThesisDocPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Instructor Pages */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth allowedRoles={['instructor', 'admin']}>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/exams"
          element={
            <RequireAuth allowedRoles={['instructor', 'admin']}>
              <ExamsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/scantron-generator"
          element={
            <RequireAuth allowedRoles={['instructor', 'admin']}>
              <ScantronGenPage />
            </RequireAuth>
          }
        />
        <Route
          path="/scanner"
          element={
            <RequireAuth allowedRoles={['instructor', 'admin']}>
              <ScannerPage />
            </RequireAuth>
          }
        />
        <Route
          path="/gradebook"
          element={
            <RequireAuth allowedRoles={['instructor', 'admin']}>
              <GradebookPage />
            </RequireAuth>
          }
        />
        <Route
          path="/students"
          element={
            <RequireAuth allowedRoles={['instructor', 'admin']}>
              <StudentsPage />
            </RequireAuth>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
