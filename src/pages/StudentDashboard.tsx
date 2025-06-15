
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { StudentWelcome } from "@/components/dashboard/StudentWelcome";
import { StudentAnalytics } from "@/components/dashboard/StudentAnalytics";
import { StudentProgress } from "@/components/dashboard/StudentProgress";
import { StudentLMS } from "@/components/dashboard/StudentLMS";
import { StudentSchedule } from "@/components/dashboard/StudentSchedule";
import { StudentAchievements } from "@/components/dashboard/StudentAchievements";
import { LMSPurchase } from "@/components/dashboard/LMSPurchase";
import { StudentCheckInButton } from "@/components/attendance/StudentCheckInButton";
import { QuotaDisplay } from "@/components/attendance/QuotaDisplay";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";

const StudentDashboard = () => {
  const { studentQuota } = useSmartAttendance();

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header with Welcome and Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <StudentWelcome />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:pt-6">
            <QuotaDisplay quota={studentQuota} compact />
            <StudentCheckInButton />
          </div>
        </div>
        
        {/* Analytics Section */}
        <StudentAnalytics />
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <StudentProgress />
          <StudentLMS />
        </div>
        
        {/* Secondary Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StudentSchedule />
          </div>
          <div className="space-y-6">
            <StudentAchievements />
            <LMSPurchase />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
