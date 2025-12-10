<<<<<<< HEAD
=======
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleType } from '../types';
import { PatientDashboard } from '../components/dashboards/PatientDashboard';
import { DoctorDashboard } from '../components/dashboards/DoctorDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';

export const Dashboard: React.FC = () => {
  const { userRole, refreshUserRole, loading: authLoading } = useAuth();
  // refreshUserRole: () => Promise<void>;
  // const [userRole, setUserRole] = ("DOCTOR");
  const [loading, setLoading] = useState(true);
  console.log('userRole', userRole);
  useEffect(() => {
    const loadRole = async () => {
      if (!userRole) {
        console.log('line no. 17');
        console.log('refreshUserRole', refreshUserRole);
        await refreshUserRole();
        // console.log('refreshUserRole', refreshUserRole);
      }
      setLoading(false);
    };
    loadRole();
  }, [userRole, refreshUserRole]);

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full"></div>
          </div>
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  // Show only ONE dashboard based on the user's single role
  return (
    <div className="px-4 py-6 sm:px-0">
      {userRole === RoleType.ADMIN && <AdminDashboard />}
      {userRole === RoleType.DOCTOR && <DoctorDashboard />}
      {userRole === RoleType.PATIENT && <PatientDashboard />}
      {!userRole && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No role assigned. Please contact administrator.
          </p>
        </div>
      )}
    </div>
  );
};

>>>>>>> vijay_config_change
