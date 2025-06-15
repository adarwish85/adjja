
import { supabase } from "@/integrations/supabase/client";
import { Coach } from "@/types/coach";

export const coachQueries = {
  async fetchCoaches(): Promise<Coach[]> {
    try {
      console.log("fetchCoaches: Starting to fetch coaches...");
      
      // Step 1: Fetch traditional coaches with simple query
      let traditionalCoaches: Coach[] = [];
      try {
        console.log("fetchCoaches: Fetching traditional coaches...");
        const { data: coachesData, error: coachesError } = await supabase
          .from("coaches")
          .select("*")
          .order("name");

        if (coachesError) {
          console.error("fetchCoaches: Error fetching traditional coaches:", coachesError);
          throw coachesError;
        }

        traditionalCoaches = (coachesData || []).map(coach => ({
          ...coach,
          status: coach.status as "active" | "inactive",
          is_upgraded_student: false
        }));
        
        console.log("fetchCoaches: Traditional coaches fetched:", traditionalCoaches.length);
      } catch (error) {
        console.error("fetchCoaches: Failed to fetch traditional coaches, continuing with empty array:", error);
        // Continue with empty array rather than failing completely
      }

      // Step 2: Fetch upgraded student coaches with enhanced detection
      let upgradedStudentCoaches: Coach[] = [];
      try {
        console.log("fetchCoaches: Fetching students marked as coaches...");
        
        // First get students marked as coaches OR students with auth accounts and Coach role
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select(`
            id, name, email, phone, belt, joined_date, auth_user_id,
            coach
          `)
          .or('coach.eq.Coach,and(auth_user_id.not.is.null)')
          .order("name");

        if (studentsError) {
          console.error("fetchCoaches: Error fetching students:", studentsError);
          throw studentsError;
        }

        if (studentsData && studentsData.length > 0) {
          console.log("fetchCoaches: Found potential coach students:", studentsData.length);
          
          // Get all auth user IDs for role checking
          const authUserIds = studentsData
            .map(s => s.auth_user_id)
            .filter(Boolean);

          let profilesWithCoachRole: any[] = [];
          
          if (authUserIds.length > 0) {
            // Get Coach role ID
            const { data: coachRole, error: roleError } = await supabase
              .from("user_roles")
              .select("id")
              .eq("name", "Coach")
              .single();

            if (roleError) {
              console.error("fetchCoaches: Error fetching Coach role:", roleError);
            } else if (coachRole) {
              console.log("fetchCoaches: Coach role ID found:", coachRole.id);
              
              // Get profiles with coach role
              const { data: coachProfiles, error: profilesError } = await supabase
                .from("profiles")
                .select("id")
                .eq("role_id", coachRole.id)
                .in("id", authUserIds);

              if (profilesError) {
                console.error("fetchCoaches: Error fetching coach profiles:", profilesError);
              } else {
                profilesWithCoachRole = coachProfiles || [];
                console.log("fetchCoaches: Found coach profiles:", profilesWithCoachRole.length);
              }
            }
          }

          const coachProfileIds = profilesWithCoachRole.map(p => p.id);
          
          // Filter students who are coaches (either marked as Coach OR have Coach role)
          const coachStudents = studentsData
            .filter(student => {
              const isMarkedAsCoach = student.coach === "Coach";
              const hasCoachRole = student.auth_user_id && coachProfileIds.includes(student.auth_user_id);
              return isMarkedAsCoach || hasCoachRole;
            });

          // Get coach profile data for these students
          const coachStudentIds = coachStudents.map(s => s.auth_user_id).filter(Boolean);
          let coachProfilesData: any[] = [];
          
          if (coachStudentIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabase
              .from("coach_profiles")
              .select("*")
              .in("user_id", coachStudentIds);

            if (!profilesError && profiles) {
              coachProfilesData = profiles;
            }
          }

          // Create a map of auth_user_id to coach profile data
          const profileMap = new Map();
          coachProfilesData.forEach(profile => {
            profileMap.set(profile.user_id, profile);
          });

          upgradedStudentCoaches = coachStudents.map(student => {
            const coachProfile = profileMap.get(student.auth_user_id) || {};
            
            return {
              id: student.id,
              name: student.name,
              email: student.email,
              phone: student.phone || null,
              belt: student.belt,
              specialties: coachProfile.specialties || [],
              branch: "Main",
              status: "active" as const,
              students_count: 0,
              assigned_classes: coachProfile.assigned_classes || [],
              joined_date: student.joined_date,
              created_at: student.joined_date,
              updated_at: student.joined_date,
              is_upgraded_student: true,
              auth_user_id: student.auth_user_id
            };
          });
          
          console.log("fetchCoaches: Upgraded student coaches:", upgradedStudentCoaches.length);
        } else {
          console.log("fetchCoaches: No potential coach students found");
        }
      } catch (error) {
        console.error("fetchCoaches: Failed to fetch upgraded student coaches, continuing without them:", error);
        // Continue without upgraded coaches rather than failing completely
      }

      // Step 3: Combine and return results
      const allCoaches = [...traditionalCoaches, ...upgradedStudentCoaches];
      console.log("fetchCoaches: Total coaches found:", allCoaches.length);
      
      // Sort by name
      const sortedCoaches = allCoaches.sort((a, b) => a.name.localeCompare(b.name));
      
      // If no coaches found at all, return empty array (don't throw error)
      if (sortedCoaches.length === 0) {
        console.log("fetchCoaches: No coaches found, returning empty array");
        return [];
      }
      
      return sortedCoaches;
    } catch (error) {
      console.error("fetchCoaches: Critical error in fetchCoaches:", error);
      // Don't throw here, let the hook handle the error display
      throw new Error(`Failed to fetch coaches: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
