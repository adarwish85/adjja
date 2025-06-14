
import { Card, CardContent } from "@/components/ui/card";

interface CourseRequirementsProps {
  requirements: string[];
}

export const CourseRequirements: React.FC<CourseRequirementsProps> = ({
  requirements,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-bjj-navy mb-4">Requirements</h2>
        <ul className="space-y-2 text-sm">
          {requirements.map((requirement, index) => (
            <li key={index}>• {requirement}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
