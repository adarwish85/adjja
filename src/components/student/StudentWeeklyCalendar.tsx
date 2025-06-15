
import { CalendarDays } from "lucide-react";
import { format, isSameDay, startOfWeek, addDays } from "date-fns";
import { ScheduledClassSession } from "@/utils/classScheduleUtils";
import { Button } from "@/components/ui/button";

interface Props {
  weekStart: Date;
  selectedDate: Date;
  onDateChange: (newDate: Date) => void;
  sessionsByDay: Record<number, ScheduledClassSession[]>;
}

export function StudentWeeklyCalendar({
  weekStart,
  selectedDate,
  onDateChange,
  sessionsByDay,
}: Props) {
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  );

  return (
    <div className="rounded-xl border bg-white shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-bjj-navy" />
          <span className="font-bold text-lg text-bjj-navy">Weekly Schedule</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(addDays(selectedDate, -7))}
          >
            Previous Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(addDays(selectedDate, 7))}
          >
            Next Week
          </Button>
        </div>
      </div>
      <div className="mb-2 text-bjj-gray">
        Week of {format(weekStart, "MMM dd, yyyy")}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, idx) => {
          const dayClasses = sessionsByDay[day.getDay()];
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={idx}
              className={`p-3 border rounded-lg min-h-[100px] flex flex-col ${
                isToday
                  ? "border-bjj-gold bg-bjj-gold/5"
                  : "border-gray-200"
              }`}
            >
              <div className="text-center mb-2">
                <div className="text-xs font-medium text-bjj-gray">
                  {format(day, "EEE")}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isToday ? "text-bjj-gold" : "text-bjj-navy"
                  }`}
                >
                  {format(day, "d")}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {dayClasses && dayClasses.length > 0 ? (
                  dayClasses.map(cls => (
                    <div
                      key={cls.classId + cls.timeLabel}
                      className="bg-bjj-navy text-white p-2 rounded text-xs font-medium whitespace-nowrap overflow-hidden"
                      title={cls.className}
                    >
                      <div className="truncate">{cls.className}</div>
                      <div className="text-bjj-gold">{cls.timeLabel}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-bjj-gray text-xs text-center opacity-70">
                    &nbsp;
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
