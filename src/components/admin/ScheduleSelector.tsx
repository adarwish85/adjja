
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

export const ScheduleSelector = ({ value, onChange }: ScheduleSelectorProps) => {
  // Parse existing schedule if it exists
  const parseSchedule = (schedule: string) => {
    if (!schedule) return { days: [], hour: "", minute: "", period: "" };
    
    // Try to parse format like "Mon, Wed, Fri - 6:00 AM"
    const parts = schedule.split(" - ");
    if (parts.length !== 2) return { days: [], hour: "", minute: "", period: "" };
    
    const daysPart = parts[0];
    const timePart = parts[1];
    
    const selectedDays = weekdays
      .filter(day => daysPart.includes(day.short))
      .map(day => day.id);
    
    const timeMatch = timePart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    if (!timeMatch) return { days: selectedDays, hour: "", minute: "", period: "" };
    
    return {
      days: selectedDays,
      hour: timeMatch[1],
      minute: timeMatch[2],
      period: timeMatch[3],
    };
  };

  const parsed = parseSchedule(value);
  const [selectedDays, setSelectedDays] = useState<string[]>(parsed.days);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(parsed.period);

  const updateSchedule = (days: string[], hour: string, minute: string, period: string) => {
    if (days.length === 0 || !hour || !minute || !period) {
      onChange("");
      return;
    }

    const dayStrings = days
      .map(dayId => weekdays.find(w => w.id === dayId)?.short)
      .filter(Boolean);
    
    const scheduleString = `${dayStrings.join(", ")} - ${hour}:${minute} ${period}`;
    onChange(scheduleString);
  };

  const handleDayChange = (dayId: string, checked: boolean) => {
    const newDays = checked 
      ? [...selectedDays, dayId]
      : selectedDays.filter(d => d !== dayId);
    
    setSelectedDays(newDays);
    updateSchedule(newDays, selectedHour, selectedMinute, selectedPeriod);
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'period', value: string) => {
    let newHour = selectedHour;
    let newMinute = selectedMinute;
    let newPeriod = selectedPeriod;

    if (type === 'hour') newHour = value;
    if (type === 'minute') newMinute = value;
    if (type === 'period') newPeriod = value;

    setSelectedHour(newHour);
    setSelectedMinute(newMinute);
    setSelectedPeriod(newPeriod);
    
    updateSchedule(selectedDays, newHour, newMinute, newPeriod);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-3 block">Select Days</Label>
        <div className="grid grid-cols-2 gap-2">
          {weekdays.map((day) => (
            <div key={day.id} className="flex items-center space-x-2">
              <Checkbox
                id={day.id}
                checked={selectedDays.includes(day.id)}
                onCheckedChange={(checked) => handleDayChange(day.id, !!checked)}
              />
              <Label htmlFor={day.id} className="text-sm">
                {day.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Select Time</Label>
        <div className="flex space-x-2">
          <Select value={selectedHour} onValueChange={(value) => handleTimeChange('hour', value)}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="flex items-center">:</span>

          <Select value={selectedMinute} onValueChange={(value) => handleTimeChange('minute', value)}>
            <SelectTrigger className="w-20">
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

          <Select value={selectedPeriod} onValueChange={(value) => handleTimeChange('period', value)}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
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
