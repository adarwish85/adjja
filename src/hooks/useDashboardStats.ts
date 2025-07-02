
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalStudents: number;
  totalCoaches: number;
  totalBranches: number;
  monthlyRevenue: number;
  attendanceToday: number;
  activeClasses: number;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Get total active students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id')
        .eq('status', 'active');

      if (studentsError) throw studentsError;

      // Get total coaches
      const { data: coaches, error: coachesError } = await supabase
        .from('coaches')
        .select('id')
        .eq('status', 'active');

      if (coachesError) throw coachesError;

      // Get total branches
      const { data: branches, error: branchesError } = await supabase
        .from('branches')
        .select('id')
        .eq('status', 'Active');

      if (branchesError) throw branchesError;

      // Get monthly revenue from current month
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: transactions, error: transactionsError } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'completed')
        .gte('transaction_date', startOfMonth.toISOString())
        .lte('transaction_date', endOfMonth.toISOString());

      if (transactionsError) throw transactionsError;

      // Get today's attendance
      const today = new Date().toISOString().split('T')[0];
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('attendance_date', today)
        .eq('status', 'present');

      if (attendanceError) throw attendanceError;

      // Get active classes
      const { data: activeClasses, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('status', 'Active');

      if (classesError) throw classesError;

      const monthlyRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        totalStudents: students?.length || 0,
        totalCoaches: coaches?.length || 0,
        totalBranches: branches?.length || 0,
        monthlyRevenue,
        attendanceToday: attendance?.length || 0,
        activeClasses: activeClasses?.length || 0,
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });
};
