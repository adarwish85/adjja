
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const UpcomingClasses = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy">Upcoming Classes</CardTitle>
        <p className="text-sm text-bjj-gray">Today's schedule across all branches</p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-bjj-gray">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No classes scheduled</p>
          <p className="text-xs">Classes will appear here when scheduled</p>
        </div>
      </CardContent>
    </Card>
  );
};
