
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
  const { bjjProfile, saveBJJProfile, loading: bjjLoading } = useBJJProfile();
  const [formState, setFormState] = useState<any>({
    name: "",
    email: "",
    phone: "",
    belt: "",
    branch: "",
    birthdate: "",
    profile_picture_url: "",
    joined_date: "",
    stripes: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [passwordState, setPasswordState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [bjjSaveState, setBjjSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");

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

      setFormState({
        name: profile?.name || userProfile?.name || "",
        email: profile?.email || userProfile?.email || "",
        phone: profile?.phone || "",
        belt: student?.belt || "",
        branch: student?.branch || "",
        birthdate: "", // Optionally add separate birthdate table
        profile_picture_url: profile?.profile_picture_url || "",
        joined_date: student?.joined_date || "",
        stripes: student?.stripes ?? 0,
      });
    } catch (e) {
      toast.error("Failed to load profile");
    }
    setLoading(false);
  }

  function handleFormChange(changes: any) {
    setFormState((prev: any) => ({ ...prev, ...changes }));
  }

  async function handleAvatarEdit() {
    // Prompt for image, upload, and update profile_picture_url
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
        setFormState((prev: any) => ({ ...prev, profile_picture_url: data.publicUrl }));
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
        }, { onConflict: 'id' });
      // Save to 'students'
      const { error: err2 } = await supabase
        .from('students')
        .update({
          belt: formState.belt,
          branch: formState.branch,
          stripes: formState.stripes
        })
        .eq('email', formState.email);
      if (err1 || err2) throw err1 || err2;
      setSaveState("success");
      toast.success("Profile saved!");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (e) {
      setSaveState("error");
      toast.error("Failed to save changes.");
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
    }
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 font-playfair">
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
        />

        {/* BJJ Athlete Profile */}
        <div className="mt-8">
          <BJJProfileForm
            data={bjjProfile}
            onChange={(data) => {
              console.log('BJJ Profile form onChange called with:', data);
              // Update the BJJ profile state through the hook
              const { setBjjProfile } = useBJJProfile();
              setBjjProfile(data);
            }}
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
