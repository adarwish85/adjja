
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Building, CreditCard } from "lucide-react";

const kpiData = [
  {
    title: "Total Active Students",
    value: "248",
    change: "+12%",
    changeType: "positive" as const,
    icon: GraduationCap,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Number of Coaches",
    value: "18",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Branches",
    value: "4",
    change: "0",
    changeType: "neutral" as const,
    icon: Building,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Monthly LMS Revenue",
    value: "$12,450",
    change: "+18%",
    changeType: "positive" as const,
    icon: CreditCard,
    color: "text-bjj-gold-dark",
    bgColor: "bg-yellow-100",
  },
];

export const DashboardOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              kpi.changeType === 'positive' ? 'text-green-600' : 
              kpi.changeType === 'negative' ? 'text-red-600' : 
              'text-bjj-gray'
            }`}>
              {kpi.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
