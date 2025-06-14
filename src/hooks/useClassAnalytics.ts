
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useClassAnalytics = (dateRange?: { start?: Date; end?: Date }) => {
  const startDate = dateRange?.start 
    ? new Date(dateRange.start).toISOString()
    : new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString();
  
  const endDate = dateRange?.end
    ? new Date(dateRange.end).toISOString()
    : new Date().toISOString();

  // Fetch class performance from materialized view
  const { data: classPerformanceData, isLoading: classPerformanceLoading } = useQuery({
    queryKey: ['class-performance-analytics', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_class_performance')
        .select('*');

      if (error) throw error;

      return data.map(item => ({
        ...item,
        attendanceRate: item.total_attendances > 0 
          ? (item.present_count / item.total_attendances) * 100 
          : 0
      })).sort((a, b) => b.utilization_percentage - a.utilization_percentage);
    }
  });

  // Fetch instructor performance
  const { data: instructorData, isLoading: instructorLoading } = useQuery({
    queryKey: ['instructor-analytics', startDate, endDate],
    queryFn: async () => {
      // First get all instructors (from classes table)
      const { data: instructors, error: instructorError } = await supabase
        .from('classes')
        .select('instructor')
        .order('instructor');

      if (instructorError) throw instructorError;

      // Get unique instructor names
      const uniqueInstructors = Array.from(
        new Set(instructors.map(c => c.instructor))
      ).filter(Boolean);

      // Get data for each instructor
      const instructorPerformance = await Promise.all(
        uniqueInstructors.map(async (instructor) => {
          // Get classes taught by this instructor
          const { data: classes } = await supabase
            .from('classes')
            .select('id, name, capacity, enrolled')
            .eq('instructor', instructor);

          const classIds = classes?.map(c => c.id) || [];
          
          // Get attendance data for these classes
          const { data: attendance } = await supabase
            .from('attendance_records')
            .select('class_id, status')
            .in('class_id', classIds)
            .gte('attendance_date', startDate)
            .lte('attendance_date', endDate);

          // Calculate metrics
          const totalClasses = classes?.length || 0;
          const totalCapacity = classes?.reduce((sum, c) => sum + (c.capacity || 0), 0) || 0;
          const totalEnrolled = classes?.reduce((sum, c) => sum + (c.enrolled || 0), 0) || 0;
          const utilizationRate = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0;

          const totalAttendances = attendance?.length || 0;
          const presentCount = attendance?.filter(a => a.status === 'present')?.length || 0;
          const attendanceRate = totalAttendances > 0 ? (presentCount / totalAttendances) * 100 : 0;

          return {
            instructor,
            totalClasses,
            totalCapacity,
            totalEnrolled,
            utilizationRate,
            totalAttendances,
            presentCount,
            attendanceRate
          };
        })
      );

      return instructorPerformance.sort((a, b) => b.attendanceRate - a.attendanceRate);
    }
  });

  // Fetch class utilization over time
  const { data: utilizationTrends, isLoading: utilizationLoading } = useQuery({
    queryKey: ['class-utilization-trends', startDate, endDate],
    queryFn: async () => {
      const { data: enrollments, error } = await supabase
        .from('class_enrollments')
        .select('class_id, enrollment_date, classes!inner(name, capacity)')
        .gte('enrollment_date', startDate)
        .lte('enrollment_date', endDate)
        .order('enrollment_date');

      if (error) throw error;

      // Group by month and class
      const monthlyUtilization: Record<string, Record<string, { enrolled: number, capacity: number }>> = {};
      
      enrollments.forEach(enrollment => {
        const month = new Date(enrollment.enrollment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const className = enrollment.classes.name;
        
        if (!monthlyUtilization[month]) {
          monthlyUtilization[month] = {};
        }
        
        if (!monthlyUtilization[month][className]) {
          monthlyUtilization[month][className] = { enrolled: 0, capacity: enrollment.classes.capacity };
        }
        
        monthlyUtilization[month][className].enrolled++;
      });

      // Transform for visualization
      const trends = Object.entries(monthlyUtilization).map(([month, classes]) => {
        const result: any = { month };
        
        Object.entries(classes).forEach(([className, data]) => {
          result[className] = (data.enrolled / data.capacity) * 100;
        });
        
        return result;
      }).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      return trends;
    }
  });

  return {
    classPerformanceData,
    instructorData,
    utilizationTrends,
    isLoading: classPerformanceLoading || instructorLoading || utilizationLoading
  };
};
