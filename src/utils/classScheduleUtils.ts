
import { addMinutes, format, isSameDay, startOfWeek, addDays, getDay, set, parse } from "date-fns";

type ClassSchedule = string; // Example: "Tue 8:00 PM - 9:30 PM, Sun 8:00 PM - 9:30 PM"
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
  if (!classData.schedule) {
    console.log(`No schedule found for class ${classData.name}`);
    return [];
  }

  console.log(`Parsing schedule for ${classData.name}: "${classData.schedule}"`);
  
  const sessions: ScheduledClassSession[] = [];
  
  // Handle new format: "Tue 8:00 PM - 9:30 PM, Sun 8:00 PM - 9:30 PM"
  if (classData.schedule.includes(' - ')) {
    const scheduleSlots = classData.schedule.split(',').map(slot => slot.trim());
    console.log(`Found ${scheduleSlots.length} schedule slots:`, scheduleSlots);
    
    for (const slot of scheduleSlots) {
      // Parse format: "Tue 8:00 PM - 9:30 PM"
      const match = slot.match(/^(\w{3})\s+(\d{1,2}:\d{2}\s+[AP]M)\s+-\s+(\d{1,2}:\d{2}\s+[AP]M)$/);
      
      if (!match) {
        console.log(`Could not parse schedule slot: "${slot}"`);
        continue;
      }
      
      const [, dayAbbr, startTimeStr, endTimeStr] = match;
      console.log(`Parsed slot - Day: ${dayAbbr}, Start: ${startTimeStr}, End: ${endTimeStr}`);
      
      if (!dayNameToIndex.hasOwnProperty(dayAbbr)) {
        console.log(`Unknown day abbreviation: ${dayAbbr}`);
        continue;
      }
      
      // Generate sessions for this day/time across the date range
      let curr = startOfWeek(rangeStart, { weekStartsOn: 0 });
      while (curr <= rangeEnd) {
        const dayIndex = dayNameToIndex[dayAbbr];
        const thisDay = addDays(curr, (dayIndex - getDay(curr) + 7) % 7);
        
        if (thisDay < rangeStart || thisDay > rangeEnd) {
          curr = addDays(curr, 7);
          continue;
        }
        
        // Parse start time
        const startTime = parseTimeString(thisDay, startTimeStr);
        const endTime = parseTimeString(thisDay, endTimeStr);
        
        if (!startTime || !endTime) {
          console.log(`Failed to parse times for ${dayAbbr}: ${startTimeStr} - ${endTimeStr}`);
          curr = addDays(curr, 7);
          continue;
        }
        
        const session: ScheduledClassSession = {
          enrollmentId,
          classId: classData.id,
          className: classData.name,
          instructor: classData.instructor,
          location: classData.location,
          dayOfWeek: getDay(startTime),
          dayLabel: format(startTime, "EEE"),
          level: classData.level,
          startTime: startTime,
          endTime: endTime,
          timeLabel: format(startTime, "h:mm a"),
        };
        
        console.log(`Created session for ${session.dayLabel} ${session.timeLabel} - ${format(endTime, "h:mm a")}`);
        sessions.push(session);
        
        curr = addDays(curr, 7);
      }
    }
  } else {
    // Handle legacy format: "Sun/Tue 8:00 PM"
    console.log(`Using legacy format parser for: ${classData.schedule}`);
    const parts = classData.schedule.split(" ");
    if (parts.length < 2) {
      console.log(`Invalid legacy schedule format: ${classData.schedule}`);
      return [];
    }
    
    const [days, time, period] = [parts[0], parts[1], parts[2] || "PM"];
    const dayList = days.split("/").map(day => day.trim().substring(0, 3));
    
    if (!time || !period) {
      console.log(`Invalid time format in legacy schedule: ${time} ${period}`);
      return [];
    }
    
    // Generate sessions for legacy format
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
        
        if (base >= rangeStart && base <= rangeEnd) {
          sessions.push(session);
        }
      }
      curr = addDays(curr, 7);
    }
  }
  
  console.log(`Generated ${sessions.length} sessions for ${classData.name}`);
  return sessions;
}

function parseTimeString(baseDate: Date, timeStr: string): Date | null {
  try {
    // Parse format like "8:00 PM"
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s+([AP]M)$/);
    if (!match) return null;
    
    const [, hourStr, minStr, period] = match;
    let hour = Number(hourStr);
    const min = Number(minStr);
    
    // Convert to 24-hour format
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    
    return set(baseDate, { hours: hour, minutes: min, seconds: 0, milliseconds: 0 });
  } catch (error) {
    console.error(`Error parsing time string "${timeStr}":`, error);
    return null;
  }
}

export function getSessionsByDay(rangeStart: Date, rangeEnd: Date, enrollments: any[]): Record<number, ScheduledClassSession[]> {
  console.log(`Getting sessions for range ${format(rangeStart, 'yyyy-MM-dd')} to ${format(rangeEnd, 'yyyy-MM-dd')}`);
  console.log(`Processing ${enrollments.length} enrollments`);
  
  // rangeStart: start of week, rangeEnd: end, enrollments: returned from Supabase
  const sessions: ScheduledClassSession[] = [];
  for (const enrollment of enrollments) {
    const classData = enrollment.classes as any;
    console.log(`Processing enrollment for class: ${classData?.name}, schedule: ${classData?.schedule}`);
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
  
  console.log(`Total sessions by day:`, Object.fromEntries(
    Object.entries(byDay).map(([day, sessions]) => [day, sessions.length])
  ));
  
  return byDay;
}

export function getTodaySessions(today: Date, enrollments: any[]): ScheduledClassSession[] {
  console.log(`Getting today's sessions for ${format(today, 'yyyy-MM-dd (EEEE)')}`);
  console.log(`Processing ${enrollments.length} enrollments for today`);
  
  // Get all sessions for today
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  
  const seen = new Set(); // avoid duplicates
  let sessions: ScheduledClassSession[] = [];
  for (const enrollment of enrollments) {
    const classData = enrollment.classes as any;
    console.log(`Checking enrollment for today - Class: ${classData?.name}, Schedule: ${classData?.schedule}`);
    
    for (let session of parseClassSchedule(enrollment.id, classData, start, end)) {
      console.log(`Found session for today: ${session.className} at ${session.timeLabel} on ${session.dayLabel}`);
      // Prevent duplicates for classes with multiple slots
      if (!seen.has(session.classId + session.timeLabel)) {
        seen.add(session.classId + session.timeLabel);
        sessions.push(session);
      }
    }
  }
  
  // Sort by start time
  sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  console.log(`Found ${sessions.length} sessions for today`);
  return sessions;
}
