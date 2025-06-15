
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/hooks/useStudents";

export const useCoachStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  const fetchCoachStudents = async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      console.log('🎓 useCoachStudents: Fetching students for coach:', userProfile.name);
      
      // Query students assigned to this coach by name or user_id
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .or(`coach.eq.${userProfile.name},coach_user_id.eq.${userProfile.id}`)
        .order("name");

      if (error) throw error;

      console.log('🎓 useCoachStudents: Found students:', data?.length || 0);
      
      const typedStudents: Student[] = (data || []).map(student => ({
        ...student,
        status: student.status as "active" | "inactive" | "on-hold",
        membership_type: student.membership_type as "monthly" | "yearly" | "unlimited",
        payment_status: student.payment_status as "unpaid" | "paid" | "due_soon" | "overdue" | null,
        phone: student.phone || null,
        last_attended: student.last_attended || null,
        subscription_plan_id: student.subscription_plan_id || null,
        plan_start_date: student.plan_start_date || null,
        next_due_date: student.next_due_date || null,
        stripes: student.stripes || 0,
        attendance_rate: student.attendance_rate || 0
      }));

      setStudents(typedStudents);
    } catch (error) {
      console.error("🎓 useCoachStudents: Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const getStudentStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const todayAttendance = students.filter(s => 
      s.last_attended === new Date().toISOString().split('T')[0]
    ).length;
    
    return {
      totalStudents,
      activeStudents,
      todayAttendance,
      averageAttendance: totalStudents > 0 
        ? Math.round(students.reduce((acc, s) => acc + s.attendance_rate, 0) / totalStudents)
        : 0
    };
  };

  useEffect(() => {
    if (userProfile) {
      fetchCoachStudents();
    }
  }, [userProfile]);

  // Set up real-time subscription for student changes
  useEffect(() => {
    if (!userProfile) return;

    const channel = supabase
      .channel('coach-students-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `coach=eq.${userProfile.name}`
        },
        () => {
          console.log('🔄 useCoachStudents: Real-time student update detected');
          fetchCoachStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile]);

  return {
    students,
    loading,
    refetch: fetchCoachStudents,
    stats: getStudentStats()
  };
};
