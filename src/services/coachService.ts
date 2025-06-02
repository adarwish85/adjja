
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

    // Create the coach record (remove account-specific fields and add branch as empty for database compatibility)
    const { username, password, createAccount, ...coachRecord } = coachData;
    const coachWithBranch = {
      ...coachRecord,
      branch: "", // Add empty branch for database compatibility
    };
    
    const { data, error } = await supabase
      .from("coaches")
      .insert([coachWithBranch])
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
    console.log("Updating coach with id:", id, "data:", updates);
    
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

    // Remove account-specific fields before updating the coach record and add branch as empty for database compatibility
    const { username, password, createAccount, ...coachUpdates } = updates;
    const updatesWithBranch = {
      ...coachUpdates,
      branch: "", // Add empty branch for database compatibility if not present
    };
    
    const { data, error } = await supabase
      .from("coaches")
      .update(updatesWithBranch)
      .eq("id", id)
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
  }
};
