
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Gets a profile id for a given email (for mapping/table joins)
export function useProfileIdByEmail() {
  const getProfileIdByEmail = useCallback(async (email: string): Promise<string | null> => {
    if (!email) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (error || !data || !data.id) return null;
    return data.id;
  }, []);

  return { getProfileIdByEmail };
}
