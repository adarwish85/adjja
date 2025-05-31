
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { UpcomingClasses } from "@/components/dashboard/UpcomingClasses";
import { RecentPurchases } from "@/components/dashboard/RecentPurchases";
import { AdminTools } from "@/components/dashboard/AdminTools";

const SuperAdminDashboard = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bjj-navy">Dashboard</h1>
          <p className="text-bjj-gray">Welcome back, Admin</p>
        </div>
        
        <DashboardOverview />
        
        <div className="grid lg:grid-cols-2 gap-6">
          <AttendanceChart />
          <UpcomingClasses />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <RecentPurchases />
          <AdminTools />
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
