
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsOverview } from "@/components/admin/analytics/AnalyticsOverview";
import { StudentAnalytics } from "@/components/admin/analytics/StudentAnalytics";
import { RevenueAnalytics } from "@/components/admin/analytics/RevenueAnalytics";
import { PerformanceAnalytics } from "@/components/admin/analytics/PerformanceAnalytics";
import { CustomReports } from "@/components/admin/analytics/CustomReports";

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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="students">
            <StudentAnalytics />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceAnalytics />
          </TabsContent>

          <TabsContent value="reports">
            <CustomReports />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminAnalytics;
