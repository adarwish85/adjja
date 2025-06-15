import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Plus, CalendarDays } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { useState, useMemo } from "react";
import { getTodaySessions, getSessionsByDay, ScheduledClassSession } from "@/utils/classScheduleUtils";
import { StudentWeeklyCalendar } from "@/components/student/StudentWeeklyCalendar";
import { StudentTodayClasses } from "@/components/student/StudentTodayClasses";

const StudentSchedule = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch enrolled classes
  const { data: enrolledClasses, isLoading } = useQuery({
    queryKey: ['student-schedule', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!student) return [];

      const { data, error } = await supabase
        .from('class_enrollments')
        .select(`
          *,
          classes (
            id,
            name,
            instructor,
            schedule,
            location,
            duration,
            level,
            capacity,
            enrolled
          )
        `)
        .eq('student_id', student.id)
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Always treat enrolledClasses as array for downstream logic.
  const safeEnrolledClasses = Array.isArray(enrolledClasses) ? enrolledClasses : [];

  // RANGE calculation
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = addDays(weekStart, 6);

  // Compute all class sessions for the calendar view
  const sessionsByDay = useMemo(
    () => getSessionsByDay(weekStart, weekEnd, safeEnrolledClasses),
    [weekStart, weekEnd, safeEnrolledClasses]
  );

  // For Today
  const todaySessions = useMemo(
    () => getTodaySessions(new Date(), safeEnrolledClasses),
    [safeEnrolledClasses]
  );

  // Next session logic (show next closest session)
  const now = new Date();
  const flatSessions = Object.values(sessionsByDay).flat();
  const nextSession = flatSessions
    .filter(session => session.startTime >= now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Schedule</h1>
            <p className="text-bjj-gray">View your class schedule and upcoming sessions</p>
          </div>
        </div>

        {/* Next Session Card */}
        {nextSession && (
          <Card className="border-bjj-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bjj-gold">
                <Clock className="h-5 w-5" />
                Next Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-bjj-navy">{nextSession.className}</h3>
                  <div className="flex items-center gap-4 mt-2 text-bjj-gray">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {nextSession.instructor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {nextSession.timeLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {nextSession.location}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">{nextSession.level}</Badge>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Today's Classes */}
        <StudentTodayClasses sessions={todaySessions} />
        
        {/* Weekly Calendar */}
        <StudentWeeklyCalendar
          weekStart={weekStart}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          sessionsByDay={sessionsByDay}
        />

        {/* All Enrolled Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              All Enrolled Classes
            </CardTitle>
            <CardDescription>
              Classes you're currently enrolled in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
              </div>
            ) : safeEnrolledClasses && safeEnrolledClasses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {safeEnrolledClasses.map((enrollment) => {
                  const classData = enrollment.classes as any;
                  return (
                    <Card key={enrollment.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{classData.name}</CardTitle>
                          <Badge variant="secondary">{classData.level}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-bjj-gray">
                            <User className="h-4 w-4" />
                            {classData.instructor}
                          </div>
                          <div className="flex items-center gap-1 text-bjj-gray">
                            <Clock className="h-4 w-4" />
                            {classData.duration}min
                          </div>
                          <div className="flex items-center gap-1 text-bjj-gray">
                            <MapPin className="h-4 w-4" />
                            {classData.location}
                          </div>
                          <div className="flex items-center gap-1 text-bjj-gray">
                            <Calendar className="h-4 w-4" />
                            {classData.schedule}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-bjj-gray">
                            {classData.enrolled}/{classData.capacity} enrolled
                          </span>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-bjj-navy mb-2">No Classes Enrolled</h3>
                <p className="text-bjj-gray mb-4">
                  You haven't enrolled in any classes yet. Contact your coach or admin to get enrolled.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Available Classes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentSchedule;
