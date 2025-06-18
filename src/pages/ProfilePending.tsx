
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ProfilePending() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [approvalStatus, setApprovalStatus] = useState<string>('pending');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchApprovalStatus = async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔍 Fetching approval status for user:', user.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('approval_status, rejection_reason')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('❌ Error fetching approval status:', error);
        toast.error('Failed to fetch approval status');
        return;
      }

      console.log('✅ Approval status fetched:', profile);
      
      if (profile) {
        setApprovalStatus(profile.approval_status || 'pending');
        setRejectionReason(profile.rejection_reason || '');
        
        // If approved, redirect to dashboard
        if (profile.approval_status === 'approved') {
          console.log('🎉 Profile approved, redirecting to dashboard');
          toast.success('Profile approved! Redirecting to dashboard...');
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      }
    } catch (error) {
      console.error('💥 Unexpected error fetching approval status:', error);
      toast.error('Unexpected error occurred');
    }
  };

  useEffect(() => {
    if (!loading && user) {
      // Check if user profile exists and has the right status
      if (userProfile) {
        if (userProfile.approval_status === 'approved') {
          console.log('🎯 User already approved, redirecting to dashboard');
          navigate("/dashboard");
          return;
        }
        
        setApprovalStatus(userProfile.approval_status || 'pending');
        setRejectionReason(userProfile.rejection_reason || '');
      } else {
        // Fetch fresh data if userProfile is not available
        fetchApprovalStatus();
      }
    }
  }, [user, userProfile, loading, navigate]);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    await fetchApprovalStatus();
    setIsRefreshing(false);
    toast.success('Status refreshed');
  };

  const handleReturnToWizard = () => {
    navigate("/profile-wizard");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

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

  const getStatusIcon = () => {
    switch (approvalStatus) {
      case 'approved':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Clock className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (approvalStatus) {
      case 'approved':
        return {
          title: "Profile Approved!",
          message: "Congratulations! Your profile has been approved. You now have full access to the platform.",
          action: "Go to Dashboard"
        };
      case 'rejected':
        return {
          title: "Profile Needs Updates",
          message: "Your profile requires some updates before approval. Please review the feedback below and resubmit.",
          action: "Update Profile"
        };
      default:
        return {
          title: "Profile Under Review",
          message: "Thank you for submitting your profile! Our team is reviewing your information and will approve it shortly.",
          action: null
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl text-bjj-navy">{status.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">{status.message}</p>

            {approvalStatus === 'rejected' && rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-red-800 mb-2">Feedback:</h4>
                <p className="text-red-700 text-sm">{rejectionReason}</p>
              </div>
            )}

            {approvalStatus === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>What happens next?</strong><br />
                  Our admin team will review your profile within 24 hours. You'll receive a notification 
                  once your profile is approved.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {status.action === "Go to Dashboard" && (
                <Button 
                  className="w-full bg-bjj-gold hover:bg-bjj-gold-dark"
                  onClick={() => navigate("/dashboard")}
                >
                  {status.action}
                </Button>
              )}

              {status.action === "Update Profile" && (
                <Button 
                  className="w-full bg-bjj-gold hover:bg-bjj-gold-dark"
                  onClick={handleReturnToWizard}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {status.action}
                </Button>
              )}

              {approvalStatus === 'pending' && (
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleRefreshStatus}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Check Status'}
                </Button>
              )}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
