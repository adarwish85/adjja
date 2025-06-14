import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { UpcomingClasses } from "@/components/dashboard/UpcomingClasses";
import { RecentPurchases } from "@/components/dashboard/RecentPurchases";
import { AdminTools } from "@/components/dashboard/AdminTools";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useState } from "react";
import { ManualCheckInModal } from "@/components/attendance/ManualCheckInModal";

const SuperAdminDashboard = () => {
  const [showManualCheckIn, setShowManualCheckIn] = useState(false);

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Dashboard</h1>
            <p className="text-bjj-gray">Welcome back, Admin</p>
          </div>
          <Button
            onClick={() => setShowManualCheckIn(true)}
            className="bg-bjj-red hover:bg-bjj-red/90"
          >
            <Users className="h-4 w-4 mr-2" />
            Quick Check-In
          </Button>
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

        <ManualCheckInModal 
          open={showManualCheckIn}
          onOpenChange={setShowManualCheckIn}
        />
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
