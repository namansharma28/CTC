"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Plus, Search, Loader2, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDateWithFallback } from "@/lib/date-utils";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  registrations: number;
  maxCapacity: number;
  status: string;
  createdAt: string;
  community?: {
    name: string;
    handle: string;
  };
}

export default function OperatorEvents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Check if user is operator or admin
    if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (userRole !== "operator" && userRole !== "admin") {
        toast({
          title: "Unauthorized",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        router.push("/home");
        return;
      }
      fetchEvents();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session, status, router, toast]);

  useEffect(() => {
    // Filter events based on debounced search query
    if (debouncedSearchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        event.community?.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [debouncedSearchQuery, events]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        const eventsArray = Array.isArray(data) ? data : (data.data || data.events || []);
        setEvents(eventsArray);
        setFilteredEvents(eventsArray);
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
      // Set empty arrays on error
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventStatus = (event: Event) => {
    const eventDate = new Date(event.date);
    const now = new Date();

    if (eventDate < now) {
      return { status: 'past', label: 'Past', variant: 'secondary' as const };
    } else if (eventDate.toDateString() === now.toDateString()) {
      return { status: 'today', label: 'Today', variant: 'default' as const };
    } else {
      return { status: 'upcoming', label: 'Upcoming', variant: 'outline' as const };
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Event Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage and oversee all events (Events are created through communities)</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
          <CardDescription>
            All events on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No events found matching your search" : "No events found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Event</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Date & Time</TableHead>
                    <TableHead className="min-w-[120px] hidden md:table-cell">Location</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Registrations</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px] hidden xl:table-cell">Community</TableHead>
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredEvents || []).map((event) => {
                    const eventStatus = getEventStatus(event);
                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                              {event.description}
                            </p>
                            <div className="flex flex-col gap-1 mt-1 sm:hidden">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatDateWithFallback(event.date, 'TBD')} • {event.time}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground md:hidden">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            <div>
                              <p>{formatDateWithFallback(event.date, 'TBD')}</p>
                              <p className="text-muted-foreground">{event.time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[120px]">{event.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            <p>{event.registrations || 0}</p>
                            {event.maxCapacity && (
                              <p className="text-muted-foreground">/ {event.maxCapacity}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={eventStatus.variant}>
                            {eventStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {event.community ? (
                            <div className="text-sm">
                              <p className="font-medium truncate max-w-[100px]">{event.community?.name || 'Community'}</p>
                              <p className="text-muted-foreground">@{event.community?.handle || 'unknown'}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
