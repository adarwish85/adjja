
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name?: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching user profile for:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            id,
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        
        // If profile doesn't exist, create a basic one for existing users
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating basic profile for existing user');
          
          // Get the user's email from auth.users
          const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
          
          if (authUser && !userError) {
            // Get default Student role
            const { data: studentRole } = await supabase
              .from('user_roles')
              .select('id')
              .eq('name', 'Student')
              .single();
            
            // Create basic profile
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: authUser.email,
                name: authUser.email?.split('@')[0] || 'User',
                role_id: studentRole?.id || null,
                status: 'active',
                approval_status: 'approved', // Auto-approve for existing users
                mandatory_fields_completed: false
              })
              .select(`
                *,
                user_roles (
                  id,
                  name
                )
              `)
              .single();
            
            if (!createError && newProfile) {
              const enrichedProfile = {
                ...newProfile,
                role_name: newProfile.user_roles?.name || 'Student',
                role_id: newProfile.user_roles?.id || null
              };
              
              console.log('✅ Basic profile created successfully:', enrichedProfile);
              setUserProfile(enrichedProfile);
              return enrichedProfile;
            }
          }
        }
        return null;
      }

      if (profile) {
        const enrichedProfile = {
          ...profile,
          role_name: profile.user_roles?.name || 'Student',
          role_id: profile.user_roles?.id || null
        };
        
        console.log('✅ Profile fetched successfully:', enrichedProfile);
        setUserProfile(enrichedProfile);
        return enrichedProfile;
      }
    } catch (error) {
      console.error('💥 Unexpected error fetching profile:', error);
    }
    
    return null;
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name || ''
          }
        }
      });

      // If signup successful and user exists, create profile
      if (data?.user && !error) {
        console.log('✅ User signed up successfully, creating profile...');
        
        // Create basic profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: name || '',
            mandatory_fields_completed: false,
            approval_status: 'pending'
          });

        if (profileError) {
          console.error('❌ Error creating profile:', profileError);
        } else {
          console.log('✅ Profile created successfully');
        }
      }

      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        setUser(null);
        setSession(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    // Set a maximum loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ Auth loading timeout reached, setting loading to false');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    // Set up auth state listener - CRITICAL: No async operations in the callback!
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        // Only synchronous state updates here - NO async operations
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer any Supabase calls using setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id).catch((error) => {
              console.error('Failed to fetch profile:', error);
            }).finally(() => {
              console.log('🔄 Setting loading to false after profile fetch');
              setLoading(false);
              clearTimeout(loadingTimeout);
            });
          }, 0);
        } else {
          setUserProfile(null);
          console.log('🔄 Setting loading to false - no user');
          setLoading(false);
          clearTimeout(loadingTimeout);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          clearTimeout(loadingTimeout);
          return;
        }
        
        console.log('📋 Initial session:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (!profile) {
            console.log('⚠️ No profile found for user, but continuing...');
          }
        }
        
        console.log('🔄 Setting loading to false after initialization');
        setLoading(false);
        clearTimeout(loadingTimeout);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  return {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };
};
