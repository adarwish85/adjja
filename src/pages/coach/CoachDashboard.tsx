
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { StudentWelcome } from "@/components/dashboard/StudentWelcome";
import { StudentAnalytics } from "@/components/dashboard/StudentAnalytics";
import { StudentProgress } from "@/components/dashboard/StudentProgress";
import { StudentLMS } from "@/components/dashboard/StudentLMS";
import { StudentSchedule } from "@/components/dashboard/StudentSchedule";
import { StudentAchievements } from "@/components/dashboard/StudentAchievements";
import { LMSPurchase } from "@/components/dashboard/LMSPurchase";
import { MyStudentsView } from "@/components/coach/MyStudentsView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useCoachStudents } from "@/hooks/useCoachStudents";

const CoachDashboard = () => {
  const { stats } = useCoachStudents();

  return (
    <CoachLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Section - Same as Student */}
        <StudentWelcome />
        
        {/* Analytics Section - Same as Student */}
        <StudentAnalytics />
        
        {/* Main Content Grid - Same as Student */}
        <div className="grid lg:grid-cols-2 gap-6">
          <StudentProgress />
          <StudentLMS />
        </div>
        
        {/* Coach-Specific: My Students Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy flex items-center gap-2">
                <Users className="h-5 w-5 text-bjj-gold" />
                My Students ({stats.totalStudents})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalStudents > 0 ? (
                <div className="text-center py-4">
                  <p className="text-bjj-gray mb-4">
                    You have {stats.totalStudents} students assigned to your classes.
                  </p>
                  <p className="text-sm text-bjj-gray">
                    Visit the "My Students" page to manage your students.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-bjj-gray">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No students assigned yet</p>
                  <p className="text-xs">Students will appear here once assigned to your classes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Secondary Content Grid - Same as Student */}
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
    </CoachLayout>
  );
};

export default CoachDashboard;
