
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import { useState } from "react";

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
            <div className="text-center py-4 text-bjj-gray">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No classes scheduled today</p>
              <p className="text-xs">Classes will appear here when scheduled</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
