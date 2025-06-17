
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, User, Award, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProfileCompletionData {
  hasBasicInfo: boolean;
  hasBJJProfile: boolean;
  hasProfilePicture: boolean;
  hasCoverPhoto: boolean;
  totalFields: number;
  completedFields: number;
}

export const ProfileCompletionBar = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [completionData, setCompletionData] = useState<ProfileCompletionData | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (user && userProfile?.approval_status === 'approved') {
      checkProfileCompletion();
    }
  }, [user, userProfile]);

  const checkProfileCompletion = async () => {
    if (!user) return;

    try {
      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get BJJ profile data
      const { data: bjjProfile } = await supabase
        .from('bjj_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const hasBasicInfo = !!(profile?.phone && profile?.name);
      const hasBJJProfile = !!bjjProfile?.belt_rank;
      const hasProfilePicture = !!profile?.profile_picture_url;
      const hasCoverPhoto = !!profile?.cover_photo_url;

      const completedFields = [hasBasicInfo, hasBJJProfile, hasProfilePicture, hasCoverPhoto].filter(Boolean).length;
      const totalFields = 4;

      const completion = {
        hasBasicInfo,
        hasBJJProfile,
        hasProfilePicture,
        hasCoverPhoto,
        completedFields,
        totalFields
      };

      // Only show if profile is not 100% complete
      if (completedFields < totalFields) {
        setCompletionData(completion);
      } else {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
    }
  };

  if (!isVisible || !completionData || completionData.completedFields === completionData.totalFields) {
    return null;
  }

  const completionPercentage = (completionData.completedFields / completionData.totalFields) * 100;

  const getMissingItems = () => {
    const missing = [];
    if (!completionData.hasBasicInfo) missing.push("Complete basic information");
    if (!completionData.hasBJJProfile) missing.push("Add BJJ details");
    if (!completionData.hasProfilePicture) missing.push("Upload profile picture");
    if (!completionData.hasCoverPhoto) missing.push("Add cover photo");
    return missing;
  };

  return (
    <Card className="border-l-4 border-l-bjj-gold bg-gradient-to-r from-bjj-gold/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-bjj-gold" />
                <h3 className="font-semibold text-bjj-navy">Complete Your Profile</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {completionData.completedFields} of {completionData.totalFields} sections complete
                </span>
                <span className="font-medium text-bjj-navy">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              
              <Progress value={completionPercentage} className="h-2" />
              
              <div className="text-xs text-gray-500">
                Missing: {getMissingItems().join(", ")}
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => navigate("/student/profile")}
            size="sm"
            className="bg-bjj-gold hover:bg-bjj-gold-dark ml-4"
          >
            Complete Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
