
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { StudentWelcome } from "@/components/dashboard/StudentWelcome";
import { StudentAnalytics } from "@/components/dashboard/StudentAnalytics";
import { StudentProgress } from "@/components/dashboard/StudentProgress";
import { StudentLMS } from "@/components/dashboard/StudentLMS";
import { StudentSchedule } from "@/components/dashboard/StudentSchedule";
import { StudentAchievements } from "@/components/dashboard/StudentAchievements";
import { LMSPurchase } from "@/components/dashboard/LMSPurchase";
import { ProfileCompletionBar } from "@/components/dashboard/ProfileCompletionBar";

const StudentDashboard = () => {
  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Profile Completion Bar */}
        <ProfileCompletionBar />
        
        {/* Welcome Section */}
        <StudentWelcome />
        
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
