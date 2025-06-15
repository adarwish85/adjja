import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Coach, CoachInput, CoachUpdate } from "@/types/coach";

export const coachService = {
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
              is_upgraded_student: true
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
  },

  async createCoach(coachData: CoachInput): Promise<Coach> {
    console.log("Adding coach with data:", coachData);
    
    // If account creation is requested, create the user account first
    if (coachData.createAccount && coachData.username && coachData.password) {
      console.log("Creating coach account...");
      
      // Call the database function to create the coach account
      const { data: accountData, error: accountError } = await supabase.rpc('create_student_account', {
        p_email: coachData.email,
        p_password: coachData.password,
        p_username: coachData.username,
        p_name: coachData.name,
        p_phone: coachData.phone
      });

      if (accountError) {
        console.error("Account creation error:", accountError);
        throw new Error(`Failed to create coach account: ${accountError.message}`);
      }

      console.log("Coach account created successfully:", accountData);
      toast.success("Coach account created successfully");
    }

    // Create the coach record (remove account-specific fields and add required branch field)
    const { username, password, createAccount, ...coachRecord } = coachData;
    
    // Add default branch if not provided (since it's required in the database)
    const coachRecordWithBranch = {
      ...coachRecord,
      branch: coachRecord.branch || "Main Branch" // Default branch if not provided
    };
    
    const { data, error } = await supabase
      .from("coaches")
      .insert([coachRecordWithBranch])
      .select()
      .single();

    if (error) throw error;

    const typedCoach: Coach = {
      ...data,
      status: data.status as "active" | "inactive",
      specialties: data.specialties || [],
      phone: data.phone || null,
      students_count: data.students_count || 0,
      joined_date: data.joined_date || new Date().toISOString().split('T')[0],
      assigned_classes: data.assigned_classes || []
    };

    toast.success("Coach added successfully");
    return typedCoach;
  },

  async updateCoach(id: string, updates: CoachUpdate): Promise<Coach> {
    console.log("Updating coach with id:", id, "updates:", updates);
    
    // Clean the update data - remove account-specific fields and undefined values
    const cleanUpdates = { ...updates };
    
    // Remove account-specific fields that shouldn't be in database updates
    delete cleanUpdates.username;
    delete cleanUpdates.password;
    delete cleanUpdates.createAccount;
    
    // Handle nullable fields properly
    if ('phone' in cleanUpdates && (cleanUpdates.phone === "" || cleanUpdates.phone === undefined)) {
      cleanUpdates.phone = null;
    }
    
    // Remove undefined values
    Object.keys(cleanUpdates).forEach(key => {
      if (cleanUpdates[key as keyof CoachUpdate] === undefined) {
        delete cleanUpdates[key as keyof CoachUpdate];
      }
    });
    
    console.log("Clean updates to send:", cleanUpdates);
    
    // If account creation is requested during update, create the user account first
    if (updates.createAccount && updates.username && updates.password) {
      console.log("Creating coach account during update...");
      
      // Call the database function to create the coach account
      const { data: accountData, error: accountError } = await supabase.rpc('create_student_account', {
        p_email: updates.email || "",
        p_password: updates.password,
        p_username: updates.username,
        p_name: updates.name || "",
        p_phone: updates.phone
      });

      if (accountError) {
        console.error("Account creation error:", accountError);
        throw new Error(`Failed to create coach account: ${accountError.message}`);
      }

      console.log("Coach account created successfully during update:", accountData);
      toast.success("Coach account created successfully");
    }
    
    // ENHANCED: Try to update in coaches table first, then fallback to students table
    console.log("Attempting to update in coaches table first...");
    const { data: coachData, error: coachError } = await supabase
      .from("coaches")
      .update(cleanUpdates)
      .eq("id", id)
      .select()
      .single();

    if (coachError) {
      console.log("Coach not found in coaches table, trying students table...");
      
      // If the coach doesn't exist in coaches table, try updating in students table
      // This handles upgraded student-coaches
      const studentUpdates: any = {};
      
      // Map coach fields to student fields
      if (cleanUpdates.name) studentUpdates.name = cleanUpdates.name;
      if (cleanUpdates.email) studentUpdates.email = cleanUpdates.email;
      if (cleanUpdates.phone !== undefined) studentUpdates.phone = cleanUpdates.phone;
      if (cleanUpdates.belt) studentUpdates.belt = cleanUpdates.belt;
      if (cleanUpdates.branch) studentUpdates.branch = cleanUpdates.branch;
      if (cleanUpdates.status) {
        studentUpdates.status = cleanUpdates.status;
      }
      
      // For upgraded student-coaches, ensure they're marked as a coach
      if (cleanUpdates.specialties || cleanUpdates.assigned_classes) {
        studentUpdates.coach = "Coach";
      }
      
      console.log("Updating student record with:", studentUpdates);
      
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .update(studentUpdates)
        .eq("id", id)
        .select()
        .single();

      if (studentError) {
        console.error("Failed to update in both coaches and students tables:", studentError);
        throw new Error(`Failed to update coach: ${studentError.message}`);
      }

      console.log("Successfully updated student-coach:", studentData);

      // Now handle coach-specific data in coach_profiles table
      if (studentData.auth_user_id && (cleanUpdates.specialties || cleanUpdates.assigned_classes || cleanUpdates.belt)) {
        console.log("Updating coach profile data for upgraded student...");
        
        const coachProfileUpdates: any = {};
        if (cleanUpdates.specialties) coachProfileUpdates.specialties = cleanUpdates.specialties;
        if (cleanUpdates.assigned_classes) coachProfileUpdates.assigned_classes = cleanUpdates.assigned_classes;
        
        const { error: profileError } = await supabase
          .from("coach_profiles")
          .upsert({
            user_id: studentData.auth_user_id,
            ...coachProfileUpdates,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error("Error updating coach profile:", profileError);
          // Don't throw here, main update was successful
        } else {
          console.log("Successfully updated coach profile for upgraded student");
        }
      }

      // Convert student data back to coach format
      const typedCoach: Coach = {
        id: studentData.id,
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone || null,
        belt: studentData.belt,
        specialties: cleanUpdates.specialties || [],
        branch: studentData.branch,
        status: studentData.status as "active" | "inactive",
        students_count: 0,
        assigned_classes: cleanUpdates.assigned_classes || [],
        joined_date: studentData.joined_date,
        created_at: studentData.joined_date,
        updated_at: new Date().toISOString(),
        is_upgraded_student: true
      };

      toast.success("Coach updated successfully");
      return typedCoach;
    }

    console.log("Successfully updated traditional coach:", coachData);

    const typedCoach: Coach = {
      ...coachData,
      status: coachData.status as "active" | "inactive",
      specialties: coachData.specialties || [],
      phone: coachData.phone || null,
      students_count: coachData.students_count || 0,
      joined_date: coachData.joined_date || new Date().toISOString().split('T')[0],
      assigned_classes: coachData.assigned_classes || []
    };

    toast.success("Coach updated successfully");
    return typedCoach;
  },

  async deleteCoach(id: string): Promise<void> {
    // ENHANCED: Try deleting from coaches table first, then students table
    console.log("Attempting to delete from coaches table first...");
    const { error: coachError } = await supabase
      .from("coaches")
      .delete()
      .eq("id", id);

    if (coachError) {
      console.log("Coach not found in coaches table, trying students table...");
      
      // If not found in coaches table, try students table
      const { error: studentError } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (studentError) {
        console.error("Failed to delete from both tables:", studentError);
        throw new Error(`Failed to delete coach: ${studentError.message}`);
      }
      
      console.log("Successfully deleted student-coach");
    } else {
      console.log("Successfully deleted traditional coach");
    }

    toast.success("Coach deleted successfully");
  },

  async updateCoachStudentCount(coachName: string): Promise<void> {
    console.log("Updating student count for coach:", coachName);
    
    // Count active students assigned to this coach
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id")
      .eq("coach", coachName)
      .eq("status", "active");

    if (studentsError) {
      console.error("Error counting students:", studentsError);
      return;
    }

    const studentCount = students?.length || 0;
    console.log("Found", studentCount, "students for coach:", coachName);

    // Update the coach's student count
    const { error: updateError } = await supabase
      .from("coaches")
      .update({ students_count: studentCount })
      .eq("name", coachName);

    if (updateError) {
      console.error("Error updating coach student count:", updateError);
    } else {
      console.log("Successfully updated coach student count");
    }
  },

  async addClassToCoach(coachName: string, className: string): Promise<void> {
    console.log("Adding class to coach:", coachName, className);
    
    // Don't add classes for "Various" instructors
    if (coachName === "Various") {
      return;
    }
    
    try {
      // Get the current coach data
      const { data: coach, error: fetchError } = await supabase
        .from("coaches")
        .select("assigned_classes")
        .eq("name", coachName)
        .single();

      if (fetchError) {
        console.error("Error fetching coach for class assignment:", fetchError);
        return;
      }

      if (!coach) {
        console.warn("Coach not found:", coachName);
        return;
      }

      const currentClasses = coach.assigned_classes || [];
      
      // Only add if not already assigned
      if (!currentClasses.includes(className)) {
        const updatedClasses = [...currentClasses, className];
        
        const { error: updateError } = await supabase
          .from("coaches")
          .update({ assigned_classes: updatedClasses })
          .eq("name", coachName);

        if (updateError) {
          console.error("Error updating coach assigned classes:", updateError);
        } else {
          console.log("Successfully added class to coach");
        }
      }
    } catch (error) {
      console.error("Error in addClassToCoach:", error);
    }
  },

  async removeClassFromCoach(coachName: string, className: string): Promise<void> {
    console.log("Removing class from coach:", coachName, className);
    
    // Don't process "Various" instructors
    if (coachName === "Various") {
      return;
    }
    
    try {
      // Get the current coach data
      const { data: coach, error: fetchError } = await supabase
        .from("coaches")
        .select("assigned_classes")
        .eq("name", coachName)
        .single();

      if (fetchError) {
        console.error("Error fetching coach for class removal:", fetchError);
        return;
      }

      if (!coach) {
        console.warn("Coach not found:", coachName);
        return;
      }

      const currentClasses = coach.assigned_classes || [];
      const updatedClasses = currentClasses.filter(cls => cls !== className);
      
      // Only update if there was a change
      if (currentClasses.length !== updatedClasses.length) {
        const { error: updateError } = await supabase
          .from("coaches")
          .update({ assigned_classes: updatedClasses })
          .eq("name", coachName);

        if (updateError) {
          console.error("Error updating coach assigned classes:", updateError);
        } else {
          console.log("Successfully removed class from coach");
        }
      }
    } catch (error) {
      console.error("Error in removeClassFromCoach:", error);
    }
  },

  async syncCoachClassAssignments(): Promise<void> {
    console.log("Syncing all coach class assignments...");
    
    try {
      // Get all classes and coaches
      const [classesResult, coachesResult] = await Promise.all([
        supabase.from("classes").select("name, instructor"),
        supabase.from("coaches").select("id, name")
      ]);

      if (classesResult.error) {
        throw classesResult.error;
      }
      
      if (coachesResult.error) {
        throw coachesResult.error;
      }

      const classes = classesResult.data || [];
      const coaches = coachesResult.data || [];

      // Build a map of coach name to assigned classes
      const coachClassMap: Record<string, string[]> = {};
      
      // Initialize all coaches with empty arrays
      coaches.forEach(coach => {
        coachClassMap[coach.name] = [];
      });

      // Populate the map with actual class assignments
      classes.forEach(cls => {
        if (cls.instructor && cls.instructor !== "Various" && coachClassMap.hasOwnProperty(cls.instructor)) {
          coachClassMap[cls.instructor].push(cls.name);
        }
      });

      // Update each coach's assigned_classes
      const updatePromises = coaches.map(async (coach) => {
        const assignedClasses = coachClassMap[coach.name] || [];
        
        const { error } = await supabase
          .from("coaches")
          .update({ assigned_classes: assignedClasses })
          .eq("id", coach.id);

        if (error) {
          console.error(`Error updating coach ${coach.name}:`, error);
        }
      });

      await Promise.all(updatePromises);
      console.log("Successfully synced all coach class assignments");
      toast.success("Coach class assignments synchronized");
    } catch (error) {
      console.error("Error syncing coach class assignments:", error);
      toast.error("Failed to sync coach class assignments");
    }
  }
};
