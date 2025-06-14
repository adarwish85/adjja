
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AvailableClass {
  class_id: string;
  class_name: string;
  instructor: string;
  schedule: string;
  already_checked_in: boolean;
  is_enrolled: boolean;
}

interface CheckInResult {
  success: boolean;
  checkin_id?: string;
  remaining_classes?: number;
  message?: string;
  error?: string;
}

export const useSmartAttendance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Get available classes for student check-in
  const { data: availableClasses, isLoading: classesLoading } = useQuery({
    queryKey: ['available-classes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get the student ID from the user
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) return [];

      // Get student record
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!student) return [];

      const { data, error } = await supabase.rpc('get_available_classes_for_student', {
        p_student_id: student.id
      });

      if (error) {
        console.error('Error fetching available classes:', error);
        return [];
      }

      return data as AvailableClass[];
    },
    enabled: !!user
  });

  // Get student's remaining class quota
  const { data: studentQuota } = useQuery({
    queryKey: ['student-quota', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: student } = await supabase
        .from('students')
        .select(`
          id,
          subscription_plan_id,
          subscription_plans (
            number_of_classes,
            subscription_period
          )
        `)
        .eq('email', user.email)
        .single();

      if (!student || !student.subscription_plan_id) {
        return { remaining_classes: 999, is_unlimited: true };
      }

      // Calculate used classes based on plan period
      const plan = student.subscription_plans as any;
      const periodStart = new Date();
      
      switch (plan.subscription_period) {
        case 'weekly':
          periodStart.setDate(periodStart.getDate() - 7);
          break;
        case 'monthly':
          periodStart.setMonth(periodStart.getMonth() - 1);
          break;
        case 'quarterly':
          periodStart.setMonth(periodStart.getMonth() - 3);
          break;
        case 'yearly':
          periodStart.setFullYear(periodStart.getFullYear() - 1);
          break;
        default:
          periodStart.setMonth(periodStart.getMonth() - 1);
      }

      const { count: usedClasses } = await supabase
        .from('attendance_records')
        .select('*', { count: 'exact' })
        .eq('student_id', student.id)
        .eq('counted_against_quota', true)
        .gte('attendance_date', periodStart.toISOString().split('T')[0]);

      const remaining = Math.max(0, plan.number_of_classes - (usedClasses || 0));

      return {
        remaining_classes: remaining,
        total_classes: plan.number_of_classes,
        used_classes: usedClasses || 0,
        is_unlimited: false
      };
    },
    enabled: !!user
  });

  // Student self check-in mutation
  const checkInMutation = useMutation({
    mutationFn: async ({ classId }: { classId: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!student) throw new Error('Student record not found');

      const { data, error } = await supabase.rpc('process_attendance_checkin', {
        p_student_id: student.id,
        p_class_id: classId,
        p_checked_in_by: user.id,
        p_source: 'self'
      });

      if (error) throw error;

      return data as CheckInResult;
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`✅ ${result.message}! ${result.remaining_classes} classes remaining.`);
        queryClient.invalidateQueries({ queryKey: ['available-classes'] });
        queryClient.invalidateQueries({ queryKey: ['student-quota'] });
        queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      } else {
        toast.error(result.error || 'Check-in failed');
      }
    },
    onError: (error) => {
      console.error('Check-in error:', error);
      toast.error('Failed to check in. Please try again.');
    }
  });

  // Manual check-in for coaches/admins
  const manualCheckInMutation = useMutation({
    mutationFn: async ({ studentIds, classId }: { studentIds: string[], classId: string }) => {
      if (!user) throw new Error('User not authenticated');

      const results = [];
      
      for (const studentId of studentIds) {
        try {
          const { data, error } = await supabase.rpc('process_attendance_checkin', {
            p_student_id: studentId,
            p_class_id: classId,
            p_checked_in_by: user.id,
            p_source: 'manual'
          });

          if (error) throw error;
          results.push({ studentId, result: data as CheckInResult });
        } catch (error) {
          results.push({ 
            studentId, 
            result: { 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            } 
          });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      const successful = results.filter(r => r.result.success).length;
      const failed = results.length - successful;
      
      if (successful > 0) {
        toast.success(`✅ Successfully checked in ${successful} student(s)`);
      }
      if (failed > 0) {
        toast.error(`❌ Failed to check in ${failed} student(s)`);
      }

      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      queryClient.invalidateQueries({ queryKey: ['available-classes'] });
    },
    onError: (error) => {
      console.error('Manual check-in error:', error);
      toast.error('Failed to process check-ins. Please try again.');
    }
  });

  return {
    availableClasses: availableClasses || [],
    studentQuota,
    loading: loading || classesLoading,
    checkIn: checkInMutation.mutate,
    manualCheckIn: manualCheckInMutation.mutate,
    isCheckingIn: checkInMutation.isPending || manualCheckInMutation.isPending
  };
};
