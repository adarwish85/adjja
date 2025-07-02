
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Coach } from "@/types/coach";

interface UseCoachesUtilitiesProps {
  coaches: Coach[];
  fetchCoaches: () => Promise<void>;
}

export const useCoachesUtilities = ({ coaches, fetchCoaches }: UseCoachesUtilitiesProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const recalculateAllCoachStudentCounts = async () => {
    try {
      setIsRefreshing(true);
      console.log("useCoachesUtilities: Recalculating all coach student counts...");
      
      // Call the database function to update all coach counts
      const { error } = await supabase.rpc('update_coach_student_counts');
      
      if (error) {
        console.error("useCoachesUtilities: Error calling update_coach_student_counts:", error);
        throw error;
      }
      
      // Refresh the coaches data
      await fetchCoaches();
      
      toast.success("All coach student counts have been recalculated");
    } catch (error) {
      console.error("useCoachesUtilities: Error recalculating coach student counts:", error);
      toast.error("Failed to recalculate coach student counts");
    } finally {
      setIsRefreshing(false);
    }
  };

  const syncAllCoachClassAssignments = async () => {
    try {
      setIsRefreshing(true);
      console.log("useCoachesUtilities: Syncing all coach class assignments...");
      
      // Update class assignments for all coaches
      for (const coach of coaches) {
        try {
          // Get classes where this coach is the instructor
          const { data: coachClasses, error: classesError } = await supabase
            .from("classes")
            .select("name")
            .eq("instructor", coach.name)
            .eq("status", "Active");

          if (!classesError && coachClasses) {
            const classNames = coachClasses.map(c => c.name);
            
            // Update traditional coaches
            if (!coach.is_upgraded_student) {
              await supabase
                .from("coaches")
                .update({ assigned_classes: classNames })
                .eq("id", coach.id);
            } else {
              // Update coach profiles for upgraded students
              if (coach.auth_user_id) {
                await supabase
                  .from("coach_profiles")
                  .upsert({ 
                    user_id: coach.auth_user_id, 
                    assigned_classes: classNames 
                  }, { 
                    onConflict: 'user_id' 
                  });
              }
            }
          }
        } catch (error) {
          console.error(`useCoachesUtilities: Error syncing assignments for ${coach.name}:`, error);
        }
      }
      
      // Refresh the coaches data
      await fetchCoaches();
      
      toast.success("All coach class assignments have been synchronized");
    } catch (error) {
      console.error("useCoachesUtilities: Error syncing coach class assignments:", error);
      toast.error("Failed to sync coach class assignments");
    } finally {
      setIsRefreshing(false);
    }
  };

  const forceRefresh = async () => {
    try {
      setIsRefreshing(true);
      console.log("useCoachesUtilities: Force refreshing coaches data...");
      
      // First recalculate counts
      await recalculateAllCoachStudentCounts();
      
      // Then sync class assignments
      await syncAllCoachClassAssignments();
      
      toast.success("Coach data has been force refreshed");
    } catch (error) {
      console.error("useCoachesUtilities: Error force refreshing:", error);
      toast.error("Failed to force refresh coach data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    recalculateAllCoachStudentCounts,
    syncAllCoachClassAssignments,
    forceRefresh,
    isRefreshing,
  };
};
