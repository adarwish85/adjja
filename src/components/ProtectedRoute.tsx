
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFlow } from "@/hooks/useAuthFlow";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, userProfile, loading, authInitialized } = useAuthFlow();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: Auth state - user:', !!user, 'profile:', !!userProfile, 'loading:', loading, 'initialized:', authInitialized);
    
    if (!authInitialized || loading) {
      return; // Wait for auth to initialize
    }

    if (!user) {
      console.log('❌ ProtectedRoute: No user, redirecting to login');
      navigate("/login");
      return;
    }

    console.log('✅ ProtectedRoute: User authenticated, allowing access');
  }, [user, userProfile, loading, authInitialized, navigate]);

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

  if (!user) {
    return null; // Will redirect to login
  }

  // Allow access
  return <>{children}</>;
};

export default ProtectedRoute;
