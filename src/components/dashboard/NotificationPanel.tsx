
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Upload, BookOpen, Check } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

export const NotificationPanel = () => {
  const { notifications, isLoading, markAsRead, unreadCount } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return BookOpen;
      case 'leave_request':
        return Calendar;
      case 'lms_submission':
        return Upload;
      default:
        return Bell;
    }
  };

  const getNotificationPriority = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'medium';
      case 'leave_request':
        return 'high';
      case 'lms_submission':
        return 'low';
      default:
        return 'low';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-bjj-gray">Loading notifications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-bjj-gray">No notifications</div>
        ) : (
          notifications.slice(0, 5).map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const priority = getNotificationPriority(notification.type);
            
            return (
              <div key={notification.id} className={`flex items-start gap-3 p-2 rounded transition-colors ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50'
              }`}>
                <div className={`p-1 rounded-full ${
                  priority === 'high' ? 'bg-red-100' :
                  priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <IconComponent className={`h-3 w-3 ${
                    priority === 'high' ? 'text-red-600' :
                    priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-xs">{notification.title}</div>
                  <div className="text-xs text-bjj-gray">{notification.message}</div>
                  <div className="text-xs text-bjj-gray mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </div>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="h-auto p-1"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
