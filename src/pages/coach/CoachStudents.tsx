
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { MyStudentsView } from "@/components/coach/MyStudentsView";

const CoachStudents = () => {
  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-bjj-navy">My Students</h1>
          <p className="text-bjj-gray">Manage and track your assigned students</p>
        </div>
        
        <MyStudentsView />
      </div>
    </CoachLayout>
  );
};

export default CoachStudents;
