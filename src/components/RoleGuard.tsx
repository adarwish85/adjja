
import { useEffect, useState } from "react";
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
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    console.log('🛡️ RoleGuard: Validating access - user:', !!user, 'profile:', userProfile, 'loading:', loading, 'allowedRoles:', allowedRoles);
    
    if (!loading && user) {
      if (!userProfile) {
        console.log('❌ RoleGuard: User exists but no profile found, redirecting to login');
        navigate("/login");
        return;
      }

      const userRole = userProfile.role_name?.toLowerCase();
      // Case-insensitive role matching with better logging
      const hasPermission = allowedRoles.some(role => {
        const normalizedRole = role.toLowerCase();
        const matches = normalizedRole === userRole;
        console.log(`🔍 RoleGuard: Checking role "${normalizedRole}" against user role "${userRole}": ${matches}`);
        return matches;
      });

      console.log('🔍 RoleGuard: User role:', userRole, 'Allowed roles:', allowedRoles, 'Has permission:', hasPermission);

      if (!hasPermission && !hasValidated) {
        setHasValidated(true);
        console.log('🚫 RoleGuard: Access denied, redirecting based on role');
        
        // Enhanced redirect logic with better role detection
        if (userRole === 'student') {
          console.log('🎓 RoleGuard: Redirecting student to dashboard');
          navigate("/dashboard", { replace: true });
        } else if (userRole === 'coach') {
          console.log('👨‍🏫 RoleGuard: Redirecting coach to coach dashboard');
          navigate("/coach", { replace: true });
        } else if (userRole === 'super admin' || userRole === 'admin' || userRole === 'superadmin') {
          console.log('👑 RoleGuard: Redirecting admin to admin dashboard');
          navigate("/admin", { replace: true });
        } else {
          console.log('❓ RoleGuard: Unknown role, using fallback redirect');
          navigate(redirectTo || "/access-denied", { replace: true });
        }
      } else if (hasPermission) {
        console.log('✅ RoleGuard: Access granted for role:', userRole);
        setHasValidated(true);
      }
    }
  }, [userProfile, loading, user, navigate, allowedRoles, redirectTo, hasValidated]);

  // Reset validation when user changes
  useEffect(() => {
    if (!user) {
      setHasValidated(false);
    }
  }, [user]);

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
