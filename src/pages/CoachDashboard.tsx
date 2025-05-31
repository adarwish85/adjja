
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { CoachOverview } from "@/components/dashboard/CoachOverview";
import { ClassCalendar } from "@/components/dashboard/ClassCalendar";
import { StudentPerformance } from "@/components/dashboard/StudentPerformance";
import { LMSUpload } from "@/components/dashboard/LMSUpload";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";

const CoachDashboard = () => {
  return (
    <CoachLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Welcome back, Coach Maria!</h1>
            <p className="text-bjj-gray">Downtown Branch - Team Lead Instructor</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-bjj-gray">Today</p>
            <p className="text-lg font-semibold text-bjj-navy">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        
        <CoachOverview />
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ClassCalendar />
          </div>
          <div className="space-y-6">
            <NotificationPanel />
            <LMSUpload />
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <StudentPerformance />
          <RecentMessages />
        </div>
      </div>
    </CoachLayout>
  );
};

export default CoachDashboard;
