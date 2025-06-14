
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Trophy } from "lucide-react";

export const StudentAnalytics = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray flex items-center justify-between">
            Attendance Rate
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">Last 30 days</p>
          <p className="text-xs font-medium mt-1 text-green-600">
            No data available
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray flex items-center justify-between">
            Classes This Month
            <Calendar className="h-4 w-4 text-bjj-gold-dark" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">Total attended</p>
          <p className="text-xs font-medium mt-1 text-bjj-gold-dark">
            No data available
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray flex items-center justify-between">
            LMS Hours
            <Clock className="h-4 w-4 text-blue-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">Time watched</p>
          <p className="text-xs font-medium mt-1 text-blue-600">
            No data available
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray flex items-center justify-between">
            Current Streak
            <Trophy className="h-4 w-4 text-purple-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">Days in a row</p>
          <p className="text-xs font-medium mt-1 text-purple-600">
            No data available
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
