
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
  profile_completed: boolean;
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

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userProfile: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    authInitialized: false,
  });

  // Helper function to check if user is Super Admin
  const isSuperAdmin = (user: User | null, profile: UserProfile | null = null) => {
    const emailCheck = user?.email === 'Ahmeddarwesh@gmail.com';
    const roleCheck = profile?.role_name?.toLowerCase() === 'super admin';
    
    console.log('🔍 Super Admin Check:');
    console.log('- Email match:', emailCheck, user?.email);
    console.log('- Role match:', roleCheck, profile?.role_name);
    console.log('- Final result:', emailCheck || roleCheck);
    
    return emailCheck || roleCheck;
  };

  // Simple profile fetch function
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('📡 Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          profile_picture_url,
          rejection_reason,
          profile_completed,
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
        return null;
      }

      if (!profile) {
        console.log('📋 No profile found');
        return null;
      }

      console.log('✅ Profile fetched:', profile);

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role_name: profile.user_roles?.name || 'Student',
        role_id: profile.user_roles?.id || '',
        approval_status: profile.approval_status || 'pending',
        mandatory_fields_completed: profile.mandatory_fields_completed || false,
        profile_completed: profile.profile_completed || false,
        profile_picture_url: profile.profile_picture_url,
        rejection_reason: profile.rejection_reason,
      };
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
          error: error.message 
        }));
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
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
          data: { name },
          emailRedirectTo: `${window.location.origin}/profile-wizard`,
        },
      });

      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }));
        return { success: false, error: error.message };
      }

      return { success: true, error: null, user: data.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
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
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          // User is authenticated
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            session: session,
            isAuthenticated: true,
            error: null,
            authInitialized: true,
            loading: true, // Keep loading until profile is fetched
          }));
          
          // Check if Super Admin - if so, create minimal profile
          if (isSuperAdmin(session.user)) {
            console.log('👑 Super Admin detected, creating minimal profile');
            const superAdminProfile: UserProfile = {
              id: session.user.id,
              name: 'Ahmed Darwish',
              email: session.user.email || '',
              role_name: 'Super Admin',
              role_id: '',
              approval_status: 'approved',
              mandatory_fields_completed: true,
              profile_completed: true,
            };
            
            if (mounted) {
              setAuthState(prev => ({
                ...prev,
                userProfile: superAdminProfile,
                loading: false,
              }));
            }
          } else {
            // Fetch profile for regular users
            setTimeout(() => {
              if (mounted) {
                fetchProfile(session.user.id).then(profile => {
                  if (mounted) {
                    // Double-check Super Admin status with profile data
                    const finalProfile = profile && isSuperAdmin(session.user, profile) 
                      ? {
                          ...profile,
                          role_name: 'Super Admin',
                          approval_status: 'approved',
                          mandatory_fields_completed: true,
                          profile_completed: true,
                        }
                      : profile;

                    setAuthState(prev => ({
                      ...prev,
                      userProfile: finalProfile,
                      loading: false,
                    }));
                  }
                });
              }
            }, 0);
          }
        } else {
          // User is not authenticated
          setAuthState({
            user: null,
            session: null,
            userProfile: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            authInitialized: true,
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session fetch error:', error);
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: error.message,
            authInitialized: true,
          }));
        }
      }
      // The auth state change listener will handle the session
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    isSuperAdmin: (user: User | null = authState.user) => isSuperAdmin(user, authState.userProfile),
  };
};
