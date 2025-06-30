
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'login';
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  
  const { isAuthenticated, loading, error, authInitialized, user, userProfile } = useAuth();

  useEffect(() => {
    setIsSignup(mode === 'signup');
  }, [mode]);

  const toggleMode = () => {
    const newMode = !isSignup;
    setIsSignup(newMode);
    setSearchParams({ mode: newMode ? 'signup' : 'login' });
  };

  // Show loading while checking auth
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

  // If authenticated, redirect based on role
  if (isAuthenticated && user) {
    // Super Admin goes to admin dashboard
    if (user.email === 'Ahmeddarwesh@gmail.com' || userProfile?.role_name?.toLowerCase() === 'super admin') {
      navigate("/admin/dashboard", { replace: true });
      return null;
    }

    // Regular users - check profile completion
    if (userProfile) {
      const role = userProfile.role_name?.toLowerCase();
      const approvalStatus = userProfile.approval_status;
      const mandatoryCompleted = userProfile.mandatory_fields_completed;

      if (role === 'coach') {
        navigate("/coach/dashboard", { replace: true });
      } else if (role === 'student') {
        if (!mandatoryCompleted) {
          navigate("/profile-wizard", { replace: true });
        } else if (approvalStatus === 'pending' || approvalStatus === 'rejected') {
          navigate("/profile-pending", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else if (!loading) {
      // No profile and not loading - redirect to profile wizard
      navigate("/profile-wizard", { replace: true });
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-bjj-gold rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-bjj-navy">
            Ahmed Darwish Academy
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}. Please try refreshing the page or contact support if the issue persists.
            </AlertDescription>
          </Alert>
        )}

        <LoginForm isSignup={isSignup} onToggleMode={toggleMode} />
      </div>
    </div>
  );
};

export default Login;
