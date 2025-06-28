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

  const fetchUserProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
    try {
      console.log(`🔍 Fetching profile for user: ${userId} (attempt ${retryCount + 1})`);
      
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
        
        // CRITICAL FIX: Enhanced Super Admin handling with auto-creation
        if (error.code === 'PGRST116') { // No rows returned
          console.log('⚠️ No profile found, checking if user is Super Admin...');
          
          // Get user email to check if it's the Super Admin
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email === 'Ahmeddarwesh@gmail.com') {
            console.log('👑 Super Admin detected, creating/fixing profile...');
            return await createSuperAdminProfile(userId, user.email);
          } else {
            // For regular users, attempt to create a profile if none exists
            console.log('👤 Regular user missing profile, attempting creation...');
            return await createUserProfile(userId, user?.email || '');
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
      
      // Retry logic for regular users
      if (retryCount < 2) {
        console.log(`🔄 Retrying profile fetch (${retryCount + 1}/2)...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await fetchUserProfile(userId, retryCount + 1);
      }
      
      return null;
    }
  };

  const createSuperAdminProfile = async (userId: string, email: string): Promise<UserProfile | null> => {
    try {
      // Get or create Super Admin role
      let { data: superAdminRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('name', 'Super Admin')
        .single();
      
      if (!superAdminRole) {
        console.log('Creating Super Admin role...');
        const { data: newRole } = await supabase
          .from('user_roles')
          .insert({
            name: 'Super Admin',
            description: 'System administrator with full access',
            is_system: true,
            permissions: ['*']
          })
          .select('id')
          .single();
        superAdminRole = newRole;
      }
      
      if (superAdminRole) {
        // Create Super Admin profile with proper status
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: 'Ahmed Darwish',
            email: email,
            role_id: superAdminRole.id,
            approval_status: 'approved',
            mandatory_fields_completed: true,
            profile_completed: true,
            status: 'active'
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
            role_name: 'Super Admin',
            role_id: superAdminRole.id,
            approval_status: 'approved',
            mandatory_fields_completed: true,
            profile_picture_url: newProfile.profile_picture_url,
            rejection_reason: newProfile.rejection_reason,
          };
        } else {
          console.error('Failed to create Super Admin profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error creating Super Admin profile:', error);
    }
    return null;
  };

  const createUserProfile = async (userId: string, email: string): Promise<UserProfile | null> => {
    try {
      // Get default Student role
      let { data: studentRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('name', 'Student')
        .single();
      
      if (!studentRole) {
        console.log('Creating Student role...');
        const { data: newRole } = await supabase
          .from('user_roles')
          .insert({
            name: 'Student',
            description: 'Default student role',
            is_system: true,
            permissions: ['view_own_profile', 'edit_own_profile']
          })
          .select('id')
          .single();
        studentRole = newRole;
      }
      
      if (studentRole) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: email.split('@')[0], // Use email prefix as default name
            email: email,
            role_id: studentRole.id,
            approval_status: 'pending',
            mandatory_fields_completed: false,
            profile_completed: false,
            status: 'active'
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
          console.log('✅ User profile created successfully');
          return {
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            role_name: 'Student',
            role_id: studentRole.id,
            approval_status: 'pending',
            mandatory_fields_completed: false,
            profile_picture_url: newProfile.profile_picture_url,
            rejection_reason: newProfile.rejection_reason,
          };
        } else {
          console.error('Failed to create user profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
    return null;
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
    
    // Reduced timeout to prevent long waits
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
    }, 8000); // Reduced from 10s to 8s
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id, session?.user?.email);
        
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
          
          // Fetch profile with reduced timeout
          profileFetchController = new AbortController();
          
          const profileTimeout = setTimeout(() => {
            if (mounted && !profileFetchController?.signal.aborted) {
              console.log('⚠️ Profile fetch timeout - proceeding with fallback');
              setAuthState(prev => ({
                ...prev,
                loading: false,
                authInitialized: true,
                // Only show error for non-Super Admin users
                error: session.user.email === 'Ahmeddarwesh@gmail.com' ? null : null, // Don't show error, let routing handle it
              }));
              clearTimeout(authTimeout);
            }
          }, 4000); // Reduced from 5s to 4s
          
          try {
            const profile = await fetchUserProfile(session.user.id);
            
            if (mounted && !profileFetchController?.signal.aborted) {
              clearTimeout(profileTimeout);
              setAuthState(prev => ({
                ...prev,
                userProfile: profile,
                loading: false,
                authInitialized: true,
                error: null, // Clear any previous errors on successful profile load
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
                // Only show error message for non-Super Admin users, and make it less alarming
                error: session.user.email === 'Ahmeddarwesh@gmail.com' 
                  ? null 
                  : null, // Don't show error here, let routing components handle it
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
