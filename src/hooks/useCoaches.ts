
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

      setCoaches(data || []);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast.error("Failed to fetch coaches");
    } finally {
      setLoading(false);
    }
  };

  const addCoach = async (coachData: Omit<Coach, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("coaches")
        .insert([coachData])
        .select()
        .single();

      if (error) throw error;

      setCoaches(prev => [...prev, data]);
      toast.success("Coach added successfully");
      return data;
    } catch (error) {
      console.error("Error adding coach:", error);
      toast.error("Failed to add coach");
      throw error;
    }
  };

  const updateCoach = async (id: string, updates: Partial<Omit<Coach, "id" | "created_at" | "updated_at">>) => {
    try {
      const { data, error } = await supabase
        .from("coaches")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setCoaches(prev => prev.map(coach => coach.id === id ? data : coach));
      toast.success("Coach updated successfully");
      return data;
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
