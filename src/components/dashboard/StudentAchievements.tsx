
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Flame } from "lucide-react";

export const StudentAchievements = () => {
  const achievements = [
    {
      icon: Trophy,
      title: "First Competition",
      description: "Competed in first tournament",
      date: "Nov 2024",
      rarity: "gold"
    },
    {
      icon: Flame,
      title: "30-Day Streak",
      description: "Attended classes 30 days in a row",
      date: "Dec 2024",
      rarity: "gold"
    },
    {
      icon: Star,
      title: "Blue Belt",
      description: "Promoted to blue belt",
      date: "Jan 2024",
      rarity: "blue"
    },
    {
      icon: Target,
      title: "First Stripe",
      description: "Earned first stripe on blue belt",
      date: "Jun 2024",
      rarity: "silver"
    },
  ];

  const recentBadges = [
    { name: "Perfect Attendance", date: "This Week" },
    { name: "LMS Enthusiast", date: "This Month" },
    { name: "Early Bird", date: "Yesterday" },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "gold": return "text-yellow-600 bg-yellow-50";
      case "silver": return "text-gray-600 bg-gray-50";
      case "blue": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Trophy className="h-5 w-5 text-bjj-gold" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Major Achievements */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Major Milestones</h4>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`p-2 rounded-full ${getRarityColor(achievement.rarity)}`}>
                  <achievement.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-bjj-navy text-sm">{achievement.title}</h5>
                  <p className="text-xs text-bjj-gray">{achievement.description}</p>
                </div>
                <span className="text-xs text-bjj-gray">{achievement.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Badges */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Recent Badges</h4>
          <div className="space-y-2">
            {recentBadges.map((badge, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-3 w-3 text-bjj-gold" />
                  <span className="text-sm text-bjj-navy">{badge.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {badge.date}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
