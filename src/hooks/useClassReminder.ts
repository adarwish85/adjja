
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, parseISO } from "date-fns";

interface TodaysClass {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  startTime: Date;
  endTime: Date;
  duration: number;
}

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

  // Fetch today's classes for the student
  const { data: todaysClasses = [] } = useQuery({
    queryKey: ['todays-classes', user?.id, format(currentTime, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!user) return [];

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!student) return [];

      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select(`
          classes (
            id,
            name,
            instructor,
            schedule,
            duration
          )
        `)
        .eq('student_id', student.id)
        .eq('status', 'active');

      if (!enrollments) return [];

      // Parse schedules and find today's classes
      const today = format(currentTime, 'EEE'); // Get day name (Mon, Tue, etc.)
      const todaysClasses: TodaysClass[] = [];

      enrollments.forEach(enrollment => {
        const classData = enrollment.classes as any;
        if (!classData?.schedule) return;

        // Parse schedule format: "Mon/Wed/Fri 7:00 PM"
        const [days, time, period] = classData.schedule.split(' ');
        if (!days || !time || !period) return;

        const classDays = days.split('/');
        const isClassToday = classDays.some(day => 
          day.trim().toLowerCase().startsWith(today.toLowerCase())
        );

        if (isClassToday) {
          // Parse time
          const [hours, minutes] = time.split(':').map(Number);
          let hour24 = hours;
          if (period.toLowerCase() === 'pm' && hours !== 12) {
            hour24 += 12;
          } else if (period.toLowerCase() === 'am' && hours === 12) {
            hour24 = 0;
          }

          const startTime = new Date();
          startTime.setHours(hour24, minutes || 0, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + classData.duration);

          todaysClasses.push({
            id: classData.id,
            name: classData.name,
            instructor: classData.instructor,
            schedule: classData.schedule,
            startTime,
            endTime,
            duration: classData.duration
          });
        }
      });

      return todaysClasses;
    },
    enabled: !!user
  });

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
