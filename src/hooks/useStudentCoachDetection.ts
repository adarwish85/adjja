
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StudentCoachStatus {
  studentId: string;
  isCoach: boolean;
  hasAuthAccount: boolean;
  authUserId?: string;
}

export const useStudentCoachDetection = (students: any[]) => {
  const [coachStatuses, setCoachStatuses] = useState<Record<string, StudentCoachStatus>>({});
  const [loading, setLoading] = useState(false);

  const checkCoachStatus = async (student: any): Promise<StudentCoachStatus> => {
    // Check if student is marked as coach in students table
    if (student.coach === "Coach") {
      return {
        studentId: student.id,
        isCoach: true,
        hasAuthAccount: !!student.auth_user_id,
        authUserId: student.auth_user_id
      };
    }

    // If student has auth account, check their role
    if (student.auth_user_id) {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role_id, user_roles!inner(name)")
          .eq("id", student.auth_user_id)
          .single();

        if (error || !profile) {
          return {
            studentId: student.id,
            isCoach: false,
            hasAuthAccount: true,
            authUserId: student.auth_user_id
          };
        }

        const isCoach = (profile.user_roles as any)?.name === "Coach";
        
        return {
          studentId: student.id,
          isCoach,
          hasAuthAccount: true,
          authUserId: student.auth_user_id
        };
      } catch (error) {
        console.error("Error checking coach role:", error);
        return {
          studentId: student.id,
          isCoach: false,
          hasAuthAccount: true,
          authUserId: student.auth_user_id
        };
      }
    }

    // No auth account
    return {
      studentId: student.id,
      isCoach: false,
      hasAuthAccount: false
    };
  };

  const refreshCoachStatuses = async () => {
    if (students.length === 0) return;
    
    setLoading(true);
    try {
      const statuses: Record<string, StudentCoachStatus> = {};
      
      // Check coach status for each student
      for (const student of students) {
        const status = await checkCoachStatus(student);
        statuses[student.id] = status;
      }
      
      setCoachStatuses(statuses);
    } catch (error) {
      console.error("Error refreshing coach statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCoachStatuses();
  }, [students]);

  const isStudentCoach = (studentId: string): boolean => {
    return coachStatuses[studentId]?.isCoach || false;
  };

  return {
    coachStatuses,
    loading,
    refreshCoachStatuses,
    isStudentCoach
  };
};
