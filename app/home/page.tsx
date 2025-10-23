"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CalendarDays, BookOpen, Briefcase, Plus, Compass, Users, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import FeedCard from '@/components/feed/feed-card';

import { Button } from "@/components/ui/button";
import { FeedItem } from '@/types/feed';
import Link from "next/link";
import { motion } from "framer-motion";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  image?: string;
  userRegistered?: boolean;
  community?: {
    name?: string;
    avatar?: string;
  };
}

interface Community {
  _id: string;
  name: string;
  handle: string;
  avatar?: string;
  isVerified?: boolean;
  membersCount: number;
  userRelation?: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [eventsFeedItems, setEventsFeedItems] = useState<FeedItem[]>([]);
  const [studyFeedItems, setStudyFeedItems] = useState<FeedItem[]>([]);
  const [tnpFeedItems, setTnpFeedItems] = useState<FeedItem[]>([]);
  const [allFeedItems, setAllFeedItems] = useState<FeedItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [trendingCommunities, setTrendingCommunities] = useState<Community[]>([]);
  const [followingStates, setFollowingStates] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsHasMore, setEventsHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch events data using the feed API
        const eventsResponse = await fetch('/api/events/feed?page=1&limit=15');
        const eventsData = await eventsResponse.json();
        if (eventsData.events && Array.isArray(eventsData.events)) {
          setEventsFeedItems(eventsData.events);
          setEventsHasMore(eventsData.pagination?.hasNext || false);
        }

