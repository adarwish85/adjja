import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { coachService } from "@/services/coachService";

export interface Class {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  duration: number;
  capacity: number;
  enrolled: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "Kids" | "All Levels";
  location: string;
  status: "Active" | "Inactive" | "Cancelled";
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("name");

      if (error) throw error;

      console.log("Fetched classes data:", data);

      const typedClasses: Class[] = (data || []).map(classItem => ({
        ...classItem,
        level: classItem.level as "Beginner" | "Intermediate" | "Advanced" | "Kids" | "All Levels",
        status: classItem.status as "Active" | "Inactive" | "Cancelled",
        description: classItem.description || undefined
      }));

      setClasses(typedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const addClass = async (classData: Omit<Class, "id" | "created_at" | "updated_at">) => {
    try {
      console.log("Adding class with data:", classData);
      
      const { data, error } = await supabase
        .from("classes")
        .insert([classData])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Successfully added class:", data);

      const typedClass: Class = {
        ...data,
        level: data.level as "Beginner" | "Intermediate" | "Advanced" | "Kids" | "All Levels",
        status: data.status as "Active" | "Inactive" | "Cancelled",
        description: data.description || undefined
      };

      setClasses(prev => [...prev, typedClass]);
      
      // Automatically assign class to coach
      if (classData.instructor && classData.instructor !== "Various") {
        await coachService.addClassToCoach(classData.instructor, classData.name);
      }
      
      toast.success("Class added successfully");
      return typedClass;
    } catch (error) {
      console.error("Error adding class:", error);
      toast.error("Failed to add class");
      throw error;
    }
  };

  const updateClass = async (id: string, updates: Partial<Omit<Class, "id" | "created_at" | "updated_at">>) => {
    try {
      console.log("Updating class with id:", id, "data:", updates);
      
      // Get the current class data to compare instructors
      const currentClass = classes.find(cls => cls.id === id);
      
      const { data, error } = await supabase
        .from("classes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      const typedClass: Class = {
        ...data,
        level: data.level as "Beginner" | "Intermediate" | "Advanced" | "Kids" | "All Levels",
        status: data.status as "Active" | "Inactive" | "Cancelled",
        description: data.description || undefined
      };

      setClasses(prev => prev.map(classItem => classItem.id === id ? typedClass : classItem));
      
      // Handle instructor changes
      if (currentClass && updates.instructor !== undefined) {
        const oldInstructor = currentClass.instructor;
        const newInstructor = updates.instructor;
        const className = updates.name || currentClass.name;
        
        // Remove from old instructor if different
        if (oldInstructor && oldInstructor !== newInstructor && oldInstructor !== "Various") {
          await coachService.removeClassFromCoach(oldInstructor, className);
        }
        
        // Add to new instructor
        if (newInstructor && newInstructor !== "Various") {
          await coachService.addClassToCoach(newInstructor, className);
        }
      }
      
      toast.success("Class updated successfully");
      return typedClass;
    } catch (error) {
      console.error("Error updating class:", error);
      toast.error("Failed to update class");
      throw error;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      // Get the class data before deletion to remove from coach
      const classToDelete = classes.find(cls => cls.id === id);
      
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setClasses(prev => prev.filter(classItem => classItem.id !== id));
      
      // Remove class from coach's assigned_classes
      if (classToDelete && classToDelete.instructor && classToDelete.instructor !== "Various") {
        await coachService.removeClassFromCoach(classToDelete.instructor, classToDelete.name);
      }
      
      toast.success("Class deleted successfully");
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Failed to delete class");
      throw error;
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    loading,
    addClass,
    updateClass,
    deleteClass,
    refetch: fetchClasses,
  };
};
