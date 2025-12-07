import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RoleType } from '../types';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: RoleType;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRole 
}) => {
  const { isAuthenticated, hasRole, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Your role: {userRole || 'None'}
          </p>
          <p className="text-sm text-gray-500">
            Required role: {allowedRole}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

