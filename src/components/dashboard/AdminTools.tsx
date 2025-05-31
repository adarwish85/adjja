
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Users, Calendar } from "lucide-react";

const quickActions = [
  {
    title: "Add Coach",
    description: "Register a new coach",
    icon: Users,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Add Class",
    description: "Schedule a new class",
    icon: Calendar,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "View Reports",
    description: "Generate analytics",
    icon: BarChart3,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Add Student",
    description: "Enroll new student",
    icon: Plus,
    color: "bg-orange-500 hover:bg-orange-600",
  },
];

export const AdminTools = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy">Quick Actions</CardTitle>
        <p className="text-sm text-bjj-gray">Common administrative tasks</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
            >
              <div className={`p-2 rounded-full ${action.color} text-white`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-bjj-navy text-sm">{action.title}</div>
                <div className="text-xs text-bjj-gray">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
