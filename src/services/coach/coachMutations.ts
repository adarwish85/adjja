
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Coach, CoachInput, CoachUpdate } from "@/types/coach";

export const coachMutations = {
  async createCoach(coachData: CoachInput): Promise<Coach> {
    console.log("coachMutations.createCoach: Adding coach with data:", coachData);
    
    // If account creation is requested, create the user account first
    if (coachData.createAccount && coachData.username && coachData.password) {
      console.log("coachMutations.createCoach: Creating coach account...");
      
      // Call the database function to create the coach account
      const { data: accountData, error: accountError } = await supabase.rpc('create_student_account', {
        p_email: coachData.email,
        p_password: coachData.password,
        p_username: coachData.username,
        p_name: coachData.name,
        p_phone: coachData.phone
      });

      if (accountError) {
        console.error("coachMutations.createCoach: Account creation error:", accountError);
        throw new Error(`Failed to create coach account: ${accountError.message}`);
      }

      console.log("coachMutations.createCoach: Coach account created successfully:", accountData);
      toast.success("Coach account created successfully");
    }

    // Create the coach record (remove account-specific fields and add required branch field)
    const { username, password, createAccount, ...coachRecord } = coachData;
    
    // Add default branch if not provided (since it's required in the database)
    const coachRecordWithBranch = {
      ...coachRecord,
      branch: coachRecord.branch || "Main Branch" // Default branch if not provided
    };
    
    console.log("coachMutations.createCoach: Creating coach record:", coachRecordWithBranch);

    const { data, error } = await supabase
      .from("coaches")
      .insert([coachRecordWithBranch])
      .select()
      .single();

    if (error) {
      console.error("coachMutations.createCoach: Database error:", error);
      throw error;
    }

    console.log("coachMutations.createCoach: Coach record created successfully:", data);

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
    console.log("coachMutations.updateCoach: Updating coach with id:", id, "updates:", updates);
    
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
    
    console.log("coachMutations.updateCoach: Clean updates to send:", cleanUpdates);
    
    // If account creation is requested during update, create the user account first
    if (updates.createAccount && updates.username && updates.password) {
      console.log("coachMutations.updateCoach: Creating coach account during update...");
      
      // Call the database function to create the coach account
      const { data: accountData, error: accountError } = await supabase.rpc('create_student_account', {
        p_email: updates.email || "",
        p_password: updates.password,
        p_username: updates.username,
        p_name: updates.name || "",
        p_phone: updates.phone
      });

      if (accountError) {
        console.error("coachMutations.updateCoach: Account creation error:", accountError);
        throw new Error(`Failed to create coach account: ${accountError.message}`);
      }

      console.log("coachMutations.updateCoach: Coach account created successfully during update:", accountData);
      toast.success("Coach account created successfully");
    }
    
    // Try to update in coaches table first, then fallback to students table
    console.log("coachMutations.updateCoach: Attempting to update in coaches table first...");
    const { data: coachData, error: coachError } = await supabase
      .from("coaches")
      .update(cleanUpdates)
      .eq("id", id)
      .select()
      .single();

    if (coachError) {
      console.log("coachMutations.updateCoach: Coach not found in coaches table, trying students table...");
      
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
      
      console.log("coachMutations.updateCoach: Updating student record with:", studentUpdates);
      
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .update(studentUpdates)
        .eq("id", id)
        .select()
        .single();

      if (studentError) {
        console.error("coachMutations.updateCoach: Failed to update in both coaches and students tables:", studentError);
        throw new Error(`Failed to update coach: ${studentError.message}`);
      }

      console.log("coachMutations.updateCoach: Successfully updated student-coach:", studentData);

      // Handle coach-specific data in coach_profiles table with proper error handling
      if (studentData.auth_user_id && (cleanUpdates.specialties !== undefined || cleanUpdates.assigned_classes !== undefined)) {
        console.log("coachMutations.updateCoach: Updating coach profile data for upgraded student...");
        
        const coachProfileUpdates: any = {};
        
        // Include both specialties and assigned_classes in the profile update
        if (cleanUpdates.specialties !== undefined) {
          coachProfileUpdates.specialties = Array.isArray(cleanUpdates.specialties) ? cleanUpdates.specialties : [];
        }
        if (cleanUpdates.assigned_classes !== undefined) {
          coachProfileUpdates.assigned_classes = Array.isArray(cleanUpdates.assigned_classes) ? cleanUpdates.assigned_classes : [];
        }
        
        console.log("coachMutations.updateCoach: Coach profile updates:", coachProfileUpdates);
        
        const { data: profileData, error: profileError } = await supabase
          .from("coach_profiles")
          .upsert({
            user_id: studentData.auth_user_id,
            ...coachProfileUpdates,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (profileError) {
          console.error("coachMutations.updateCoach: Error updating coach profile:", profileError);
          // Don't throw here - log the error but continue since main update succeeded
          console.warn(`Coach profile update failed but main record updated successfully: ${profileError.message}`);
        } else {
          console.log("coachMutations.updateCoach: Successfully updated coach profile for upgraded student:", profileData);
        }

        // Verify the coach profile update
        const { data: verificationData, error: verificationError } = await supabase
          .from("coach_profiles")
          .select("*")
          .eq("user_id", studentData.auth_user_id)
          .single();

        if (verificationError) {
          console.warn("coachMutations.updateCoach: Could not verify coach profile update:", verificationError);
        } else {
          console.log("coachMutations.updateCoach: Coach profile verification successful:", verificationData);
        }
      }

      // Convert student data back to coach format with the updated profile data
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
        is_upgraded_student: true,
        auth_user_id: studentData.auth_user_id
      };

      toast.success("Coach updated successfully");
      return typedCoach;
    }

    console.log("coachMutations.updateCoach: Successfully updated traditional coach:", coachData);

    // Verify the traditional coach update
    const { data: verificationData, error: verificationError } = await supabase
      .from("coaches")
      .select("*")
      .eq("id", id)
      .single();

    if (verificationError) {
      console.warn("coachMutations.updateCoach: Could not verify traditional coach update:", verificationError);
    } else {
      console.log("coachMutations.updateCoach: Traditional coach verification successful:", verificationData);
    }

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
    console.log("coachMutations.deleteCoach: Attempting to delete coach with id:", id);
    
    // Try deleting from coaches table first, then students table
    console.log("coachMutations.deleteCoach: Attempting to delete from coaches table first...");
    const { error: coachError } = await supabase
      .from("coaches")
      .delete()
      .eq("id", id);

    if (coachError) {
      console.log("coachMutations.deleteCoach: Coach not found in coaches table, trying students table...");
      
      // If not found in coaches table, try students table
      const { error: studentError } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (studentError) {
        console.error("coachMutations.deleteCoach: Failed to delete from both tables:", studentError);
        throw new Error(`Failed to delete coach: ${studentError.message}`);
      }
      
      console.log("coachMutations.deleteCoach: Successfully deleted student-coach");
    } else {
      console.log("coachMutations.deleteCoach: Successfully deleted traditional coach");
    }

    toast.success("Coach deleted successfully");
  }
};
