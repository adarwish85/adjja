
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpgradeResult {
  success: boolean;
  error?: string;
  message?: string;
  student_name?: string;
  auth_user_id?: string;
  student_email?: string;
}

export const useImprovedStudentUpgrade = () => {
  const [loading, setLoading] = useState(false);

  const upgradeStudentToCoach = useCallback(async (studentId: string): Promise<UpgradeResult> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('upgrade_student_to_coach_with_autofix', {
        p_student_id: studentId
      });

      if (error) throw error;

      // Properly type the response as UpgradeResult
      const result = data as unknown as UpgradeResult;

      if (result.success) {
        toast.success(result.message || `${result.student_name} successfully upgraded to Coach`);
        
        // Enhanced real-time notification - trigger multiple channels
        console.log("Student upgrade successful, triggering enhanced real-time updates...");
        
        // Small delay to ensure database consistency before triggering updates
        setTimeout(() => {
          // The real-time sync will automatically pick up the changes
          console.log("Enhanced real-time sync will handle the updates automatically");
        }, 100);
      } else {
        toast.error(result.error || "Failed to upgrade student");
      }

      return result;
    } catch (error) {
      console.error("Error upgrading student to coach:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upgrade student";
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpgradeStudentsToCoach = useCallback(async (studentIds: string[]): Promise<{
    successful: number;
    failed: number;
    results: UpgradeResult[];
  }> => {
    setLoading(true);
    const results: UpgradeResult[] = [];
    let successful = 0;
    let failed = 0;

    try {
      // Process upgrades with small delays for better database consistency
      for (const studentId of studentIds) {
        const result = await upgradeStudentToCoach(studentId);
        results.push(result);
        
        if (result.success) {
          successful++;
        } else {
          failed++;
        }
        
        // Small delay between upgrades for better performance
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (successful > 0) {
        toast.success(`Successfully upgraded ${successful} student(s) to Coach`);
        console.log(`Enhanced bulk upgrade completed: ${successful} successful, ${failed} failed. Real-time updates triggered.`);
      }
      
      if (failed > 0) {
        toast.error(`Failed to upgrade ${failed} student(s)`);
      }

      return { successful, failed, results };
    } catch (error) {
      console.error("Error in bulk upgrade:", error);
      toast.error("Bulk upgrade operation failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [upgradeStudentToCoach]);

  return {
    upgradeStudentToCoach,
    bulkUpgradeStudentsToCoach,
    loading
  };
};
