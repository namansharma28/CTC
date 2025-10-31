"use client";

import { useState, useEffect, Suspense, lazy, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  BookOpen,
  Briefcase,
  Plus,
  Compass,
  Users,
  Clock,
  Phone,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedItem } from "@/types/feed";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components
const FeedCard = lazy(() => import("@/components/feed/feed-card"));
const MobileTrendingCommunities = lazy(
  () => import("@/components/home/mobile-trending-communities")
);
const MobileUpcomingEvents = lazy(
  () => import("@/components/home/mobile-upcoming-events")
);

// Skeleton component for feed cards
const FeedCardSkeleton = () => (
  <div className="rounded-lg border p-4 space-y-3">
    <div className="flex items-center space-x-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-32 w-full rounded-md" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

interface Event {
  _id: string;
  title: string;
  date?: string;
  time?: string;
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

  // Feeds / lists
  const [eventsFeedItems, setEventsFeedItems] = useState<FeedItem[]>([]);
  const [studyFeedItems, setStudyFeedItems] = useState<FeedItem[]>([]);
  const [tnpFeedItems, setTnpFeedItems] = useState<FeedItem[]>([]);
  const [allFeedItems, setAllFeedItems] = useState<FeedItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [trendingCommunities, setTrendingCommunities] = useState<Community[]>(
    []
  );

  const [followingStates, setFollowingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsHasMore, setEventsHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // persistent cache across renders
  const apiCacheRef = useRef<Map<string, any>>(new Map());

  // caching fetch helper
  const fetchWithCache = async (url: string, options: RequestInit = {}) => {
    const cache = apiCacheRef.current;
    if (cache.has(url)) {
      return cache.get(url);
    }
    const response = await fetch(url, options);
    const data = await response.json();
    cache.set(url, data);
    return data;
  };

  // Optimized feed list component - note: MUST be declared before return()
  const OptimizedFeedList = ({
    items,
    loading,
    loadingMore,
  }: {
    items: any[];
    loading: boolean;
    loadingMore: boolean;
  }) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <FeedCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts available</p>
        </div>
      );
    }

    return (
      <>
        {/* Render first batch immediately */}
        {items.slice(0, 5).map((item, index) => (
          <Suspense
            key={`${item.id || item._id || index}-initial`}
            fallback={<FeedCardSkeleton />}
          >
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FeedCard item={item} />
            </motion.div>
          </Suspense>
        ))}

        {/* Remaining items */}
        {items.length > 5 && (
          <div id="remaining-items">
            {items.slice(5).map((item, index) => (
              <Suspense
                key={`${item.id || item._id || index}-delayed`}
                fallback={<FeedCardSkeleton />}
              >
                <motion.div
                  className="w-full mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <FeedCard item={item} />
                </motion.div>
              </Suspense>
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="py-4">
            <FeedCardSkeleton />
          </div>
        )}
      </>
    );
  };

  // current feed items for "All" tab (combined)
  const currentFeedItems = allFeedItems;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Events (initial small batch)
        let eventsData: any = { events: [], pagination: null };
        try {
          const eventsResponse = await fetchWithCache(
            "/api/events/feed?page=1&limit=5"
          );
          if (eventsResponse) {
            eventsData = eventsResponse;
            if (eventsData.events && Array.isArray(eventsData.events)) {
              setEventsFeedItems(eventsData.events);
              setEventsHasMore(eventsData.pagination?.hasNext || false);
            }
          }
        } catch (error) {
          console.error("Error fetching events:", error);
        }

        // Upcoming events
        try {
          const upcomingData = await fetchWithCache(
            "/api/events/upcoming?limit=4"
          );
          if (Array.isArray(upcomingData)) {
            setUpcomingEvents(upcomingData);
          }
        } catch (error) {
          console.error("Error fetching upcoming events:", error);
        }

        // Study posts
        let studyData: any = { success: false, data: [] };
        try {
          studyData = await fetchWithCache("/api/study");
          if (studyData?.success) {
            const initialStudyItems = studyData.data
              .slice(0, 5)
              .map((item: any) => ({ ...item, type: "study" }));
            setStudyFeedItems(initialStudyItems);

            if (studyData.data.length > 5) {
              setTimeout(() => {
                const remainingItems = studyData.data
                  .slice(5)
                  .map((item: any) => ({ ...item, type: "study" }));
                setStudyFeedItems((prev) => [...prev, ...remainingItems]);
              }, 1000);
            }
          }
        } catch (error) {
          console.error("Error fetching study posts:", error);
        }

        // TNP posts
        let tnpData: any = { success: false, data: [] };
        try {
          tnpData = await fetchWithCache("/api/tnp");
        } catch (error) {
          console.error("Error fetching TNP posts:", error);
        }

        let filteredTnpItems: FeedItem[] = [];
        if (tnpData?.success) {
          const allTnpItems = tnpData.data.map((item: any) => ({
            ...item,
            type: "tnp",
          }));

          const userRole = (session as any)?.user?.role;
          const hasPlacementAccess =
            userRole === "ctc_student" ||
            userRole === "technical_lead" ||
            userRole === "operator" ||
            userRole === "admin";

          filteredTnpItems = allTnpItems.filter((item: any) => {
            if (item.category === "placement" && !hasPlacementAccess) {
              return false;
            }
            if (item.deadline) {
              const deadlineDate = new Date(item.deadline);
              if (!isNaN(deadlineDate.getTime()) && deadlineDate < new Date()) {
                return false;
              }
            }
            return true;
          });

          setTnpFeedItems(filteredTnpItems);
        }

        // Trending communities
        try {
          const communitiesResponse = await fetch("/api/communities/trending");
          if (communitiesResponse.ok) {
            const communitiesData = await communitiesResponse.json();
            if (
              communitiesData.success &&
              Array.isArray(communitiesData.data)
            ) {
              const validCommunities = communitiesData.data.filter(
                (community: any) =>
                  community && community._id && community.name && community.handle
              );
              setTrendingCommunities(validCommunities.slice(0, 5));
            }
          }
        } catch (error) {
          console.error("Error fetching trending communities:", error);
        }

        // Combine feeds
        const studyItems = studyData?.success
          ? studyData.data.map((item: any) => ({ ...item, type: "study" }))
          : [];

        const now = new Date();
        const filteredEvents = (eventsData.events || []).filter((event: any) => {
          if (event.date) {
            const eventDate = new Date(event.date);
            return eventDate >= now;
          }
          return true;
        });

        const combinedFeed = [...filteredEvents, ...studyItems, ...filteredTnpItems].sort(
          (a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB.getTime() - dateA.getTime();
          }
        );

        setAllFeedItems(combinedFeed);
      } catch (error) {
        console.error("Error fetching feed data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // include session because TNP filtering depends on it
  }, [session]);

  const loadMoreEvents = async () => {
    if (loadingMore || !eventsHasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = eventsPage + 1;
      const data = await fetchWithCache(
        `/api/events/feed?page=${nextPage}&limit=10`
      );

      if (data?.events && Array.isArray(data.events)) {
        const processEvents = () => {
          setEventsFeedItems((prev) => {
            const newEvents = [...prev, ...data.events];

            const now = new Date();
            const filteredEvents = newEvents.filter((event: any) => {
              if (event.date) {
                const eventDate = new Date(event.date);
                return eventDate >= now;
              }
              return true;
            });

            const combinedFeed = [
              ...filteredEvents,
              ...studyFeedItems,
              ...tnpFeedItems,
            ].sort((a, b) => {
              const dateA = new Date(a.createdAt || a.date || 0);
              const dateB = new Date(b.createdAt || b.date || 0);
              return dateB.getTime() - dateA.getTime();
            });

            setAllFeedItems(combinedFeed);
            return newEvents;
          });

          setEventsPage(nextPage);
          setEventsHasMore(data.pagination?.hasNext || false);
        };

        window.requestAnimationFrame(processEvents);
      }
    } catch (error) {
      console.error("Error loading more events:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFollow = async (communityId: string, handle: string) => {
    try {
      setFollowingStates((prev) => ({ ...prev, [communityId]: true }));

      const response = await fetch(`/api/communities/${handle}/follow`, {
        method: "POST",
      });

      if (!response.ok) {
        setFollowingStates((prev) => ({ ...prev, [communityId]: false }));
      }
    } catch (error) {
      console.error("Error following community:", error);
      setFollowingStates((prev) => ({ ...prev, [communityId]: false }));
    }
  };

  // placement access check
  const hasPlacementAccess =
    (session as any)?.user?.role === "ctc_student" ||
    (session as any)?.user?.role === "technical_lead" ||
    (session as any)?.user?.role === "operator" ||
    (session as any)?.user?.role === "admin";

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {(session as any)?.user?.role !== "operator" && (
              <Link
                href="https://wa.me/+919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>WhatsApp</span>
                </Button>
              </Link>
            )}
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-auto p-1">
              <TabsTrigger
                value="all"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">All</span>
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm"
              >
                <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Events</span>
              </TabsTrigger>
              <TabsTrigger
                value="study"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm"
              >
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Study</span>
              </TabsTrigger>
              <TabsTrigger
                value="tnp"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm"
              >
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">TNP</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">All Posts</h2>
              </div>
              <div className="space-y-4">
                <OptimizedFeedList
                  items={currentFeedItems}
                  loading={isLoading}
                  loadingMore={loadingMore}
                />
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Events</h2>
              </div>
              <div className="space-y-6">
                <OptimizedFeedList
                  items={eventsFeedItems}
                  loading={isLoading}
                  loadingMore={loadingMore}
                />

                {/* Show mobile sections after first events */}
                {eventsFeedItems.length > 0 && (
                  <div className="md:hidden mt-6 space-y-6">
                    {/* Mobile Upcoming Events Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-white dark:text-white" />
                          Upcoming Events
                        </h3>
                        <Link href="/events">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white dark:text-white hover:text-silver dark:hover:text-silver "
                          >
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
                                          <Avatar className="h-3 w-3">
                                            <AvatarImage src={event.community.avatar || ""} />
                                            <AvatarFallback>
                                              {event.community.name?.substring(0, 2) || "EV"}
                                            </AvatarFallback>
                                          </Avatar>
                                          <p className="text-xs text-muted-foreground truncate">
                                            {event.community.name || "Unknown Community"}
                                          </p>
                                        </div>
                                      )}
                                      {event.date && (
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                          <div className="flex items-center gap-1">
                                            <CalendarDays className="h-3 w-3" />
                                            <span>{event.date}</span>
                                          </div>
                                          {event.time && (
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              <span>{event.time}</span>
                                            </div>
                                          )}
                                        </div>
                                      )}
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
                                  {session &&
                                    community.userRelation !== "member" &&
                                    community.userRelation !== "admin" &&
                                    community.userRelation !== "follower" && (
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
                {/* End mobile sections */}
              </div>

              {/* Load more button for events */}
              {eventsHasMore && (
                <div className="flex justify-center mt-6">
                  <Button onClick={loadMoreEvents} disabled={loadingMore} variant="outline">
                    {loadingMore ? "Loading..." : "Load More Events"}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="study" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Study Resources</h2>
                {((session as any)?.user?.role === "operator" ||
                  (session as any)?.user?.role === "admin") && (
                  <Link href="/study/create">
                    <Button size="sm" className="">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Resource
                    </Button>
                  </Link>
                )}
              </div>
              <div className="space-y-6">
                <OptimizedFeedList items={studyFeedItems} loading={isLoading} loadingMore={false} />
                {studyFeedItems.length === 0 && !isLoading && (
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
                {((session as any)?.user?.role === "operator" ||
                  (session as any)?.user?.role === "admin") && (
                  <Link href="/tnp/create">
                    <Button size="sm" className="">
                      <Plus className="mr-2 h-4 w-4" />
                      Create TNP Post
                    </Button>
                  </Link>
                )}
              </div>
              <div className="space-y-6">
                <OptimizedFeedList items={tnpFeedItems} loading={isLoading} loadingMore={false} />
                {tnpFeedItems.length === 0 && !isLoading && (
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
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="modern-card modern-card-hover overflow-hidden shadow-lg">
                <CardHeader className="bg-muted/50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CalendarDays className="h-5 w-5 text-white dark:text-silver" />
                      Upcoming Events
                    </CardTitle>
                    <Link href="/events">
                      <Button variant="ghost" size="sm" className="text-white dark:text-white hover:text-silver dark:hover:text-silver ">
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
                      <Button asChild size="sm">
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
                          <Link href={`/events/${event._id}`} className="block rounded-lg border p-3 md:p-4 transition-all hover:shadow-md hover:border-primary/30 bg-card ">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-12 w-12 md:h-14 md:w-14 rounded-lg bg-gradient-to-r from-primary to-silver flex-shrink-0 flex items-center justify-center"
                                style={{
                                  backgroundImage: event.image ? `url(${event.image})` : undefined,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              >
                                {!event.image && <CalendarDays className="h-6 w-6 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{event.title}</p>
                                {event.community && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarImage src={event.community.avatar || ""} />
                                      <AvatarFallback>
                                        {event.community.name?.substring(0, 2) || "EV"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {event.community.name || "Unknown Community"}
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
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="modern-card modern-card-hover overflow-hidden shadow-lg">
                <CardHeader className="bg-muted/50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Compass className="h-5 w-5 text-silver" />
                      Trending Communities
                    </CardTitle>
                    <Link href="/explore">
                      <Button variant="ghost" size="sm" className="text-silver hover:text-silver-light ">
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
                      <Button asChild size="sm">
                        <Link href="/explore">Explore</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {trendingCommunities.slice(0, 4).map((community, index) => (
                        <Link key={community._id} href={`/communities/${community.handle}`} className="font-semibold hover:text-primary transition-colors truncate">
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md hover:border-white/70 bg-card "
                          >
                            <Avatar className="ring-2 ring-primary/10">
                              <AvatarImage src={community.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-silver text-white">
                                {community.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span>{community.name}</span>
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
                            {session &&
                              community.userRelation !== "member" &&
                              community.userRelation !== "admin" &&
                              community.userRelation !== "follower" && (
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
                        </Link>
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
