
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
  profile_picture_url?: string;
  rejection_reason?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  authInitialized: boolean;
}

export const useAuthFlow = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userProfile: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    authInitialized: false,
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
          profile_picture_url,
          rejection_reason,
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
        
        // CRITICAL FIX: For Super Admin, create minimal profile if missing
        if (error.code === 'PGRST116') { // No rows returned
          console.log('⚠️ No profile found, checking if user is Super Admin...');
          
          // Get user email to check if it's the Super Admin
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email === 'Ahmeddarwesh@gmail.com') {
            console.log('👑 Super Admin detected, creating minimal profile...');
            
            // Get Super Admin role
            const { data: superAdminRole } = await supabase
              .from('user_roles')
              .select('id')
              .eq('name', 'Super Admin')
              .single();
            
            if (superAdminRole) {
              // Create Super Admin profile
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: userId,
                  name: 'Ahmed Darwish',
                  email: user.email,
                  role_id: superAdminRole.id,
                  approval_status: 'approved',
                  mandatory_fields_completed: true,
                  profile_completed: true
                })
                .select(`
                  id,
                  name,
                  email,
                  profile_picture_url,
                  rejection_reason,
                  user_roles (
                    id,
                    name
                  ),
                  approval_status,
                  mandatory_fields_completed
                `)
                .single();
              
              if (!insertError && newProfile) {
                console.log('✅ Super Admin profile created successfully');
                return {
                  id: newProfile.id,
                  name: newProfile.name,
                  email: newProfile.email,
                  role_name: newProfile.user_roles?.name || 'Super Admin',
                  role_id: newProfile.user_roles?.id || '',
                  approval_status: newProfile.approval_status || 'approved',
                  mandatory_fields_completed: newProfile.mandatory_fields_completed || true,
                  profile_picture_url: newProfile.profile_picture_url,
                  rejection_reason: newProfile.rejection_reason,
                };
              }
            }
          }
        }
        
        return null;
      }

      if (!profile) {
        console.error('❌ No profile found for user:', userId);
        return null;
      }

      const enrichedProfile: UserProfile = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role_name: profile.user_roles?.name || 'Student',
        role_id: profile.user_roles?.id || '',
        approval_status: profile.approval_status || 'pending',
        mandatory_fields_completed: profile.mandatory_fields_completed || false,
        profile_picture_url: profile.profile_picture_url,
        rejection_reason: profile.rejection_reason,
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
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message,
          authInitialized: true 
        }));
        return { success: false, error: error.message };
      }

      console.log('✅ Sign in successful');
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        authInitialized: true 
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/profile-wizard`,
        },
      });

      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message,
          authInitialized: true 
        }));
        return { success: false, error: error.message };
      }

      console.log('✅ Sign up successful');
      return { success: true, error: null, user: data.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        authInitialized: true 
      }));
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
        authInitialized: true,
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    let profileFetchController: AbortController | null = null;
    
    // Add timeout to prevent infinite loading
    const authTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Auth timeout reached - forcing initialization');
        setAuthState(prev => ({
          ...prev,
          loading: false,
          authInitialized: true,
          error: prev.user ? null : 'Authentication timeout. Please try refreshing the page.'
        }));
      }
    }, 10000);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        // Cancel any ongoing profile fetch
        if (profileFetchController) {
          profileFetchController.abort();
        }
        
        if (session?.user) {
          console.log('👤 User authenticated, fetching profile...');
          
          // Update state immediately with user/session
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            session: session,
            isAuthenticated: true,
            error: null,
            loading: true,
            authInitialized: false,
          }));
          
          // Fetch profile with timeout
          profileFetchController = new AbortController();
          
          const profileTimeout = setTimeout(() => {
            if (mounted && !profileFetchController?.signal.aborted) {
              console.log('⚠️ Profile fetch timeout - proceeding without profile');
              setAuthState(prev => ({
                ...prev,
                loading: false,
                authInitialized: true,
                error: 'Profile loading timed out. Some features may be limited.',
              }));
              clearTimeout(authTimeout);
            }
          }, 5000);
          
          try {
            const profile = await fetchUserProfile(session.user.id);
            
            if (mounted && !profileFetchController?.signal.aborted) {
              clearTimeout(profileTimeout);
              setAuthState(prev => ({
                ...prev,
                userProfile: profile,
                loading: false,
                authInitialized: true,
                error: profile ? null : 'Failed to load user profile',
              }));
              clearTimeout(authTimeout);
            }
          } catch (error) {
            if (mounted && !profileFetchController?.signal.aborted) {
              clearTimeout(profileTimeout);
              console.error('Profile fetch error:', error);
              setAuthState(prev => ({
                ...prev,
                loading: false,
                authInitialized: true,
                error: 'Failed to load user profile',
              }));
              clearTimeout(authTimeout);
            }
          }
        } else {
          // No session - user logged out or not authenticated
          console.log('❌ No user session');
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              userProfile: null,
              loading: false,
              error: null,
              isAuthenticated: false,
              authInitialized: true,
            });
            clearTimeout(authTimeout);
          }
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          if (mounted) {
            setAuthState(prev => ({ 
              ...prev, 
              loading: false, 
              error: error.message,
              authInitialized: true,
            }));
            clearTimeout(authTimeout);
          }
          return;
        }
        
        // Let the auth state change listener handle the session
        if (!session && mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false,
            authInitialized: true,
          }));
          clearTimeout(authTimeout);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Authentication initialization failed',
            authInitialized: true,
          }));
          clearTimeout(authTimeout);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(authTimeout);
      if (profileFetchController) {
        profileFetchController.abort();
      }
    };
  }, []);

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
};
