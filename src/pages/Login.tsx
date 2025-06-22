
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Shield } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthRouter } from "@/components/auth/AuthRouter";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  
  const { isAuthenticated, loading, error, authInitialized } = useAuthFlow();

  useEffect(() => {
    setIsSignup(mode === 'signup');
  }, [mode]);

  const toggleMode = () => {
    const newMode = !isSignup;
    setIsSignup(newMode);
    setSearchParams({ mode: newMode ? 'signup' : 'login' });
  };

  // Show loading state while checking authentication
  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, let AuthRouter handle navigation
  if (isAuthenticated) {
    return (
      <AuthRouter>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
            <p className="text-bjj-gray">Redirecting...</p>
          </div>
        </div>
      </AuthRouter>
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
