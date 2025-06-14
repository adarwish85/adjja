
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Download, Clock, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const StudentLMS = () => {
  const { user } = useAuth();

  // Fetch enrolled courses
  const { data: enrolledCourses, isLoading } = useQuery({
    queryKey: ['student-enrolled-courses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!student) return [];

      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            instructor,
            thumbnail_url,
            duration_hours,
            level,
            category,
            rating,
            total_videos
          )
        `)
        .eq('student_id', student.id)
        .eq('status', 'Active');

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch available courses (not enrolled)
  const { data: availableCourses } = useQuery({
    queryKey: ['available-courses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!student) return [];

      // Get enrolled course IDs
      const { data: enrolled } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('student_id', student.id)
        .eq('status', 'Active');

      const enrolledIds = enrolled?.map(e => e.course_id) || [];

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'Published')
        .not('id', 'in', `(${enrolledIds.join(',') || 'null'})`);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const getLevelBadge = (level: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{level}</Badge>;
  };

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Learning Management System</h1>
            <p className="text-bjj-gray">Access your courses, videos, and learning materials</p>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-bjj-navy">My Enrolled Courses</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
            </div>
          ) : enrolledCourses && enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment) => {
                const course = enrollment.courses as any;
                return (
                  <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      {course.thumbnail_url && (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                        {getLevelBadge(course.level)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-bjj-gray">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration_hours}h
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{enrollment.progress_percentage}%</span>
                        </div>
                        <Progress value={enrollment.progress_percentage} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-bjj-gray">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {course.rating || 'N/A'}
                        </div>
                        <span className="text-sm text-bjj-gray">{course.total_videos} videos</span>
                      </div>

                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        {enrollment.progress_percentage > 0 ? 'Continue' : 'Start'} Course
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-bjj-navy mb-2">No Enrolled Courses</h3>
                <p className="text-bjj-gray">You haven't enrolled in any courses yet. Browse available courses below!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Available Courses */}
        {availableCourses && availableCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-bjj-navy">Available Courses</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    {course.thumbnail_url && (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      {getLevelBadge(course.level)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-bjj-gray">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration_hours}h
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-bjj-gray">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {course.rating || 'N/A'}
                      </div>
                      <span className="text-sm text-bjj-gray">{course.total_videos} videos</span>
                    </div>

                    {course.price ? (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-bjj-gold mb-2">${course.price}</div>
                        <Button className="w-full">Enroll Now</Button>
                      </div>
                    ) : (
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        View Course
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentLMS;
