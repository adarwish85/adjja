
import { supabase } from "@/integrations/supabase/client";

interface CoachProfileData {
  specialties: string[];
  assigned_classes: string[];
  bio?: string;
  years_experience?: number;
  certifications?: string[];
}

export const useCoachProfileData = () => {
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
    getCoachProfile
  };
};
