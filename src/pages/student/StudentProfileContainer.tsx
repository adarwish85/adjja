
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
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [passwordState, setPasswordState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [bjjSaveState, setBjjSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);
  const [originalFormState, setOriginalFormState] = useState<any>({});

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

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

    // Check if there are changes
    const hasFormChanges = JSON.stringify(newFormState) !== JSON.stringify(originalFormState);
    console.log('Has changes:', hasFormChanges);
    setHasChanges(hasFormChanges);
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

  async function handleSave() {
    setSaveState("saving");
    try {
      console.log('Saving profile with data:', formState);

      // Prepare the data for saving (only include fields that exist in the profiles table)
      const profileData = {
        id: user.id,
        name: formState.name,
        email: formState.email,
        phone: formState.phone || null,
        birthdate: formState.birthdate || null,
        profile_picture_url: formState.profile_picture_url || null,
        cover_photo_url: formState.cover_photo_url || null,
      };

      // Save to 'profiles'
      const { error: err1 } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (err1) {
        console.error('Profile save error:', err1);
        throw err1;
      }

      console.log('Profile saved successfully');

      // Update original state to reflect saved changes
      setOriginalFormState({ ...formState });
      setHasChanges(false);

      setSaveState("success");
      toast.success("✅ Profile updated successfully");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (e) {
      console.error('Save error details:', e);
      setSaveState("error");
      toast.error(`Failed to save changes: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setTimeout(() => setSaveState("idle"), 1500);
    }
  }

  async function handleBJJProfileSave() {
    setBjjSaveState("saving");
    const success = await saveBJJProfile(bjjProfile);
    setBjjSaveState(success ? "success" : "error");
    setTimeout(() => setBjjSaveState("idle"), 1500);
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
          onCoverPhotoEdit={handleCoverPhotoEdit}
          onAvatarEdit={handleAvatarEdit}
          loading={loading}
        />

        {/* Main Content Area with Facebook-style layout */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
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
                onSave={handleSave}
                saveState={saveState}
                hasChanges={hasChanges}
              />

              {/* BJJ Athlete Profile */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">BJJ Athlete Profile</h2>
                <BJJProfileForm
                  data={bjjProfile}
                  onChange={setBjjProfile}
                  loading={bjjLoading}
                />
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleBJJProfileSave}
                    className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-lg px-8 py-3 text-lg shadow-lg transition"
                    disabled={bjjLoading || bjjSaveState === "saving"}
                  >
                    {bjjSaveState === "saving" ? "Saving BJJ Profile..." : bjjSaveState === "success" ? "BJJ Profile Saved!" : "Save BJJ Profile"}
                  </Button>
                </div>
              </div>

              {/* Change Password Section */}
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
