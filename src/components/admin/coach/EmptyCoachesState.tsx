
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, GraduationCap, AlertCircle } from "lucide-react";

interface EmptyCoachesStateProps {
  hasError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onAddCoach?: () => void;
}

export const EmptyCoachesState: React.FC<EmptyCoachesStateProps> = ({
  hasError = false,
  errorMessage,
  onRetry,
  onAddCoach,
}) => {
  if (hasError) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Coaches
          </h3>
          <p className="text-gray-600 mb-6">
            {errorMessage || "There was an error loading the coaches. Please try again."}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-bjj-gold/10 rounded-full mb-4">
          <GraduationCap className="h-8 w-8 text-bjj-gold" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Coaches Found
        </h3>
        <p className="text-gray-600 mb-6">
          Get started by adding traditional coaches or upgrading students to coach status.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          {onAddCoach && (
            <Button onClick={onAddCoach} className="bg-bjj-gold hover:bg-bjj-gold-dark">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Coach
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href="/admin/students">
              <GraduationCap className="h-4 w-4 mr-2" />
              Upgrade Students
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
