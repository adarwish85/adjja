
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
      console.log('🎓 useCoachStudents: Fetching students for coach:', userProfile.name, 'ID:', userProfile.id);
      
      let allStudents: any[] = [];

      // Step 1: Get students directly assigned to this coach by name or user_id
      const { data: directStudents, error: directError } = await supabase
        .from("students")
        .select("*")
        .or(`coach.eq.${userProfile.name},coach_user_id.eq.${userProfile.id}`)
        .order("name");

      if (directError) {
        console.error("useCoachStudents: Error fetching direct students:", directError);
      } else {
        allStudents = directStudents || [];
        console.log('🎓 useCoachStudents: Found direct students:', allStudents.length);
      }

      // Step 2: Get students enrolled in classes where this coach is the instructor
      try {
        // First, get classes where this coach is the instructor (by name)
        const { data: coachClasses, error: classesError } = await supabase
          .from("classes")
          .select("id, name, instructor")
          .eq("instructor", userProfile.name)
          .eq("status", "Active");

        if (classesError) {
          console.error("useCoachStudents: Error fetching coach classes:", classesError);
        } else if (coachClasses && coachClasses.length > 0) {
          console.log('🎓 useCoachStudents: Found coach classes:', coachClasses.map(c => c.name));
          
          const classIds = coachClasses.map(c => c.id);
          
          // Get students enrolled in these classes
          const { data: enrollments, error: enrollmentError } = await supabase
            .from("class_enrollments")
            .select(`
              student_id,
              students!inner(*)
            `)
            .in("class_id", classIds)
            .eq("status", "active");

          if (enrollmentError) {
            console.error("useCoachStudents: Error fetching class enrollments:", enrollmentError);
          } else if (enrollments) {
            console.log('🎓 useCoachStudents: Found class enrollments:', enrollments.length);
            
            // Extract students from enrollments and avoid duplicates
            const classStudents = enrollments
              .map(enrollment => enrollment.students)
              .filter(student => student && !allStudents.some(existing => existing.id === student.id));
            
            allStudents = [...allStudents, ...classStudents];
            console.log('🎓 useCoachStudents: Total students after class enrollments:', allStudents.length);
          }
        }
      } catch (error) {
        console.error("useCoachStudents: Error in class enrollment lookup:", error);
      }

      // Step 3: For upgraded coaches, also check if there are any additional assignments
      // This covers edge cases where the coach might be assigned in different ways
      if (userProfile.id) {
        try {
          // Check if this user has any coach profile assignments
          const { data: coachProfile, error: coachProfileError } = await supabase
            .from("coach_profiles")
            .select("assigned_classes")
            .eq("user_id", userProfile.id)
            .single();

          if (!coachProfileError && coachProfile?.assigned_classes?.length > 0) {
            console.log('🎓 useCoachStudents: Found coach profile with assigned classes:', coachProfile.assigned_classes);
            
            // Get students from assigned classes (if any additional ones)
            const { data: additionalClasses, error: additionalClassesError } = await supabase
              .from("classes")
              .select("id, name")
              .in("name", coachProfile.assigned_classes)
              .eq("status", "Active");

            if (!additionalClassesError && additionalClasses?.length > 0) {
              const additionalClassIds = additionalClasses.map(c => c.id);
              
              const { data: additionalEnrollments, error: additionalEnrollmentError } = await supabase
                .from("class_enrollments")
                .select(`
                  student_id,
                  students!inner(*)
                `)
                .in("class_id", additionalClassIds)
                .eq("status", "active");

              if (!additionalEnrollmentError && additionalEnrollments) {
                const additionalStudents = additionalEnrollments
                  .map(enrollment => enrollment.students)
                  .filter(student => student && !allStudents.some(existing => existing.id === student.id));
                
                allStudents = [...allStudents, ...additionalStudents];
                console.log('🎓 useCoachStudents: Total students after additional assignments:', allStudents.length);
              }
            }
          }
        } catch (error) {
          console.error("useCoachStudents: Error checking coach profile assignments:", error);
        }
      }

      // Step 4: Type and format the final students array
      const typedStudents: Student[] = allStudents.map(student => ({
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

      console.log('🎓 useCoachStudents: Final student list:', typedStudents.map(s => s.name));
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

  // Set up real-time subscription for student and enrollment changes
  useEffect(() => {
    if (!userProfile) return;

    const studentsChannel = supabase
      .channel('coach-students-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        () => {
          console.log('🔄 useCoachStudents: Real-time student update detected');
          fetchCoachStudents();
        }
      )
      .subscribe();

    const enrollmentsChannel = supabase
      .channel('coach-enrollments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_enrollments'
        },
        () => {
          console.log('🔄 useCoachStudents: Real-time enrollment update detected');
          fetchCoachStudents();
        }
      )
      .subscribe();

    const classesChannel = supabase
      .channel('coach-classes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classes'
        },
        () => {
          console.log('🔄 useCoachStudents: Real-time class update detected');
          fetchCoachStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(enrollmentsChannel);
      supabase.removeChannel(classesChannel);
    };
  }, [userProfile]);

  return {
    students,
    loading,
    refetch: fetchCoachStudents,
    stats: getStudentStats()
  };
};
