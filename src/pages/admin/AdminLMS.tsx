
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LMSOverview } from "@/components/admin/lms/LMSOverview";
import { CourseManagement } from "@/components/admin/lms/CourseManagement";
import { ContentLibrary } from "@/components/admin/lms/ContentLibrary";
import { StudentProgress } from "@/components/admin/lms/StudentProgress";
import { LMSAnalytics } from "@/components/admin/lms/LMSAnalytics";
import { LMSSettings } from "@/components/admin/lms/LMSSettings";

const AdminLMS = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bjj-navy">Learning Management System</h1>
          <p className="text-bjj-gray">Manage courses, content, and student progress</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <LMSOverview />
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentLibrary />
          </TabsContent>

          <TabsContent value="progress">
            <StudentProgress />
          </TabsContent>

          <TabsContent value="analytics">
            <LMSAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <LMSSettings />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminLMS;
