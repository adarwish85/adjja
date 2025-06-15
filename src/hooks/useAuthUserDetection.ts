
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthUserStatus {
  hasAuthAccount: boolean;
  authUserId?: string;
  method?: 'auth_user_id' | 'email';
}

export function useAuthUserDetection() {
  const [checking, setChecking] = useState(false);

  const checkAuthUserById = useCallback(async (authUserId: string): Promise<AuthUserStatus> => {
    if (!authUserId) return { hasAuthAccount: false };
    
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", authUserId)
        .maybeSingle();
      
      setChecking(false);
      
      if (error || !data) {
        return { hasAuthAccount: false };
      }
      
      return {
        hasAuthAccount: true,
        authUserId: data.id,
        method: 'auth_user_id'
      };
    } catch (e) {
      setChecking(false);
      return { hasAuthAccount: false };
    }
  }, []);

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
        authUserId: data.id,
        method: 'email'
      };
    } catch (e) {
      setChecking(false);
      return { hasAuthAccount: false };
    }
  }, []);

  const checkAuthUserStatus = useCallback(async (email: string, authUserId?: string): Promise<AuthUserStatus> => {
    // Prioritize auth_user_id check if available (more reliable)
    if (authUserId) {
      const result = await checkAuthUserById(authUserId);
      if (result.hasAuthAccount) {
        return result;
      }
    }
    
    // Fall back to email check
    if (email) {
      return await checkAuthUserByEmail(email);
    }
    
    return { hasAuthAccount: false };
  }, [checkAuthUserById, checkAuthUserByEmail]);

  return {
    checkAuthUserByEmail,
    checkAuthUserById,
    checkAuthUserStatus,
    checking
  };
}
