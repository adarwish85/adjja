
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useBJJProfile } from "@/hooks/useBJJProfile";

export const useProfileDataManager = () => {
  const { user, userProfile } = useAuth();
  const { bjjProfile, setBjjProfile, saveBJJProfile, loading: bjjLoading } = useBJJProfile();
  
  const [formState, setFormState] = useState<any>({
    name: "",
    email: "",
    phone: "",
    belt: "",
    branch: "",
    birthdate: "",
    profile_picture_url: "",
    cover_photo_url: "",
    joined_date: "",
    stripes: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalFormState, setOriginalFormState] = useState<any>({});
  const [originalBjjProfile, setOriginalBjjProfile] = useState<any>({});
  const [saveAllState, setSaveAllState] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Track changes in profiles
  useEffect(() => {
    if (isEditing) {
      const bjjHasChanges = JSON.stringify(bjjProfile) !== JSON.stringify(originalBjjProfile);
      const personalHasChanges = JSON.stringify(formState) !== JSON.stringify(originalFormState);
      setHasChanges(bjjHasChanges || personalHasChanges);
    }
  }, [bjjProfile, formState, originalBjjProfile, originalFormState, isEditing]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      console.log('Fetching profile for user:', user?.id);

      // Fetch profile info (from 'profiles' table)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      // Fetch student info (for belt, branch, joined_date, stripes)
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (studentError) {
        console.error('Student fetch error:', studentError);
      }

      const profileData = {
        name: profile?.name || userProfile?.name || "",
        email: profile?.email || userProfile?.email || "",
        phone: profile?.phone || "",
        belt: student?.belt || "",
        branch: student?.branch || "",
        birthdate: profile?.birthdate || "",
        profile_picture_url: profile?.profile_picture_url || "",
        cover_photo_url: profile?.cover_photo_url || "",
        joined_date: student?.joined_date || "",
        stripes: student?.stripes ?? 0,
      };

      console.log('Loaded profile data:', profileData);
      setFormState(profileData);
      setOriginalFormState({ ...profileData });
      setOriginalBjjProfile({ ...bjjProfile });
    } catch (e) {
      console.error('Unexpected error loading profile:', e);
      toast.error("Failed to load profile");
    }
    setLoading(false);
  };

  const handleFormChange = (changes: any) => {
    console.log('Form changes:', changes);
    const newFormState = { ...formState, ...changes };
    setFormState(newFormState);
  };

  const handleBjjProfileChange = (changes: any) => {
    console.log('BJJ profile changes:', changes);
    setBjjProfile(changes);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - revert changes
      setFormState({ ...originalFormState });
      setBjjProfile({ ...originalBjjProfile });
      setHasChanges(false);
    } else {
      // Store current state as original when starting edit
      setOriginalFormState({ ...formState });
      setOriginalBjjProfile({ ...bjjProfile });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveAll = async () => {
    setSaveAllState("saving");
    try {
      console.log('Saving all profile data...');

      // Save personal profile data
      const profileData = {
        id: user.id,
        name: formState.name,
        email: formState.email,
        phone: formState.phone || null,
        birthdate: formState.birthdate || null,
        profile_picture_url: formState.profile_picture_url || null,
        cover_photo_url: formState.cover_photo_url || null,
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile save error:', profileError);
        throw profileError;
      }

      // Save BJJ profile data
      const bjjSuccess = await saveBJJProfile(bjjProfile);
      if (!bjjSuccess) {
        throw new Error('Failed to save BJJ profile');
      }

      // Update original states
      setOriginalFormState({ ...formState });
      setOriginalBjjProfile({ ...bjjProfile });
      setHasChanges(false);
      setIsEditing(false);

      setSaveAllState("success");
      toast.success("✅ All profile changes saved successfully");
      setTimeout(() => setSaveAllState("idle"), 1500);
    } catch (e) {
      console.error('Save all error:', e);
      setSaveAllState("error");
      toast.error(`Failed to save changes: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setTimeout(() => setSaveAllState("idle"), 1500);
    }
  };

  return {
    formState,
    loading,
    isEditing,
    hasChanges,
    saveAllState,
    bjjProfile,
    bjjLoading,
    fetchProfile,
    handleFormChange,
    handleBjjProfileChange,
    handleEditToggle,
    handleSaveAll
  };
};
