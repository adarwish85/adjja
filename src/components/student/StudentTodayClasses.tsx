
import { Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduledClassSession } from "@/utils/classScheduleUtils";
import { format } from "date-fns";

export function StudentTodayClasses({
  sessions,
  onCheckIn,
  now = new Date(),
}: {
  sessions: ScheduledClassSession[];
  onCheckIn?: (cls: ScheduledClassSession) => void;
  now?: Date;
}) {
  if (!sessions || sessions.length === 0)
    return (
      <div className="rounded-xl border bg-white shadow p-6 mb-6">
        <div className="flex flex-col items-center gap-3 py-4">
          <Clock className="h-8 w-8 text-gray-300" />
          <div className="text-bjj-navy font-semibold text-lg">No classes scheduled today</div>
          <div className="text-bjj-gray text-sm">Enroll in a class to see it here.</div>
        </div>
      </div>
    );
  return (
    <div className="rounded-xl border bg-white shadow p-6 mb-6">
      <h2 className="font-bold text-bjj-navy text-xl mb-4">Today&apos;s Classes</h2>
      <div className="flex flex-col gap-4">
        {sessions.map(cls => {
          // Check-in allowed if now >= startTime and now < endTime - 15min
          const canCheckIn =
            now >= cls.startTime &&
            now <= new Date(cls.endTime.getTime() - 15 * 60 * 1000);
          return (
            <div key={cls.classId + cls.timeLabel} className="border rounded-lg p-4 flex justify-between items-center bg-bjj-navy/5">
              <div>
                <div className="text-lg font-bold text-bjj-navy">{cls.className}</div>
                <div className="flex items-center gap-4 mt-1 text-bjj-gray text-sm">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {cls.instructor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {cls.timeLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {cls.location}
                  </span>
                </div>
              </div>
              {onCheckIn ? (
                <Button
                  size="sm"
                  className="bg-bjj-gold text-white"
                  disabled={!canCheckIn}
                  onClick={() => onCheckIn(cls)}
                >
                  {canCheckIn ? "Check In" : "Not Open"}
                </Button>
              ) : (
                <span className="px-3 py-1 rounded-full bg-bjj-gold/10 text-bjj-gold text-xs font-semibold">
                  {format(cls.startTime, "h:mm a")} - {format(cls.endTime, "h:mm a")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
