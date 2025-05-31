
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleSelectorProps {
  value: string;
  onChange: (schedule: string) => void;
}

const weekdays = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const minutes = ["00", "15", "30", "45"];

interface DaySchedule {
  enabled: boolean;
  startHour: string;
  startMinute: string;
  startPeriod: string;
  endHour: string;
  endMinute: string;
  endPeriod: string;
}

export const ScheduleSelector = ({ value, onChange }: ScheduleSelectorProps) => {
  // Parse existing schedule if it exists
  const parseSchedule = (schedule: string) => {
    const defaultSchedule: Record<string, DaySchedule> = {};
    weekdays.forEach(day => {
      defaultSchedule[day.id] = {
        enabled: false,
        startHour: "",
        startMinute: "",
        startPeriod: "",
        endHour: "",
        endMinute: "",
        endPeriod: "",
      };
    });

    if (!schedule) return defaultSchedule;
    
    // Try to parse format like "Mon 6:00 AM - 7:00 AM, Wed 7:00 PM - 8:30 PM"
    const daySchedules = schedule.split(", ");
    
    daySchedules.forEach(daySchedule => {
      const parts = daySchedule.split(" ");
      if (parts.length >= 5) {
        const dayShort = parts[0];
        const startTime = parts[1];
        const startPeriod = parts[2];
        // parts[3] is "-"
        const endTime = parts[4];
        const endPeriod = parts[5];
        
        const day = weekdays.find(w => w.short === dayShort);
        if (day && startTime && endTime) {
          const [startHour, startMinute] = startTime.split(":");
          const [endHour, endMinute] = endTime.split(":");
          
          if (startHour && startMinute && endHour && endMinute) {
            defaultSchedule[day.id] = {
              enabled: true,
              startHour,
              startMinute,
              startPeriod: startPeriod || "",
              endHour,
              endMinute,
              endPeriod: endPeriod || "",
            };
          }
        }
      }
    });
    
    return defaultSchedule;
  };

  const [daySchedules, setDaySchedules] = useState<Record<string, DaySchedule>>(parseSchedule(value));

  const updateSchedule = (schedules: Record<string, DaySchedule>) => {
    const enabledDays = Object.entries(schedules)
      .filter(([_, schedule]) => schedule.enabled && 
        schedule.startHour && schedule.startMinute && schedule.startPeriod &&
        schedule.endHour && schedule.endMinute && schedule.endPeriod)
      .map(([dayId, schedule]) => {
        const day = weekdays.find(w => w.id === dayId);
        if (!day) return null;
        
        return `${day.short} ${schedule.startHour}:${schedule.startMinute} ${schedule.startPeriod} - ${schedule.endHour}:${schedule.endMinute} ${schedule.endPeriod}`;
      })
      .filter(Boolean);
    
    const scheduleString = enabledDays.join(", ");
    onChange(scheduleString);
  };

  const handleDayToggle = (dayId: string, enabled: boolean) => {
    const newSchedules = {
      ...daySchedules,
      [dayId]: {
        ...daySchedules[dayId],
        enabled,
      }
    };
    setDaySchedules(newSchedules);
    updateSchedule(newSchedules);
  };

  const handleTimeChange = (dayId: string, field: keyof DaySchedule, value: string) => {
    const newSchedules = {
      ...daySchedules,
      [dayId]: {
        ...daySchedules[dayId],
        [field]: value,
      }
    };
    setDaySchedules(newSchedules);
    updateSchedule(newSchedules);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-3 block">Select Days and Times</Label>
        <div className="space-y-3">
          {weekdays.map((day) => (
            <div key={day.id} className="border rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id={day.id}
                  checked={daySchedules[day.id]?.enabled || false}
                  onCheckedChange={(checked) => handleDayToggle(day.id, !!checked)}
                />
                <Label htmlFor={day.id} className="text-sm font-medium">
                  {day.label}
                </Label>
              </div>
              
              {daySchedules[day.id]?.enabled && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 min-w-[40px]">From:</span>
                    <Select 
                      value={daySchedules[day.id]?.startHour || ""} 
                      onValueChange={(value) => handleTimeChange(day.id, 'startHour', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="Hr" />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span>:</span>

                    <Select 
                      value={daySchedules[day.id]?.startMinute || ""} 
                      onValueChange={(value) => handleTimeChange(day.id, 'startMinute', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((minute) => (
                          <SelectItem key={minute} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={daySchedules[day.id]?.startPeriod || ""} 
                      onValueChange={(value) => handleTimeChange(day.id, 'startPeriod', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 min-w-[40px]">To:</span>
                    <Select 
                      value={daySchedules[day.id]?.endHour || ""} 
                      onValueChange={(value) => handleTimeChange(day.id, 'endHour', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="Hr" />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span>:</span>

                    <Select 
                      value={daySchedules[day.id]?.endMinute || ""} 
                      onValueChange={(value) => handleTimeChange(day.id, 'endMinute', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((minute) => (
                          <SelectItem key={minute} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={daySchedules[day.id]?.endPeriod || ""} 
                      onValueChange={(value) => handleTimeChange(day.id, 'endPeriod', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {value && (
        <div className="text-sm text-bjj-gray">
          Schedule: <span className="font-medium">{value}</span>
        </div>
      )}
    </div>
  );
};
