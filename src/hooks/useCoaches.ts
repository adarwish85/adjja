
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Coach, CoachInput, CoachUpdate } from "@/types/coach";
import { coachService } from "@/services/coachService";
import { useCoachesRealTimeSync } from "./useCoachesRealTimeSync";

export const useCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("useCoaches: Starting fetchCoaches...");
      
      const data = await coachService.fetchCoaches();
      console.log("useCoaches: Fetched coaches successfully:", data.length);
      
      setCoaches(data);
      
      // Only show success message if we actually have coaches
      if (data.length === 0) {
        console.log("useCoaches: No coaches found - this is normal if none have been added yet");
      }
    } catch (error) {
      console.error("useCoaches: Error fetching coaches:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch coaches";
      setError(errorMessage);
      
      // Show specific error messages based on the error
      if (errorMessage.includes("Coach role does not exist")) {
        toast.error("Coach role not found in database. Please contact administrator.");
      } else if (errorMessage.includes("auth")) {
        toast.error("Authentication error while fetching coaches. Please try refreshing the page.");
      } else {
        toast.error("Unable to load coaches. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Enhanced real-time sync with better callbacks
  useCoachesRealTimeSync({
    onCoachAdded: () => {
      console.log("Real-time: Traditional coach added, refreshing...");
      fetchCoaches();
    },
    onCoachUpdated: () => {
      console.log("Real-time: Traditional coach updated, refreshing...");
      fetchCoaches();
    },
    onCoachRemoved: () => {
      console.log("Real-time: Traditional coach removed, refreshing...");
      fetchCoaches();
    },
    onStudentUpgraded: () => {
      console.log("Real-time: Student upgraded to coach or role changed, refreshing...");
      // Add a small delay to ensure database consistency
      setTimeout(() => {
        fetchCoaches();
      }, 500);
    },
  });

  const addCoach = async (coachData: CoachInput) => {
    try {
      const newCoach = await coachService.createCoach(coachData);
      // Don't manually update state - let real-time sync handle it
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
      
      // Don't manually update state - let real-time sync handle it
      
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
      // Don't manually update state - let real-time sync handle it
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

  // Manual refresh function for error recovery
  const forceRefresh = async () => {
    console.log("useCoaches: Manual refresh triggered");
    await fetchCoaches();
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return {
    coaches,
    loading,
    error,
    addCoach,
    updateCoach,
    deleteCoach,
    refetch: fetchCoaches,
    forceRefresh,
    recalculateAllCoachStudentCounts,
    syncAllCoachClassAssignments,
  };
};

// Re-export the Coach type for backward compatibility
export type { Coach } from "@/types/coach";
