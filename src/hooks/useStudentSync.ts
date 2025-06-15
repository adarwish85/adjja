
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SyncResult {
  student_id: string;
  student_email: string;
  auth_user_id: string;
  action: string;
}

interface ValidationResult {
  student_id: string;
  student_name: string;
  student_email: string;
  has_auth_account: boolean;
  auth_user_id: string | null;
  issue_description: string;
}

export const useStudentSync = () => {
  const [loading, setLoading] = useState(false);

  const syncStudentAuthLinks = useCallback(async (): Promise<SyncResult[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('sync_student_auth_links');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast.success(`Successfully linked ${data.length} student(s) to their auth accounts`);
      } else {
        toast.info("All students are already properly linked to auth accounts");
      }
      
      return data || [];
    } catch (error) {
      console.error("Error syncing student auth links:", error);
      toast.error("Failed to sync student auth links");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateStudentAuthLinks = useCallback(async (): Promise<ValidationResult[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('validate_student_auth_links');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error validating student auth links:", error);
      toast.error("Failed to validate student auth links");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    syncStudentAuthLinks,
    validateStudentAuthLinks,
    loading
  };
};
