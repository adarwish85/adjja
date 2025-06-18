
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BarChart3, Users, TrendingUp, Clock, Smartphone } from "lucide-react";
import { useAttendanceStats } from "@/hooks/useAttendanceStats";
import { useNavigate } from "react-router-dom";

const CoachAttendance = () => {
  const navigate = useNavigate();
  const { stats, loading } = useAttendanceStats();

  const totalStudents = stats.length;
  const averageAttendance = stats.length > 0 
    ? stats.reduce((acc, s) => acc + s.attendance_percentage, 0) / stats.length 
    : 0;
  const topPerformers = stats.filter(s => s.attendance_percentage >= 90).length;

  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-bjj-navy">Attendance Management</h1>
          <p className="text-bjj-gray">Track student attendance and engagement</p>
        </div>

        {/* Quick Action Card */}
        <Card className="mb-6 border-bjj-gold border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-bjj-navy mb-2">Mobile Attendance Tracker</h3>
                <p className="text-bjj-gray mb-4">Start a session and mark attendance with quick taps</p>
                <Button 
                  onClick={() => navigate('/coach/attendance-tracker')}
                  className="bg-bjj-gold hover:bg-bjj-gold-dark"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </div>
              <div className="text-6xl opacity-20">
                📱
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-bjj-navy flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-bjj-gold" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-bjj-navy">{totalStudents}</div>
              <p className="text-sm text-bjj-gray">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-bjj-navy flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Average Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-bjj-navy">{averageAttendance.toFixed(1)}%</div>
              <p className="text-sm text-bjj-gray">Overall rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-bjj-navy flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-blue-500" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-bjj-navy">{topPerformers}</div>
              <p className="text-sm text-bjj-gray">90%+ attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-bjj-navy flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Active Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-bjj-navy">
                {stats.filter(s => s.current_streak > 0).length}
              </div>
              <p className="text-sm text-bjj-gray">Current streaks</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-bjj-gold" />
              Student Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-bjj-gray">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Loading attendance data...</p>
              </div>
            ) : stats.length > 0 ? (
              <div className="space-y-3">
                {stats.slice(0, 10).map((student) => (
                  <div key={student.student_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-bjj-navy">{student.name}</div>
                      <div className="text-sm text-bjj-gray">
                        {student.attended_sessions}/{student.total_sessions} sessions
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={student.attendance_percentage >= 90 ? "default" : student.attendance_percentage >= 70 ? "secondary" : "destructive"}
                      >
                        {student.attendance_percentage.toFixed(0)}%
                      </Badge>
                      {student.current_streak > 0 && (
                        <Badge variant="outline" className="text-bjj-gold border-bjj-gold">
                          🔥 {student.current_streak}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-bjj-gray">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No attendance data available</p>
                <p className="text-xs">Start tracking attendance with the mobile tracker</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CoachLayout>
  );
};

export default CoachAttendance;
