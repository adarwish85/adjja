
import { useCoachesData } from "./useCoachesData";
import { useCoachesMutations } from "./useCoachesMutations";
import { useCoachesUtilities } from "./useCoachesUtilities";

export const useCoaches = () => {
  const { coaches, loading, error, fetchCoaches } = useCoachesData();
  
  const { addCoach, updateCoach, deleteCoach } = useCoachesMutations({
    coaches,
    fetchCoaches,
  });
  
  const { recalculateAllCoachStudentCounts, syncAllCoachClassAssignments, forceRefresh } = useCoachesUtilities({
    coaches,
    fetchCoaches,
  });

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
