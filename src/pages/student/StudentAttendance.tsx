
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { StudentCheckInButton } from "@/components/attendance/StudentCheckInButton";
import { QuotaDisplay } from "@/components/attendance/QuotaDisplay";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const StudentAttendance = () => {
  const { user } = useAuth();
  const { studentQuota, availableClasses } = useSmartAttendance();

  // Fetch student's attendance history
  const { data: attendanceHistory, isLoading } = useQuery({
    queryKey: ['student-attendance-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!student) return [];

      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          *,
          classes (name, instructor),
          checked_in_by_profile:profiles!checked_in_by (name)
        `)
        .eq('student_id', student.id)
        .order('attendance_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Present</Badge>;
      case 'absent':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case 'late':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Late</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Attendance</h1>
            <p className="text-bjj-gray">Track your class attendance and check-in status</p>
          </div>
          <div className="flex items-center gap-4">
            <QuotaDisplay quota={studentQuota} />
            <StudentCheckInButton />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {attendanceHistory?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {attendanceHistory?.filter(record => 
                  new Date(record.attendance_date).getMonth() === new Date().getMonth()
                ).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Remaining Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-gold">
                {studentQuota?.is_unlimited ? '∞' : studentQuota?.remaining_classes || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Classes for Check-in */}
        {availableClasses && availableClasses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Available Classes Today
              </CardTitle>
              <CardDescription>
                Classes you can check into today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {availableClasses.map((classItem) => (
                  <div
                    key={classItem.class_id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{classItem.class_name}</h4>
                      <p className="text-sm text-bjj-gray">
                        Instructor: {classItem.instructor} • {classItem.schedule}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {classItem.already_checked_in && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Checked In
                        </Badge>
                      )}
                      {!classItem.is_enrolled && (
                        <Badge variant="outline">Not Enrolled</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance History
            </CardTitle>
            <CardDescription>
              Your recent class attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
              </div>
            ) : attendanceHistory && attendanceHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Checked In By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.attendance_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{(record.classes as any)?.name || 'Unknown Class'}</TableCell>
                      <TableCell>{(record.classes as any)?.instructor || 'Unknown'}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {record.source === 'self' ? 'Self Check-in' : 
                           (record.checked_in_by_profile as any)?.name || 'Admin'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-bjj-navy mb-2">No Attendance Records</h3>
                <p className="text-bjj-gray">You haven't attended any classes yet. Check in to your first class!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentAttendance;
