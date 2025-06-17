
import { supabase } from "@/integrations/supabase/client";
import { Coach } from "@/types/coach";

export const coachQueries = {
  async fetchCoaches(): Promise<Coach[]> {
    try {
      console.log("fetchCoaches: Starting to fetch coaches...");
      
      // Step 1: Fetch traditional coaches
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
      }

      // Step 2: Fetch upgraded student coaches with improved detection
      let upgradedStudentCoaches: Coach[] = [];
      try {
        console.log("fetchCoaches: Fetching students who are coaches...");
        
        // Get Coach role ID first
        const { data: coachRole, error: roleError } = await supabase
          .from("user_roles")
          .select("id")
          .eq("name", "Coach")
          .single();

        if (roleError || !coachRole) {
          console.error("fetchCoaches: Error fetching Coach role:", roleError);
          throw new Error("Coach role not found");
        }

        console.log("fetchCoaches: Coach role ID found:", coachRole.id);
        
        // Get all profiles with Coach role
        const { data: coachProfiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, email")
          .eq("role_id", coachRole.id);

        if (profilesError) {
          console.error("fetchCoaches: Error fetching coach profiles:", profilesError);
          throw profilesError;
        }

        console.log("fetchCoaches: Found coach profiles:", coachProfiles?.length || 0);

        if (coachProfiles && coachProfiles.length > 0) {
          const coachProfileIds = coachProfiles.map(p => p.id);
          
          // Get students linked to these coach profiles
          const { data: studentsData, error: studentsError } = await supabase
            .from("students")
            .select("*")
            .in("auth_user_id", coachProfileIds)
            .order("name");

          if (studentsError) {
            console.error("fetchCoaches: Error fetching coach students:", studentsError);
          } else if (studentsData) {
            console.log("fetchCoaches: Found coach students:", studentsData.length);
            
            // Get coach profile data
            const { data: coachProfilesData, error: coachProfileError } = await supabase
              .from("coach_profiles")
              .select("*")
              .in("user_id", coachProfileIds);

            const profileMap = new Map();
            (coachProfilesData || []).forEach(profile => {
              profileMap.set(profile.user_id, profile);
            });

            // Process each student who is now a coach
            for (const student of studentsData) {
              const coachProfile = profileMap.get(student.auth_user_id) || {};
              const profileData = coachProfiles.find(p => p.id === student.auth_user_id);
              
              // Calculate student counts for this coach
              let studentCount = 0;
              
              try {
                // Count direct students assigned to this coach
                const { data: directStudents, error: directError } = await supabase
                  .from("students")
                  .select("id", { count: 'exact' })
                  .or(`coach.eq.${student.name},coach_user_id.eq.${student.auth_user_id}`)
                  .eq("status", "active");

                if (!directError && directStudents) {
                  studentCount += directStudents.length;
                  console.log(`fetchCoaches: Direct students for ${student.name}:`, directStudents.length);
                }

                // Count students enrolled in classes where this coach is instructor
                const { data: coachClasses, error: classesError } = await supabase
                  .from("classes")
                  .select("id, name")
                  .eq("instructor", student.name)
                  .eq("status", "Active");

                if (!classesError && coachClasses && coachClasses.length > 0) {
                  console.log(`fetchCoaches: Classes for ${student.name}:`, coachClasses.length);
                  const classIds = coachClasses.map(c => c.id);
                  
                  const { data: enrollments, error: enrollmentError } = await supabase
                    .from("class_enrollments")
                    .select("student_id", { count: 'exact' })
                    .in("class_id", classIds)
                    .eq("status", "active");

                  if (!enrollmentError && enrollments) {
                    // Count unique students from class enrollments
                    const uniqueClassStudents = new Set(enrollments.map(e => e.student_id));
                    studentCount += uniqueClassStudents.size;
                    console.log(`fetchCoaches: Class students for ${student.name}:`, uniqueClassStudents.size);
                  }
                }
              } catch (error) {
                console.error("fetchCoaches: Error counting students for coach:", student.name, error);
              }
              
              upgradedStudentCoaches.push({
                id: student.id,
                name: student.name,
                email: student.email,
                phone: student.phone || null,
                belt: student.belt,
                specialties: coachProfile.specialties || [],
                branch: "Main",
                status: "active" as const,
                students_count: studentCount,
                assigned_classes: coachProfile.assigned_classes || [],
                joined_date: student.joined_date,
                created_at: student.joined_date,
                updated_at: student.joined_date,
                is_upgraded_student: true,
                auth_user_id: student.auth_user_id
              });
            }
          }
        }
        
        console.log("fetchCoaches: Upgraded student coaches:", upgradedStudentCoaches.length);
      } catch (error) {
        console.error("fetchCoaches: Failed to fetch upgraded student coaches:", error);
      }

      // Step 3: Update student counts for traditional coaches
      for (const coach of traditionalCoaches) {
        try {
          let studentCount = 0;
          
          // Count direct students
          const { data: directStudents, error: directError } = await supabase
            .from("students")
            .select("id", { count: 'exact' })
            .eq("coach", coach.name)
            .eq("status", "active");

          if (!directError && directStudents) {
            studentCount += directStudents.length;
          }

          // Count class students
          const { data: coachClasses, error: classesError } = await supabase
            .from("classes")
            .select("id")
            .eq("instructor", coach.name)
            .eq("status", "Active");

          if (!classesError && coachClasses && coachClasses.length > 0) {
            const classIds = coachClasses.map(c => c.id);
            
            const { data: enrollments, error: enrollmentError } = await supabase
              .from("class_enrollments")
              .select("student_id", { count: 'exact' })
              .in("class_id", classIds)
              .eq("status", "active");

            if (!enrollmentError && enrollments) {
              const uniqueClassStudents = new Set(enrollments.map(e => e.student_id));
              studentCount += uniqueClassStudents.size;
            }
          }
          
          coach.students_count = studentCount;
        } catch (error) {
          console.error("fetchCoaches: Error counting students for traditional coach:", coach.name, error);
        }
      }

      const allCoaches = [...traditionalCoaches, ...upgradedStudentCoaches];
      console.log("fetchCoaches: Total coaches found:", allCoaches.length);
      
      return allCoaches.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error("fetchCoaches: Critical error:", error);
      throw new Error(`Failed to fetch coaches: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
