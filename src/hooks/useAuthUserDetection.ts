
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthUserStatus {
  hasAuthAccount: boolean;
  authUserId?: string;
}

export function useAuthUserDetection() {
  const [checking, setChecking] = useState(false);

  const checkAuthUserByEmail = useCallback(async (email: string): Promise<AuthUserStatus> => {
    if (!email) return { hasAuthAccount: false };
    
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      
      setChecking(false);
      
      if (error || !data) {
        return { hasAuthAccount: false };
      }
      
      return {
        hasAuthAccount: true,
        authUserId: data.id
      };
    } catch (e) {
      setChecking(false);
      return { hasAuthAccount: false };
    }
  }, []);

  return {
    checkAuthUserByEmail,
    checking
  };
}
