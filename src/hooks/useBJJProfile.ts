
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface BJJProfileData {
  weight_kg?: number;
  height_cm?: number;
  belt_rank?: string;
  academy_team?: string;
  favorite_position?: string;
  favorite_submission?: string;
  instagram_url?: string;
  facebook_url?: string;
  about_me?: string;
  gallery_images?: string[];
}

export const useBJJProfile = () => {
  const { user } = useAuth();
  const [bjjProfile, setBjjProfile] = useState<BJJProfileData>({});
  const [loading, setLoading] = useState(false);

  const loadBJJProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bjj_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Safely cast gallery_images to string array
        const galleryImages = Array.isArray(data.gallery_images) 
          ? data.gallery_images.filter((img): img is string => typeof img === 'string')
          : [];

        setBjjProfile({
          weight_kg: data.weight_kg,
          height_cm: data.height_cm,
          belt_rank: data.belt_rank,
          academy_team: data.academy_team,
          favorite_position: data.favorite_position,
          favorite_submission: data.favorite_submission,
          instagram_url: data.instagram_url,
          facebook_url: data.facebook_url,
          about_me: data.about_me,
          gallery_images: galleryImages
        });
      }
    } catch (error) {
      console.error('Error loading BJJ profile:', error);
      toast.error("Failed to load BJJ profile");
    } finally {
      setLoading(false);
    }
  };

  const saveBJJProfile = async (profileData: BJJProfileData) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bjj_profiles')
        .upsert({
          user_id: user.id,
          weight_kg: profileData.weight_kg,
          height_cm: profileData.height_cm,
          belt_rank: profileData.belt_rank,
          academy_team: profileData.academy_team,
          favorite_position: profileData.favorite_position,
          favorite_submission: profileData.favorite_submission,
          instagram_url: profileData.instagram_url,
          facebook_url: profileData.facebook_url,
          about_me: profileData.about_me,
          gallery_images: profileData.gallery_images || []
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      setBjjProfile(profileData);
      return true;
    } catch (error) {
      console.error('Error saving BJJ profile:', error);
      toast.error("Failed to save BJJ profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBJJProfile();
    }
  }, [user]);

  return {
    bjjProfile,
    setBjjProfile,
    loading,
    saveBJJProfile,
    loadBJJProfile
  };
};
