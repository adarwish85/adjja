
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthDebugInfo {
  currentUserId: string | null;
  currentRole: string | null;
  sessionValid: boolean;
  isLoading: boolean;
  dbSessionInfo?: {
    auth_uid: string | null;
    session_valid: boolean;
    current_timestamp: string;
  };
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
      console.log('🔍 Running comprehensive auth debug check...');
      
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

      // Test database session state using direct SQL query instead of RPC
      let dbSessionInfo = null;
      try {
        const { data: dbSession, error: dbError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single();
        
        if (!dbError && dbSession) {
          // If we can query profiles, the session is working at DB level
          dbSessionInfo = {
            auth_uid: session?.user?.id || null,
            session_valid: true,
            current_timestamp: new Date().toISOString()
          };
          console.log('Database session test: SUCCESS');
        } else {
          dbSessionInfo = {
            auth_uid: null,
            session_valid: false,
            current_timestamp: new Date().toISOString()
          };
          console.log('Database session test: FAILED', dbError);
        }
      } catch (error) {
        console.error('Failed to test DB session:', error);
        dbSessionInfo = {
          auth_uid: null,
          session_valid: false,
          current_timestamp: new Date().toISOString()
        };
      }

      // Get current role using direct query instead of RPC to avoid type issues
      let currentRole = null;
      if (session?.user?.id) {
        const { data: roleData, error: roleError } = await supabase
          .from('profiles')
          .select(`
            user_roles (
              name
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (roleError) {
          console.error('Role fetch error:', roleError);
        } else {
          currentRole = roleData?.user_roles?.name || null;
          console.log('Current role:', currentRole);
        }
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
        currentUserId: session?.user?.id || null,
        currentRole: currentRole || profileData?.user_roles?.name || null,
        sessionValid: !!session?.user,
        isLoading: false,
        dbSessionInfo,
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
