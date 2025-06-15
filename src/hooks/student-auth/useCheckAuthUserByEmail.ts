
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Checks if Auth user exists for a given email
export function useCheckAuthUserByEmail() {
  const [checking, setChecking] = useState(false);

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

  return { checkAuthUserByEmail, checking };
}
