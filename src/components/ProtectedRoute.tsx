
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute - loading:', loading, 'user:', !!user, 'userProfile:', userProfile);
    
    if (!loading) {
      if (!user) {
        console.log('No user, redirecting to login');
        navigate("/login");
        return;
      }

      // If user is authenticated but we're on a generic protected route,
      // redirect them to their appropriate dashboard
      if (user && userProfile && window.location.pathname === "/protected") {
        const userRole = userProfile.role_name?.toLowerCase();
        console.log('Redirecting user with role:', userRole);
        
        if (userRole === 'student') {
          navigate("/dashboard");
        } else if (userRole === 'coach') {
          navigate("/coach");
        } else if (userRole === 'super admin' || userRole === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    }
  }, [user, userProfile, loading, navigate]);

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
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default ProtectedRoute;
