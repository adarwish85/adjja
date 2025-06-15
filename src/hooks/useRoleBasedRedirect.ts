
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const useRoleBasedRedirect = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 useRoleBasedRedirect: Checking redirect - profile:', userProfile, 'loading:', loading);
    
    if (!loading && userProfile) {
      const userRole = userProfile.role_name?.toLowerCase();
      const currentPath = window.location.pathname;
      
      console.log('🧭 useRoleBasedRedirect: User role:', userRole, 'Current path:', currentPath);
      
      // Skip redirect if already on correct dashboard
      if (currentPath.includes('/dashboard') || 
          currentPath.includes('/coach') || 
          currentPath.includes('/admin')) {
        console.log('✅ useRoleBasedRedirect: Already on appropriate dashboard, no redirect needed');
        return;
      }

      // Enhanced role-based redirect logic
      switch (userRole) {
        case 'student':
          console.log('🎓 useRoleBasedRedirect: Redirecting student to dashboard');
          navigate("/dashboard", { replace: true });
          break;
        case 'coach':
          console.log('👨‍🏫 useRoleBasedRedirect: Redirecting coach to coach dashboard');
          navigate("/coach", { replace: true });
          break;
        case 'super admin':
        case 'admin':
          console.log('👑 useRoleBasedRedirect: Redirecting admin to admin dashboard');
          navigate("/admin", { replace: true });
          break;
        default:
          console.log('🎓 useRoleBasedRedirect: Default redirect to student dashboard for role:', userRole);
          navigate("/dashboard", { replace: true });
      }
    }
  }, [userProfile, loading, navigate]);
};
