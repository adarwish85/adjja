
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Upload } from "lucide-react";

const notifications = [
  {
    type: "leave_request",
    title: "Leave Request",
    message: "Alex Johnson requested leave for next week",
    time: "1 hour ago",
    icon: Calendar,
    priority: "medium",
  },
  {
    type: "lms_submission",
    title: "LMS Submission",
    message: "Sarah Chen submitted assignment: Guard Concepts",
    time: "3 hours ago",
    icon: Upload,
    priority: "low",
  },
  {
    type: "leave_request",
    title: "Leave Request",
    message: "Mike Rodriguez - family emergency",
    time: "1 day ago",
    icon: Calendar,
    priority: "high",
  },
];

export const NotificationPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          <Badge variant="destructive" className="ml-auto">
            {notifications.filter(n => n.priority === 'high' || n.priority === 'medium').length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notif, index) => (
          <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
            <div className={`p-1 rounded-full ${
              notif.priority === 'high' ? 'bg-red-100' :
              notif.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <notif.icon className={`h-3 w-3 ${
                notif.priority === 'high' ? 'text-red-600' :
                notif.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-xs">{notif.title}</div>
              <div className="text-xs text-bjj-gray">{notif.message}</div>
              <div className="text-xs text-bjj-gray mt-1">{notif.time}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