        // Fetch upcoming events using the new API
        const upcomingResponse = await fetch('/api/events/upcoming?limit=4');
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          if (Array.isArray(upcomingData)) {
            setUpcomingEvents(upcomingData);
          }
        }

        // Fetch study posts
        const studyResponse = await fetch('/api/study');
        const studyData = await studyResponse.json();
        if (studyData.success) {
          setStudyFeedItems(studyData.data.map((item: any) => ({
            ...item,
            type: 'study'
          })));
        }

        // Fetch TNP posts with filtering
        const tnpResponse = await fetch('/api/tnp');
        const tnpData = await tnpResponse.json();
        let filteredTnpItems: FeedItem[] = [];
        if (tnpData.success) {
          const allTnpItems = tnpData.data.map((item: any) => ({
            ...item,
            type: 'tnp'
          }));

          // Filter TNP posts based on user role
          const userRole = session?.user?.role;
          const hasPlacementAccess = userRole === 'ctc_student' || userRole === 'technical_lead' || userRole === 'operator' || userRole === 'admin';

          filteredTnpItems = allTnpItems.filter((item: any) => {
            // If it's a placement-related post and user doesn't have access, filter it out
            if (item.category === 'placement' && !hasPlacementAccess) {
              return false;
            }
            return true;
          });

          setTnpFeedItems(filteredTnpItems);
        }

        // Fetch trending communities
        const communitiesResponse = await fetch('/api/communities/trending');
        const communitiesData = await communitiesResponse.json();
        if (communitiesData.success && Array.isArray(communitiesData.data)) {
          const validCommunities = communitiesData.data.filter((community: any) =>
            community && community._id && community.name && community.handle
          );
          setTrendingCommunities(validCommunities.slice(0, 5));
        }

        // Create combined feed for "All Posts" tab
        const studyItems = studyData.success ? studyData.data.map((item: any) => ({
          ...item,
          type: 'study'
        })) : [];

        // Filter out past events and updates
        const now = new Date();
        const filteredEvents = (eventsData.events || []).filter((event: any) => {
          // For events, check if the event date hasn't passed
          if (event.date) {
            const eventDate = new Date(event.date);
            return eventDate >= now;
          }
          return true; // Keep events without dates
        });

        const combinedFeed = [
          ...filteredEvents,
          ...studyItems,
          ...filteredTnpItems
        ].sort((a, b) => {
          // Sort by creation date (latest first)
          const dateA = new Date(a.createdAt || a.date || 0);
          const dateB = new Date(b.createdAt || b.date || 0);
          return dateB.getTime() - dateA.getTime();
        });

        setAllFeedItems(combinedFeed);
      } catch (error) {
        console.error('Error fetching feed data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadMoreEvents = async () => {
    if (loadingMore || !eventsHasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = eventsPage + 1;
      const response = await fetch(`/api/events/feed?page=${nextPage}&limit=15`);
      const data = await response.json();

      if (data.events && Array.isArray(data.events)) {
        setEventsFeedItems(prev => {
          const newEvents = [...prev, ...data.events];

          // Filter out past events and updates
          const now = new Date();
          const filteredEvents = newEvents.filter((event: any) => {
            // For events, check if the event date hasn't passed
            if (event.date) {
              const eventDate = new Date(event.date);
              return eventDate >= now;
            }
            return true; // Keep events without dates
          });

          // Update the combined feed for "All Posts" tab
          const combinedFeed = [
            ...filteredEvents,
            ...studyFeedItems,
            ...tnpFeedItems
          ].sort((a, b) => {
            // Sort by creation date (latest first)
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB.getTime() - dateA.getTime();
          });

          setAllFeedItems(combinedFeed);
          return newEvents;
        });

        setEventsPage(nextPage);
        setEventsHasMore(data.pagination?.hasNext || false);
      }
    } catch (error) {
      console.error('Error loading more events:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFollow = async (communityId: string, handle: string) => {
    try {
      setFollowingStates(prev => ({ ...prev, [communityId]: true }));

      const response = await fetch(`/api/communities/${handle}/follow`, {
        method: 'POST',
      });

      if (!response.ok) {
        setFollowingStates(prev => ({ ...prev, [communityId]: false }));
      }
    } catch (error) {
      console.error('Error following community:', error);
      setFollowingStates(prev => ({ ...prev, [communityId]: false }));
    }
  };

  // Check if user has placement access (for create buttons)
  const hasPlacementAccess = session?.user?.role === 'ctc_student' || session?.user?.role === 'technical_lead' || session?.user?.role === 'operator' || session?.user?.role === 'admin';

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full flex-row justify-center gap-2">
              <TabsTrigger value="all" className="flex items-center gap-2 flex-1">
                <Plus className="h-4 w-4" />
                All Posts
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 flex-1">
                <CalendarDays className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="study" className="flex items-center gap-2 flex-1">
                <BookOpen className="h-4 w-4" />
                Study
              </TabsTrigger>
              <TabsTrigger value="tnp" className="flex items-center gap-2 flex-1">
                <Briefcase className="h-4 w-4" />
                TNP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">All Posts</h2>
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading posts...</p>
                  </div>
                ) : allFeedItems.length > 0 ? (
                  <>
                    <div className="grid gap-6">
                      {allFeedItems.map((item, index) => (
                        <div key={`${item.type}-${item.id}`}>
                          <motion.div
                            className="w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FeedCard item={item} />
                          </motion.div>

                          {/* Show mobile sections after first 1-2 posts */}
                          {((index === 0 && allFeedItems.length === 1) || index === 1) && (
                            <div className="md:hidden mt-6 space-y-6">
                              {/* Mobile Upcoming Events Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-bold flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5 text-white dark:text-white" />
                                    Upcoming Events
                                  </h3>
                                  <Link href="/events">
                                    <Button variant="ghost" size="sm" className="text-white dark:text-white hover:text-silver dark:hover:text-silver silver-hover">
                                      View All
                                    </Button>
                                  </Link>
                                </div>
                                {upcomingEvents.length > 0 ? (
                                  <div className="overflow-x-auto scrollbar-hide touch-pan-x w-screen -ml-4 -mr-4 sm:-ml-6 sm:-mr-6">
                                    <div className="flex gap-3 pb-4 pl-4 pr-4 sm:pl-6 sm:pr-6">
                                      {upcomingEvents.slice(0, 4).map((event, eventIndex) => (
                                        <motion.div
                                          key={event._id}
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.1 + eventIndex * 0.1 }}
                                          className="flex-shrink-0 w-64 sm:w-72"
                                        >
                                          <Link
                                            href={`/events/${event._id}`}
                                            className="block rounded-lg border p-4 transition-all hover:shadow-md hover:border-primary/30 bg-card"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div
                                                className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary to-silver flex-shrink-0 flex items-center justify-center"
                                                style={{
                                                  backgroundImage: event.image ? `url(${event.image})` : undefined,
                                                  backgroundSize: "cover",
                                                  backgroundPosition: "center",
                                                }}
                                              >
                                                {!event.image && <CalendarDays className="h-6 w-6 text-white" />}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate text-sm">{event.title}</p>
                                                {event.community && (
                                                  <div className="flex items-center gap-2 mt-1">
                                                    <Avatar className="h-3 w-3">
                                                      <AvatarImage src={event.community.avatar || ''} />
                                                      <AvatarFallback>
                                                        {event.community.name?.substring(0, 2) || 'EV'}
                                                      </AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                      {event.community.name || 'Unknown Community'}
                                                    </p>
                                                  </div>
                                                )}
                                                {event.date && (
                                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                                    <CalendarDays className="h-3 w-3" />
                                                    <span>{event.date}</span>
                                                  </div>
                                                )}
                                              </div>
                                              {event.userRegistered && (
                                                <Badge className="bg-green-500 text-white text-xs">✓</Badge>
                                              )}
                                            </div>
                                          </Link>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8">
                                    <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No upcoming events</p>
                                  </div>
                                )}
                              </div>

                              {/* Mobile Trending Communities Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Compass className="h-5 w-5 text-silver" />
                                    Trending Communities
                                  </h3>
                                  <Link href="/explore">
                                    <Button variant="ghost" size="sm" className="text-silver hover:text-silver-light">
                                      Explore
                                    </Button>
                                  </Link>
                                </div>
                                {trendingCommunities.length > 0 ? (
                                  <div className="overflow-x-auto scrollbar-hide touch-pan-x w-screen -ml-4 -mr-4 sm:-ml-6 sm:-mr-6">
                                    <div className="flex gap-3 pb-4 pl-4 pr-4 sm:pl-6 sm:pr-6">
                                      {trendingCommunities.slice(0, 5).map((community, commIndex) => (
                                        <motion.div
                                          key={community._id}
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.1 + commIndex * 0.1 }}
                                          className="flex-shrink-0 w-56 sm:w-64"
                                        >
                                          <div className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:shadow-md hover:border-primary/30 bg-card">
                                            <Avatar className="ring-2 ring-primary/10">
                                              <AvatarImage src={community.avatar} />
                                              <AvatarFallback className="bg-gradient-to-br from-primary to-silver text-white">
                                                {community.name.substring(0, 2)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <Link
                                                  href={`/communities/${community.handle}`}
                                                  className="font-semibold hover:text-primary transition-colors truncate text-sm"
                                                >
                                                  {community.name}
                                                </Link>
                                                {community.isVerified && (
                                                  <Badge variant="outline" className="h-3 border-blue-300 px-1 text-[8px] text-blue-500">
                                                    ✓
                                                  </Badge>
                                                )}
                                              </div>
                                              <p className="text-xs text-muted-foreground">@{community.handle}</p>
                                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <Users size={10} />
                                                <span>{community.membersCount} members</span>
                                              </div>
                                            </div>
                                            {session && community.userRelation !== 'member' && community.userRelation !== 'admin' && community.userRelation !== 'follower' && (
                                              <Button
                                                size="sm"
                                                variant={followingStates[community._id] ? "default" : "outline"}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  handleFollow(community._id, community.handle);
                                                }}
                                                className="h-6 text-xs px-2"
                                              >
                                                {followingStates[community._id] ? "Following" : "Follow"}
                                              </Button>
                                            )}
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8">
                                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No trending communities</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No posts found.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Events</h2>
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading events...</p>
                  </div>
                ) : eventsFeedItems.length > 0 ? (
                  <>
                    <div className="grid gap-6">
                      {eventsFeedItems.map((item, index) => (
                        <div key={item.id}>
                          <motion.div
                            className="w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FeedCard item={item} />
                          </motion.div>

                          {/* Show mobile sections after first 1-2 events */}
                          {((index === 0 && eventsFeedItems.length === 1) || index === 1) && (
                            <div className="md:hidden mt-6 space-y-6">
                              {/* Mobile Upcoming Events Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-bold flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5 text-white dark:text-white" />
                                    Upcoming Events
                                  </h3>
                                  <Link href="/events">
                                    <Button variant="ghost" size="sm" className="text-white dark:text-white hover:text-silver dark:hover:text-silver silver-hover">
                                      View All
                                    </Button>
                                  </Link>
                                </div>
                                {upcomingEvents.length > 0 ? (
                                  <div className="overflow-x-auto scrollbar-hide touch-pan-x w-screen -ml-4 -mr-4 sm:-ml-6 sm:-mr-6">
                                    <div className="flex gap-3 pb-4 pl-4 pr-4 sm:pl-6 sm:pr-6">
                                      {upcomingEvents.slice(0, 4).map((event, eventIndex) => (
                                        <motion.div
                                          key={event._id}
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.1 + eventIndex * 0.1 }}
                                          className="flex-shrink-0 w-64 sm:w-72"
                                        >
                                          <Link
                                            href={`/events/${event._id}`}
                                            className="block rounded-lg border p-4 transition-all hover:shadow-md hover:border-primary/30 bg-card"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div
                                                className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary to-silver flex-shrink-0 flex items-center justify-center"
                                                style={{
                                                  backgroundImage: event.image ? `url(${event.image})` : undefined,
                                                  backgroundSize: "cover",
                                                  backgroundPosition: "center",
                                                }}
                                              >
                                                {!event.image && <CalendarDays className="h-6 w-6 text-white" />}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate text-sm">{event.title}</p>
                                                {event.community && (
                                                  <div className="flex items-center gap-2 mt-1">
                                                    <Avatar className="h-3 w-3">
                                                      <AvatarImage src={event.community.avatar || ''} />
                                                      <AvatarFallback>
                                                        {event.community.name?.substring(0, 2) || 'EV'}
                                                      </AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                      {event.community.name || 'Unknown Community'}
                                                    </p>
                                                  </div>
                                                )}
                                                {event.date && (
                                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                                    <CalendarDays className="h-3 w-3" />
                                                    <span>{event.date}</span>
                                                  </div>
                                                )}
                                              </div>
                                              {event.userRegistered && (
                                                <Badge className="bg-green-500 text-white text-xs">✓</Badge>
                                              )}
                                            </div>
                                          </Link>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8">
                                    <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No upcoming events</p>
                                  </div>
                                )}
                              </div>

                              {/* Mobile Trending Communities Section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Compass className="h-5 w-5 text-silver" />
                                    Trending Communities
                                  </h3>
                                  <Link href="/explore">
                                    <Button variant="ghost" size="sm" className="text-silver hover:text-silver-light">
                                      Explore
                                    </Button>
                                  </Link>
                                </div>
                                {trendingCommunities.length > 0 ? (
                                  <div className="overflow-x-auto scrollbar-hide touch-pan-x w-screen -ml-4 -mr-4 sm:-ml-6 sm:-mr-6">
                                    <div className="flex gap-3 pb-4 pl-4 pr-4 sm:pl-6 sm:pr-6">
                                      {trendingCommunities.slice(0, 5).map((community, commIndex) => (
                                        <motion.div
                                          key={community._id}
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.1 + commIndex * 0.1 }}
                                          className="flex-shrink-0 w-56 sm:w-64"
                                        >
                                          <div className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:shadow-md hover:border-primary/30 bg-card">
                                            <Avatar className="ring-2 ring-primary/10">
                                              <AvatarImage src={community.avatar} />
                                              <AvatarFallback className="bg-gradient-to-br from-primary to-silver text-white">
                                                {community.name.substring(0, 2)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <Link
                                                  href={`/communities/${community.handle}`}
                                                  className="font-semibold hover:text-primary transition-colors truncate text-sm"
                                                >
                                                  {community.name}
                                                </Link>
                                                {community.isVerified && (
                                                  <Badge variant="outline" className="h-3 border-blue-300 px-1 text-[8px] text-blue-500">
                                                    ✓
                                                  </Badge>
                                                )}
                                              </div>
                                              <p className="text-xs text-muted-foreground">@{community.handle}</p>
                                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <Users size={10} />
                                                <span>{community.membersCount} members</span>
                                              </div>
                                            </div>
                                            {session && community.userRelation !== 'member' && community.userRelation !== 'admin' && community.userRelation !== 'follower' && (
                                              <Button
                                                size="sm"
                                                variant={followingStates[community._id] ? "default" : "outline"}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  handleFollow(community._id, community.handle);
                                                }}
                                                className="h-6 text-xs px-2"
                                              >
                                                {followingStates[community._id] ? "Following" : "Follow"}
                                              </Button>
                                            )}
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8">
                                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No trending communities</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {eventsHasMore && (
                      <div className="flex justify-center mt-6">
                        <Button
                          onClick={loadMoreEvents}
                          disabled={loadingMore}
                          variant="outline"
                          className="silver-hover"
                        >
                          {loadingMore ? "Loading..." : "Load More Events"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-center py-12">
                      <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No events found.</p>
                    </div>

                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="study" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Study Resources</h2>
                {((session?.user as any)?.role === 'operator' || (session?.user as any)?.role === 'admin') && (
                  <Link href="/study/create">
                    <Button size="sm" className="silver-hover">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Resource
                    </Button>
                  </Link>
                )}
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading study resources...</p>
                  </div>
                ) : studyFeedItems.length > 0 ? (
                  <div className="grid gap-6">
                    {studyFeedItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className="w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FeedCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No study resources found.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tnp" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Training & Placement</h2>
                {((session?.user as any)?.role === 'operator' || (session?.user as any)?.role === 'admin') && (
                  <Link href="/tnp/create">
                    <Button size="sm" className="silver-hover">
                      <Plus className="mr-2 h-4 w-4" />
                      Create TNP Post
                    </Button>
                  </Link>
                )}
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading TNP updates...</p>
                  </div>
                ) : tnpFeedItems.length > 0 ? (
                  <div className="grid gap-6">
                    {tnpFeedItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className="w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FeedCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No TNP updates found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>



        {/* Right Sidebar - Hidden on mobile, visible on tablet and desktop */}
        <div className="hidden md:block lg:col-span-4">
          <div className="space-y-6 sticky top-6">
            {/* Upcoming Events Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="modern-card modern-card-hover overflow-hidden shadow-lg">
                <CardHeader className="bg-muted/50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CalendarDays className="h-5 w-5 text-white dark:text-silver" />
                      Upcoming Events
                    </CardTitle>
                    <Link href="/events">
                      <Button variant="ghost" size="sm" className="text-white dark:text-white hover:text-silver dark:hover:text-silver silver-hover">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {upcomingEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 md:px-6">
                      <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">No upcoming events</p>
                      <Button asChild size="sm" className="silver-hover">
                        <Link href="/explore">Discover Events</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {upcomingEvents.slice(0, 3).map((event, index) => (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <Link
                            href={`/events/${event._id}`}
                            className="block rounded-lg border p-3 md:p-4 transition-all hover:shadow-md hover:border-primary/30 bg-card silver-hover"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="h-12 w-12 md:h-14 md:w-14 rounded-lg bg-gradient-to-r from-primary to-silver flex-shrink-0 flex items-center justify-center"
                                style={{
                                  backgroundImage: event.image
                                    ? `url(${event.image})`
                                    : undefined,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              >
                                {!event.image && (
                                  <CalendarDays className="h-6 w-6 text-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{event.title}</p>
                                {event.community && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarImage src={event.community.avatar || ''} />
                                      <AvatarFallback>
                                        {event.community.name?.substring(0, 2) || 'EV'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {event.community.name || 'Unknown Community'}
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                  {event.date && (
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="h-3 w-3" />
                                      <span>{event.date}</span>
                                    </div>
                                  )}
                                  {event.time && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{event.time}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {event.userRegistered && (
                                <Badge className="bg-green-500 dark:bg-green-600 text-white text-xs">
                                  ✓ Registered
                                </Badge>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Trending Communities Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="modern-card modern-card-hover overflow-hidden shadow-lg">
                <CardHeader className="bg-muted/50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Compass className="h-5 w-5 text-silver" />
                      Trending Communities
                    </CardTitle>
                    <Link href="/explore">
                      <Button variant="ghost" size="sm" className="text-silver hover:text-silver-light silver-hover">
                        Explore
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {trendingCommunities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 md:px-6">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">No trending communities</p>
                      <Button asChild size="sm" className="silver-hover">
                        <Link href="/explore">Explore</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {trendingCommunities.slice(0, 4).map((community, index) => (
                        <motion.div
                          key={community._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md hover:border-primary/30 bg-card silver-hover"
                        >
                          <Avatar className="ring-2 ring-primary/10">
                            <AvatarImage src={community.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-silver text-white">
                              {community.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/communities/${community.handle}`}
                                className="font-semibold hover:text-primary transition-colors truncate"
                              >
                                {community.name}
                              </Link>
                              {community.isVerified && (
                                <Badge variant="outline" className="h-4 border-blue-300 dark:border-blue-700 px-1 text-[10px] text-blue-500 dark:text-blue-400">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">@{community.handle}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Users size={10} />
                              <span>{community.membersCount} members</span>
                            </div>
                          </div>
                          {session && community.userRelation !== 'member' && community.userRelation !== 'admin' && community.userRelation !== 'follower' && (
                            <Button
                              size="sm"
                              variant={followingStates[community._id] ? "default" : "outline"}
                              onClick={(e) => {
                                e.preventDefault();
                                handleFollow(community._id, community.handle);
                              }}
                              className="h-7 text-xs px-3 btn-modern"
                            >
                              {followingStates[community._id] ? "Following" : "Follow"}
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
