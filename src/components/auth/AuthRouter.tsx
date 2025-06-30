
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFlow } from "@/hooks/useAuthFlow";

interface AuthRouterProps {
  children: React.ReactNode;
}

export const AuthRouter = ({ children }: AuthRouterProps) => {
  const { user, userProfile, loading, error, isAuthenticated, authInitialized } = useAuthFlow();
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Don't do anything while auth is not initialized
    if (!authInitialized) {
      console.log('⏳ AuthRouter: Auth not initialized yet');
      return;
    }

    // Don't navigate if we've already done so
    if (hasNavigated) {
      return;
    }

    console.log('🧭 AuthRouter: Starting navigation logic', {
      isAuthenticated,
      hasProfile: !!userProfile,
      role: userProfile?.role_name,
      approvalStatus: userProfile?.approval_status,
      mandatoryCompleted: userProfile?.mandatory_fields_completed,
      currentPath: window.location.pathname,
      userEmail: user?.email,
      loading
    });

    // Handle authentication errors
    if (error && !isAuthenticated) {
      console.error('❌ AuthRouter: Auth error detected:', error);
      return; // Stay on current page, error will be displayed
    }

    // If not authenticated, stay on current page (login/landing)
    if (!isAuthenticated || !user) {
      console.log('❌ AuthRouter: User not authenticated');
      return;
    }

    // Skip navigation if already on the correct page
    const currentPath = window.location.pathname;
    if (currentPath.includes('/dashboard') || 
        currentPath.includes('/coach') || 
        currentPath.includes('/admin') ||
        currentPath.includes('/profile-wizard') ||
        currentPath.includes('/profile-pending')) {
      console.log('✅ AuthRouter: Already on appropriate page');
      setHasNavigated(true);
      return;
    }

    // CRITICAL FIX: Super Admin bypass - immediate redirect
    const isSuperAdmin = user.email === 'Ahmeddarwesh@gmail.com' || userProfile?.role_name?.toLowerCase() === 'super admin';
    
    if (isSuperAdmin) {
      console.log('👑 AuthRouter: Super Admin detected - bypassing all checks');
      setHasNavigated(true);
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    // If still loading profile, wait
    if (loading) {
      console.log('⏳ AuthRouter: Still loading profile, waiting...');
      return;
    }

    // If we don't have profile data but user is authenticated, wait for it
    if (!userProfile) {
      console.log('⏳ AuthRouter: No profile data, waiting for profile to load...');
      return;
    }

    // Role-based navigation for regular users
    const role = userProfile.role_name?.toLowerCase();
    const approvalStatus = userProfile.approval_status;
    const mandatoryCompleted = userProfile.mandatory_fields_completed;

    console.log('🚀 AuthRouter: Executing navigation for role:', role);
    setHasNavigated(true);

    switch (role) {
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
  }, [user, userProfile, loading, error, isAuthenticated, authInitialized, navigate, hasNavigated]);

  // Reset navigation state when user changes
  useEffect(() => {
    if (!user) {
      setHasNavigated(false);
    }
  }, [user]);

  // Show loading while auth is initializing
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
