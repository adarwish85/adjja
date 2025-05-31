
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp } from "lucide-react";

const kpiData = [
  {
    title: "Total Assigned Students",
    value: "42",
    change: "+3 new this month",
    changeType: "positive" as const,
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Upcoming Classes Today",
    value: "4",
    change: "Next at 6:00 PM",
    changeType: "neutral" as const,
    icon: Calendar,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Attendance Rate This Week",
    value: "87%",
    change: "+5% from last week",
    changeType: "positive" as const,
    icon: TrendingUp,
    color: "text-bjj-gold-dark",
    bgColor: "bg-yellow-100",
  },
];

export const CoachOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              {kpi.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{kpi.value}</div>
            <p className={`text-xs ${
              kpi.changeType === 'positive' ? 'text-green-600' : 'text-bjj-gray'
            }`}>
              {kpi.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
