
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
  // Public profile settings
  is_public?: boolean;
  profile_slug?: string;
  profile_views?: number;
  // Competition stats
  competitions_count?: number;
  gold_medals?: number;
  silver_medals?: number;
  bronze_medals?: number;
  notable_wins?: string;
  // External links
  smoothcomp_url?: string;
  bjj_heroes_url?: string;
  other_link_1?: string;
  other_link_1_name?: string;
  other_link_2?: string;
  other_link_2_name?: string;
}

export const useBJJProfile = () => {
  const { user } = useAuth();
  const [bjjProfile, setBjjProfile] = useState<BJJProfileData>({});
  const [loading, setLoading] = useState(false);

  const loadBJJProfile = async () => {
    if (!user) {
      console.log('No user found, skipping profile load');
      return;
    }

    console.log('Loading BJJ profile for user:', user.id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bjj_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading BJJ profile:', error);
        throw error;
      }

      console.log('Loaded BJJ profile data:', data);

      if (data) {
        // Safely cast gallery_images to string array
        const galleryImages = Array.isArray(data.gallery_images) 
          ? data.gallery_images.filter((img): img is string => typeof img === 'string')
          : [];

        const profileData = {
          weight_kg: data.weight_kg,
          height_cm: data.height_cm,
          belt_rank: data.belt_rank,
          academy_team: data.academy_team,
          favorite_position: data.favorite_position,
          favorite_submission: data.favorite_submission,
          instagram_url: data.instagram_url,
          facebook_url: data.facebook_url,
          about_me: data.about_me,
          gallery_images: galleryImages,
          // Public profile settings
          is_public: data.is_public,
          profile_slug: data.profile_slug,
          profile_views: data.profile_views,
          // Competition stats
          competitions_count: data.competitions_count,
          gold_medals: data.gold_medals,
          silver_medals: data.silver_medals,
          bronze_medals: data.bronze_medals,
          notable_wins: data.notable_wins,
          // External links
          smoothcomp_url: data.smoothcomp_url,
          bjj_heroes_url: data.bjj_heroes_url,
          other_link_1: data.other_link_1,
          other_link_1_name: data.other_link_1_name,
          other_link_2: data.other_link_2,
          other_link_2_name: data.other_link_2_name,
        };
        
        console.log('Setting BJJ profile state:', profileData);
        setBjjProfile(profileData);
      } else {
        console.log('No BJJ profile found, setting empty state');
        setBjjProfile({});
      }
    } catch (error) {
      console.error('Error loading BJJ profile:', error);
      toast.error("Failed to load BJJ profile");
    } finally {
      setLoading(false);
    }
  };

  const saveBJJProfile = async (profileData: BJJProfileData) => {
    if (!user) {
      console.error('No user found, cannot save profile');
      toast.error("You must be logged in to save your profile");
      return false;
    }

    console.log('Saving BJJ profile for user:', user.id, 'with data:', profileData);
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
          gallery_images: profileData.gallery_images || [],
          // Public profile settings
          is_public: profileData.is_public || false,
          profile_slug: profileData.profile_slug,
          // Competition stats
          competitions_count: profileData.competitions_count || 0,
          gold_medals: profileData.gold_medals || 0,
          silver_medals: profileData.silver_medals || 0,
          bronze_medals: profileData.bronze_medals || 0,
          notable_wins: profileData.notable_wins,
          // External links
          smoothcomp_url: profileData.smoothcomp_url,
          bjj_heroes_url: profileData.bjj_heroes_url,
          other_link_1: profileData.other_link_1,
          other_link_1_name: profileData.other_link_1_name,
          other_link_2: profileData.other_link_2,
          other_link_2_name: profileData.other_link_2_name,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Supabase error saving BJJ profile:', error);
        throw error;
      }

      console.log('Successfully saved BJJ profile');
      setBjjProfile(profileData);
      toast.success("BJJ profile saved successfully");
      return true;
    } catch (error) {
      console.error('Error saving BJJ profile:', error);
      toast.error("Failed to save BJJ profile: " + (error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPublicProfile = async (slug: string) => {
    console.log('Loading public profile for slug:', slug);
    try {
      const { data, error } = await supabase
        .from('bjj_profiles')
        .select(`
          *,
          profiles!inner(name, profile_picture_url)
        `)
        .eq('profile_slug', slug)
        .eq('is_public', true)
        .single();

      if (error) {
        console.error('Error loading public profile:', error);
        throw error;
      }

      // Increment profile views
      if (data) {
        await supabase
          .from('bjj_profiles')
          .update({ profile_views: (data.profile_views || 0) + 1 })
          .eq('profile_slug', slug);
      }

      console.log('Loaded public profile:', data);
      return data;
    } catch (error) {
      console.error('Error loading public profile:', error);
      return null;
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
    loadBJJProfile,
    getPublicProfile
  };
};
