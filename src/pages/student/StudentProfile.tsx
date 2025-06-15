
import { useEffect, useState } from "react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StudentProfileCard } from "@/components/profile/StudentProfileCard";
import { StudentProfileForm } from "@/components/profile/StudentProfileForm";
import { ChangePasswordSection } from "@/components/profile/ChangePasswordSection";
import { BeltProgressBar } from "@/components/profile/BeltProgressBar";
import { BJJProfileForm } from "@/components/profile/BJJProfileForm";
import { useBJJProfile } from "@/hooks/useBJJProfile";
import { Button } from "@/components/ui/button";

export default function StudentProfile() {
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
      // Fetch profile info (from 'profiles' table)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      // Fetch student info (for belt, branch, joined_date, stripes)
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      const profileData = {
        name: profile?.name || userProfile?.name || "",
        email: profile?.email || userProfile?.email || "",
        phone: profile?.phone || "",
        belt: student?.belt || "",
        branch: student?.branch || "",
        birthdate: "", // Optionally add separate birthdate table
        profile_picture_url: profile?.profile_picture_url || "",
        cover_photo_url: profile?.cover_photo_url || "",
        joined_date: student?.joined_date || "",
        stripes: student?.stripes ?? 0,
      };

      setFormState(profileData);
      setOriginalFormState({ ...profileData });
    } catch (e) {
      toast.error("Failed to load profile");
    }
    setLoading(false);
  }

  function handleFormChange(changes: any) {
    const newFormState = { ...formState, ...changes };
    setFormState(newFormState);
    
    // Check if there are changes
    const hasFormChanges = JSON.stringify(newFormState) !== JSON.stringify(originalFormState);
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
      toast.error("Failed to select image");
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaveState("saving");
    try {
      // Save to 'profiles'
      const { error: err1 } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          profile_picture_url: formState.profile_picture_url,
          cover_photo_url: formState.cover_photo_url,
        }, { onConflict: 'id' });
      
      if (err1) throw err1;
      
      // Update original state to reflect saved changes
      setOriginalFormState({ ...formState });
      setHasChanges(false);
      
      setSaveState("success");
      toast.success("✅ Profile updated successfully");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (e) {
      setSaveState("error");
      toast.error("Failed to save changes.");
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
      setPasswordState("error");
      toast.error("Failed to change password.");
      setTimeout(() => setPasswordState("idle"), 1500);
    }
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 font-playfair">
        {/* Cover Photo Section */}
        <div className="relative h-48 md:h-64 rounded-t-3xl overflow-hidden mb-6 bg-gradient-to-br from-amber-100 via-yellow-50 to-white">
          {formState.cover_photo_url ? (
            <img 
              src={formState.cover_photo_url} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-bjj-gold/20 via-amber-50 to-white" />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <button
            onClick={handleCoverPhotoEdit}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition"
            type="button"
          >
            <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5H3v-4L16.5 3.5Z" />
            </svg>
          </button>
        </div>

        <StudentProfileCard
          name={formState.name}
          profilePicture={formState.profile_picture_url}
          belt={formState.belt}
          stripes={formState.stripes}
          joinedDate={formState.joined_date}
          onAvatarEdit={handleAvatarEdit}
        />
        <BeltProgressBar belt={formState.belt} stripes={formState.stripes} />
        
        {/* Basic Profile Information */}
        <StudentProfileForm
          data={formState}
          onChange={handleFormChange}
          loading={loading}
          onSave={handleSave}
          saveState={saveState}
          hasChanges={hasChanges}
        />

        {/* BJJ Athlete Profile */}
        <div className="mt-8">
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
    </StudentLayout>
  );
}
