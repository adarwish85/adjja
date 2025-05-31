
import { useParams } from "react-router-dom";
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
  Eye
} from "lucide-react";
import { useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";

const CourseLanding = () => {
  const { courseId } = useParams();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: videos } = useQuery({
    queryKey: ["course-videos", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from("course_videos")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (error) throw error;
      return data;
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalVideos = videos?.length || 0;
  const totalDuration = videos?.reduce((sum, video) => sum + (video.duration_minutes || 0), 0) || 0;
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;
  const studentCount = enrollmentCount || course.total_students || 0;

  // Use first video as fallback for featured image and intro video
  const firstVideo = videos?.[0];
  const featuredImage = course.thumbnail_url || (firstVideo?.video_url ? getYoutubeThumbnail(firstVideo.video_url) : null);
  const introVideo = course.intro_video || firstVideo?.video_url;

  // Group videos by sections (for now, we'll create basic sections based on video titles)
  const sections = videos ? [
    {
      title: "Course Lessons",
      videos: videos,
      duration: totalDuration
    }
  ] : [];

  const learningOutcomes = course.learning_outcomes || [
    "Master fundamental BJJ techniques and positions",
    "Understand basic transitions and movement patterns", 
    "Learn effective submission holds and escapes",
    "Develop proper defensive strategies and mindset",
    "Build confidence and mental toughness on the mat",
    "Improve physical conditioning and flexibility"
  ];

  const requirements = course.requirements || [
    "No prior martial arts experience required",
    "A gi (Brazilian Jiu-Jitsu uniform) is recommended but not required for video lessons",
    "Willingness to learn and practice regularly",
    "Basic physical fitness (modifications provided for all levels)"
  ];

  const handleVideoPreview = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setIsPlayerOpen(true);
  };

  const handlePreviewCourse = () => {
    if (introVideo) {
      handleVideoPreview(introVideo);
    }
  };

  function getYoutubeThumbnail(url: string): string {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  }

  function extractYouTubeVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
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

                    <Button className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                      Enroll Now
                    </Button>

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
                          <span>{totalVideos} lectures</span>
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
                  <span>{sections.length} sections • {totalVideos} lectures • {totalHours}h {totalMinutes}m total length</span>
                </div>
                
                {totalVideos > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {sections.map((section, sectionIndex) => (
                      <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex justify-between items-center w-full pr-4">
                            <span className="font-medium">{section.title}</span>
                            <span className="text-sm text-gray-600">
                              {section.videos.length} lectures • {Math.floor(section.duration / 60)}h {section.duration % 60}m
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 ml-4">
                            {section.videos.map((video) => (
                              <div key={video.id} className="flex items-center justify-between text-sm border-b pb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <Play className="h-3 w-3 text-gray-400" />
                                  <span className="flex-1">{video.title}</span>
                                  {video.is_preview && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleVideoPreview(video.video_url)}
                                      className="text-bjj-gold hover:text-bjj-gold-dark h-6 px-2"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Preview
                                    </Button>
                                  )}
                                </div>
                                <span className="text-gray-500 ml-2">{video.duration_minutes || 0} min</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
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

      {/* Video Player Modal */}
      {isPlayerOpen && selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo}
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
