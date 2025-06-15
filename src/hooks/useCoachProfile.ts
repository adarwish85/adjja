
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
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCoachProfile(data);
    } catch (error) {
      console.error('Error fetching coach profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCoachProfile = async (updates: Partial<CoachProfile>) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('coach_profiles')
        .upsert({
          user_id: user.id,
          ...updates
        });

      if (error) throw error;

      toast.success("Coach profile saved successfully");
      await fetchCoachProfile();
      return true;
    } catch (error) {
      console.error('Error saving coach profile:', error);
      toast.error("Failed to save coach profile");
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
