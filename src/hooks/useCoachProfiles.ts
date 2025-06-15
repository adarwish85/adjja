
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
    try {
      if (isUpgradedStudent) {
        // For upgraded student-coaches, we need to store some data in coach_profiles
        // and some in the students table
        
        // First, get the student's auth_user_id
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("auth_user_id")
          .eq("id", coachId)
          .single();

        if (studentError || !student?.auth_user_id) {
          throw new Error("Could not find auth user for this coach");
        }

        // Update or create coach profile with ALL coach-specific data
        const { error: profileError } = await supabase
          .from("coach_profiles")
          .upsert({
            user_id: student.auth_user_id,
            bio: profileData.bio,
            years_experience: profileData.years_experience,
            certifications: profileData.certifications,
            specialties: profileData.specialties,
            assigned_classes: profileData.assigned_classes,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error("Error updating coach profile:", profileError);
          throw profileError;
        }

        console.log("Successfully updated coach profile for upgraded student");
      } else {
        // For traditional coaches, update the coaches table directly
        const { error } = await supabase
          .from("coaches")
          .update({
            specialties: profileData.specialties,
            assigned_classes: profileData.assigned_classes,
            updated_at: new Date().toISOString()
          })
          .eq("id", coachId);

        if (error) {
          console.error("Error updating traditional coach:", error);
          throw error;
        }

        console.log("Successfully updated traditional coach");
      }

      toast.success("Coach profile updated successfully");
      return true;
    } catch (error) {
      console.error("Error saving coach profile:", error);
      toast.error("Failed to update coach profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCoachProfile = async (coachId: string, isUpgradedStudent: boolean = false) => {
    try {
      if (isUpgradedStudent) {
        // Get data from both students table and coach_profiles
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("auth_user_id")
          .eq("id", coachId)
          .single();

        if (studentError || !student?.auth_user_id) {
          return null;
        }

        const { data: profile, error: profileError } = await supabase
          .from("coach_profiles")
          .select("*")
          .eq("user_id", student.auth_user_id)
          .single();

        if (profileError) {
          console.log("No coach profile found for upgraded student");
          return null;
        }

        return profile;
      } else {
        // Get data from coaches table
        const { data: coach, error } = await supabase
          .from("coaches")
          .select("specialties, assigned_classes")
          .eq("id", coachId)
          .single();

        if (error) {
          console.error("Error fetching traditional coach:", error);
          return null;
        }

        return coach;
      }
    } catch (error) {
      console.error("Error getting coach profile:", error);
      return null;
    }
  };

  return {
    saveCoachProfile,
    getCoachProfile,
    loading
  };
};
