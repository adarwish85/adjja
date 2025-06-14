
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type CourseEnrollment = Tables<"course_enrollments">;
type CourseEnrollmentInsert = TablesInsert<"course_enrollments">;
type CourseEnrollmentUpdate = TablesUpdate<"course_enrollments">;

export const useCourseEnrollments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: enrollments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course_enrollments"],
    queryFn: async () => {
      console.log("Fetching course enrollments...");
      const { data, error } = await supabase
        .from("course_enrollments")
        .select(`
          *,
          courses (title, instructor),
          students (name, email)
        `)
        .order("enrollment_date", { ascending: false });

      if (error) {
        console.error("Error fetching course enrollments:", error);
        throw error;
      }
      console.log("Fetched course enrollments:", data);
      return data as any[];
    },
  });

  const createEnrollment = useMutation({
    mutationFn: async (enrollmentData: CourseEnrollmentInsert) => {
      console.log("Creating course enrollment:", enrollmentData);
      const { data, error } = await supabase
        .from("course_enrollments")
        .insert([enrollmentData])
        .select()
        .single();

      if (error) {
        console.error("Error creating enrollment:", error);
        throw error;
      }
      console.log("Created enrollment:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Success",
        description: "Student enrolled successfully",
      });
    },
    onError: (error) => {
      console.error("Create enrollment error:", error);
      toast({
        title: "Error",
        description: "Failed to enroll student",
        variant: "destructive",
      });
    },
  });

  const updateEnrollment = useMutation({
    mutationFn: async ({ id, ...updateData }: CourseEnrollmentUpdate & { id: string }) => {
      console.log("Updating enrollment:", id, updateData);
      const { data, error } = await supabase
        .from("course_enrollments")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating enrollment:", error);
        throw error;
      }
      console.log("Updated enrollment:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Success",
        description: "Enrollment updated successfully",
      });
    },
    onError: (error) => {
      console.error("Update enrollment error:", error);
      toast({
        title: "Error",
        description: "Failed to update enrollment",
        variant: "destructive",
      });
    },
  });

  return {
    enrollments,
    isLoading,
    error,
    createEnrollment,
    updateEnrollment,
  };
};
