
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({ children, allowedRoles, redirectTo }: RoleGuardProps) => {
  const { userProfile, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (!userProfile) {
        // User exists but no profile found
        navigate("/login");
        return;
      }

      const userRole = userProfile.role_name?.toLowerCase();
      // Case-insensitive role matching
      const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

      console.log('RoleGuard - User role:', userRole, 'Allowed roles:', allowedRoles, 'Has permission:', hasPermission);

      if (!hasPermission) {
        // Redirect to appropriate dashboard based on role
        if (userRole === 'student') {
          navigate("/dashboard");
        } else if (userRole === 'coach') {
          navigate("/coach");
        } else if (userRole === 'super admin' || userRole === 'admin' || userRole === 'superadmin') {
          navigate("/admin");
        } else {
          navigate(redirectTo || "/access-denied");
        }
      }
    }
  }, [userProfile, loading, user, navigate, allowedRoles, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // ProtectedRoute will handle redirect to login
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-bjj-navy mb-4">Profile Not Found</h2>
          <p className="text-bjj-gray">Unable to load user profile. Please contact support.</p>
        </div>
      </div>
    );
  }

  const userRole = userProfile.role_name?.toLowerCase();
  // Case-insensitive role matching
  const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!hasPermission) {
    return null; // Redirect happens in useEffect
  }

  return <>{children}</>;
};

export default RoleGuard;
