
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Upload, BookOpen, Check, ExternalLink } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {notifications.length > 5 && (
            <Button variant="ghost" size="sm" className="text-bjj-navy">
              <ExternalLink className="h-4 w-4 mr-1" />
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-bjj-gray">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const priority = getNotificationPriority(notification.type);
            
            return (
              <div 
                key={notification.id} 
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'
                }`}
              >
                <div className={`p-1.5 rounded-full ${
                  priority === 'high' ? 'bg-red-100' :
                  priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <IconComponent className={`h-4 w-4 ${
                    priority === 'high' ? 'text-red-600' :
                    priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className={`font-medium text-sm ${notification.read ? 'text-gray-700' : 'text-bjj-navy'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0 ml-2"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-bjj-gray mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-bjj-gray">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                    {!notification.read && (
                      <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
