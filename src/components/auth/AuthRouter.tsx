
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
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // Don't do anything while loading or if we've already navigated
    if (loading || !authInitialized || hasNavigated) {
      console.log('🔄 AuthRouter: Waiting for auth to initialize...', { loading, authInitialized, hasNavigated });
      return;
    }

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

    console.log('🧭 AuthRouter: Starting navigation logic', {
      hasProfile: !!userProfile,
      role: userProfile?.role_name,
      approvalStatus: userProfile?.approval_status,
      mandatoryCompleted: userProfile?.mandatory_fields_completed,
      currentPath: window.location.pathname
    });

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

    // If we don't have profile data but user is authenticated, provide fallback navigation
    if (!userProfile) {
      console.log('⚠️ AuthRouter: No profile data, redirecting to default dashboard');
      setHasNavigated(true);
      navigate("/dashboard", { replace: true });
      return;
    }

    // Role-based navigation
    const role = userProfile.role_name?.toLowerCase();
    const approvalStatus = userProfile.approval_status;
    const mandatoryCompleted = userProfile.mandatory_fields_completed;

    console.log('🚀 AuthRouter: Executing navigation for role:', role);
    setHasNavigated(true);

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
  }, [user, userProfile, loading, error, isAuthenticated, authInitialized, navigate, hasNavigated]);

  // Add timeout fallback for stuck redirects
  useEffect(() => {
    if (isAuthenticated && authInitialized && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        console.log('⏰ AuthRouter: Navigation timeout reached');
        setShowTimeout(true);
      }, 8000);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, authInitialized, hasNavigated]);

  // Reset navigation state when user changes
  useEffect(() => {
    if (!user) {
      setHasNavigated(false);
      setShowTimeout(false);
    }
  }, [user]);

  // Show timeout fallback
  if (showTimeout && isAuthenticated && !hasNavigated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Issue</h2>
          <p className="text-gray-600 mb-6">
            We couldn't complete the login process. This might be due to a connection issue or server problem.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => navigate("/dashboard", { replace: true })} 
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Go to Dashboard
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            If this persists, please contact support.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
