
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [hasCheckedRedirect, setHasCheckedRedirect] = useState(false);

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: Auth state - user:', !!user, 'profile:', userProfile, 'loading:', loading);
    
    if (!loading) {
      if (!user) {
        console.log('❌ ProtectedRoute: No user, redirecting to login');
        navigate("/login");
        return;
      }

      if (userProfile && !hasCheckedRedirect) {
        const approvalStatus = userProfile.approval_status;
        const mandatoryFieldsCompleted = userProfile.mandatory_fields_completed;
        const userRole = userProfile.role_name;

        console.log('📋 ProtectedRoute: Profile status check', {
          approvalStatus,
          mandatoryFieldsCompleted,
          userRole
        });

        // Skip wizard for Super Admin and Coach roles
        if (userRole === 'Super Admin' || userRole === 'Coach') {
          console.log('👑 ProtectedRoute: Admin/Coach user, skipping wizard');
          setHasCheckedRedirect(true);
          return;
        }

        // Only redirect Students to wizard if they haven't completed mandatory fields
        if (userRole === 'Student' && !mandatoryFieldsCompleted) {
          console.log('📝 ProtectedRoute: Redirecting Student to profile wizard - mandatory fields incomplete');
          navigate("/profile-wizard");
          setHasCheckedRedirect(true);
          return;
        }

        // If profile is pending or rejected, redirect to pending page (Students only)
        if (userRole === 'Student' && (approvalStatus === 'pending' || approvalStatus === 'rejected')) {
          console.log('⏳ ProtectedRoute: Redirecting Student to profile pending - status:', approvalStatus);
          navigate("/profile-pending");
          setHasCheckedRedirect(true);
          return;
        }

        setHasCheckedRedirect(true);
      } else if (user && !userProfile && !hasCheckedRedirect) {
        // User exists but no profile - let them through for now
        console.log('⚠️ ProtectedRoute: User exists but no profile, allowing access');
        setHasCheckedRedirect(true);
      }
    }
  }, [user, userProfile, loading, navigate, hasCheckedRedirect]);

  // Reset redirect check when user changes
  useEffect(() => {
    if (!user) {
      setHasCheckedRedirect(false);
    }
  }, [user]);

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

  // Allow access even if profile is missing - some users might not have profiles yet
  return <>{children}</>;
};

export default ProtectedRoute;
