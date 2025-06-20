
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role_name: string;
  role_id: string;
  approval_status: string;
  mandatory_fields_completed: boolean;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useAuthFlow = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userProfile: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          user_roles (
            id,
            name
          ),
          approval_status,
          mandatory_fields_completed
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Profile fetch error:', error);
        throw new Error(`Profile fetch failed: ${error.message}`);
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      const enrichedProfile: UserProfile = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role_name: profile.user_roles?.name || 'Student',
        role_id: profile.user_roles?.id || '',
        approval_status: profile.approval_status || 'pending',
        mandatory_fields_completed: profile.mandatory_fields_completed || false,
      };

      console.log('✅ Profile loaded:', enrichedProfile);
      return enrichedProfile;
    } catch (error) {
      console.error('💥 Profile fetch failed:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      // Let the auth state change handler take care of the rest
      console.log('✅ Sign in successful, waiting for auth state change...');
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        session: null,
        userProfile: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Add a 15-second timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Auth loading timeout reached');
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Authentication timeout. Please try refreshing the page.'
        }));
      }
    }, 15000);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        if (session?.user) {
          // Update state immediately with user/session
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            session: session,
            isAuthenticated: true,
            error: null,
          }));
          
          // Fetch profile separately with timeout
          try {
            const profilePromise = fetchUserProfile(session.user.id);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
            );
            
            const profile = await Promise.race([profilePromise, timeoutPromise]) as UserProfile | null;
            
            if (mounted) {
              setAuthState(prev => ({
                ...prev,
                userProfile: profile,
                loading: false,
                error: profile ? null : 'Failed to load user profile',
              }));
              clearTimeout(loadingTimeout);
            }
          } catch (error) {
            if (mounted) {
              console.error('Profile fetch error:', error);
              setAuthState(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load user profile',
              }));
              clearTimeout(loadingTimeout);
            }
          }
        } else {
          // No session - user logged out or not authenticated
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              userProfile: null,
              loading: false,
              error: null,
              isAuthenticated: false,
            });
            clearTimeout(loadingTimeout);
          }
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          if (mounted) {
            setAuthState(prev => ({ 
              ...prev, 
              loading: false, 
              error: error.message 
            }));
            clearTimeout(loadingTimeout);
          }
          return;
        }
        
        if (session?.user) {
          if (mounted) {
            setAuthState(prev => ({
              ...prev,
              user: session.user,
              session: session,
              isAuthenticated: true,
            }));
          }
          
          try {
            const profile = await fetchUserProfile(session.user.id);
            
            if (mounted) {
              setAuthState(prev => ({
                ...prev,
                userProfile: profile,
                loading: false,
                error: profile ? null : 'Failed to load user profile',
              }));
              clearTimeout(loadingTimeout);
            }
          } catch (error) {
            if (mounted) {
              setAuthState(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load user profile',
              }));
              clearTimeout(loadingTimeout);
            }
          }
        } else {
          if (mounted) {
            setAuthState(prev => ({ ...prev, loading: false }));
            clearTimeout(loadingTimeout);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Authentication initialization failed' 
          }));
          clearTimeout(loadingTimeout);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  return {
    ...authState,
    signIn,
    signOut,
  };
};
