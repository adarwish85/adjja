
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Trophy } from "lucide-react";

const analytics = [
  {
    title: "Attendance Rate",
    value: "92%",
    description: "Last 30 days",
    icon: TrendingUp,
    trend: "+5% from last month",
    color: "text-green-600",
  },
  {
    title: "Classes This Month",
    value: "18",
    description: "Total attended",
    icon: Calendar,
    trend: "+3 from last month",
    color: "text-bjj-gold-dark",
  },
  {
    title: "LMS Hours",
    value: "24.5h",
    description: "Time watched",
    icon: Clock,
    trend: "+8.2h from last month",
    color: "text-blue-600",
  },
  {
    title: "Current Streak",
    value: "12",
    description: "Days in a row",
    icon: Trophy,
    trend: "Personal best!",
    color: "text-purple-600",
  },
];

export const StudentAnalytics = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {analytics.map((item) => (
        <Card key={item.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray flex items-center justify-between">
              {item.title}
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-bjj-navy">{item.value}</div>
            <p className="text-xs text-bjj-gray">{item.description}</p>
            <p className={`text-xs font-medium mt-1 ${item.color}`}>
              {item.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
