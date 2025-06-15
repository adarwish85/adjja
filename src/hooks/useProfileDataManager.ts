
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
      console.log('🔍 Fetching profile for user:', user?.id);

      // Fetch profile info (from 'profiles' table)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError);
      } else {
        console.log('✅ Profile data fetched:', profile);
      }

      // Fetch student info (for belt, branch, joined_date, stripes)
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (studentError) {
        console.error('❌ Student fetch error:', studentError);
      } else {
        console.log('✅ Student data fetched:', student);
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

      console.log('📋 Final profile data assembled:', profileData);
      setFormState(profileData);
      setOriginalFormState({ ...profileData });
      setOriginalBjjProfile({ ...bjjProfile });
    } catch (e) {
      console.error('💥 Unexpected error loading profile:', e);
      toast.error("Failed to load profile");
    }
    setLoading(false);
  };

  const handleFormChange = (changes: any) => {
    console.log('📝 Form changes received:', changes);
    const newFormState = { ...formState, ...changes };
    setFormState(newFormState);
  };

  const handleBjjProfileChange = (changes: any) => {
    console.log('🥋 BJJ profile changes received:', changes);
    setBjjProfile(changes);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - revert changes
      console.log('🚫 Canceling edit mode - reverting changes');
      setFormState({ ...originalFormState });
      setBjjProfile({ ...originalBjjProfile });
      setHasChanges(false);
    } else {
      // Store current state as original when starting edit
      console.log('✏️ Entering edit mode - storing original state');
      setOriginalFormState({ ...formState });
      setOriginalBjjProfile({ ...bjjProfile });
    }
    setIsEditing(!isEditing);
  };

  const validateProfileData = (data: any): string[] => {
    const errors: string[] = [];
    
    if (!data.name?.trim()) {
      errors.push("Name is required");
    }
    
    if (!data.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Valid email is required");
    }
    
    return errors;
  };

  const handleSaveAll = async () => {
    console.log('💾 Starting save all process...');
    setSaveAllState("saving");
    
    try {
      // Validate authentication
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      console.log('👤 User authenticated:', user.id);
      
      // Validate profile data
      const validationErrors = validateProfileData(formState);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      console.log('✅ Validation passed');

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

      console.log('📤 Attempting to save profile data:', profileData);

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) {
        console.error('❌ Profile save error:', profileError);
        throw new Error(`Profile save failed: ${profileError.message}`);
      }

      console.log('✅ Profile data saved successfully');

      // Save BJJ profile data
      console.log('🥋 Attempting to save BJJ profile...');
      const bjjSuccess = await saveBJJProfile(bjjProfile);
      if (!bjjSuccess) {
        throw new Error('BJJ profile save failed');
      }

      console.log('✅ BJJ profile saved successfully');

      // Update original states
      setOriginalFormState({ ...formState });
      setOriginalBjjProfile({ ...bjjProfile });
      setHasChanges(false);
      setIsEditing(false);

      setSaveAllState("success");
      toast.success("✅ All profile changes saved successfully");
      console.log('🎉 Save all process completed successfully');
      
      setTimeout(() => setSaveAllState("idle"), 1500);
    } catch (e) {
      console.error('💥 Save all error:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setSaveAllState("error");
      toast.error(`Failed to save changes: ${errorMessage}`);
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
