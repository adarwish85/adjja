
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { StudentSchedule } from "@/components/dashboard/StudentSchedule";

const CoachSchedule = () => {
  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-bjj-navy">My Schedule</h1>
          <p className="text-bjj-gray">View your class schedule and upcoming sessions</p>
        </div>
        
        <StudentSchedule />
      </div>
    </CoachLayout>
  );
};

export default CoachSchedule;
