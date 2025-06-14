
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCourseEnrollment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const enrollInCourse = useMutation({
    mutationFn: async ({ courseId, studentId }: { courseId: string; studentId: string }) => {
      console.log("Enrolling student in course:", { courseId, studentId });
      
      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("course_id", courseId)
        .eq("student_id", studentId)
        .single();

      if (existingEnrollment) {
        throw new Error("Already enrolled in this course");
      }

      // Create new enrollment
      const { data, error } = await supabase
        .from("course_enrollments")
        .insert({
          course_id: courseId,
          student_id: studentId,
          status: "Active",
          progress_percentage: 0,
        })
        .select()
        .single();

      if (error) {
        console.error("Error enrolling in course:", error);
        throw error;
      }

      console.log("Successfully enrolled:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Enrollment Successful!",
        description: "You have been enrolled in the course.",
      });
    },
    onError: (error: any) => {
      console.error("Enrollment error:", error);
      const message = error.message === "Already enrolled in this course" 
        ? "You are already enrolled in this course."
        : "Failed to enroll in course. Please try again.";
      
      toast({
        title: "Enrollment Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const checkEnrollmentStatus = async (courseId: string, studentId: string) => {
    const { data } = await supabase
      .from("course_enrollments")
      .select("id, status")
      .eq("course_id", courseId)
      .eq("student_id", studentId)
      .single();

    return data;
  };

  return {
    enrollInCourse,
    checkEnrollmentStatus,
  };
};
