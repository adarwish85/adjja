
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ManualEnrollmentData {
  courseId: string;
  studentIds: string[];
  startDate?: string;
  note?: string;
}

export interface EnrollmentResult {
  studentId: string;
  success: boolean;
  message: string;
}

export const useManualEnrollment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkEnrollStudents = useMutation({
    mutationFn: async (data: ManualEnrollmentData): Promise<EnrollmentResult[]> => {
      console.log("Starting bulk enrollment:", data);
      const results: EnrollmentResult[] = [];

      for (const studentId of data.studentIds) {
        try {
          // Check if already enrolled
          const { data: existingEnrollment } = await supabase
            .from("course_enrollments")
            .select("id")
            .eq("course_id", data.courseId)
            .eq("student_id", studentId)
            .single();

          if (existingEnrollment) {
            results.push({
              studentId,
              success: false,
              message: "Already enrolled in this course"
            });
            continue;
          }

          // Create enrollment
          const { error } = await supabase
            .from("course_enrollments")
            .insert({
              course_id: data.courseId,
              student_id: studentId,
              status: "Active",
              progress_percentage: 0,
              start_date: data.startDate || null,
              note: data.note || null,
              enrolled_by: (await supabase.auth.getUser()).data.user?.id
            });

          if (error) {
            console.error("Enrollment error for student:", studentId, error);
            results.push({
              studentId,
              success: false,
              message: error.message
            });
          } else {
            results.push({
              studentId,
              success: true,
              message: "Successfully enrolled"
            });
          }
        } catch (error: any) {
          console.error("Unexpected error enrolling student:", studentId, error);
          results.push({
            studentId,
            success: false,
            message: error.message || "Unexpected error"
          });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      queryClient.invalidateQueries({ queryKey: ["course_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });

      if (successCount > 0) {
        toast({
          title: "Enrollment Complete",
          description: `Successfully enrolled ${successCount} student(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
        });
      } else {
        toast({
          title: "Enrollment Failed",
          description: "No students were enrolled successfully",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error("Bulk enrollment error:", error);
      toast({
        title: "Enrollment Error",
        description: "Failed to process enrollment requests",
        variant: "destructive",
      });
    },
  });

  return {
    bulkEnrollStudents,
    isEnrolling: bulkEnrollStudents.isPending,
  };
};
