
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

const upcomingClasses = [
  {
    id: 1,
    name: "Beginner BJJ",
    time: "09:00 AM",
    coach: "Prof. Silva",
    branch: "Downtown",
    capacity: "12/20",
    level: "Beginner",
  },
  {
    id: 2,
    name: "Advanced BJJ",
    time: "11:00 AM",
    coach: "Prof. Santos",
    branch: "North Side",
    capacity: "15/18",
    level: "Advanced",
  },
  {
    id: 3,
    name: "Kids BJJ",
    time: "02:00 PM",
    coach: "Prof. Lima",
    branch: "East Branch",
    capacity: "8/15",
    level: "Kids",
  },
  {
    id: 4,
    name: "Competition Team",
    time: "07:00 PM",
    coach: "Prof. Silva",
    branch: "Downtown",
    capacity: "10/12",
    level: "Elite",
  },
];

export const UpcomingClasses = () => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Advanced": return "bg-blue-100 text-blue-800";
      case "Kids": return "bg-purple-100 text-purple-800";
      case "Elite": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy">Upcoming Classes</CardTitle>
        <p className="text-sm text-bjj-gray">Today's schedule across all branches</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingClasses.map((classItem) => (
            <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-bjj-navy">{classItem.name}</h4>
                  <Badge className={getLevelColor(classItem.level)}>
                    {classItem.level}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-bjj-gray">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{classItem.branch}</span>
                  </div>
                  <span>Coach: {classItem.coach}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-bjj-navy">{classItem.capacity}</div>
                <div className="text-xs text-bjj-gray">enrolled</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
