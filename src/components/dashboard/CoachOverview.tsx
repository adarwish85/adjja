
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp } from "lucide-react";

export const CoachOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray">
            Total Assigned Students
          </CardTitle>
          <div className="p-2 rounded-full bg-blue-100">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">No data available</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray">
            Upcoming Classes Today
          </CardTitle>
          <div className="p-2 rounded-full bg-green-100">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">No classes scheduled</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray">
            Attendance Rate This Week
          </CardTitle>
          <div className="p-2 rounded-full bg-yellow-100">
            <TrendingUp className="h-4 w-4 text-bjj-gold-dark" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">No data available</p>
        </CardContent>
      </Card>
    </div>
  );
};
