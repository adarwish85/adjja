import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Download, 
  Award, 
  CheckCircle,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { EnhancedVideoPlayer } from "@/components/EnhancedVideoPlayer";
import { extractYouTubeVideoId, getYouTubeThumbnail } from "@/utils/youtubeUtils";
import { useCourseEnrollment } from "@/hooks/useCourseEnrollment";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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

  // Fetch course topics with lessons and quizzes
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

  // Calculate totals from course topics
  const allLessons = courseTopics.flatMap(topic => topic.course_lessons || []);
  const totalLessons = allLessons.length;
  const totalDuration = allLessons.reduce((sum, lesson) => sum + (lesson.duration_minutes || 10), 0);
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;
  const studentCount = enrollmentCount || course.total_students || 0;

  // Use first lesson video as fallback for featured image and intro video
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
    setSelectedVideo(videoUrl);
    setIsPlayerOpen(true);
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

  // Generate fallback MP4 URLs for enhanced video player
  const generateFallbackUrls = (videoUrl: string) => {
    const fallbacks: string[] = [];
    const mp4Urls: string[] = [];
    
    // Add example MP4 fallbacks (these would be your actual video URLs)
    if (videoUrl) {
      // Example: convert YouTube URLs to your hosted MP4s
      const videoId = extractYouTubeVideoId(videoUrl);
      if (videoId) {
        mp4Urls.push(`https://your-cdn.com/videos/${videoId}-720p.mp4`);
        mp4Urls.push(`https://your-cdn.com/videos/${videoId}-480p.mp4`);
      }
    }
    
    return { fallbacks, mp4Urls };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <Badge className="bg-bjj-gold text-black">{course.category}</Badge>
                <h1 className="text-3xl lg:text-4xl font-bold">{course.title}</h1>
                <p className="text-lg text-gray-300">{course.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating || "4.5"}</span>
                  <span className="text-gray-400">({studentCount} students)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{studentCount} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalHours}h {totalMinutes}m</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Created by</p>
                <p className="text-lg font-medium">{course.instructor}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="outline" className="text-white border-gray-600">
                  {course.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>English</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-0">
                  {/* Video Preview */}
                  <div className="relative aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                    {featuredImage ? (
                      <img 
                        src={featuredImage} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-bjj-navy to-bjj-gold"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Button 
                        size="lg" 
                        className="bg-white text-black hover:bg-gray-100"
                        onClick={handlePreviewCourse}
                        disabled={!introVideo}
                      >
                        <Play className="h-6 w-6 mr-2" />
                        Preview Course
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-bjj-navy">
                        {course.price > 0 ? `$${course.price}` : "Free"}
                      </div>
                    </div>

                    {isEnrolled ? (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => navigate(`/course/${courseId}/learn`)}
                      >
                        Continue Learning
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-white"
                        onClick={handleEnrollment}
                        disabled={enrollInCourse.isPending}
                      >
                        {enrollInCourse.isPending ? "Enrolling..." : "Enroll Now"}
                      </Button>
                    )}

                    <p className="text-xs text-center text-gray-600">
                      30-Day Money-Back Guarantee
                    </p>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold">This course includes:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          <span>{totalHours}h {totalMinutes}m on-demand video</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          <span>{totalLessons} lectures</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <span>Downloadable resources</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span>Access on mobile and TV</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>Certificate of completion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-bjj-navy mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {learningOutcomes.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content with Accordion */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-bjj-navy mb-4">Course content</h2>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <span>{courseTopics.length} sections • {totalLessons} lectures • {totalHours}h {totalMinutes}m total length</span>
                </div>
                
                {courseTopics.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {courseTopics.map((topic, topicIndex) => {
                      const topicLessons = topic.course_lessons || [];
                      const topicDuration = topicLessons.reduce((sum, lesson) => sum + (lesson.duration_minutes || 10), 0);
                      
                      return (
                        <AccordionItem key={topic.id} value={`topic-${topicIndex}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex justify-between items-center w-full pr-4">
                              <span className="font-medium">{topic.title}</span>
                              <span className="text-sm text-gray-600">
                                {topicLessons.length} lectures • {Math.floor(topicDuration / 60)}h {topicDuration % 60}m
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 ml-4">
                              {topicLessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between text-sm border-b pb-2">
                                  <div className="flex items-center gap-2 flex-1">
                                    <Play className="h-3 w-3 text-gray-400" />
                                    <span className="flex-1">{lesson.title}</span>
                                    {lesson.is_preview && lesson.video_url && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleVideoPreview(lesson.video_url)}
                                        className="text-bjj-gold hover:text-bjj-gold-dark h-6 px-2"
                                      >
                                        <Eye className="h-3 w-3 mr-1" />
                                        Preview
                                      </Button>
                                    )}
                                  </div>
                                  <span className="text-gray-500 ml-2">{lesson.duration_minutes || 10} min</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                ) : (
                  <div className="border rounded-lg p-4 text-center text-gray-500">
                    Course content is being prepared. Check back soon!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-bjj-navy mb-4">Requirements</h2>
                <ul className="space-y-2 text-sm">
                  {requirements.map((requirement, index) => (
                    <li key={index}>• {requirement}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-bjj-navy mb-4">Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    {course.description || "This comprehensive Brazilian Jiu-Jitsu course is designed for students who want to learn the art and science of BJJ. Whether you're completely new to martial arts or looking to add BJJ to your existing skillset, this course will provide you with a solid foundation in the fundamental techniques and concepts."}
                  </p>
                  <p className="text-gray-700 mb-4">
                    Our experienced instructor will guide you through each technique step-by-step, ensuring you understand not just the 
                    "how" but also the "why" behind each movement. You'll learn proper body mechanics, timing, and the strategic thinking 
                    that makes Brazilian Jiu-Jitsu so effective.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructor Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-bjj-navy mb-4">Instructor</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-lg">{course.instructor}</h4>
                    <p className="text-sm text-gray-600">BJJ Instructor</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students:</span>
                      <span>{studentCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span>{course.rating || "4.5"}/5</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    Experienced Brazilian Jiu-Jitsu instructor passionate about sharing the art with students of all backgrounds and skill levels.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Video Player Modal */}
      {isPlayerOpen && selectedVideo && (
        <EnhancedVideoPlayer
          primaryUrl={selectedVideo}
          {...generateFallbackUrls(selectedVideo)}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
};

export default CourseLanding;
