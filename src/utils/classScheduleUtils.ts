
import { addMinutes, format, isSameDay, startOfWeek, addDays, getDay, set } from "date-fns";

type ClassSchedule = string; // Example: "Sun/Tue 8:00 PM"
type ClassData = {
  id: string;
  name: string;
  instructor: string;
  location: string;
  schedule: ClassSchedule;
  duration: number;
  level: string;
};

export type ScheduledClassSession = {
  enrollmentId: string;
  classId: string;
  className: string;
  instructor: string;
  level: string;
  location: string;
  dayOfWeek: number;
  dayLabel: string;
  startTime: Date;
  endTime: Date;
  timeLabel: string;
};

const dayNameToIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function parseClassSchedule(
  enrollmentId: string,
  classData: ClassData,
  rangeStart: Date,
  rangeEnd: Date,
  localTz = true
): ScheduledClassSession[] {
  if (!classData.schedule) return [];
  // Parse schedule string: e.g., "Sun/Tue 8:00 PM"
  const parts = classData.schedule.split(" ");
  if (parts.length < 2) return [];
  const [days, time, period] = [parts[0], parts[1], parts[2] || "PM"];
  const dayList = days.split("/").map(day => day.trim().substring(0, 3));
  if (!time || !period) return [];
  // Generate all class sessions between rangeStart and rangeEnd
  const sessions: ScheduledClassSession[] = [];
  let curr = startOfWeek(rangeStart, { weekStartsOn: 0 });
  while (curr <= rangeEnd) {
    for (let dayAbbr of dayList) {
      if (!dayNameToIndex.hasOwnProperty(dayAbbr)) continue;
      const thisDay = addDays(curr, (dayNameToIndex[dayAbbr] - getDay(curr) + 7) % 7);
      if (thisDay < rangeStart || thisDay > rangeEnd) continue;
      // Parse time - e.g., "8:00" and "PM"
      const [hourStr, minStr] = time.split(":");
      let hour = Number(hourStr);
      const min = minStr ? Number(minStr) : 0;
      let hour24 = hour;
      if (period.toUpperCase() === "PM" && hour !== 12) hour24 += 12;
      if (period.toUpperCase() === "AM" && hour === 12) hour24 = 0;
      // Build start/end time
      let base = set(thisDay, { hours: hour24, minutes: min, seconds: 0, milliseconds: 0 });
      if (localTz) {
        // do nothing, base uses local timezone
      }
      const session: ScheduledClassSession = {
        enrollmentId,
        classId: classData.id,
        className: classData.name,
        instructor: classData.instructor,
        location: classData.location,
        dayOfWeek: getDay(base),
        dayLabel: format(base, "EEE"),
        level: classData.level,
        startTime: base,
        endTime: addMinutes(base, classData.duration),
        timeLabel: format(base, "h:mm a"),
      };
      // Push only if in week range (sometimes course end date logic can be added here)
      if (base >= rangeStart && base <= rangeEnd) {
        sessions.push(session);
      }
    }
    curr = addDays(curr, 7);
  }
  return sessions;
}

export function getSessionsByDay(rangeStart: Date, rangeEnd: Date, enrollments: any[]): Record<number, ScheduledClassSession[]> {
  // rangeStart: start of week, rangeEnd: end, enrollments: returned from Supabase
  const sessions: ScheduledClassSession[] = [];
  for (const enrollment of enrollments) {
    const classData = enrollment.classes as any;
    sessions.push(
      ...parseClassSchedule(enrollment.id, classData, rangeStart, rangeEnd)
    );
  }
  // Group by getDay
  const byDay: Record<number, ScheduledClassSession[]> = {};
  for (let i = 0; i < 7; ++i) byDay[i] = [];
  for (const session of sessions) {
    byDay[session.dayOfWeek].push(session);
  }
  // Sort by time
  for (let i = 0; i < 7; ++i) {
    byDay[i].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }
  return byDay;
}

export function getTodaySessions(today: Date, enrollments: any[]): ScheduledClassSession[] {
  // Get all sessions for today
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  const seen = new Set(); // avoid duplicates
  let sessions: ScheduledClassSession[] = [];
  for (const enrollment of enrollments) {
    const classData = enrollment.classes as any;
    for (let session of parseClassSchedule(enrollment.id, classData, start, end)) {
      // Prevent duplicates for classes with multiple slots
      if (!seen.has(session.classId + session.timeLabel)) {
        seen.add(session.classId + session.timeLabel);
        sessions.push(session);
      }
    }
  }
  // Sort by start time
  sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return sessions;
}
