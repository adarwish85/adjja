
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Checks if Auth user exists for a given profile/user id (UUID string)
export function useCheckAuthUserById() {
  const [checking, setChecking] = useState(false);

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

  return { checkAuthUserById, checking };
}
