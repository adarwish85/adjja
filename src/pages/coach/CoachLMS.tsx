
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { StudentLMS } from "@/components/dashboard/StudentLMS";
import { LMSPurchase } from "@/components/dashboard/LMSPurchase";

const CoachLMS = () => {
  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-bjj-navy">Learning Management System</h1>
          <p className="text-bjj-gray">Access your courses and learning materials</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <StudentLMS />
          <LMSPurchase />
        </div>
      </div>
    </CoachLayout>
  );
};

export default CoachLMS;
