
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { StudentProgress } from "@/components/dashboard/StudentProgress";
import { StudentAchievements } from "@/components/dashboard/StudentAchievements";

const CoachProgress = () => {
  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-bjj-navy">My Progress</h1>
          <p className="text-bjj-gray">Track your personal BJJ journey</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <StudentProgress />
          <StudentAchievements />
        </div>
      </div>
    </CoachLayout>
  );
};

export default CoachProgress;
