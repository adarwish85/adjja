
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Calendar, Upload, BookOpen, Check, X, MarkdownIcon as MarkAllRead } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { notifications, isLoading, markAsRead, unreadCount } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

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

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    markAsRead.mutate(notificationId);
  };

  const markAllAsRead = () => {
    notifications
      .filter(n => !n.read)
      .forEach(notification => {
        markAsRead.mutate(notification.id);
      });
  };

  if (isLoading) {
    return (
      <div ref={dropdownRef} className="absolute right-0 top-12 w-96 z-50">
        <Card className="shadow-lg border">
          <CardContent className="p-4">
            <div className="text-center text-bjj-gray">Loading notifications...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="absolute right-0 top-12 w-96 z-50">
      <Card className="shadow-lg border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <MarkAllRead className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-bjj-gray">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const priority = getNotificationPriority(notification.type);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer ${
                        notification.read ? 'bg-gray-25' : 'bg-blue-50'
                      }`}
                    >
                      <div className={`p-2 rounded-full mt-0.5 ${
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
                          <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-bjj-navy'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        <p className="text-sm text-bjj-gray mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-bjj-gray">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
          
          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-3">
                <Button 
                  variant="outline" 
                  className="w-full text-sm"
                  onClick={onClose}
                >
                  View All Notifications
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
