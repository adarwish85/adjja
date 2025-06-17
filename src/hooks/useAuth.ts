
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
  profile_picture_url?: string;
  approval_status?: string;
  profile_completed?: boolean;
  mandatory_fields_completed?: boolean;
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createFallbackProfile = (user: User, suggestedRole: string = 'Student'): UserProfile => {
    console.log('🔄 useAuth: Creating fallback profile for user:', user.id, 'with suggested role:', suggestedRole);
    return {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role_id: 'fallback-role-id',
      role_name: suggestedRole,
      status: 'active'
    };
  };

  const verifyUserRole = async (userId: string, userEmail?: string): Promise<string | null> => {
    console.log('🔍 useAuth: Verifying role for user:', userId, 'email:', userEmail);
    
    try {
      // Check if user is upgraded student-coach
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('coach, auth_user_id')
        .eq('auth_user_id', userId)
        .single();

      if (!studentError && studentData) {
        console.log('👨‍🎓 useAuth: Found student record:', studentData);
        if (studentData.coach === 'Coach') {
          console.log('🎯 useAuth: Student is marked as Coach - should have Coach role');
          return 'Coach';
        }
      }

      // Check profile role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role_id, user_roles!inner(name)')
        .eq('id', userId)
        .single();

      if (!profileError && profileData) {
        const roleName = (profileData.user_roles as any)?.name;
        console.log('👤 useAuth: Profile role found:', roleName);
        return roleName;
      }

      console.log('⚠️ useAuth: No role found in verification');
      return null;
    } catch (error) {
      console.error('❌ useAuth: Error in role verification:', error);
      return null;
    }
  };

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log('📥 useAuth: Starting profile fetch for user:', userId, 'email:', userEmail);
      
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

      console.log('📋 useAuth: Profile query result:', { profile, error });

      if (error) {
        console.error('❌ useAuth: Error fetching user profile:', error);
        
        // If it's a timeout or database recursion error, return fallback
        if (error.message?.includes('timeout') || 
            error.message?.includes('recursion') || 
            error.code === 'PGRST301' ||
            error.code === '42P17') {
          console.log('⚠️ useAuth: Database issue detected, using fallback profile');
          
          // Verify role independently
          const verifiedRole = await verifyUserRole(userId, userEmail);
          const fallbackRole = verifiedRole || (userEmail === 'ahmeddarwesh@gmail.com' ? 'Super Admin' : 'Student');
          
          console.log('🔧 useAuth: Using verified role for fallback:', fallbackRole);
          return createFallbackProfile({ id: userId, email: userEmail, user_metadata: user?.user_metadata } as User, fallbackRole);
        }
        
        // If profile doesn't exist, try to create one (with error handling)
        if (error.code === 'PGRST116') {
          try {
            console.log('🔨 useAuth: Profile not found, attempting to create...');
            
            // Verify role first
            const verifiedRole = await verifyUserRole(userId, userEmail);
            let roleToAssign = verifiedRole || 'Student';
            
            // Special handling for Ahmed's email
            if (userEmail === 'ahmeddarwesh@gmail.com') {
              roleToAssign = 'Super Admin';
            }
            
            console.log('🎯 useAuth: Creating profile with role:', roleToAssign);
            
            // Get the appropriate role with timeout
            const roleQuery = supabase
              .from('user_roles')
              .select('id')
              .eq('name', roleToAssign)
              .single();
              
            const { data: targetRole } = await Promise.race([
              roleQuery,
              new Promise((_, reject) => setTimeout(() => reject(new Error('Role fetch timeout')), 5000))
            ]) as any;

            if (targetRole) {
              const profileName = userEmail?.split('@')[0] || 'User';
              const profileEmail = userEmail || '';

              const createQuery = supabase
                .from('profiles')
                .insert({
                  id: userId,
                  name: profileName,
                  email: profileEmail,
                  role_id: targetRole.id,
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
                const finalProfile = {
                  ...newProfile,
                  role_name: userRole?.name || roleToAssign
                } as UserProfile;
                
                console.log('✅ useAuth: Created new profile:', finalProfile);
                return finalProfile;
              }
            }
          } catch (createError) {
            console.error('❌ useAuth: Error creating profile, using fallback:', createError);
          }
        }
        
        // Return fallback profile if all else fails with verified role
        const verifiedRole = await verifyUserRole(userId, userEmail);
        const fallbackRole = verifiedRole || (userEmail === 'ahmeddarwesh@gmail.com' ? 'Super Admin' : 'Student');
        
        console.log('🔧 useAuth: Final fallback with verified role:', fallbackRole);
        return createFallbackProfile({ id: userId, email: userEmail, user_metadata: user?.user_metadata } as User, fallbackRole);
      }

      const userRole = Array.isArray(profile.user_roles) ? profile.user_roles[0] : profile.user_roles;
      
      let finalRoleName = userRole?.name || 'Student';
      
      // Verify role matches student coach status
      const verifiedRole = await verifyUserRole(userId, userEmail);
      if (verifiedRole && verifiedRole !== finalRoleName) {
        console.log('🔄 useAuth: Role mismatch detected. Profile role:', finalRoleName, 'Verified role:', verifiedRole);
        finalRoleName = verifiedRole;
      }
      
      const userProfile = {
        ...profile,
        role_name: finalRoleName
      } as UserProfile;

      console.log('✅ useAuth: Successfully fetched and verified profile:', userProfile);
      
      // Double check for Ahmed's email and override role if needed
      if (userEmail === 'ahmeddarwesh@gmail.com' && userProfile.role_name !== 'Super Admin') {
        console.log('🔧 useAuth: Overriding role for Ahmed to Super Admin');
        userProfile.role_name = 'Super Admin';
      }
      
      return userProfile;
    } catch (error) {
      console.error('💥 useAuth: Critical error in fetchUserProfile:', error);
      
      // Special handling for Ahmed's email in catch block
      if (userEmail === 'ahmeddarwesh@gmail.com') {
        console.log('🔧 useAuth: Critical error fallback for Ahmed, setting Super Admin role');
        return createFallbackProfile({ id: userId, email: userEmail, user_metadata: user?.user_metadata } as User, 'Super Admin');
      }
      
      // Try to verify role even in error case
      const verifiedRole = await verifyUserRole(userId, userEmail);
      const fallbackRole = verifiedRole || 'Student';
      
      console.log('🔧 useAuth: Critical error fallback with verified role:', fallbackRole);
      return createFallbackProfile({ id: userId, email: userEmail, user_metadata: user?.user_metadata } as User, fallbackRole);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authTimeout: NodeJS.Timeout;

    console.log('🔄 useAuth: Setting up auth state management');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔔 useAuth: Auth state changed:", event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            console.log('👤 useAuth: Fetching profile for authenticated user');
            const profile = await fetchUserProfile(session.user.id, session.user.email);
            if (mounted) {
              setUserProfile(profile);
              console.log('✅ useAuth: Profile set:', profile);
            }
          } catch (error) {
            console.error('❌ useAuth: Error setting profile:', error);
            if (mounted) {
              // Set fallback profile to prevent infinite loading
              const fallbackRole = session.user.email === 'ahmeddarwesh@gmail.com' ? 'Super Admin' : 'Student';
              setUserProfile(createFallbackProfile(session.user, fallbackRole));
            }
          }
        } else {
          if (mounted) {
            console.log('🚪 useAuth: User logged out, clearing profile');
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
        console.log('🔍 useAuth: Checking for existing session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        console.log("📋 useAuth: Initial session:", session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 useAuth: Processing initial session user');
          const profile = await fetchUserProfile(session.user.id, session.user.email);
          if (mounted) {
            setUserProfile(profile);
            console.log('✅ useAuth: Initial profile set:', profile);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ useAuth: Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Safety timeout - never stay loading forever
    authTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ useAuth: Auth timeout reached, stopping loading');
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
      console.log('🔐 useAuth: Attempting email sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("✅ useAuth: Sign in successful, waiting for profile...");
      toast.success("Signed in successfully");
      return { data, error: null };
    } catch (error) {
      console.error("❌ useAuth: Error signing in:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithUsername = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 useAuth: Attempting username sign in for:', username);
      // First, find the user by username to get their email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (profileError || !profile) {
        throw new Error("Username not found");
      }

      console.log('📧 useAuth: Found email for username:', profile.email);
      // Then sign in with email
      return await signInWithEmail(profile.email, password);
    } catch (error) {
      console.error("❌ useAuth: Error signing in with username:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    console.log('🔑 useAuth: Sign in attempt for:', emailOrUsername);
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
      console.log('🚪 useAuth: Signing out user');
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
