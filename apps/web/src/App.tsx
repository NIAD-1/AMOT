import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CaptureAdvertPage } from './pages/CaptureAdvertPage';
import { ObservationListPage } from './pages/ObservationListPage';
import { ObservationDetailPage } from './pages/ObservationDetailPage';
import { ReviewPage } from './pages/ReviewPage';
import { MyAssignmentsPage } from './pages/MyAssignmentsPage';
import { AlertsListPage } from './pages/AlertsListPage';
import { AlertDetailPage } from './pages/AlertDetailPage';
import { AlertCreatePage } from './pages/AlertCreatePage';
import { DashboardPage } from './pages/DashboardPage';
import { EscalationsPage } from './pages/EscalationsPage';
import { UsersManagementPage } from './pages/UsersManagementPage';
import { NapamsSyncPage } from './pages/NapamsSyncPage';
import { ExcelImportPage } from './pages/ExcelImportPage';
import { useAuthStore } from './stores/auth.store';

export const App: React.FC = () => {
  const { isAuthenticated, hasRole } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
      } />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* All Roles */}
          <Route path="/" element={<HomePage />} />
          <Route path="/capture" element={<CaptureAdvertPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/observations" element={<ObservationListPage />} />
          <Route path="/observations/:id" element={<ObservationDetailPage />} />
          <Route path="/observations/:id/review" element={<ReviewPage />} />
          <Route path="/assignments" element={<MyAssignmentsPage />} />
          <Route path="/alerts" element={<AlertsListPage />} />
          <Route path="/alerts/:id" element={<AlertDetailPage />} />

          {/* Advert Team, Supervisor, Admin */}
          <Route element={<ProtectedRoute requiredRoles={['ADVERT_TEAM', 'SUPERVISOR', 'ADMINISTRATOR', 'ADMIN']} />}>
            <Route path="/alerts/create" element={<AlertCreatePage />} />
            <Route path="/admin/imports" element={<ExcelImportPage />} />
          </Route>

          {/* Supervisor, Admin */}
          <Route element={<ProtectedRoute requiredRoles={['SUPERVISOR', 'ADMINISTRATOR', 'ADMIN']} />}>
            <Route path="/escalations" element={<EscalationsPage />} />
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute requiredRoles={['ADMINISTRATOR', 'ADMIN']} />}>
            <Route path="/admin/users" element={<UsersManagementPage />} />
            <Route path="/admin/napams" element={<NapamsSyncPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
