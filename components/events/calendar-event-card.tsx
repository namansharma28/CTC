import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";
import { Globe, MapPin, Calendar, Clock, Users, Plus, CalendarDays, Video, Laptop } from "lucide-react";

interface CalendarEventCardProps {
  event: Event;
  variant?: "default" | "horizontal";
}

export function CalendarEventCard({ event, variant = "default" }: CalendarEventCardProps) {
  const router = useRouter();
  
  // Add null checks for community properties
  const communityName = event.community?.name || "Community";
  const communityInitials = communityName.substring(0, 2);
  const communityHandle = event.community?.handle || "";
  const communityAvatar = event.community?.avatar || "";
  
  const handleCommunityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (communityHandle) {
      router.push(`/communities/${communityHandle}`);
    }
  };
  
  // Get event type icon
  const getEventTypeIcon = () => {
    switch(event.eventType) {
      case 'online':
        return <Video className="h-4 w-4" />;
      case 'hybrid':
        return <Laptop className="h-4 w-4" />;
      case 'offline':
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };
  
  // Get event type label
  const getEventTypeLabel = () => {
    switch(event.eventType) {
      case 'online':
        return 'Online';
      case 'hybrid':
        return 'Hybrid';
      case 'offline':
      default:
        return event.location || 'In-person';
    }
  };

  const handleClick = () => {
    console.log("Navigating to event:", event._id);
  };
  
  // Horizontal variant layout
  if (variant === "horizontal") {
    return (
      <Link href={`/events/${event._id}`} onClick={handleClick}>
        <Card className="transition-colors hover:bg-accent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div
                className="h-20 w-20 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                style={{
                  backgroundImage: event.image
                    ? `url(${event.image})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={communityAvatar} />
                    <AvatarFallback className="text-xs">{communityInitials}</AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={handleCommunityClick}
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors hover:underline"
                  >
                    {communityName}
                  </button>
                </div>
                <h3 className="font-semibold">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {event.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getEventTypeIcon()}
                    <span>{getEventTypeLabel()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }
  
  // Default vertical layout
  return (
    <Link href={`/events/${event._id}`} onClick={handleClick}>
      <Card className="overflow-hidden">
        <div className="relative">
          <div 
            className="h-32 w-full bg-gradient-to-r from-blue-500 to-purple-600"
            style={{
              backgroundImage: event.image 
                ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${event.image})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <Badge className="mb-1 bg-primary/80 hover:bg-primary/70">
              {event.eventType === 'online' ? 'Online Event' : 
               event.eventType === 'hybrid' ? 'Hybrid Event' : 'Event'}
            </Badge>
            <h3 className="text-lg font-bold">{event.title}</h3>
          </div>
        </div>
        
        <CardContent className="p-4 pt-3">
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={communityAvatar} />
              <AvatarFallback>{communityInitials}</AvatarFallback>
            </Avatar>
            <button 
              onClick={handleCommunityClick}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              {communityName}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-start gap-2 text-sm">
              <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              {event.eventType === 'online' ? 
                <Video className="mt-0.5 h-4 w-4 text-muted-foreground" /> : 
                event.eventType === 'hybrid' ? 
                  <Laptop className="mt-0.5 h-4 w-4 text-muted-foreground" /> :
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              }
              <span>{getEventTypeLabel()}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span>{event.attendees?.length || 0} attendees</span>
            </div>
          </div>
          
          {/* Event Description */}
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}
        </CardContent>
        

      </Card>
    </Link>
  );
}

