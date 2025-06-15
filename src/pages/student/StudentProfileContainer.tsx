import { useEffect, useState } from "react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StudentProfileHeader } from "@/components/profile/StudentProfileHeader";
import { StudentProfileSidebar } from "@/components/profile/StudentProfileSidebar";
import { StudentProfileMainForm } from "@/components/profile/StudentProfileMainForm";
import { ChangePasswordSection } from "@/components/profile/ChangePasswordSection";
import { BJJProfileForm } from "@/components/profile/BJJProfileForm";
import { useBJJProfile } from "@/hooks/useBJJProfile";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

export default function StudentProfileContainer() {
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
  const [passwordState, setPasswordState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalFormState, setOriginalFormState] = useState<any>({});
  const [originalBjjProfile, setOriginalBjjProfile] = useState<any>({});
  const [saveAllState, setSaveAllState] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  // Track changes in BJJ profile
  useEffect(() => {
    if (isEditing) {
      const bjjHasChanges = JSON.stringify(bjjProfile) !== JSON.stringify(originalBjjProfile);
      const personalHasChanges = JSON.stringify(formState) !== JSON.stringify(originalFormState);
      setHasChanges(bjjHasChanges || personalHasChanges);
    }
  }, [bjjProfile, formState, originalBjjProfile, originalFormState, isEditing]);

  async function fetchProfile() {
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
  }

  function handleFormChange(changes: any) {
    console.log('Form changes:', changes);
    const newFormState = { ...formState, ...changes };
    setFormState(newFormState);
  }

  function handleBjjProfileChange(changes: any) {
    console.log('BJJ profile changes:', changes);
    setBjjProfile(changes);
  }

  function handleEditToggle() {
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
  }

  async function handleSaveAll() {
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
  }

  async function handleCoverPhotoEdit() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        // Upload to Supabase Storage (bucket: profiles)
        const fileName = `${user.id}/cover/${Date.now()}_${file.name}`;
        const { error } = await supabase
          .storage
          .from('profiles')
          .upload(fileName, file, { upsert: true });

        if (error) {
          console.error('Cover photo upload error:', error);
          toast.error("Failed to upload cover photo");
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
        handleFormChange({ cover_photo_url: data.publicUrl });
        toast.success("Cover photo updated!");
        setLoading(false);
      };
      input.click();
    } catch (error) {
      console.error('Cover photo selection error:', error);
      toast.error("Failed to select image");
      setLoading(false);
    }
  }

  async function handleAvatarEdit() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        // Upload to Supabase Storage (bucket: profiles)
        const fileName = `${user.id}/profile/${Date.now()}_${file.name}`;
        const { error } = await supabase
          .storage
          .from('profiles')
          .upload(fileName, file, { upsert: true });

        if (error) {
          console.error('Profile photo upload error:', error);
          toast.error("Failed to upload photo");
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
        handleFormChange({ profile_picture_url: data.publicUrl });
        toast.success("Profile photo updated!");
        setLoading(false);
      };
      input.click();
    } catch (error) {
      console.error('Profile photo selection error:', error);
      toast.error("Failed to select image");
      setLoading(false);
    }
  }

  async function handleChangePassword(oldPass: string, newPass: string) {
    setPasswordState("saving");
    try {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) throw error;
      setPasswordState("success");
      toast.success("Password changed!");
      setTimeout(() => setPasswordState("idle"), 1500);
    } catch (e) {
      console.error('Password change error:', e);
      setPasswordState("error");
      toast.error("Failed to change password.");
      setTimeout(() => setPasswordState("idle"), 1500);
    }
  }

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Cover Photo & Profile Header */}
        <StudentProfileHeader
          formState={formState}
          onCoverPhotoEdit={isEditing ? handleCoverPhotoEdit : undefined}
          onAvatarEdit={isEditing ? handleAvatarEdit : undefined}
          loading={loading}
        />

        {/* Main Content Area with Facebook-style layout */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Edit/Save Controls */}
          <div className="flex justify-end mb-6">
            {!isEditing ? (
              <Button
                onClick={handleEditToggle}
                className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-xl px-6 py-3 flex items-center gap-2"
              >
                <Edit className="h-5 w-5" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleEditToggle}
                  className="font-semibold rounded-xl px-6 py-3 flex items-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </Button>
                {hasChanges && (
                  <Button
                    onClick={handleSaveAll}
                    className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-xl px-6 py-3 flex items-center gap-2"
                    disabled={saveAllState === "saving"}
                  >
                    <Save className="h-5 w-5" />
                    {saveAllState === "saving" ? "Saving..." : saveAllState === "success" ? "Saved!" : "Save All Changes"}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Profile Info (30%) */}
            <div className="lg:col-span-4 xl:col-span-3">
              <StudentProfileSidebar
                formState={formState}
              />
            </div>

            {/* Main Content - Editable Forms (70%) */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Basic Profile Information */}
              <StudentProfileMainForm
                data={formState}
                onChange={handleFormChange}
                loading={loading}
                disabled={!isEditing}
              />

              {/* BJJ Athlete Profile */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">BJJ Athlete Profile</h2>
                <BJJProfileForm
                  data={bjjProfile}
                  onChange={handleBjjProfileChange}
                  loading={bjjLoading}
                  disabled={!isEditing}
                />
              </div>

              {/* Change Password Section - Keep separate */}
              <ChangePasswordSection
                onChangePassword={handleChangePassword}
                loading={passwordState === "saving"}
                saveState={passwordState}
              />
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
