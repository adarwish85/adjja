
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface CourseLearningOutcomesProps {
  learningOutcomes: string[];
}

export const CourseLearningOutcomes: React.FC<CourseLearningOutcomesProps> = ({
  learningOutcomes,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-bjj-navy mb-4">What you'll learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {learningOutcomes.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
