
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, BookOpen, Award } from "lucide-react";

export const StudentLMS = () => {
  const continueWatching = [
    {
      title: "Guard Passing Fundamentals",
      instructor: "Coach Roberto",
      progress: 65,
      timeLeft: "12 min left",
      thumbnail: "🥋"
    },
    {
      title: "Submission Defense",
      instructor: "Coach Maria",
      progress: 30,
      timeLeft: "25 min left", 
      thumbnail: "🔒"
    },
  ];

  const recommended = [
    {
      title: "Advanced Sweeps",
      instructor: "Master Silva",
      duration: "45 min",
      level: "Intermediate",
      thumbnail: "⚡"
    },
    {
      title: "Competition Preparation",
      instructor: "Coach Ana",
      duration: "1.2h",
      level: "Advanced",
      thumbnail: "🏆"
    },
  ];

  const certificates = [
    { name: "Basic Positions", date: "Nov 2024" },
    { name: "Guard Fundamentals", date: "Oct 2024" },
  ];

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
          <div className="space-y-3">
            {continueWatching.map((course, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{course.thumbnail}</div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-bjj-navy text-sm">{course.title}</h5>
                  <p className="text-xs text-bjj-gray">{course.instructor}</p>
                  <div className="mt-1">
                    <Progress value={course.progress} className="h-1" />
                    <span className="text-xs text-bjj-gray">{course.timeLeft}</span>
                  </div>
                </div>
                <Button size="sm" className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  <Play className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Recommended for You</h4>
          <div className="space-y-2">
            {recommended.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{course.thumbnail}</span>
                  <div>
                    <h5 className="text-sm font-medium text-bjj-navy">{course.title}</h5>
                    <p className="text-xs text-bjj-gray">{course.instructor} • {course.duration}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Watch</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-bjj-gold" />
            Certificates Earned
          </h4>
          <div className="space-y-2">
            {certificates.map((cert, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-bjj-navy">{cert.name}</span>
                <span className="text-bjj-gray">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
