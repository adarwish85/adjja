
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({ children, allowedRoles, redirectTo = "/dashboard" }: RoleGuardProps) => {
  const { user, userProfile, loading, authInitialized, isSuperAdmin } = useAuth();

  console.log('🛡️ RoleGuard: Checking access');
  console.log('👤 User:', user?.email);
  console.log('🎭 User profile role:', userProfile?.role_name);
  console.log('🔐 Allowed roles:', allowedRoles);
  console.log('👑 Is Super Admin:', isSuperAdmin());

  // Show loading while auth/profile is loading
  if (!authInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, ProtectedRoute will handle redirect
  if (!user) {
    console.log('🚫 RoleGuard: No user found');
    return null;
  }

  // Super Admin bypass - always allow if Super Admin role is in allowedRoles
  const allowsSuperAdmin = allowedRoles.some(role => role.toLowerCase() === 'super admin');
  
  if (isSuperAdmin() && allowsSuperAdmin) {
    console.log('🎯 RoleGuard: Super Admin access granted');
    return <>{children}</>;
  }

  // If no profile and not Super Admin, show profile not found
  if (!userProfile && !isSuperAdmin()) {
    console.log('📋 RoleGuard: No profile found for non-Super Admin');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-bjj-navy mb-4">Profile Not Found</h2>
          <p className="text-bjj-gray">Unable to load user profile. Please contact support.</p>
        </div>
      </div>
    );
  }

  // Check role permissions for regular users
  if (!isSuperAdmin()) {
    const userRole = userProfile?.role_name?.toLowerCase();
    const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

    console.log('🔍 RoleGuard: User role:', userRole);
    console.log('✅ RoleGuard: Has permission?', hasPermission);

    if (!hasPermission) {
      console.log('🚫 RoleGuard: Access denied, redirecting');
      // Redirect based on user role
      if (userRole === 'student') {
        return <Navigate to="/dashboard" replace />;
      } else if (userRole === 'coach') {
        return <Navigate to="/coach/dashboard" replace />;
      } else {
        return <Navigate to={redirectTo} replace />;
      }
    }
  }

  console.log('✅ RoleGuard: Access granted');
  return <>{children}</>;
};

export default RoleGuard;
