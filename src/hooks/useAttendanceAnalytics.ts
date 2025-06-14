
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceHeatmapData {
  day_of_week: number;
  hour_of_day: number;
  attendance_count: number;
}

interface AttendanceTrendData {
  date: string;
  total: number;
  present: number;
  absent: number;
  late: number;
}

export const useAttendanceAnalytics = (
  dateRange?: { start?: Date; end?: Date },
  classId?: string,
  branchId?: string
) => {
  const startDate = dateRange?.start 
    ? new Date(dateRange.start).toISOString().split('T')[0]
    : new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  
  const endDate = dateRange?.end
    ? new Date(dateRange.end).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  // Fetch attendance heatmap data
  const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
    queryKey: ['attendance-heatmap', startDate, endDate, classId, branchId],
    queryFn: async () => {
      // Use the database function we created
      const { data, error } = await supabase.rpc(
        'get_attendance_heatmap', 
        { start_date: startDate, end_date: endDate }
      );

      if (error) throw error;

      // Transform data for heatmap visualization
      const transformedData: AttendanceHeatmapData[] = data || [];
      return transformedData;
    }
  });

  // Fetch attendance trends
  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ['attendance-trends', startDate, endDate, classId, branchId],
    queryFn: async () => {
      let query = supabase
        .from('attendance_records')
        .select('attendance_date, status')
        .gte('attendance_date', startDate)
        .lte('attendance_date', endDate);

      if (classId) {
        query = query.eq('class_id', classId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by date and count statuses
      const trendsByDate: Record<string, { total: number; present: number; absent: number; late: number }> = {};
      
      // Initialize dates in range
      const start = new Date(startDate);
      const end = new Date(endDate);
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        trendsByDate[dateStr] = { total: 0, present: 0, absent: 0, late: 0 };
      }

      // Fill with actual data
      data?.forEach(record => {
        const date = record.attendance_date;
        if (!trendsByDate[date]) {
          trendsByDate[date] = { total: 0, present: 0, absent: 0, late: 0 };
        }
        trendsByDate[date].total++;
        trendsByDate[date][record.status as 'present' | 'absent' | 'late']++;
      });

      // Convert to array for charts
      return Object.entries(trendsByDate).map(([date, counts]) => ({
        date,
        ...counts
      })).sort((a, b) => a.date.localeCompare(b.date));
    }
  });

  // Fetch attendance metrics
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['attendance-metrics', startDate, endDate, classId, branchId],
    queryFn: async () => {
      const { data: records, error } = await supabase
        .from('attendance_records')
        .select('status, classes(name, capacity), student_id')
        .gte('attendance_date', startDate)
        .lte('attendance_date', endDate);

      if (error) throw error;

      // Calculate attendance metrics
      const totalRecords = records?.length || 0;
      const presentCount = records?.filter(r => r.status === 'present')?.length || 0;
      const absentCount = records?.filter(r => r.status === 'absent')?.length || 0;
      const lateCount = records?.filter(r => r.status === 'late')?.length || 0;
      
      // Calculate student consistency
      const studentAttendance: Record<string, number> = {};
      records?.forEach(record => {
        if (!studentAttendance[record.student_id]) {
          studentAttendance[record.student_id] = 0;
        }
        if (record.status === 'present' || record.status === 'late') {
          studentAttendance[record.student_id]++;
        }
      });

      // Get top 5 consistent students
      const topStudentIds = Object.entries(studentAttendance)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);

      // Get student details
      const { data: studentDetails } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', topStudentIds);

      const topStudents = topStudentIds.map(id => {
        const student = studentDetails?.find(s => s.id === id);
        return {
          id,
          name: student?.name || 'Unknown',
          attendances: studentAttendance[id]
        };
      }).sort((a, b) => b.attendances - a.attendances);

      return {
        totalAttendances: totalRecords,
        presentPercentage: totalRecords ? (presentCount / totalRecords) * 100 : 0,
        absentPercentage: totalRecords ? (absentCount / totalRecords) * 100 : 0,
        latePercentage: totalRecords ? (lateCount / totalRecords) * 100 : 0,
        consistentStudents: topStudents,
        noShowRate: totalRecords ? (absentCount / totalRecords) * 100 : 0
      };
    }
  });

  return {
    heatmapData,
    trendsData,
    metrics: metricsData,
    isLoading: heatmapLoading || trendsLoading || metricsLoading
  };
};
