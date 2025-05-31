
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Coach, CoachInput, CoachUpdate } from "@/types/coach";
import { coachService } from "@/services/coachService";

export const useCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const data = await coachService.fetchCoaches();
      setCoaches(data);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast.error("Failed to fetch coaches");
    } finally {
      setLoading(false);
    }
  };

  const addCoach = async (coachData: CoachInput) => {
    try {
      const newCoach = await coachService.createCoach(coachData);
      setCoaches(prev => [...prev, newCoach]);
      return newCoach;
    } catch (error) {
      console.error("Error adding coach:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add coach");
      throw error;
    }
  };

  const updateCoach = async (id: string, updates: CoachUpdate) => {
    try {
      const updatedCoach = await coachService.updateCoach(id, updates);
      setCoaches(prev => prev.map(coach => coach.id === id ? updatedCoach : coach));
      return updatedCoach;
    } catch (error) {
      console.error("Error updating coach:", error);
      toast.error("Failed to update coach");
      throw error;
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      await coachService.deleteCoach(id);
      setCoaches(prev => prev.filter(coach => coach.id !== id));
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

// Re-export the Coach type for backward compatibility
export type { Coach } from "@/types/coach";
