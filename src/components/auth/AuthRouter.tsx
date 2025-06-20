
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFlow } from "@/hooks/useAuthFlow";

interface AuthRouterProps {
  children: React.ReactNode;
}

export const AuthRouter = ({ children }: AuthRouterProps) => {
  const { user, userProfile, loading, error, isAuthenticated } = useAuthFlow();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't do anything while loading
    if (loading) {
      console.log('🔄 AuthRouter: Still loading auth state...');
      return;
    }

    // Handle authentication errors
    if (error) {
      console.error('❌ AuthRouter: Auth error detected:', error);
      return; // Stay on current page, error will be displayed
    }

    // If not authenticated, stay on current page (login/landing)
    if (!isAuthenticated || !user) {
      console.log('❌ AuthRouter: User not authenticated');
      return;
    }

    // If authenticated but no profile, there's an issue
    if (!userProfile) {
      console.error('⚠️ AuthRouter: User authenticated but no profile loaded');
      return;
    }

    // Determine where to navigate based on role and profile status
    const role = userProfile.role_name?.toLowerCase();
    const approvalStatus = userProfile.approval_status;
    const mandatoryCompleted = userProfile.mandatory_fields_completed;

    console.log('🧭 AuthRouter: Navigation logic', {
      role,
      approvalStatus,
      mandatoryCompleted,
      currentPath: window.location.pathname
    });

    // Skip navigation if already on the correct page
    const currentPath = window.location.pathname;
    if (currentPath.includes('/dashboard') || 
        currentPath.includes('/coach') || 
        currentPath.includes('/admin')) {
      console.log('✅ AuthRouter: Already on appropriate dashboard');
      return;
    }

    // Role-based navigation with 500ms delay to ensure smooth transition
    setTimeout(() => {
      switch (role) {
        case 'super admin':
          console.log('👑 AuthRouter: Redirecting Super Admin to admin dashboard');
          navigate("/admin/dashboard", { replace: true });
          break;
          
        case 'coach':
          console.log('👨‍🏫 AuthRouter: Redirecting Coach to coach dashboard');
          navigate("/coach/dashboard", { replace: true });
          break;
          
        case 'student':
          // Check if student needs to complete profile
          if (!mandatoryCompleted) {
            console.log('📝 AuthRouter: Redirecting Student to profile wizard');
            navigate("/profile-wizard", { replace: true });
          } else if (approvalStatus === 'pending' || approvalStatus === 'rejected') {
            console.log('⏳ AuthRouter: Redirecting Student to profile pending');
            navigate("/profile-pending", { replace: true });
          } else {
            console.log('🎓 AuthRouter: Redirecting Student to dashboard');
            navigate("/dashboard", { replace: true });
          }
          break;
          
        default:
          console.log('🔄 AuthRouter: Unknown role, defaulting to student dashboard');
          navigate("/dashboard", { replace: true });
      }
    }, 500);
  }, [user, userProfile, loading, error, isAuthenticated, navigate]);

  return <>{children}</>;
};
