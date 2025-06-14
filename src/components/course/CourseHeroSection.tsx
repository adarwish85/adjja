
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Download, 
  Award,
  Globe,
  Smartphone,
  Monitor,
  ArrowLeft
} from "lucide-react";

interface CourseHeroSectionProps {
  course: any;
  totalHours: number;
  totalMinutes: number;
  totalLessons: number;
  studentCount: number;
  featuredImage: string | null;
  introVideo: string | null;
  isEnrolled: boolean;
  enrollInCourse: any;
  onPreviewCourse: () => void;
  onEnrollment: () => void;
  onNavigateBack: () => void;
  onNavigateToCourse: () => void;
}

export const CourseHeroSection: React.FC<CourseHeroSectionProps> = ({
  course,
  totalHours,
  totalMinutes,
  totalLessons,
  studentCount,
  featuredImage,
  introVideo,
  isEnrolled,
  enrollInCourse,
  onPreviewCourse,
  onEnrollment,
  onNavigateBack,
  onNavigateToCourse,
}) => {
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={onNavigateBack}
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
                      onClick={onPreviewCourse}
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
                      onClick={onNavigateToCourse}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-white"
                      onClick={onEnrollment}
                      disabled={enrollInCourse.isPending}
                    >
                      {enrollInCourse.isPending ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  )}

                  <p className="text-xs text-center text-gray-600">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="border-t pt-4">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
