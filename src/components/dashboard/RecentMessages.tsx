
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

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
        <div className="text-center py-8 text-bjj-gray">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No messages yet</p>
          <p className="text-xs">Student messages will appear here</p>
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          View All Messages
        </Button>
      </CardContent>
    </Card>
  );
};
