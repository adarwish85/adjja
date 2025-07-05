
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthDebugInfo {
  currentUserId: string | null;
  currentRole: string | null;
  sessionValid: boolean;
  isLoading: boolean;
}

export const useAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo>({
    currentUserId: null,
    currentRole: null,
    sessionValid: false,
    isLoading: true,
  });

  const runAuthDebug = async () => {
    try {
      console.log('🔍 Running auth debug check...');
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error("Session error detected");
      }

      console.log('Session data:', {
        user: session?.user?.email,
        expires_at: session?.expires_at,
        access_token: session?.access_token ? 'Present' : 'Missing'
      });

      // Call debug function
      const { data: debugData, error: debugError } = await supabase.rpc('debug_auth_session');
      
      if (debugError) {
        console.error('Debug function error:', debugError);
      } else {
        console.log('Debug results:', debugData);
      }

      // Get user profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, approval_status, user_roles(name)')
        .eq('id', session?.user?.id || '')
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      } else {
        console.log('Profile data:', profileData);
      }

      setDebugInfo({
        currentUserId: debugData?.[0]?.current_user_id || session?.user?.id || null,
        currentRole: debugData?.[0]?.current_role || profileData?.user_roles?.name || null,
        sessionValid: debugData?.[0]?.session_valid || !!session?.user,
        isLoading: false,
      });

    } catch (error) {
      console.error('Auth debug error:', error);
      setDebugInfo(prev => ({ ...prev, isLoading: false }));
    }
  };

  const refreshSession = async () => {
    try {
      console.log('🔄 Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        toast.error("Failed to refresh session");
        return false;
      }

      console.log('Session refreshed successfully');
      toast.success("Session refreshed successfully");
      await runAuthDebug();
      return true;
    } catch (error) {
      console.error('Session refresh failed:', error);
      toast.error("Session refresh failed");
      return false;
    }
  };

  useEffect(() => {
    runAuthDebug();
  }, []);

  return {
    debugInfo,
    runAuthDebug,
    refreshSession,
  };
};
