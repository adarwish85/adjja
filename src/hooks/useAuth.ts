
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityAuditLogger } from './useSecurityAuditLogger';
import { useRateLimiter } from './useRateLimiter';

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
  const { logLoginAttempt, logPasswordChange, logSuspiciousActivity } = useSecurityAuditLogger();
  const rateLimiter = useRateLimiter({
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000 // 30 minutes
  });

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
    // Only use role-based check, remove hardcoded email security vulnerability
    const roleCheck = profile?.role_name?.toLowerCase() === 'super admin';
    
    console.log('🔍 Super Admin Check:');
    console.log('- Role match:', roleCheck, profile?.role_name);
    console.log('- Final result:', roleCheck);
    
    return roleCheck;
  };

  // Enhanced profile fetch function with better error handling
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('📡 Fetching profile for user:', userId);
      
      // First check if we have a valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        console.warn('⚠️ No valid session found during profile fetch');
        return null;
      }
      
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
        // Don't throw error if it's just missing profile
        if (error.code === 'PGRST116') {
          console.log('📋 No profile found - this might be expected for new users');
          return null;
        }
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
      // Check rate limiting
      if (rateLimiter.isBlocked()) {
        const remainingTime = rateLimiter.getRemainingTime();
        const errorMessage = `Too many login attempts. Please try again in ${remainingTime} seconds.`;
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage 
        }));
        logSuspiciousActivity('Rate limited login attempt', { email });
        return { success: false, error: errorMessage };
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('🔐 Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in failed:', error);
        rateLimiter.recordAttempt();
        logLoginAttempt(false, email);
        
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }));
        return { success: false, error: error.message };
      }

      console.log('✅ Sign in successful');
      rateLimiter.reset(); // Reset on successful login
      logLoginAttempt(true, email);
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('💥 Sign in exception:', error);
      rateLimiter.recordAttempt();
      logLoginAttempt(false, email);
      
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
      console.log('🚪 Signing out...');
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
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    console.log('🚀 Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
            loading: true, // Keep loading until profile is resolved
          }));
          
          // Check if Super Admin first - if so, create minimal profile immediately
          if (isSuperAdmin(session.user)) {
            console.log('👑 Super Admin detected, creating profile');
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
            try {
              const profile = await fetchProfile(session.user.id);
              if (mounted) {
                setAuthState(prev => ({
                  ...prev,
                  userProfile: profile,
                  loading: false,
                }));
              }
            } catch (error) {
              console.error('❌ Profile fetch error during auth change:', error);
              if (mounted) {
                setAuthState(prev => ({
                  ...prev,
                  userProfile: null,
                  loading: false,
                  error: 'Failed to load user profile',
                }));
              }
            }
          }
        } else {
          // User is not authenticated
          console.log('👤 User not authenticated');
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
        console.error('❌ Session fetch error:', error);
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
      console.log('🧹 Cleaning up auth listener');
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
