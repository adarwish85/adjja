
import { Card, CardContent } from "@/components/ui/card";

interface CourseInstructorCardProps {
  course: any;
  studentCount: number;
}

export const CourseInstructorCard: React.FC<CourseInstructorCardProps> = ({
  course,
  studentCount,
}) => {
  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-bjj-navy mb-4">Instructor</h3>
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
            <h4 className="font-semibold text-lg">{course.instructor}</h4>
            <p className="text-sm text-gray-600">BJJ Instructor</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Students:</span>
              <span>{studentCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rating:</span>
              <span>{course.rating || "4.5"}/5</span>
            </div>
          </div>

          <p className="text-sm text-gray-700">
            Experienced Brazilian Jiu-Jitsu instructor passionate about sharing the art with students of all backgrounds and skill levels.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
