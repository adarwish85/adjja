
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLMSAnalytics = () => {
  const { data: lmsStats } = useQuery({
    queryKey: ['lms-analytics'],
    queryFn: async () => {
      const { data: courses } = await supabase
        .from('courses')
        .select('*');

      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('*, students(*), courses(*)');

      const { data: contentItems } = await supabase
        .from('content_library')
        .select('*');

      const { data: videoProgress } = await supabase
        .from('video_progress')
        .select('*');

      // Course performance metrics
      const courseStats = courses?.map(course => {
        const courseEnrollments = enrollments?.filter(e => e.course_id === course.id) || [];
        const completedEnrollments = courseEnrollments.filter(e => e.status === 'Completed');
        const avgProgress = courseEnrollments.length > 0 
          ? courseEnrollments.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) / courseEnrollments.length
          : 0;

        return {
          ...course,
          enrollmentCount: courseEnrollments.length,
          completionRate: courseEnrollments.length > 0 ? (completedEnrollments.length / courseEnrollments.length) * 100 : 0,
          averageProgress: avgProgress
        };
      }) || [];

      // Student engagement metrics
      const totalWatchTime = videoProgress?.reduce((acc, vp) => acc + (vp.watch_time_seconds || 0), 0) || 0;
      const completedVideos = videoProgress?.filter(vp => vp.completed).length || 0;
      const totalVideos = videoProgress?.length || 0;

      // Monthly enrollment trends
      const enrollmentTrends = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthEnrollments = enrollments?.filter(enrollment => {
          const enrollmentDate = new Date(enrollment.enrollment_date);
          return enrollmentDate >= monthStart && enrollmentDate <= monthEnd;
        }) || [];

        enrollmentTrends.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          enrollments: monthEnrollments.length
        });
      }

      return {
        totalCourses: courses?.length || 0,
        totalEnrollments: enrollments?.length || 0,
        activeStudents: enrollments?.filter(e => e.status === 'Active').length || 0,
        completedCourses: enrollments?.filter(e => e.status === 'Completed').length || 0,
        totalContentItems: contentItems?.length || 0,
        totalRevenue: courses?.reduce((acc, course) => acc + ((course.price || 0) * (course.total_students || 0)), 0) || 0,
        averageProgress: enrollments?.length > 0 
          ? enrollments.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) / enrollments.length 
          : 0,
        completionRate: enrollments?.length > 0 
          ? (enrollments.filter(e => e.status === 'Completed').length / enrollments.length) * 100
          : 0,
        totalWatchTimeHours: Math.round(totalWatchTime / 3600),
        videoCompletionRate: totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0,
        courseStats,
        enrollmentTrends,
        topPerformingCourses: courseStats.sort((a, b) => b.enrollmentCount - a.enrollmentCount).slice(0, 5)
      };
    }
  });

  return {
    data: lmsStats,
    isLoading: !lmsStats
  };
};
