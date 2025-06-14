
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award } from "lucide-react";

export const StudentPerformance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Student Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-bjj-navy mb-3">Recent Notes</h3>
          <div className="text-center py-4 text-bjj-gray">
            <p className="text-sm">No performance notes yet</p>
            <p className="text-xs">Student progress notes will appear here</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-bjj-navy mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Promotion Readiness
          </h3>
          <div className="text-center py-4 text-bjj-gray">
            <p className="text-sm">No promotion assessments yet</p>
            <p className="text-xs">Promotion readiness will appear here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
