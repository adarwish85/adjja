
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCourseTopics = (courseId: string | null) => {
  return useQuery({
    queryKey: ["course-topics", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      console.log("Fetching course topics for course:", courseId);
      
      // Fetch topics
      const { data: topicsData, error: topicsError } = await supabase
        .from("course_topics")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (topicsError) {
        console.error("Error fetching topics:", topicsError);
        throw topicsError;
      }

      console.log("Fetched topics:", topicsData);

      // For each topic, fetch lessons and quizzes
      const topicsWithContent = await Promise.all(
        topicsData.map(async (topic) => {
          // Fetch lessons
          const { data: lessonsData, error: lessonsError } = await supabase
            .from("course_lessons")
            .select("*")
            .eq("topic_id", topic.id)
            .order("order_index", { ascending: true });

          if (lessonsError) {
            console.error("Error fetching lessons:", lessonsError);
            throw lessonsError;
          }

          // Fetch quizzes
          const { data: quizzesData, error: quizzesError } = await supabase
            .from("course_quizzes")
            .select("*")
            .eq("topic_id", topic.id)
            .order("order_index", { ascending: true });

          if (quizzesError) {
            console.error("Error fetching quizzes:", quizzesError);
            throw quizzesError;
          }

          // For each quiz, fetch questions
          const quizzesWithQuestions = await Promise.all(
            quizzesData.map(async (quiz) => {
              const { data: questionsData, error: questionsError } = await supabase
                .from("quiz_questions")
                .select("*")
                .eq("quiz_id", quiz.id)
                .order("order_index", { ascending: true });

              if (questionsError) {
                console.error("Error fetching questions:", questionsError);
                throw questionsError;
              }

              return {
                id: quiz.id,
                type: "quiz" as const,
                title: quiz.title,
                description: quiz.description,
                timeLimit: quiz.time_limit,
                showTimer: quiz.show_timer,
                feedbackMode: quiz.feedback_mode as "immediate" | "after_submission",
                attemptsAllowed: quiz.attempts_allowed,
                passingGrade: quiz.passing_grade,
                questions: questionsData.map(q => ({
                  id: q.id,
                  type: q.question_type as any,
                  question: q.question,
                  options: q.options || [],
                  correctAnswer: q.correct_answer || "",
                  points: q.points,
                })),
              };
            })
          );

          // Convert lessons to the expected format
          const lessons = lessonsData.map(lesson => ({
            id: lesson.id,
            type: "lesson" as const,
            name: lesson.title,
            content: lesson.content || "",
            featuredImage: lesson.featured_image || "",
            videoUrl: lesson.video_url || "",
            attachments: lesson.attachments || [],
            isPreview: lesson.is_preview || false,
            duration: lesson.duration_minutes || 10,
          }));

          // Combine lessons and quizzes and sort by order_index
          const allItems = [
            ...lessons,
            ...quizzesWithQuestions,
          ];

          return {
            id: topic.id,
            title: topic.title,
            description: topic.description || "",
            items: allItems,
          };
        })
      );

      console.log("Topics with content:", topicsWithContent);
      return topicsWithContent;
    },
    enabled: !!courseId,
  });
};
