
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
        const profileCompleted = userProfile.profile_completed;
        const mandatoryFieldsCompleted = userProfile.mandatory_fields_completed;

        console.log('📋 ProtectedRoute: Profile status check', {
          approvalStatus,
          profileCompleted,
          mandatoryFieldsCompleted
        });

        // If user hasn't completed mandatory fields, redirect to wizard
        if (!mandatoryFieldsCompleted) {
          console.log('📝 ProtectedRoute: Redirecting to profile wizard - mandatory fields incomplete');
          navigate("/profile-wizard");
          setHasCheckedRedirect(true);
          return;
        }

        // If profile is pending or rejected, redirect to pending page
        if (approvalStatus === 'pending' || approvalStatus === 'rejected') {
          console.log('⏳ ProtectedRoute: Redirecting to profile pending - status:', approvalStatus);
          navigate("/profile-pending");
          setHasCheckedRedirect(true);
          return;
        }

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

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-bjj-navy mb-4">Profile Loading</h2>
          <p className="text-bjj-gray">Please wait while we load your profile...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
