import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ExtinguisherListPage from '../pages/extinguishers/ExtinguisherListPage';
import ExtinguisherDetailsPage from '../pages/extinguishers/ExtinguisherDetailsPage';
import ExtinguisherFormPage from '../pages/extinguishers/ExtinguisherFormPage';
import InspectionSchedulePage from '../pages/inspections/InspectionSchedulePage';
import InspectionHistoryPage from '../pages/inspections/InspectionHistoryPage';
import MaintenanceLogPage from '../pages/maintainance/MaintenanceLogPage';
import CompliancePage from '../pages/compliance/CompliancePage';
import ReportsPage from '../pages/reports/ReportsPage';
import ProfilePage from '../pages/users/ProfilePage';
import UserManagementPage from '../pages/admin/UserManagementPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/extinguishers" element={<ExtinguisherListPage />} />
        <Route path="/extinguishers/new" element={<ExtinguisherFormPage />} />
        <Route path="/extinguishers/:id" element={<ExtinguisherDetailsPage />} />
        <Route path="/extinguishers/:id/edit" element={<ExtinguisherFormPage />} />
        <Route path="/inspections/schedule" element={<InspectionSchedulePage />} />
        <Route path="/inspections/history" element={<InspectionHistoryPage />} />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute roles={['ADMIN', 'INSPECTOR']}>
              <MaintenanceLogPage />
            </ProtectedRoute>
          }
        />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={['ADMIN', 'INSPECTOR']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
