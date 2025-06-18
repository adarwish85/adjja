
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { MobileAttendanceTracker } from "@/components/attendance/MobileAttendanceTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Clock } from "lucide-react";
import { useAttendanceStats } from "@/hooks/useAttendanceStats";

const CoachAttendanceTracker = () => {
  const { stats, loading } = useAttendanceStats();

  const totalStudents = stats.length;
  const averageAttendance = stats.length > 0 
    ? stats.reduce((acc, s) => acc + s.attendance_percentage, 0) / stats.length 
    : 0;
  const activeStreaks = stats.filter(s => s.current_streak > 0).length;

  return (
    <CoachLayout>
      <div className="p-4 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-bjj-navy mb-2">Attendance Tracker</h1>
          <p className="text-bjj-gray">Mark attendance with quick taps during class</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-bjj-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-bjj-navy">{totalStudents}</div>
              <div className="text-xs text-gray-500">Total Students</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-bjj-navy">
                {averageAttendance.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">Avg Attendance</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-bjj-navy">{activeStreaks}</div>
              <div className="text-xs text-gray-500">Active Streaks</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Attendance Tracker */}
        <MobileAttendanceTracker />
      </div>
    </CoachLayout>
  );
};

export default CoachAttendanceTracker;
