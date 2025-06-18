
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StudentAttendanceStats {
  student_id: string;
  name: string;
  email: string;
  total_sessions: number;
  attended_sessions: number;
  late_sessions: number;
  early_departure_sessions: number;
  attendance_percentage: number;
  last_attended?: string;
  current_streak?: number;
  longest_streak?: number;
}

export const useAttendanceStats = (studentId?: string) => {
  const [stats, setStats] = useState<StudentAttendanceStats[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Refresh materialized view first
      await supabase.rpc('refresh_attendance_stats');

      let query = supabase
        .from('student_attendance_stats')
        .select('*')
        .order('attendance_percentage', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get streak data for each student
      const statsWithStreaks = await Promise.all(
        (data || []).map(async (student) => {
          try {
            const { data: streakData } = await supabase.rpc(
              'calculate_attendance_streak',
              { p_student_id: student.student_id }
            );

            return {
              ...student,
              current_streak: streakData?.[0]?.current_streak || 0,
              longest_streak: streakData?.[0]?.longest_streak || 0
            };
          } catch (error) {
            console.error('Error fetching streak data:', error);
            return {
              ...student,
              current_streak: 0,
              longest_streak: 0
            };
          }
        })
      );

      setStats(statsWithStreaks as StudentAttendanceStats[]);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [studentId]);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
};
