
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Monitor
} from "lucide-react";

const CourseLanding = () => {
  const { courseId } = useParams();

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

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : "";
  };

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
                  <span className="text-gray-400">({course.total_students || 0} students)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.total_students || 0} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_hours || 0} hours</span>
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
                  <Certificate className="h-4 w-4" />
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="lg" className="bg-white text-black hover:bg-gray-100">
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
                          <span>{course.duration_hours || 0} hours on-demand video</span>
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
                          <Certificate className="h-4 w-4" />
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
                  {[
                    "Master fundamental BJJ techniques",
                    "Understand basic positions and transitions", 
                    "Learn effective submission holds",
                    "Develop proper defensive strategies",
                    "Build confidence on the mat",
                    "Improve physical conditioning"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-bjj-navy mb-4">Course content</h2>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <span>8 sections • 32 lectures • 5h 30m total length</span>
                </div>
                <div className="space-y-2">
                  {/* Sample course sections */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Introduction to Brazilian Jiu-Jitsu</h3>
                      <span className="text-sm text-gray-600">4 lectures • 30min</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Basic Positions</h3>
                      <span className="text-sm text-gray-600">6 lectures • 45min</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Fundamental Submissions</h3>
                      <span className="text-sm text-gray-600">8 lectures • 1h 15min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-bjj-navy mb-4">Requirements</h2>
                <ul className="space-y-2 text-sm">
                  <li>• No prior martial arts experience required</li>
                  <li>• A gi (Brazilian Jiu-Jitsu uniform) is recommended but not required for video lessons</li>
                  <li>• Willingness to learn and practice regularly</li>
                  <li>• Basic physical fitness (modifications provided for all levels)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-bjj-navy mb-4">Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    This comprehensive Brazilian Jiu-Jitsu course is designed for beginners who want to learn the art and science of BJJ. 
                    Whether you're completely new to martial arts or looking to add BJJ to your existing skillset, this course will provide 
                    you with a solid foundation in the fundamental techniques and concepts.
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
                    <p className="text-sm text-gray-600">BJJ Black Belt & Certified Instructor</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span>15+ years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students:</span>
                      <span>2,500+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courses:</span>
                      <span>8</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    With over 15 years of experience in Brazilian Jiu-Jitsu, our instructor has competed at the highest levels 
                    and is passionate about sharing the art with students of all backgrounds.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLanding;
