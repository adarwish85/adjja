
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star } from "lucide-react";

export const StudentProgress = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Trophy className="h-5 w-5 text-bjj-gold" />
          My Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Belt Progress */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Belt Progression</h4>
          <div className="text-center py-4 text-bjj-gray">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold mx-auto mb-2">
              W
            </div>
            <span className="text-xs">White Belt</span>
            <div className="mt-2">
              <Progress value={0} className="w-12 h-1 mx-auto" />
              <span className="text-xs text-bjj-gray">0/4 stripes</span>
            </div>
          </div>
        </div>

        {/* Coach Feedback */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-bjj-gold" />
            Recent Coach Feedback
          </h4>
          <div className="text-center py-4 text-bjj-gray">
            <p className="text-sm">No feedback yet</p>
            <p className="text-xs">Coach feedback will appear here after training sessions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
