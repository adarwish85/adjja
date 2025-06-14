
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Target, Calendar, BookOpen, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentProgress = () => {
  const { user } = useAuth();
  const { studentQuota } = useSmartAttendance();

  // Fetch progress data
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['student-progress', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!student) return null;

      // Get attendance data for progress tracking
      const { data: attendanceRecords } = await supabase
        .from('attendance_records')
        .select('attendance_date, status')
        .eq('student_id', student.id)
        .order('attendance_date', { ascending: true });

      // Get course progress
      const { data: courseProgress } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (title, total_videos)
        `)
        .eq('student_id', student.id)
        .eq('status', 'Active');

      return {
        student,
        attendanceRecords: attendanceRecords || [],
        courseProgress: courseProgress || []
      };
    },
    enabled: !!user
  });

  // Calculate attendance trend data
  const attendanceTrendData = progressData?.attendanceRecords.reduce((acc: any[], record) => {
    const date = new Date(record.attendance_date).toLocaleDateString();
    const existingEntry = acc.find(entry => entry.date === date);
    
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    
    return acc;
  }, []) || [];

  // Calculate stats
  const totalClasses = progressData?.attendanceRecords.length || 0;
  const presentClasses = progressData?.attendanceRecords.filter(r => r.status === 'present').length || 0;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
  
  const quotaProgress = studentQuota?.is_unlimited 
    ? 100 
    : studentQuota?.total_classes 
      ? Math.round(((studentQuota.used_classes || 0) / studentQuota.total_classes) * 100)
      : 0;

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">My Progress</h1>
            <p className="text-bjj-gray">Track your learning journey and achievements</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Total Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-bjj-navy">{totalClasses}</div>
                  <p className="text-xs text-bjj-gray">Classes attended</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Attendance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-bjj-navy">{attendanceRate}%</div>
                  <p className="text-xs text-bjj-gray">Present vs total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Quota Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-bjj-gold">
                    {studentQuota?.is_unlimited ? '∞' : `${quotaProgress}%`}
                  </div>
                  <p className="text-xs text-bjj-gray">
                    {studentQuota?.is_unlimited ? 'Unlimited plan' : 'Of monthly quota'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Belt Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-bjj-navy">
                    {progressData?.student.belt || 'White'}
                  </div>
                  <p className="text-xs text-bjj-gray">
                    {progressData?.student.stripes || 0} stripes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Attendance Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Monthly Quota Progress
                  </CardTitle>
                  <CardDescription>
                    Your progress toward monthly class quota
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!studentQuota?.is_unlimited ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-bjj-navy mb-2">
                          {studentQuota?.used_classes || 0} / {studentQuota?.total_classes || 0}
                        </div>
                        <p className="text-bjj-gray">Classes used this month</p>
                      </div>
                      <Progress value={quotaProgress} className="h-3" />
                      <div className="flex justify-between text-sm text-bjj-gray">
                        <span>Used: {studentQuota?.used_classes || 0}</span>
                        <span>Remaining: {studentQuota?.remaining_classes || 0}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-bjj-gold mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-bjj-navy mb-2">Unlimited Plan</h3>
                      <p className="text-bjj-gray">You have unlimited access to all classes!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Attendance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Attendance Trend
                  </CardTitle>
                  <CardDescription>
                    Your class attendance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {attendanceTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={attendanceTrendData.slice(-10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#f6ad24" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
                      <p className="text-bjj-gray">No attendance data yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Progress
                </CardTitle>
                <CardDescription>
                  Your progress in enrolled courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {progressData?.courseProgress && progressData.courseProgress.length > 0 ? (
                  <div className="space-y-4">
                    {progressData.courseProgress.map((enrollment) => {
                      const course = enrollment.courses as any;
                      return (
                        <div key={enrollment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{course.title}</h4>
                            <Badge variant="outline">{enrollment.progress_percentage}% Complete</Badge>
                          </div>
                          <Progress value={enrollment.progress_percentage} className="mb-2" />
                          <div className="flex justify-between text-sm text-bjj-gray">
                            <span>Started: {new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                            <span>{course.total_videos} videos total</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-bjj-navy mb-2">No Courses Enrolled</h3>
                    <p className="text-bjj-gray">Enroll in courses to track your learning progress</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentProgress;
