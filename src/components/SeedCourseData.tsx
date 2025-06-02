
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SeedCourseData = () => {
  const { toast } = useToast();

  const seedSampleData = async () => {
    try {
      // Update the existing Combatives course with sample video data
      const { error: updateError } = await supabase
        .from("courses")
        .update({
          intro_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Sample YouTube video
          thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
        })
        .eq("title", "Combatives");

      if (updateError) throw updateError;

      // Get the course ID to add lessons
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("id")
        .eq("title", "Combatives")
        .single();

      if (courseError) throw courseError;

      // Check if topics already exist
      const { data: existingTopics } = await supabase
        .from("course_topics")
        .select("id")
        .eq("course_id", course.id);

      if (existingTopics && existingTopics.length > 0) {
        toast({
          title: "Sample data already exists",
          description: "Course already has video content",
        });
        return;
      }

      // Create a sample topic
      const { data: topic, error: topicError } = await supabase
        .from("course_topics")
        .insert({
          course_id: course.id,
          title: "Basic Techniques",
          description: "Fundamental BJJ techniques for beginners",
          order_index: 0
        })
        .select()
        .single();

      if (topicError) throw topicError;

      // Add sample lessons with video URLs
      const sampleLessons = [
        {
          topic_id: topic.id,
          title: "Introduction to BJJ",
          content: "Learn the basics of Brazilian Jiu-Jitsu",
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          is_preview: true,
          duration_minutes: 15,
          order_index: 0
        },
        {
          topic_id: topic.id,
          title: "Basic Positions",
          content: "Understanding fundamental positions in BJJ",
          video_url: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
          is_preview: true,
          duration_minutes: 20,
          order_index: 1
        }
      ];

      const { error: lessonsError } = await supabase
        .from("course_lessons")
        .insert(sampleLessons);

      if (lessonsError) throw lessonsError;

      toast({
        title: "Success",
        description: "Sample video data added to course",
      });

    } catch (error) {
      console.error("Error seeding data:", error);
      toast({
        title: "Error",
        description: "Failed to add sample data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={seedSampleData}
        className="bg-red-600 hover:bg-red-700 text-white"
        size="sm"
      >
        Add Sample Videos
      </Button>
    </div>
  );
};
