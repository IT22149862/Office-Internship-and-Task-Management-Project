import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/Dashboard';
import AdminInterns from './pages/admin/Interns';
import AdminProjects from './pages/admin/Projects';
import AdminTasks from './pages/admin/Tasks';
import AdminWorkLogs from './pages/admin/WorkLogs';

import InternDashboard from './pages/intern/Dashboard';
import InternProjects from './pages/intern/Projects';
import InternTasks from './pages/intern/Tasks';
import InternWorkLogs from './pages/intern/WorkLogs';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-text">Loading Orbit&hellip;</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/intern/dashboard'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/interns" element={<ProtectedRoute role="ADMIN"><AdminInterns /></ProtectedRoute>} />
      <Route path="/admin/projects" element={<ProtectedRoute role="ADMIN"><AdminProjects /></ProtectedRoute>} />
      <Route path="/admin/tasks" element={<ProtectedRoute role="ADMIN"><AdminTasks /></ProtectedRoute>} />
      <Route path="/admin/worklogs" element={<ProtectedRoute role="ADMIN"><AdminWorkLogs /></ProtectedRoute>} />

      <Route path="/intern/dashboard" element={<ProtectedRoute role="INTERN"><InternDashboard /></ProtectedRoute>} />
      <Route path="/intern/projects" element={<ProtectedRoute role="INTERN"><InternProjects /></ProtectedRoute>} />
      <Route path="/intern/tasks" element={<ProtectedRoute role="INTERN"><InternTasks /></ProtectedRoute>} />
      <Route path="/intern/worklogs" element={<ProtectedRoute role="INTERN"><InternWorkLogs /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
