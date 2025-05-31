
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
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
      
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign out");
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
