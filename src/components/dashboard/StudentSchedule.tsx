
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export const StudentSchedule = () => {
  const upcomingClasses = [
    {
      title: "Fundamentals Class",
      instructor: "Coach Maria",
      time: "6:00 PM - 7:30 PM",
      date: "Today",
      location: "Downtown Branch",
      level: "Beginner",
      enrolled: 12,
      capacity: 20,
      status: "enrolled"
    },
    {
      title: "Open Mat",
      instructor: "Coach Roberto",
      time: "7:30 PM - 9:00 PM", 
      date: "Today",
      location: "Downtown Branch",
      level: "All Levels",
      enrolled: 8,
      capacity: 15,
      status: "available"
    },
    {
      title: "Competition Class",
      instructor: "Master Silva",
      time: "6:00 PM - 7:30 PM",
      date: "Tomorrow",
      location: "Downtown Branch", 
      level: "Intermediate",
      enrolled: 15,
      capacity: 18,
      status: "available"
    },
    {
      title: "No-Gi Training",
      instructor: "Coach Ana",
      time: "7:00 PM - 8:30 PM",
      date: "Dec 31",
      location: "Uptown Branch",
      level: "All Levels",
      enrolled: 20,
      capacity: 20,
      status: "waitlist"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enrolled": return "bg-green-100 text-green-800";
      case "available": return "bg-blue-100 text-blue-800";
      case "waitlist": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Calendar className="h-5 w-5 text-bjj-gold" />
          Upcoming Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingClasses.map((classItem, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-bjj-navy">{classItem.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {classItem.level}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(classItem.status)}`}>
                      {classItem.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-bjj-gray">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{classItem.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{classItem.enrolled}/{classItem.capacity}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-bjj-gray mt-1">{classItem.instructor}</p>
                </div>
                
                <div className="flex space-x-2">
                  {classItem.status === "enrolled" ? (
                    <>
                      <Button size="sm" className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                        Check In
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </>
                  ) : classItem.status === "available" ? (
                    <Button size="sm" variant="outline">
                      Enroll
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Join Waitlist
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View Full Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
