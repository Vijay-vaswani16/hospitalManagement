import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Doctors } from './pages/Doctors';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { RoleType } from './types';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/dashboard"
              element={
                <RoleProtectedRoute allowedRole={RoleType.PATIENT}>
                  <PatientDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/doctor/dashboard"
              element={
                <RoleProtectedRoute allowedRole={RoleType.DOCTOR}>
                  <DoctorDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <RoleProtectedRoute allowedRole={RoleType.ADMIN}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

