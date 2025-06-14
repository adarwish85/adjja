
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { AttendanceManager } from "@/components/admin/AttendanceManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceAnalyticsComponent } from "@/components/admin/analytics/AttendanceAnalyticsComponent";
import { Calendar, FileText, Users } from "lucide-react";

const AdminAttendance = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bjj-navy">Attendance Management</h1>
        </div>
        
        <Tabs defaultValue="record">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="record">
              <Calendar className="h-4 w-4 mr-2" />
              Record Attendance
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <FileText className="h-4 w-4 mr-2" />
              Attendance Analytics
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Users className="h-4 w-4 mr-2" />
              Student Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="mt-6">
            <AttendanceManager />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <AttendanceAnalyticsComponent />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Individual Student Reports</h3>
                  <p className="text-bjj-gray">
                    View detailed attendance history and analytics for each student.
                    <br />
                    Select a student from the list to view their report.
                  </p>
                </div>
                {/* This section would be implemented with individual student attendance reports */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminAttendance;
