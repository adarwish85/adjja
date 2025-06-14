import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name?: string;
  status: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createFallbackProfile = (user: User, suggestedRole: string = 'Student'): UserProfile => {
    console.log('Creating fallback profile for user:', user.id, 'with suggested role:', suggestedRole);
    return {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role_id: 'fallback-role-id',
      role_name: suggestedRole,
      status: 'active'
    };
  };

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const profilePromise = supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          role_id,
          status,
          user_roles:role_id (
            name
          )
        `)
        .eq('id', userId)
        .single();

      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      console.log('Profile query result:', { profile, error });

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If it's a timeout or database recursion error, return fallback
        if (error.message?.includes('timeout') || 
            error.message?.includes('recursion') || 
            error.code === 'PGRST301' ||
            error.code === '42P17') {
          console.log('Database issue detected, using fallback profile');
          // Don't default to Student - preserve any role info from auth metadata
          const suggestedRole = user?.user_metadata?.role || 'Student';
          return createFallbackProfile({ id: userId, email: userEmail, user_metadata: user?.user_metadata } as User, suggestedRole);
        }
        
        // If profile doesn't exist, try to create one (with error handling)
        if (error.code === 'PGRST116') {
          try {
            console.log('Profile not found, attempting to create...');
            
            // Get default student role with timeout
            const roleQuery = supabase
              .from('user_roles')
              .select('id')
              .eq('name', 'Student')
              .single();
              
            const { data: studentRole } = await Promise.race([
              roleQuery,
              new Promise((_, reject) => setTimeout(() => reject(new Error('Role fetch timeout')), 5000))
            ]) as any;

            if (studentRole) {
              const profileName = userEmail?.split('@')[0] || 'User';
              const profileEmail = userEmail || '';

              const createQuery = supabase
                .from('profiles')
                .insert({
                  id: userId,
                  name: profileName,
                  email: profileEmail,
                  role_id: studentRole.id,
                  status: 'active'
                })
                .select(`
                  id,
                  name,
                  email,
                  role_id,
                  status,
                  user_roles:role_id (
                    name
                  )
                `)
                .single();

              const { data: newProfile, error: createError } = await Promise.race([
                createQuery,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Profile create timeout')), 5000))
              ]) as any;

              if (!createError && newProfile) {
                const userRole = Array.isArray(newProfile.user_roles) ? newProfile.user_roles[0] : newProfile.user_roles;
                return {
                  ...newProfile,
                  role_name: userRole?.name || 'Student'
                } as UserProfile;
              }
            }
          } catch (createError) {
            console.error('Error creating profile, using fallback:', createError);
          }
        }
        
        // Return fallback profile if all else fails - don't always default to Student
        const suggestedRole = user?.user_metadata?.role || 'Student';
        return createFallbackProfile({ id: userId, email: userEmail, user_metadata: user?.user_metadata } as User, suggestedRole);
      }

      const userRole = Array.isArray(profile.user_roles) ? profile.user_roles[0] : profile.user_roles;
      
      const userProfile = {
        ...profile,
        role_name: userRole?.name || 'Student'
      } as UserProfile;

      console.log('Successfully fetched profile:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Critical error in fetchUserProfile:', error);
      // Always return a fallback to prevent infinite loading - but don't always default to Student
      const suggestedRole = user?.user_metadata?.role || 'Student';
      return createFallbackProfile({ id: userId, email: userEmail, user_metadata: user?.user_metadata } as User, suggestedRole);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authTimeout: NodeJS.Timeout;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const profile = await fetchUserProfile(session.user.id, session.user.email);
            if (mounted) {
              setUserProfile(profile);
              console.log('Profile set:', profile);
            }
          } catch (error) {
            console.error('Error setting profile:', error);
            if (mounted) {
              // Set fallback profile to prevent infinite loading
              setUserProfile(createFallbackProfile(session.user));
            }
          }
        } else {
          if (mounted) {
            setUserProfile(null);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        console.log("Initial session:", session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email);
          if (mounted) {
            setUserProfile(profile);
            console.log('Initial profile set:', profile);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Safety timeout - never stay loading forever
    authTimeout = setTimeout(() => {
      if (mounted) {
        console.log('Auth timeout reached, stopping loading');
        setLoading(false);
      }
    }, 15000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Sign in successful, waiting for profile...");
      toast.success("Signed in successfully");
      return { data, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithUsername = async (username: string, password: string) => {
    try {
      setLoading(true);
      // First, find the user by username to get their email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (profileError || !profile) {
        throw new Error("Username not found");
      }

      // Then sign in with email
      return await signInWithEmail(profile.email, password);
    } catch (error) {
      console.error("Error signing in with username:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    // Check if input looks like an email
    const isEmail = emailOrUsername.includes('@');
    
    if (isEmail) {
      return await signInWithEmail(emailOrUsername, password);
    } else {
      return await signInWithUsername(emailOrUsername, password);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) throw error;

      toast.success("Account created successfully");
      return { data, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Clear local state first to prevent UI issues
      setUserProfile(null);
      setUser(null);
      setSession(null);
      
      // Attempt to sign out, but don't throw error if session is already missing
      const { error } = await supabase.auth.signOut();
      
      // Only log error if it's not a session-related error
      if (error && !error.message.includes('session') && !error.message.includes('Session')) {
        console.error("Sign out error:", error);
        toast.error(error.message);
      } else {
        // Success or expected session error
        toast.success("Signed out successfully");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      // Don't show error to user for session issues, just clear local state
      if (error instanceof Error && !error.message.includes('session')) {
        toast.error("Failed to sign out");
      } else {
        toast.success("Signed out successfully");
      }
    }
  };

  const hasRole = (roleName: string): boolean => {
    if (!userProfile?.role_name) return false;
    // Case-insensitive role comparison
    return userProfile.role_name.toLowerCase() === roleName.toLowerCase();
  };

  const isAdmin = (): boolean => hasRole('Super Admin') || hasRole('Admin');
  const isCoach = (): boolean => hasRole('Coach');
  const isStudent = (): boolean => hasRole('Student');

  return {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    isAdmin,
    isCoach,
    isStudent,
  };
};
