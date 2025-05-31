
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Course = Tables<"courses">;
type CourseInsert = TablesInsert<"courses">;
type CourseUpdate = TablesUpdate<"courses">;

export const useCourses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      console.log("Fetching courses...");
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }
      console.log("Fetched courses:", data);
      return data as Course[];
    },
  });

  const createCourse = useMutation({
    mutationFn: async (courseData: CourseInsert) => {
      console.log("Creating course:", courseData);
      const { data, error } = await supabase
        .from("courses")
        .insert([courseData])
        .select()
        .single();

      if (error) {
        console.error("Error creating course:", error);
        throw error;
      }
      console.log("Created course:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Success",
        description: "Course created successfully",
      });
    },
    onError: (error) => {
      console.error("Create course error:", error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    },
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, ...updateData }: CourseUpdate & { id: string }) => {
      console.log("Updating course:", id, updateData);
      const { data, error } = await supabase
        .from("courses")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating course:", error);
        throw error;
      }
      console.log("Updated course:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
    },
    onError: (error) => {
      console.error("Update course error:", error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting course:", id);
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting course:", error);
        throw error;
      }
      console.log("Deleted course:", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete course error:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    },
  });

  return {
    courses,
    isLoading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
