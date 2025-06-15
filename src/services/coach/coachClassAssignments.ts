
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const coachClassAssignments = {
  async updateCoachStudentCount(coachName: string): Promise<void> {
    console.log("Updating student count for coach:", coachName);
    
    // Count active students assigned to this coach
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id")
      .eq("coach", coachName)
      .eq("status", "active");

    if (studentsError) {
      console.error("Error counting students:", studentsError);
      return;
    }

    const studentCount = students?.length || 0;
    console.log("Found", studentCount, "students for coach:", coachName);

    // Update the coach's student count
    const { error: updateError } = await supabase
      .from("coaches")
      .update({ students_count: studentCount })
      .eq("name", coachName);

    if (updateError) {
      console.error("Error updating coach student count:", updateError);
    } else {
      console.log("Successfully updated coach student count");
    }
  },

  async addClassToCoach(coachName: string, className: string): Promise<void> {
    console.log("Adding class to coach:", coachName, className);
    
    // Don't add classes for "Various" instructors
    if (coachName === "Various") {
      return;
    }
    
    try {
      // Get the current coach data
      const { data: coach, error: fetchError } = await supabase
        .from("coaches")
        .select("assigned_classes")
        .eq("name", coachName)
        .single();

      if (fetchError) {
        console.error("Error fetching coach for class assignment:", fetchError);
        return;
      }

      if (!coach) {
        console.warn("Coach not found:", coachName);
        return;
      }

      const currentClasses = coach.assigned_classes || [];
      
      // Only add if not already assigned
      if (!currentClasses.includes(className)) {
        const updatedClasses = [...currentClasses, className];
        
        const { error: updateError } = await supabase
          .from("coaches")
          .update({ assigned_classes: updatedClasses })
          .eq("name", coachName);

        if (updateError) {
          console.error("Error updating coach assigned classes:", updateError);
        } else {
          console.log("Successfully added class to coach");
        }
      }
    } catch (error) {
      console.error("Error in addClassToCoach:", error);
    }
  },

  async removeClassFromCoach(coachName: string, className: string): Promise<void> {
    console.log("Removing class from coach:", coachName, className);
    
    // Don't process "Various" instructors
    if (coachName === "Various") {
      return;
    }
    
    try {
      // Get the current coach data
      const { data: coach, error: fetchError } = await supabase
        .from("coaches")
        .select("assigned_classes")
        .eq("name", coachName)
        .single();

      if (fetchError) {
        console.error("Error fetching coach for class removal:", fetchError);
        return;
      }

      if (!coach) {
        console.warn("Coach not found:", coachName);
        return;
      }

      const currentClasses = coach.assigned_classes || [];
      const updatedClasses = currentClasses.filter(cls => cls !== className);
      
      // Only update if there was a change
      if (currentClasses.length !== updatedClasses.length) {
        const { error: updateError } = await supabase
          .from("coaches")
          .update({ assigned_classes: updatedClasses })
          .eq("name", coachName);

        if (updateError) {
          console.error("Error updating coach assigned classes:", updateError);
        } else {
          console.log("Successfully removed class from coach");
        }
      }
    } catch (error) {
      console.error("Error in removeClassFromCoach:", error);
    }
  },

  async syncCoachClassAssignments(): Promise<void> {
    console.log("Syncing all coach class assignments...");
    
    try {
      // Get all classes and coaches
      const [classesResult, coachesResult] = await Promise.all([
        supabase.from("classes").select("name, instructor"),
        supabase.from("coaches").select("id, name")
      ]);

      if (classesResult.error) {
        throw classesResult.error;
      }
      
      if (coachesResult.error) {
        throw coachesResult.error;
      }

      const classes = classesResult.data || [];
      const coaches = coachesResult.data || [];

      // Build a map of coach name to assigned classes
      const coachClassMap: Record<string, string[]> = {};
      
      // Initialize all coaches with empty arrays
      coaches.forEach(coach => {
        coachClassMap[coach.name] = [];
      });

      // Populate the map with actual class assignments
      classes.forEach(cls => {
        if (cls.instructor && cls.instructor !== "Various" && coachClassMap.hasOwnProperty(cls.instructor)) {
          coachClassMap[cls.instructor].push(cls.name);
        }
      });

      // Update each coach's assigned_classes
      const updatePromises = coaches.map(async (coach) => {
        const assignedClasses = coachClassMap[coach.name] || [];
        
        const { error } = await supabase
          .from("coaches")
          .update({ assigned_classes: assignedClasses })
          .eq("id", coach.id);

        if (error) {
          console.error(`Error updating coach ${coach.name}:`, error);
        }
      });

      await Promise.all(updatePromises);
      console.log("Successfully synced all coach class assignments");
      toast.success("Coach class assignments synchronized");
    } catch (error) {
      console.error("Error syncing coach class assignments:", error);
      toast.error("Failed to sync coach class assignments");
    }
  }
};
