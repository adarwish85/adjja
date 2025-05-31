
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

  const saveCourseContent = useMutation({
    mutationFn: async ({ courseId, topics }: { courseId: string; topics: any[] }) => {
      console.log("Saving course content for course:", courseId, topics);
      
      // First, delete existing topics for this course
      await supabase
        .from("course_topics")
        .delete()
        .eq("course_id", courseId);

      // Save each topic
      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        const topic = topics[topicIndex];
        
        // Insert topic
        const { data: topicData, error: topicError } = await supabase
          .from("course_topics")
          .insert({
            course_id: courseId,
            title: topic.title,
            description: topic.description,
            order_index: topicIndex,
          })
          .select()
          .single();

        if (topicError) throw topicError;

        // Save topic items (lessons and quizzes)
        for (let itemIndex = 0; itemIndex < topic.items.length; itemIndex++) {
          const item = topic.items[itemIndex];
          
          if (item.type === "lesson") {
            const { error: lessonError } = await supabase
              .from("course_lessons")
              .insert({
                topic_id: topicData.id,
                title: item.name,
                content: item.content,
                video_url: item.videoUrl,
                featured_image: item.featuredImage,
                attachments: item.attachments || [],
                is_preview: item.isPreview,
                order_index: itemIndex,
              });

            if (lessonError) throw lessonError;
          } else if (item.type === "quiz") {
            const { data: quizData, error: quizError } = await supabase
              .from("course_quizzes")
              .insert({
                topic_id: topicData.id,
                title: item.title,
                description: item.description,
                time_limit: item.timeLimit,
                show_timer: item.showTimer,
                feedback_mode: item.feedbackMode,
                attempts_allowed: item.attemptsAllowed,
                passing_grade: item.passingGrade,
                order_index: itemIndex,
              })
              .select()
              .single();

            if (quizError) throw quizError;

            // Save quiz questions
            for (let questionIndex = 0; questionIndex < item.questions.length; questionIndex++) {
              const question = item.questions[questionIndex];
              
              const { error: questionError } = await supabase
                .from("quiz_questions")
                .insert({
                  quiz_id: quizData.id,
                  question_type: question.type,
                  question: question.question,
                  options: question.options || [],
                  correct_answer: Array.isArray(question.correctAnswer) 
                    ? question.correctAnswer.join(",") 
                    : question.correctAnswer,
                  points: question.points,
                  order_index: questionIndex,
                });

              if (questionError) throw questionError;
            }
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-topics"] });
      toast({
        title: "Success",
        description: "Course content saved successfully",
      });
    },
    onError: (error) => {
      console.error("Save course content error:", error);
      toast({
        title: "Error",
        description: "Failed to save course content",
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
    saveCourseContent,
  };
};
