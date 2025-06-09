
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ClassEnrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrollment_date: string;
  status: "active" | "inactive" | "dropped";
  created_at: string;
  updated_at: string;
  student?: {
    id: string;
    name: string;
    email: string;
    belt: string;
    stripes: number;
  };
  class?: {
    id: string;
    name: string;
    instructor: string;
    schedule: string;
  };
}

export const useClassEnrollments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: enrollments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["class_enrollments"],
    queryFn: async () => {
      console.log("Fetching class enrollments...");
      const { data, error } = await supabase
        .from("class_enrollments")
        .select(`
          *,
          students (id, name, email, belt, stripes),
          classes (id, name, instructor, schedule)
        `)
        .order("enrollment_date", { ascending: false });

      if (error) {
        console.error("Error fetching class enrollments:", error);
        throw error;
      }
      console.log("Fetched class enrollments:", data);
      return data as ClassEnrollment[];
    },
  });

  const enrollStudent = useMutation({
    mutationFn: async ({ studentId, classId }: { studentId: string; classId: string }) => {
      console.log("Enrolling student:", studentId, "in class:", classId);
      const { data, error } = await supabase.rpc('enroll_student_in_class', {
        p_student_id: studentId,
        p_class_id: classId
      });

      if (error) {
        console.error("Error enrolling student:", error);
        throw error;
      }
      console.log("Student enrolled successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Success",
        description: "Student enrolled successfully",
      });
    },
    onError: (error) => {
      console.error("Enroll student error:", error);
      toast({
        title: "Error",
        description: "Failed to enroll student",
        variant: "destructive",
      });
    },
  });

  const unenrollStudent = useMutation({
    mutationFn: async ({ studentId, classId }: { studentId: string; classId: string }) => {
      console.log("Unenrolling student:", studentId, "from class:", classId);
      const { data, error } = await supabase.rpc('unenroll_student_from_class', {
        p_student_id: studentId,
        p_class_id: classId
      });

      if (error) {
        console.error("Error unenrolling student:", error);
        throw error;
      }
      console.log("Student unenrolled successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Success",
        description: "Student unenrolled successfully",
      });
    },
    onError: (error) => {
      console.error("Unenroll student error:", error);
      toast({
        title: "Error",
        description: "Failed to unenroll student",
        variant: "destructive",
      });
    },
  });

  return {
    enrollments,
    isLoading,
    error,
    enrollStudent,
    unenrollStudent,
  };
};
