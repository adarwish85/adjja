import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  branch: string;
  belt: string;
  specialties: string[];
  status: "active" | "inactive";
  students_count: number;
  joined_date: string;
  created_at: string;
  updated_at: string;
  // Optional fields for account creation
  username?: string;
  password?: string;
  createAccount?: boolean;
}

export const useCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("coaches")
        .select("*")
        .order("name");

      if (error) throw error;

      // Type the data properly by ensuring status is correctly typed
      const typedCoaches: Coach[] = (data || []).map(coach => ({
        ...coach,
        status: coach.status as "active" | "inactive",
        specialties: coach.specialties || [],
        phone: coach.phone || null,
        students_count: coach.students_count || 0,
        joined_date: coach.joined_date || new Date().toISOString().split('T')[0]
      }));

      setCoaches(typedCoaches);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast.error("Failed to fetch coaches");
    } finally {
      setLoading(false);
    }
  };

  const addCoach = async (coachData: Omit<Coach, "id" | "created_at" | "updated_at">) => {
    try {
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
        joined_date: data.joined_date || new Date().toISOString().split('T')[0]
      };

      setCoaches(prev => [...prev, typedCoach]);
      toast.success("Coach added successfully");
      return typedCoach;
    } catch (error) {
      console.error("Error adding coach:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add coach");
      throw error;
    }
  };

  const updateCoach = async (id: string, updates: Partial<Omit<Coach, "id" | "created_at" | "updated_at">>) => {
    try {
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

      // Remove account-specific fields before updating the coach record
      const { username, password, createAccount, ...coachUpdates } = updates;
      
      const { data, error } = await supabase
        .from("coaches")
        .update(coachUpdates)
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
        joined_date: data.joined_date || new Date().toISOString().split('T')[0]
      };

      setCoaches(prev => prev.map(coach => coach.id === id ? typedCoach : coach));
      toast.success("Coach updated successfully");
      return typedCoach;
    } catch (error) {
      console.error("Error updating coach:", error);
      toast.error("Failed to update coach");
      throw error;
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      const { error } = await supabase
        .from("coaches")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCoaches(prev => prev.filter(coach => coach.id !== id));
      toast.success("Coach deleted successfully");
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast.error("Failed to delete coach");
      throw error;
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return {
    coaches,
    loading,
    addCoach,
    updateCoach,
    deleteCoach,
    refetch: fetchCoaches,
  };
};
