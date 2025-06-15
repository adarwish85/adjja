
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ChangePasswordSection } from "./ChangePasswordSection";

export const PasswordChangeManager = () => {
  const [passwordState, setPasswordState] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handleChangePassword = async (oldPass: string, newPass: string) => {
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
  };

  return (
    <ChangePasswordSection
      onChangePassword={handleChangePassword}
      loading={passwordState === "saving"}
      saveState={passwordState}
    />
  );
};
