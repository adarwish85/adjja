
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CoachProfileData {
  specialties: string[];
  assigned_classes: string[];
  bio?: string;
  years_experience?: number;
  certifications?: string[];
}

export const useCoachProfiles = () => {
  const [loading, setLoading] = useState(false);

  const saveCoachProfile = async (coachId: string, profileData: CoachProfileData, isUpgradedStudent: boolean = false) => {
    setLoading(true);
    console.log("saveCoachProfile: Starting save for coach:", coachId, "Data:", profileData, "IsUpgraded:", isUpgradedStudent);
    
    try {
      if (isUpgradedStudent) {
        // For upgraded student-coaches, we need to store data in coach_profiles table
        console.log("saveCoachProfile: Handling upgraded student coach");
        
        // First, get the student's auth_user_id
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("auth_user_id")
          .eq("id", coachId)
          .single();

        if (studentError) {
          console.error("saveCoachProfile: Error fetching student:", studentError);
          throw new Error(`Could not find student record: ${studentError.message}`);
        }

        if (!student?.auth_user_id) {
          console.error("saveCoachProfile: No auth_user_id found for student");
          throw new Error("No auth account linked to this coach. Please contact administrator.");
        }

        console.log("saveCoachProfile: Student auth_user_id found:", student.auth_user_id);

        // Update or create coach profile with ALL coach-specific data
        const profileUpdateData = {
          user_id: student.auth_user_id,
          bio: profileData.bio || null,
          years_experience: profileData.years_experience || 0,
          certifications: Array.isArray(profileData.certifications) ? profileData.certifications : [],
          specialties: Array.isArray(profileData.specialties) ? profileData.specialties : [],
          assigned_classes: Array.isArray(profileData.assigned_classes) ? profileData.assigned_classes : [],
          updated_at: new Date().toISOString()
        };

        console.log("saveCoachProfile: Upserting coach profile with data:", profileUpdateData);

        const { data: profileResult, error: profileError } = await supabase
          .from("coach_profiles")
          .upsert(profileUpdateData, { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (profileError) {
          console.error("saveCoachProfile: Error updating coach profile:", profileError);
          throw new Error(`Failed to update coach profile: ${profileError.message}`);
        }

        console.log("saveCoachProfile: Successfully updated coach profile:", profileResult);

        // Critical: Verify the update was actually saved by fetching fresh data
        const { data: verificationData, error: verificationError } = await supabase
          .from("coach_profiles")
          .select("*")
          .eq("user_id", student.auth_user_id)
          .single();

        if (verificationError) {
          console.error("saveCoachProfile: Verification failed:", verificationError);
          throw new Error("Update verification failed. Changes may not have been saved.");
        }

        // Check if the data actually matches what we tried to save
        const isDataCorrect = (
          JSON.stringify(verificationData.specialties || []) === JSON.stringify(profileData.specialties || []) &&
          JSON.stringify(verificationData.assigned_classes || []) === JSON.stringify(profileData.assigned_classes || []) &&
          verificationData.bio === (profileData.bio || null) &&
          verificationData.years_experience === (profileData.years_experience || 0)
        );

        if (!isDataCorrect) {
          console.error("saveCoachProfile: Data verification failed. Expected:", profileData, "Got:", verificationData);
          throw new Error("Data verification failed. The update was not saved correctly.");
        }

        console.log("saveCoachProfile: Data verification successful:", verificationData);

      } else {
        // For traditional coaches, update the coaches table directly
        console.log("saveCoachProfile: Handling traditional coach");
        
        const coachUpdateData = {
          specialties: Array.isArray(profileData.specialties) ? profileData.specialties : [],
          assigned_classes: Array.isArray(profileData.assigned_classes) ? profileData.assigned_classes : [],
          updated_at: new Date().toISOString()
        };

        console.log("saveCoachProfile: Updating traditional coach with data:", coachUpdateData);

        const { data: coachResult, error: coachError } = await supabase
          .from("coaches")
          .update(coachUpdateData)
          .eq("id", coachId)
          .select()
          .single();

        if (coachError) {
          console.error("saveCoachProfile: Error updating traditional coach:", coachError);
          throw new Error(`Failed to update coach: ${coachError.message}`);
        }

        if (!coachResult) {
          throw new Error("No coach record was updated. The coach may not exist.");
        }

        console.log("saveCoachProfile: Successfully updated traditional coach:", coachResult);

        // Verify the traditional coach update
        const { data: verificationData, error: verificationError } = await supabase
          .from("coaches")
          .select("*")
          .eq("id", coachId)
          .single();

        if (verificationError) {
          console.error("saveCoachProfile: Traditional coach verification failed:", verificationError);
          throw new Error("Update verification failed. Changes may not have been saved.");
        }

        // Check if the data actually matches what we tried to save
        const isDataCorrect = (
          JSON.stringify(verificationData.specialties || []) === JSON.stringify(profileData.specialties || []) &&
          JSON.stringify(verificationData.assigned_classes || []) === JSON.stringify(profileData.assigned_classes || [])
        );

        if (!isDataCorrect) {
          console.error("saveCoachProfile: Traditional coach data verification failed. Expected:", profileData, "Got:", verificationData);
          throw new Error("Data verification failed. The update was not saved correctly.");
        }

        console.log("saveCoachProfile: Traditional coach verification successful:", verificationData);
      }

      toast.success("Coach profile updated successfully");
      console.log("saveCoachProfile: Save operation completed successfully");
      return true;

    } catch (error) {
      console.error("saveCoachProfile: Error in save operation:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to update coach profile: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCoachProfile = async (coachId: string, isUpgradedStudent: boolean = false) => {
    console.log("getCoachProfile: Fetching profile for coach:", coachId, "IsUpgraded:", isUpgradedStudent);
    
    try {
      if (isUpgradedStudent) {
        // Get data from both students table and coach_profiles
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("auth_user_id")
          .eq("id", coachId)
          .single();

        if (studentError || !student?.auth_user_id) {
          console.log("getCoachProfile: No auth user found for upgraded student coach");
          return {
            specialties: [],
            assigned_classes: [],
            bio: null,
            years_experience: 0,
            certifications: []
          };
        }

        const { data: profile, error: profileError } = await supabase
          .from("coach_profiles")
          .select("*")
          .eq("user_id", student.auth_user_id)
          .single();

        if (profileError) {
          console.log("getCoachProfile: No coach profile found for upgraded student, returning defaults");
          return {
            specialties: [],
            assigned_classes: [],
            bio: null,
            years_experience: 0,
            certifications: []
          };
        }

        console.log("getCoachProfile: Found coach profile for upgraded student:", profile);
        return {
          ...profile,
          specialties: profile.specialties || [],
          assigned_classes: profile.assigned_classes || []
        };
      } else {
        // Get data from coaches table
        const { data: coach, error } = await supabase
          .from("coaches")
          .select("specialties, assigned_classes")
          .eq("id", coachId)
          .single();

        if (error) {
          console.error("getCoachProfile: Error fetching traditional coach:", error);
          return null;
        }

        console.log("getCoachProfile: Found traditional coach profile:", coach);
        return {
          specialties: coach.specialties || [],
          assigned_classes: coach.assigned_classes || []
        };
      }
    } catch (error) {
      console.error("getCoachProfile: Error getting coach profile:", error);
      return null;
    }
  };

  return {
    saveCoachProfile,
    getCoachProfile,
    loading
  };
};
