
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Award } from "lucide-react";

export const StudentLMS = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-bjj-gold" />
          LMS Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Continue Watching */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Continue Watching</h4>
          <div className="text-center py-4 text-bjj-gray">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No courses in progress</p>
            <p className="text-xs">Start watching courses to see your progress here</p>
          </div>
        </div>

        {/* Recommended */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Recommended for You</h4>
          <div className="text-center py-4 text-bjj-gray">
            <p className="text-sm">No recommendations yet</p>
            <p className="text-xs">Course recommendations will appear based on your progress</p>
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-bjj-gold" />
            Certificates Earned
          </h4>
          <div className="text-center py-4 text-bjj-gray">
            <p className="text-sm">No certificates yet</p>
            <p className="text-xs">Complete courses to earn certificates</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
