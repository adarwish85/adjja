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

      // Step 2: Fetch upgraded student coaches with simpler approach
      let upgradedStudentCoaches: Coach[] = [];
      try {
        console.log("fetchCoaches: Fetching students with auth accounts...");
        
        // First get students with auth_user_id
        const { data: studentsWithAuth, error: studentsError } = await supabase
          .from("students")
          .select("id, name, email, phone, belt, joined_date, auth_user_id")
          .not("auth_user_id", "is", null);

        if (studentsError) {
          console.error("fetchCoaches: Error fetching students with auth:", studentsError);
          throw studentsError;
        }

        if (studentsWithAuth && studentsWithAuth.length > 0) {
          console.log("fetchCoaches: Found students with auth accounts:", studentsWithAuth.length);
          
          // Get the Coach role ID first
          const { data: coachRole, error: roleError } = await supabase
            .from("user_roles")
            .select("id")
            .eq("name", "Coach")
            .single();

          if (roleError) {
            console.error("fetchCoaches: Error fetching Coach role:", roleError);
            throw roleError;
          }

          if (coachRole) {
            console.log("fetchCoaches: Coach role ID found:", coachRole.id);
            
            // Get profiles with coach role
            const authUserIds = studentsWithAuth.map(s => s.auth_user_id).filter(Boolean);
            const { data: coachProfiles, error: profilesError } = await supabase
              .from("profiles")
              .select("id")
              .eq("role_id", coachRole.id)
              .in("id", authUserIds);

            if (profilesError) {
              console.error("fetchCoaches: Error fetching coach profiles:", profilesError);
              throw profilesError;
            }

            if (coachProfiles && coachProfiles.length > 0) {
              console.log("fetchCoaches: Found coach profiles:", coachProfiles.length);
              
              const coachProfileIds = coachProfiles.map(p => p.id);
              
              // Filter students who have coach role
              upgradedStudentCoaches = studentsWithAuth
                .filter(student => student.auth_user_id && coachProfileIds.includes(student.auth_user_id))
                .map(student => ({
                  id: student.id,
                  name: student.name,
                  email: student.email,
                  phone: student.phone || null,
                  belt: student.belt,
                  specialties: [],
                  branch: "Main",
                  status: "active" as const,
                  students_count: 0,
                  assigned_classes: [],
                  joined_date: student.joined_date,
                  created_at: student.joined_date,
                  updated_at: student.joined_date,
                  is_upgraded_student: true
                }));
              
              console.log("fetchCoaches: Upgraded student coaches:", upgradedStudentCoaches.length);
            } else {
              console.log("fetchCoaches: No students with coach role found");
            }
          } else {
            console.log("fetchCoaches: Coach role not found in database");
          }
        } else {
          console.log("fetchCoaches: No students with auth accounts found");
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
    
    const { data, error } = await supabase
      .from("coaches")
      .update(cleanUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }

    console.log("Successfully updated coach:", data);

    const typedCoach: Coach = {
      ...data,
      status: data.status as "active" | "inactive",
      specialties: data.specialties || [],
      phone: data.phone || null,
      students_count: data.students_count || 0,
      joined_date: data.joined_date || new Date().toISOString().split('T')[0],
      assigned_classes: data.assigned_classes || []
    };

    toast.success("Coach updated successfully");
    return typedCoach;
  },

  async deleteCoach(id: string): Promise<void> {
    const { error } = await supabase
      .from("coaches")
      .delete()
      .eq("id", id);

    if (error) throw error;

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
