
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Coach, CoachInput, CoachUpdate } from "@/types/coach";

export const coachService = {
  async fetchCoaches(): Promise<Coach[]> {
    const { data, error } = await supabase
      .from("coaches")
      .select("*")
      .order("name");

    if (error) throw error;

    // Type the data properly by ensuring status is correctly typed and adding assigned_classes
    const typedCoaches: Coach[] = (data || []).map(coach => ({
      ...coach,
      status: coach.status as "active" | "inactive",
      specialties: coach.specialties || [],
      phone: coach.phone || null,
      students_count: coach.students_count || 0,
      joined_date: coach.joined_date || new Date().toISOString().split('T')[0],
      assigned_classes: coach.assigned_classes || []
    }));

    return typedCoaches;
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

    // Create the coach record (remove account-specific fields)
    const { username, password, createAccount, ...coachRecord } = coachData;
    
    const { data, error } = await supabase
      .from("coaches")
      .insert([coachRecord])
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
    
    // Clean the update data - remove read-only and problematic fields
    const cleanUpdates = { ...updates };
    
    // Remove read-only fields
    delete cleanUpdates.id;
    delete cleanUpdates.created_at;
    delete cleanUpdates.updated_at;
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
  }
};
