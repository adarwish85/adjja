
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Plus, CalendarDays } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { useState } from "react";

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

  // Generate week view
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Mock upcoming sessions - in real app, parse schedule field from classes
  const getUpcomingSessions = () => {
    if (!enrolledClasses) return [];
    
    // Mock schedule parsing - in real app, parse the schedule field properly
    const sessions = enrolledClasses.flatMap(enrollment => {
      const classData = enrollment.classes as any;
      // Mock: assume schedule is "Mon/Wed/Fri 7:00 PM" format
      const scheduleParts = classData.schedule?.split(' ') || [];
      const days = scheduleParts[0]?.split('/') || [];
      const time = scheduleParts[1] || '7:00';
      const period = scheduleParts[2] || 'PM';
      
      return days.map((day: string) => ({
        id: `${enrollment.id}-${day}`,
        classId: classData.id,
        className: classData.name,
        instructor: classData.instructor,
        location: classData.location,
        time: `${time} ${period}`,
        duration: classData.duration,
        level: classData.level,
        day: day.trim(),
        dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day.substring(0, 3))
      }));
    });

    return sessions;
  };

  const upcomingSessions = getUpcomingSessions();

  const getSessionsForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    return upcomingSessions.filter(session => session.dayOfWeek === dayOfWeek);
  };

  const nextSession = upcomingSessions.find(session => {
    const today = new Date();
    const sessionDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()];
    return session.day.startsWith(sessionDay.substring(0, 3));
  });

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
                      {nextSession.time}
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

        {/* Week View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                >
                  Previous Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                >
                  Next Week
                </Button>
              </div>
            </div>
            <CardDescription>
              Week of {format(weekStart, 'MMM dd, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => {
                const sessionsForDay = getSessionsForDate(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg min-h-[120px] ${
                      isToday ? 'border-bjj-gold bg-bjj-gold/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-center mb-2">
                      <div className="text-xs font-medium text-bjj-gray">
                        {format(day, 'EEE')}
                      </div>
                      <div className={`text-lg font-bold ${
                        isToday ? 'text-bjj-gold' : 'text-bjj-navy'
                      }`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {sessionsForDay.map(session => (
                        <div
                          key={session.id}
                          className="bg-bjj-navy text-white p-2 rounded text-xs"
                        >
                          <div className="font-medium truncate">{session.className}</div>
                          <div className="text-bjj-gold">{session.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
            ) : enrolledClasses && enrolledClasses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {enrolledClasses.map((enrollment) => {
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
