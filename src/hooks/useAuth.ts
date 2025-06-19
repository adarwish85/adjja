
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile but don't block loading state
          const profile = await fetchUserProfile(session.user.id);
          if (!profile) {
            console.log('⚠️ No profile found for user, but continuing...');
          }
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (!profile) {
            console.log('⚠️ No profile found for user, but continuing...');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
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
