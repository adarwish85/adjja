
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Star } from "lucide-react";

export const StudentProgress = () => {
  const beltProgress = [
    { belt: "White", completed: true },
    { belt: "Blue", current: true, stripes: 2, totalStripes: 4 },
    { belt: "Purple", upcoming: true },
    { belt: "Brown", locked: true },
    { belt: "Black", locked: true },
  ];

  const recentFeedback = [
    {
      date: "Dec 28, 2024",
      coach: "Coach Maria",
      feedback: "Excellent progress on guard retention. Focus on escaping side control next.",
      type: "positive"
    },
    {
      date: "Dec 24, 2024", 
      coach: "Coach Roberto",
      feedback: "Great improvement in passing guard. Ready for more advanced techniques.",
      type: "positive"
    },
  ];

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
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {beltProgress.map((belt) => (
              <div key={belt.belt} className="flex flex-col items-center min-w-16">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    belt.completed
                      ? "bg-green-600"
                      : belt.current
                      ? "bg-blue-600"
                      : belt.upcoming
                      ? "bg-gray-400"
                      : "bg-gray-300"
                  }`}
                >
                  {belt.belt === "White" && "W"}
                  {belt.belt === "Blue" && "B"}
                  {belt.belt === "Purple" && "P"}
                  {belt.belt === "Brown" && "Br"}
                  {belt.belt === "Black" && "Bl"}
                </div>
                <span className="text-xs mt-1 text-center">{belt.belt}</span>
                {belt.current && (
                  <div className="mt-1">
                    <Progress value={(belt.stripes / belt.totalStripes) * 100} className="w-12 h-1" />
                    <span className="text-xs text-bjj-gray">{belt.stripes}/{belt.totalStripes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coach Feedback */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-bjj-gold" />
            Recent Coach Feedback
          </h4>
          <div className="space-y-3">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-bjj-navy">{feedback.coach}</span>
                  <span className="text-xs text-bjj-gray">{feedback.date}</span>
                </div>
                <p className="text-sm text-bjj-gray">{feedback.feedback}</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {feedback.type === "positive" ? "Positive Feedback" : "Areas to Improve"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
