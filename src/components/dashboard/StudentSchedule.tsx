
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const StudentSchedule = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Calendar className="h-5 w-5 text-bjj-gold" />
          Upcoming Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-bjj-gray">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No upcoming classes</p>
          <p className="text-xs">Enroll in classes to see your schedule here</p>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View Full Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
