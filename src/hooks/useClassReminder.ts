
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getTodaySessions, ScheduledClassSession } from "@/utils/classScheduleUtils";

export const useClassReminder = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Fetch enrolled classes for the student
  const { data: enrolledClasses = [] } = useQuery({
    queryKey: ['todays-classes', user?.id, format(currentTime, 'yyyy-MM-dd')],
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
            duration,
            level,
            location
          )
        `)
        .eq('student_id', student.id)
        .eq('status', 'active');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Use the existing parsing utility to get today's sessions
  const todaysClasses = getTodaySessions(currentTime, enrolledClasses).map(session => ({
    id: session.classId,
    name: session.className,
    instructor: session.instructor,
    schedule: `${session.dayLabel} ${session.timeLabel}`,
    startTime: session.startTime,
    endTime: session.endTime,
    duration: Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))
  }));

  // Check if reminder should be shown (from 9 AM onwards on class day)
  const shouldShowReminder = todaysClasses.length > 0 && currentTime.getHours() >= 9;

  // Check if check-in is available for any class
  const getCheckInStatus = () => {
    const now = currentTime.getTime();
    
    for (const classItem of todaysClasses) {
      const classStart = classItem.startTime.getTime();
      const checkInClose = classItem.endTime.getTime() - (15 * 60 * 1000); // 15 mins before end
      
      if (now >= classStart && now <= checkInClose) {
        return {
          canCheckIn: true,
          activeClass: classItem,
          reason: null
        };
      }
    }

    // Find the next class today
    const nextClass = todaysClasses
      .filter(c => c.startTime.getTime() > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];

    if (nextClass) {
      return {
        canCheckIn: false,
        activeClass: null,
        reason: `Check-in opens at ${format(nextClass.startTime, 'h:mm a')}`
      };
    }

    // Check if we missed check-in window
    const missedClass = todaysClasses
      .filter(c => c.endTime.getTime() - (15 * 60 * 1000) < now)
      .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())[0];

    if (missedClass) {
      return {
        canCheckIn: false,
        activeClass: null,
        reason: 'Check-in window has closed'
      };
    }

    return {
      canCheckIn: false,
      activeClass: null,
      reason: 'No classes today'
    };
  };

  // Show notification at 9 AM (check every minute)
  useEffect(() => {
    if (shouldShowReminder && currentTime.getHours() === 9 && currentTime.getMinutes() === 0) {
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        const nextClass = todaysClasses[0];
        if (nextClass) {
          new Notification('BJJ Class Reminder', {
            body: `You have a ${nextClass.name} class today at ${format(nextClass.startTime, 'h:mm a')}`,
            icon: '/favicon.ico'
          });
        }
      }
    }
  }, [currentTime, shouldShowReminder, todaysClasses]);

  return {
    todaysClasses,
    shouldShowReminder,
    checkInStatus: getCheckInStatus(),
    currentTime
  };
};
