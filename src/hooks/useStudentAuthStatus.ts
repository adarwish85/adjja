
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Checks if an Auth user exists for given email or user id (UUID string)
export function useStudentAuthStatus() {
  const [checking, setChecking] = useState(false);

  // By email: fetches auth.users by matching email
  const checkAuthUserByEmail = useCallback(async (email: string) => {
    setChecking(true);
    try {
      if (!email) return false;
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      setChecking(false);
      return Boolean(data && data.id && !error);
    } catch (e) {
      setChecking(false);
      return false;
    }
  }, []);

  // By id (UUID)
  const checkAuthUserById = useCallback(async (userId: string) => {
    setChecking(true);
    try {
      if (!userId) return false;
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      setChecking(false);
      return Boolean(data && data.id === userId && !error);
    } catch (e) {
      setChecking(false);
      return false;
    }
  }, []);
  return { checkAuthUserByEmail, checkAuthUserById, checking };
}
