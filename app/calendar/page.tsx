"use client";

import { useState, useEffect } from "react";
import { Calendar, CalendarDays, Clock, MapPin, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow, format, isToday, isTomorrow, isThisWeek } from "date-fns";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  attendees: string[];
  maxAttendees?: number;
  tags: string[];
  createdBy: {
    name: string;
    image?: string;
  };
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      
      switch (filter) {
        case 'today':
          return isToday(eventDate);
        case 'week':
          return isThisWeek(eventDate);
        case 'month':
          return eventDate.getMonth() === now.getMonth() && 
                 eventDate.getFullYear() === now.getFullYear();
        default:
          return eventDate >= now; // Only show future events
      }
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getEventDateLabel = (dateString: string) => {
    const eventDate = new Date(dateString);
    
    if (isToday(eventDate)) {
      return { label: 'Today', color: 'bg-green-100 text-green-800' };
    } else if (isTomorrow(eventDate)) {
      return { label: 'Tomorrow', color: 'bg-blue-100 text-blue-800' };
    } else if (isThisWeek(eventDate)) {
      return { label: format(eventDate, 'EEEE'), color: 'bg-purple-100 text-purple-800' };
    } else {
      return { label: format(eventDate, 'MMM d'), color: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredEvents = getFilteredEvents();

  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to view your calendar and events.
          </p>
          <Button onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your upcoming events
          </p>
        </div>
        <Button asChild>
          <Link href="/events/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All Events' },
          { key: 'today', label: 'Today' },
          { key: 'week', label: 'This Week' },
          { key: 'month', label: 'This Month' }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key as any)}
          >
            {label}
          </Button>
        ))}\n      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}\n        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const dateLabel = getEventDateLabel(event.date);
            const isUserAttending = event.attendees.includes(session.user?.email || '');
            
            return (
              <Card key={event._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Event Image */}
                    <div className="flex-shrink-0">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <CalendarDays className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            <Link 
                              href={`/events/${event._id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {event.title}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                        <Badge className={dateLabel.color}>
                          {dateLabel.label}
                        </Badge>
                      </div>
                      
                      {/* Event Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {event.attendees.length}
                            {event.maxAttendees && ` / ${event.maxAttendees}`} attending
                          </span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {event.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-3">
                          {event.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {event.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{event.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>by {event.createdBy.name}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(event.date), { addSuffix: true })}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/events/${event._id}`}>
                              View Details
                            </Link>
                          </Button>
                          {isUserAttending && (
                            <Badge variant="secondary" className="px-2 py-1">
                              Attending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {filter === 'all' ? 'No upcoming events' : `No events ${filter === 'today' ? 'today' : filter === 'week' ? 'this week' : 'this month'}`}
          </h2>
          <p className="text-muted-foreground mb-4">
            {filter === 'all' 
              ? "There are no upcoming events at the moment." 
              : "Try changing the filter to see more events."
            }
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => setFilter('all')}>
              View All Events
            </Button>
            <Button asChild>
              <Link href="/events/create">
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}