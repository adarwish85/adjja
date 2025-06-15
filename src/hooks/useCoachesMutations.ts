
import { toast } from "sonner";
import { CoachInput, CoachUpdate } from "@/types/coach";
import { coachService } from "@/services/coachService";

interface UseCoachesMutationsProps {
  coaches: any[];
  fetchCoaches: () => Promise<void>;
}

export const useCoachesMutations = ({ coaches, fetchCoaches }: UseCoachesMutationsProps) => {
  const addCoach = async (coachData: CoachInput) => {
    try {
      console.log("useCoachesMutations: Adding coach...", coachData);
      const newCoach = await coachService.createCoach(coachData);
      console.log("useCoachesMutations: Coach added successfully:", newCoach);
      
      // Refresh the coaches list after successful creation
      await fetchCoaches();
      await coachService.updateCoachStudentCount(newCoach.name);
      return newCoach;
    } catch (error) {
      console.error("useCoachesMutations: Error adding coach:", error);
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

      console.log("useCoachesMutations: Updating coach with id:", id, "updates:", updates);
      
      // Perform the update with enhanced error handling
      const updatedCoach = await coachService.updateCoach(id, updates);
      
      if (!updatedCoach) {
        throw new Error("Update operation did not return updated coach data");
      }
      
      console.log("useCoachesMutations: Coach updated successfully:", updatedCoach);
      
      // Critical: Force immediate refresh to ensure UI reflects changes
      console.log("useCoachesMutations: Force refreshing coaches list after update...");
      await fetchCoaches();
      
      // If the coach name changed, we need to update student assignments
      if (updates.name) {
        await coachService.updateCoachStudentCount(updates.name);
      }
      
      // Verify the coach data was actually updated by checking the refreshed list
      const refreshedCoaches = coaches.find(c => c.id === id);
      if (refreshedCoaches) {
        console.log("useCoachesMutations: Verified coach update in refreshed data:", refreshedCoaches);
      }
      
      console.log("useCoachesMutations: Update process completed successfully");
      return updatedCoach;
    } catch (error) {
      console.error("useCoachesMutations: Error updating coach:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update coach";
      toast.error(errorMessage);
      
      // Force refresh even on error to ensure UI is in sync
      console.log("useCoachesMutations: Refreshing coaches list after error to ensure consistency...");
      await fetchCoaches();
      
      throw error;
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      if (!id) {
        throw new Error("Coach ID is required for deletion");
      }

      console.log("useCoachesMutations: Deleting coach with id:", id);
      await coachService.deleteCoach(id);
      console.log("useCoachesMutations: Coach deleted successfully");
      
      // Refresh the coaches list after successful deletion
      await fetchCoaches();
    } catch (error) {
      console.error("useCoachesMutations: Error deleting coach:", error);
      toast.error("Failed to delete coach");
      throw error;
    }
  };

  return {
    addCoach,
    updateCoach,
    deleteCoach,
  };
};
