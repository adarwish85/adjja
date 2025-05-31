
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useState } from "react";

const todaysClasses = [
  { time: "6:00 AM", name: "Morning Fundamentals", students: 8, level: "Beginner" },
  { time: "12:00 PM", name: "Open Mat", students: 12, level: "All Levels" },
  { time: "6:00 PM", name: "Competition Team", students: 15, level: "Advanced" },
  { time: "7:30 PM", name: "No-Gi Basics", students: 10, level: "Intermediate" },
];

export const ClassCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Class Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-bjj-navy">Today's Classes</h3>
            {todaysClasses.map((cls, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-bjj-navy">{cls.name}</div>
                  <div className="text-sm text-bjj-gray">{cls.time} • {cls.students} students</div>
                </div>
                <Badge 
                  variant={cls.level === 'Beginner' ? 'secondary' : 
                           cls.level === 'Advanced' ? 'destructive' : 'default'}
                  className="text-xs"
                >
                  {cls.level}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
