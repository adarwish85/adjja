
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
      // Update student count after adding coach
      await coachService.updateCoachStudentCount(newCoach.name);
      return newCoach;
    } catch (error) {
      console.error("Error adding coach:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add coach");
      throw error;
    }
  };

  const updateCoach = async (id: string, updates: CoachUpdate) => {
    try {
      // Validate that we have an ID
      if (!id) {
        throw new Error("Coach ID is required for update");
      }

      console.log("useCoaches: Updating coach with id:", id, "updates:", updates);
      const updatedCoach = await coachService.updateCoach(id, updates);
      setCoaches(prev => prev.map(coach => coach.id === id ? updatedCoach : coach));
      
      // If the coach name changed, we need to update student assignments
      if (updates.name) {
        await coachService.updateCoachStudentCount(updates.name);
      }
      
      return updatedCoach;
    } catch (error) {
      console.error("useCoaches: Error updating coach:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update coach");
      throw error;
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      if (!id) {
        throw new Error("Coach ID is required for deletion");
      }

      await coachService.deleteCoach(id);
      setCoaches(prev => prev.filter(coach => coach.id !== id));
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast.error("Failed to delete coach");
      throw error;
    }
  };

  const recalculateAllCoachStudentCounts = async () => {
    try {
      console.log("Recalculating student counts for all coaches...");
      for (const coach of coaches) {
        await coachService.updateCoachStudentCount(coach.name);
      }
      // Refresh coaches data to get updated counts
      await fetchCoaches();
      toast.success("Coach student counts updated");
    } catch (error) {
      console.error("Error recalculating coach student counts:", error);
      toast.error("Failed to update coach student counts");
    }
  };

  const syncAllCoachClassAssignments = async () => {
    try {
      await coachService.syncCoachClassAssignments();
      // Refresh coaches data to get updated assignments
      await fetchCoaches();
    } catch (error) {
      console.error("Error syncing coach class assignments:", error);
      toast.error("Failed to sync coach class assignments");
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
    recalculateAllCoachStudentCounts,
    syncAllCoachClassAssignments,
  };
};

// Re-export the Coach type for backward compatibility
export type { Coach } from "@/types/coach";
