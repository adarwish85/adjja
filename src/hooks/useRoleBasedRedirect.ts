
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const useRoleBasedRedirect = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userProfile) {
      const userRole = userProfile.role_name?.toLowerCase();
      const currentPath = window.location.pathname;
      
      // Skip redirect if already on correct dashboard
      if (currentPath.includes('/dashboard') || 
          currentPath.includes('/coach') || 
          currentPath.includes('/admin')) {
        return;
      }

      switch (userRole) {
        case 'student':
          navigate("/dashboard", { replace: true });
          break;
        case 'coach':
          navigate("/coach", { replace: true });
          break;
        case 'super admin':
        case 'admin':
          navigate("/admin", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
    }
  }, [userProfile, loading, navigate]);
};
