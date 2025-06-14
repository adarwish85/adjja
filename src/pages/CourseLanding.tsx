import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { extractYouTubeVideoId, getYouTubeThumbnail, isYouTubeUrl } from "@/utils/youtubeUtils";
import { useCourseEnrollment } from "@/hooks/useCourseEnrollment";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CourseHeroSection } from "@/components/course/CourseHeroSection";
import { CourseLearningOutcomes } from "@/components/course/CourseLearningOutcomes";
import { CourseContentAccordion } from "@/components/course/CourseContentAccordion";
import { CourseRequirements } from "@/components/course/CourseRequirements";
import { CourseDescription } from "@/components/course/CourseDescription";
import { CourseInstructorCard } from "@/components/course/CourseInstructorCard";
import { UniversalVideoPlayer } from "@/components/video/UniversalVideoPlayer";

const CourseLanding = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { enrollInCourse } = useCourseEnrollment();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("No course ID provided");
      
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: courseTopics = [] } = useQuery({
    queryKey: ["course-topics", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      const { data: topics, error: topicsError } = await supabase
        .from("course_topics")
        .select(`
          *,
          course_lessons(*),
          course_quizzes(*)
        `)
        .eq("course_id", courseId)
        .order("order_index");

      if (topicsError) throw topicsError;
      return topics;
    },
    enabled: !!courseId,
  });

  const { data: enrollmentCount } = useQuery({
    queryKey: ["course-enrollments", courseId],
    queryFn: async () => {
      if (!courseId) return 0;
      const { count, error } = await supabase
        .from("course_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!courseId,
  });

  const { data: userEnrollment } = useQuery({
    queryKey: ["user-enrollment", courseId, user?.id],
    queryFn: async () => {
      if (!courseId || !user?.id) return null;
      const { data, error } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("student_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!courseId && !!user?.id,
  });

  const handleEnrollment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in courses.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!courseId) return;

    try {
      await enrollInCourse.mutateAsync({
        courseId,
        studentId: user.id,
      });
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")} className="bg-bjj-gold hover:bg-bjj-gold-dark">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const allLessons = courseTopics.flatMap(topic => topic.course_lessons || []);
  const totalLessons = allLessons.length;
  const totalDuration = allLessons.reduce((sum, lesson) => sum + (lesson.duration_minutes || 10), 0);
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;
  const studentCount = enrollmentCount || course.total_students || 0;

  const firstLesson = allLessons.find(lesson => lesson.video_url);
  const featuredImage = course.thumbnail_url || (firstLesson?.video_url ? getYouTubeThumbnail(firstLesson.video_url) : null);
  const introVideo = course.intro_video || firstLesson?.video_url;

  const learningOutcomes = course.learning_outcomes || [
    "Master fundamental BJJ techniques and positions",
    "Understand basic transitions and movement patterns", 
    "Learn effective submission holds and escapes",
    "Develop proper defensive strategies and mindset",
    "Build confidence and mental toughness on the mat",
    "Improve physical conditioning and flexibility"
  ];

  const requirements = course.requirements ? [course.requirements] : [
    "No prior martial arts experience required",
    "A gi (Brazilian Jiu-Jitsu uniform) is recommended but not required for video lessons",
    "Willingness to learn and practice regularly",
    "Basic physical fitness (modifications provided for all levels)"
  ];

  const handleVideoPreview = (videoUrl: string) => {
    console.log("Opening video preview for:", videoUrl);
    
    if (isYouTubeUrl(videoUrl)) {
      setSelectedVideo(videoUrl);
      setIsPlayerOpen(true);
    } else {
      toast({
        title: "Unsupported Video Format",
        description: "Currently only YouTube videos are supported for preview.",
        variant: "destructive",
      });
    }
  };

  const handlePreviewCourse = () => {
    if (introVideo) {
      handleVideoPreview(introVideo);
    } else {
      toast({
        title: "No Preview Available",
        description: "This course doesn't have a preview video yet.",
        variant: "destructive",
      });
    }
  };

  const isEnrolled = !!userEnrollment;

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseHeroSection
        course={course}
        totalHours={totalHours}
        totalMinutes={totalMinutes}
        totalLessons={totalLessons}
        studentCount={studentCount}
        featuredImage={featuredImage}
        introVideo={introVideo}
        isEnrolled={isEnrolled}
        enrollInCourse={enrollInCourse}
        onPreviewCourse={handlePreviewCourse}
        onEnrollment={handleEnrollment}
        onNavigateBack={() => navigate("/")}
        onNavigateToCourse={() => navigate(`/course/${courseId}/learn`)}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CourseLearningOutcomes learningOutcomes={learningOutcomes} />
            <CourseContentAccordion
              courseTopics={courseTopics}
              totalLessons={totalLessons}
              totalHours={totalHours}
              totalMinutes={totalMinutes}
              onVideoPreview={handleVideoPreview}
            />
            <CourseRequirements requirements={requirements} />
            <CourseDescription course={course} />
          </div>

          <div className="lg:col-span-1">
            <CourseInstructorCard course={course} studentCount={studentCount} />
          </div>
        </div>
      </div>

      {isPlayerOpen && selectedVideo && (
        <UniversalVideoPlayer
          videoUrl={selectedVideo}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedVideo(null);
          }}
          title={course?.title || "Course Preview"}
        />
      )}
    </div>
  );
};

export default CourseLanding;
