
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export const StudentAchievements = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Trophy className="h-5 w-5 text-bjj-gold" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Major Milestones</h4>
          <div className="text-center py-4 text-bjj-gray">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No achievements yet</p>
            <p className="text-xs">Your achievements will appear here as you progress</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Recent Badges</h4>
          <div className="text-center py-4 text-bjj-gray">
            <p className="text-sm">No badges earned yet</p>
            <p className="text-xs">Keep training to earn badges</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
