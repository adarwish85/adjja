
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStudentAnalytics = (dateRange?: { start?: Date; end?: Date }) => {
  const startDate = dateRange?.start 
    ? new Date(dateRange.start).toISOString().split('T')[0]
    : new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
  
  const endDate = dateRange?.end
    ? new Date(dateRange.end).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  // Fetch student growth data from materialized view
  const { data: growthData, isLoading: growthLoading } = useQuery({
    queryKey: ['student-growth-analytics', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_student_metrics')
        .select('*')
        .order('month');

      if (error) throw error;

      // Calculate growth rates and cumulative students
      let cumulativeStudents = 0;
      const enrichedData = data.map((month, index) => {
        const previousMonth = index > 0 ? data[index - 1] : null;
        const growthRate = previousMonth 
          ? ((month.active_students - previousMonth.active_students) / previousMonth.active_students) * 100 
          : 0;
        
        cumulativeStudents += month.new_students;
        
        return {
          ...month,
          growthRate: isFinite(growthRate) ? growthRate : 0,
          cumulativeStudents,
          month: new Date(month.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
      });

      return enrichedData;
    }
  });

  // Fetch student retention data
  const { data: retentionData, isLoading: retentionLoading } = useQuery({
    queryKey: ['student-retention-analytics', startDate, endDate],
    queryFn: async () => {
      // Get all students
      const { data: students, error } = await supabase
        .from('students')
        .select('*');

      if (error) throw error;

      // Calculate retention rates by month cohorts
      const cohorts: Record<string, { month: string; total: number; active: number; retention: number }> = {};
      
      students.forEach(student => {
        const joinMonth = new Date(student.joined_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!cohorts[joinMonth]) {
          cohorts[joinMonth] = { month: joinMonth, total: 0, active: 0, retention: 0 };
        }
        
        cohorts[joinMonth].total++;
        
        if (student.status === 'active') {
          cohorts[joinMonth].active++;
        }
      });

      // Calculate retention rates
      Object.keys(cohorts).forEach(month => {
        const cohort = cohorts[month];
        cohort.retention = cohort.total > 0 ? (cohort.active / cohort.total) * 100 : 0;
      });

      return Object.values(cohorts)
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    }
  });

  // Fetch belt distribution
  const { data: beltData, isLoading: beltLoading } = useQuery({
    queryKey: ['student-belt-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('belt, count')
        .eq('status', 'active')
        .group('belt');

      if (error) throw error;

      // Add colors for visualization
      const beltColors: Record<string, string> = {
        'White': '#FFFFFF',
        'Blue': '#0000FF',
        'Purple': '#800080',
        'Brown': '#A52A2A',
        'Black': '#000000',
      };

      return data.map(item => ({
        belt: item.belt,
        count: item.count,
        color: beltColors[item.belt] || '#CCCCCC'
      }));
    }
  });

  // Fetch overall metrics
  const { data: overallMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['student-overall-metrics'],
    queryFn: async () => {
      const { data: students, error } = await supabase
        .from('students')
        .select('*');

      if (error) throw error;

      const totalStudents = students?.length || 0;
      const activeStudents = students?.filter(s => s.status === 'active').length || 0;
      const inactiveStudents = students?.filter(s => s.status === 'inactive').length || 0;
      
      // Calculate churn rate
      const churnRate = totalStudents > 0 ? (inactiveStudents / totalStudents) * 100 : 0;
      
      // Calculate average student lifetime
      const currentDate = new Date();
      let totalDays = 0;
      
      students.forEach(student => {
        const joinDate = new Date(student.joined_date);
        const endDate = student.status === 'inactive' && student.last_attended 
          ? new Date(student.last_attended) 
          : currentDate;
        
        const daysActive = Math.floor((endDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += daysActive;
      });
      
      const averageLifetimeDays = totalStudents > 0 ? totalDays / totalStudents : 0;

      return {
        totalStudents,
        activeStudents,
        inactiveStudents,
        churnRate,
        retentionRate: 100 - churnRate,
        averageLifetimeDays,
        averageLifetimeMonths: averageLifetimeDays / 30
      };
    }
  });

  return {
    growthData,
    retentionData,
    beltDistribution: beltData,
    metrics: overallMetrics,
    isLoading: growthLoading || retentionLoading || beltLoading || metricsLoading
  };
};
