
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFlow } from "@/hooks/useAuthFlow";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({ children, allowedRoles, redirectTo }: RoleGuardProps) => {
  const { userProfile, loading, user, authInitialized } = useAuthFlow();
  const navigate = useNavigate();
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    console.log('🛡️ RoleGuard: Validating access - user:', !!user, 'profile:', userProfile, 'loading:', loading, 'allowedRoles:', allowedRoles);
    
    if (!authInitialized) {
      return; // Wait for auth to initialize
    }

    if (!user) {
      return; // ProtectedRoute will handle redirect to login
    }

    // CRITICAL FIX: Super Admin bypass - immediate access
    const isSuperAdmin = user.email === 'Ahmeddarwesh@gmail.com' || userProfile?.role_name?.toLowerCase() === 'super admin';
    
    if (isSuperAdmin) {
      console.log('👑 RoleGuard: Super Admin detected - granting access');
      const hasPermission = allowedRoles.some(role => role.toLowerCase() === 'super admin');
      if (hasPermission) {
        console.log('✅ RoleGuard: Super Admin access granted');
        setHasValidated(true);
        return;
      } else {
        console.log('🚫 RoleGuard: Super Admin access denied for this route');
        navigate("/admin/dashboard", { replace: true });
        return;
      }
    }

    // If still loading profile, wait
    if (loading) {
      console.log('⏳ RoleGuard: Still loading, waiting...');
      return;
    }

    // For non-Super Admin users, check if we have profile data
    if (!userProfile) {
      console.log('⏳ RoleGuard: No profile yet for regular user, waiting...');
      return;
    }

    const userRole = userProfile.role_name?.toLowerCase();
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
      
      // Enhanced redirect logic
      if (userRole === 'student') {
        console.log('🎓 RoleGuard: Redirecting student to dashboard');
        navigate("/dashboard", { replace: true });
      } else if (userRole === 'coach') {
        console.log('👨‍🏫 RoleGuard: Redirecting coach to coach dashboard');
        navigate("/coach/dashboard", { replace: true });
      } else {
        console.log('❓ RoleGuard: Unknown role, using fallback redirect');
        navigate(redirectTo || "/dashboard", { replace: true });
      }
    } else if (hasPermission) {
      console.log('✅ RoleGuard: Access granted for role:', userRole);
      setHasValidated(true);
    }
  }, [userProfile, loading, user, navigate, allowedRoles, redirectTo, hasValidated, authInitialized]);

  // Reset validation when user changes
  useEffect(() => {
    if (!user) {
      setHasValidated(false);
    }
  }, [user]);

  if (!authInitialized) {
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

  // Super Admin bypass - never show profile not found
  const isSuperAdmin = user.email === 'Ahmeddarwesh@gmail.com' || userProfile?.role_name?.toLowerCase() === 'super admin';
  
  if (isSuperAdmin) {
    const hasPermission = allowedRoles.some(role => role.toLowerCase() === 'super admin');
    if (!hasPermission) {
      return null; // Redirect happens in useEffect
    }
    return <>{children}</>;
  }

  // Only show "Profile Not Found" for non-Super Admin users when profile is truly missing after loading is complete
  if (!userProfile && !loading && authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-bjj-navy mb-4">Profile Not Found</h2>
          <p className="text-bjj-gray">Unable to load user profile. Please contact support.</p>
        </div>
      </div>
    );
  }

  const userRole = userProfile?.role_name?.toLowerCase();
  const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!hasPermission) {
    return null; // Redirect happens in useEffect
  }

  return <>{children}</>;
};

export default RoleGuard;
