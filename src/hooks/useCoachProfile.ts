
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface CoachProfile {
  id: string;
  user_id: string;
  bio?: string;
  rank?: string;
  certifications?: string[];
  years_experience: number;
  social_media: any;
  featured_media: any;
  created_at: string;
  updated_at: string;
}

export const useCoachProfile = () => {
  const { user } = useAuth();
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCoachProfile = async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching coach profile");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching coach profile for user:", user.id);
      
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching coach profile:", error);
        throw error;
      }

      console.log("Coach profile fetched:", data);
      setCoachProfile(data);
    } catch (error) {
      console.error('Error fetching coach profile:', error);
      toast.error("Failed to load coach profile");
    } finally {
      setLoading(false);
    }
  };

  const saveCoachProfile = async (updates: Partial<CoachProfile>) => {
    if (!user?.id) {
      console.error("No user ID available for saving coach profile");
      toast.error("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      console.log("Saving coach profile with updates:", updates);
      
      const profileData = {
        user_id: user.id,
        ...updates
      };
      
      console.log("Final profile data to upsert:", profileData);
      
      const { data, error } = await supabase
        .from('coach_profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving coach profile:', error);
        toast.error(`Failed to save coach profile: ${error.message}`);
        return false;
      }

      console.log("Coach profile saved successfully:", data);
      toast.success("Coach profile saved successfully");
      
      // Update local state with the saved data
      setCoachProfile(data);
      return true;
    } catch (error) {
      console.error('Unexpected error saving coach profile:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to save coach profile: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachProfile();
  }, [user?.id]);

  return {
    coachProfile,
    loading,
    saveCoachProfile,
    refetch: fetchCoachProfile
  };
};
