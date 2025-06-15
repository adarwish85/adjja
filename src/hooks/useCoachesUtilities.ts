
import { toast } from "sonner";
import { coachService } from "@/services/coachService";

interface UseCoachesUtilitiesProps {
  coaches: any[];
  fetchCoaches: () => Promise<void>;
}

export const useCoachesUtilities = ({ coaches, fetchCoaches }: UseCoachesUtilitiesProps) => {
  const recalculateAllCoachStudentCounts = async () => {
    try {
      console.log("useCoachesUtilities: Recalculating student counts for all coaches...");
      for (const coach of coaches) {
        await coachService.updateCoachStudentCount(coach.name);
      }
      // Refresh coaches data to get updated counts
      await fetchCoaches();
      toast.success("Coach student counts updated");
    } catch (error) {
      console.error("useCoachesUtilities: Error recalculating coach student counts:", error);
      toast.error("Failed to update coach student counts");
    }
  };

  const syncAllCoachClassAssignments = async () => {
    try {
      console.log("useCoachesUtilities: Syncing all coach class assignments...");
      await coachService.syncCoachClassAssignments();
      // Refresh coaches data to get updated assignments
      await fetchCoaches();
    } catch (error) {
      console.error("useCoachesUtilities: Error syncing coach class assignments:", error);
      toast.error("Failed to sync coach class assignments");
    }
  };

  // Manual refresh function for error recovery
  const forceRefresh = async () => {
    console.log("useCoachesUtilities: Manual refresh triggered");
    await fetchCoaches();
  };

  return {
    recalculateAllCoachStudentCounts,
    syncAllCoachClassAssignments,
    forceRefresh,
  };
};
