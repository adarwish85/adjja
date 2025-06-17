
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart3 } from "lucide-react";

const CoachAttendance = () => {
  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-bjj-navy">My Attendance</h1>
          <p className="text-bjj-gray">Track your attendance as a student</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy flex items-center gap-2">
                <Calendar className="h-5 w-5 text-bjj-gold" />
                Recent Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-bjj-gray">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent attendance records</p>
                <p className="text-xs">Your attendance will appear here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-bjj-gold" />
                Attendance Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-bjj-gray">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No stats available</p>
                <p className="text-xs">Statistics will appear as you attend classes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CoachLayout>
  );
};

export default CoachAttendance;
