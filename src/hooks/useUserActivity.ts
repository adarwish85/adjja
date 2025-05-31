
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  category: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  status: "success" | "failed" | "warning";
  created_at: string;
}

export const useUserActivity = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivityLogs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logActivity = async (activityData: {
    user_id: string;
    user_name: string;
    action: string;
    category: string;
    details?: string;
    status?: "success" | "failed" | "warning";
  }) => {
    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          ...activityData,
          status: activityData.status || 'success'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  return {
    activityLogs,
    isLoading,
    logActivity,
    refetch: fetchActivityLogs
  };
};
