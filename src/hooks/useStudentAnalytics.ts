
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStudentAnalytics = (dateRange?: { start?: Date; end?: Date }, branchId?: string) => {
  const startDate = dateRange?.start 
    ? new Date(dateRange.start).toISOString()
    : new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
  
  const endDate = dateRange?.end
    ? new Date(dateRange.end).toISOString()
    : new Date().toISOString();

  // Fetch student growth data from materialized view
  const { data: growthData, isLoading: growthLoading } = useQuery({
    queryKey: ['student-growth', startDate, endDate, branchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_student_metrics')
        .select('*')
        .order('month');

      if (error) throw error;

      // Calculate growth rate for each month
      return data.map((item, index) => ({
        ...item,
        month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        growthRate: index > 0 && data[index - 1] ? 
          ((item.new_students - data[index - 1].new_students) / data[index - 1].new_students) * 100 : 0
      }));
    }
  });

  // Fetch retention data
  const { data: retentionData, isLoading: retentionLoading } = useQuery({
    queryKey: ['student-retention', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('created_at, status')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      // Group by month and calculate retention
      const monthlyData: Record<string, { total: number; active: number; retention: number }> = {};
      
      data.forEach(student => {
        const month = new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) {
          monthlyData[month] = { total: 0, active: 0, retention: 0 };
        }
        monthlyData[month].total++;
        if (student.status === 'active') {
          monthlyData[month].active++;
        }
      });

      // Calculate retention percentage
      Object.keys(monthlyData).forEach(month => {
        const data = monthlyData[month];
        data.retention = data.total > 0 ? (data.active / data.total) * 100 : 0;
      });

      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data
      })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    }
  });

  // Fetch belt distribution
  const { data: beltDistribution, isLoading: beltLoading } = useQuery({
    queryKey: ['belt-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('belt');

      if (error) throw error;

      // Count students by belt
      const beltCounts: Record<string, number> = {};
      data.forEach(student => {
        beltCounts[student.belt] = (beltCounts[student.belt] || 0) + 1;
      });

      // Define belt colors
      const beltColors: Record<string, string> = {
        'White': '#f8f9fa',
        'Blue': '#007bff',
        'Purple': '#6f42c1',
        'Brown': '#6c4423',
        'Black': '#343a40'
      };

      return Object.entries(beltCounts).map(([belt, count]) => ({
        belt,
        count,
        color: beltColors[belt] || '#6c757d'
      }));
    }
  });

  // Fetch student metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['student-metrics'],
    queryFn: async () => {
      const { data: students, error } = await supabase
        .from('students')
        .select('status, created_at');

      if (error) throw error;

      const totalStudents = students.length;
      const activeStudents = students.filter(s => s.status === 'active').length;
      const inactiveStudents = students.filter(s => s.status === 'inactive').length;
      
      const retentionRate = totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0;
      const churnRate = totalStudents > 0 ? (inactiveStudents / totalStudents) * 100 : 0;

      // Calculate average lifetime
      const now = new Date();
      const lifetimes = students.map(student => {
        const joinDate = new Date(student.created_at);
        const diffTime = Math.abs(now.getTime() - joinDate.getTime());
        return diffTime / (1000 * 60 * 60 * 24); // days
      });

      const averageLifetimeDays = lifetimes.reduce((sum, days) => sum + days, 0) / lifetimes.length;
      const averageLifetimeMonths = averageLifetimeDays / 30;

      return {
        totalStudents,
        activeStudents,
        inactiveStudents,
        retentionRate,
        churnRate,
        averageLifetimeDays,
        averageLifetimeMonths
      };
    }
  });

  return {
    growthData,
    retentionData,
    beltDistribution,
    metrics,
    isLoading: growthLoading || retentionLoading || beltLoading || metricsLoading
  };
};
