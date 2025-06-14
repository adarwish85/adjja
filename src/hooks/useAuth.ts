
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
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

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      const userRole = Array.isArray(profile.user_roles) ? profile.user_roles[0] : profile.user_roles;
      
      return {
        ...profile,
        role_name: userRole?.name || 'Student'
      } as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Signed in successfully");
      return { data, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      return { data: null, error };
    }
  };

  const signInWithUsername = async (username: string, password: string) => {
    try {
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUserProfile(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign out");
    }
  };

  const hasRole = (roleName: string): boolean => {
    return userProfile?.role_name?.toLowerCase() === roleName.toLowerCase();
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
