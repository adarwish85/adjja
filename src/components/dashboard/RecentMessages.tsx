
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";

const messages = [
  {
    student: "Alex Johnson",
    message: "Could you explain the kimura setup from side control again?",
    time: "2 hours ago",
    unread: true,
  },
  {
    student: "Sarah Chen",
    message: "Thank you for the feedback on my guard work!",
    time: "5 hours ago",
    unread: false,
  },
  {
    student: "Mike Rodriguez",
    message: "Will there be open mat this Saturday?",
    time: "1 day ago",
    unread: true,
  },
];

export const RecentMessages = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm flex items-center gap-2">
                {msg.student}
                {msg.unread && <Badge variant="destructive" className="h-2 w-2 p-0" />}
              </div>
              <span className="text-xs text-bjj-gray">{msg.time}</span>
            </div>
            <p className="text-sm text-bjj-gray">{msg.message}</p>
            <Button variant="ghost" size="sm" className="text-xs">
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>
        ))}
        
        <Button variant="outline" className="w-full mt-4">
          View All Messages
        </Button>
      </CardContent>
    </Card>
  );
};
