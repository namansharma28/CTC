"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  community?: {
    name: string;
    handle: string;
    avatar: string;
  };
  image?: string;
  userRegistered?: boolean;
  attendees?: any[];
}

interface MobileEventsSectionProps {
  events: Event[];
}

export default function MobileEventsSection({ events }: MobileEventsSectionProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide touch-pan-x w-screen -ml-4 -mr-4 sm:-ml-6 sm:-mr-6">
      <div className="flex gap-3 pb-4 pl-4 pr-4 sm:pl-6 sm:pr-6">
        {events.slice(0, 5).map((event, eventIndex) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + eventIndex * 0.1 }}
            className="flex-shrink-0 w-80 h-32"
          >
            <Link href={`/events/${event._id}`}>
              <div className="rounded-lg border transition-all hover:shadow-md hover:border-primary/30 bg-card h-full overflow-hidden">
                {/* Event Image/Header */}
                <div 
                  className="h-16 bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-500 relative"
                  style={{
                    backgroundImage: event.image ? `url(${event.image})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-2 right-2">
                    {event.userRegistered && (
                      <Badge className="bg-green-500 text-white text-xs">Registered</Badge>
                    )}
                  </div>
                </div>
                
                {/* Event Content */}
                <div className="p-3 h-16 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-1 mb-1">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {event.community && (
                        <>
                          <Avatar className="h-3 w-3">
                            <AvatarImage src={event.community.avatar} />
                            <AvatarFallback>{event.community.name?.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate">{event.community.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={10} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}