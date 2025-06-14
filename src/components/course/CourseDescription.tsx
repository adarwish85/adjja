
import { Card, CardContent } from "@/components/ui/card";

interface CourseDescriptionProps {
  course: any;
}

export const CourseDescription: React.FC<CourseDescriptionProps> = ({
  course,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-bjj-navy mb-4">Description</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            {course.description || "This comprehensive Brazilian Jiu-Jitsu course is designed for students who want to learn the art and science of BJJ. Whether you're completely new to martial arts or looking to add BJJ to your existing skillset, this course will provide you with a solid foundation in the fundamental techniques and concepts."}
          </p>
          <p className="text-gray-700 mb-4">
            Our experienced instructor will guide you through each technique step-by-step, ensuring you understand not just the 
            "how" but also the "why" behind each movement. You'll learn proper body mechanics, timing, and the strategic thinking 
            that makes Brazilian Jiu-Jitsu so effective.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
