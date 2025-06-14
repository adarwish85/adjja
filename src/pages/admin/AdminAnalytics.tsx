
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";
import { StudentAnalyticsComponent } from "@/components/admin/analytics/StudentAnalyticsComponent";
import { RevenueAnalyticsComponent } from "@/components/admin/analytics/RevenueAnalyticsComponent";
import { AttendanceAnalyticsComponent } from "@/components/admin/analytics/AttendanceAnalyticsComponent";
import { ClassAnalyticsComponent } from "@/components/admin/analytics/ClassAnalyticsComponent";
import { BarChart, Users, Calendar, DollarSign, FileText } from "lucide-react";

const AdminAnalytics = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bjj-navy">Analytics & Reports</h1>
          <p className="text-bjj-gray">Comprehensive insights and performance metrics</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <BarChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="students">
              <Users className="h-4 w-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <Calendar className="h-4 w-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="students">
            <StudentAnalyticsComponent />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceAnalyticsComponent />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueAnalyticsComponent />
          </TabsContent>

          <TabsContent value="reports">
            <ClassAnalyticsComponent />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminAnalytics;
