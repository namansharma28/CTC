"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, Users, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";

interface NotificationListProps {
  onClose?: () => void;
}

export default function NotificationList({ onClose }: NotificationListProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/notifications/list');
      
      if (response.ok) {
        const data = await response.json();
        // Show only 5 most recent notifications in the overlay
        setNotifications(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/user/notifications/read-all', {
        method: 'POST'
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'community':
        return <Users className="h-4 w-4 text-silver" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (onClose) onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b p-3">
        <h4 className="font-medium">Notifications</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={markAllAsRead}
          className="text-xs h-8"
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>
      
      <ScrollArea className="max-h-[70vh] md:max-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Bell className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <Link 
                key={notification.id} 
                href={notification.linkUrl || '#'}
                onClick={() => handleNotificationClick(notification)}
                className={`block border-b last:border-b-0 hover:bg-muted/50 transition-colors ${notification.read ? 'opacity-70' : ''}`}
              >
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notification.read ? 'bg-transparent' : 'bg-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {getNotificationIcon(notification.type)}
                          <p className="font-medium text-sm">{notification.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatNotificationTime(notification.createdAt)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <Separator />
      
      <div className="p-3 space-y-2">
        <Button variant="outline" size="sm" className="w-full text-xs" asChild>
          <Link href="/notifications">View All Notifications</Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <Link href="/settings">Manage notifications</Link>
        </Button>
      </div>
    </div>
  );
}
