"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CalendarDays, BookOpen, Briefcase, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types/user';
import FeedCard from '@/components/feed/feed-card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FeedItem } from '@/types/feed';
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [eventsFeedItems, setEventsFeedItems] = useState<FeedItem[]>([]);
  const [studyFeedItems, setStudyFeedItems] = useState<FeedItem[]>([]);
  const [tnpFeedItems, setTnpFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch events data
        const eventsResponse = await fetch('/api/events');
        const eventsData = await eventsResponse.json();
        if (eventsData.success) {
          setEventsFeedItems(eventsData.data.map((item: any) => ({
            ...item,
            type: 'event'
          })));
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

        // Fetch TNP posts
        const tnpResponse = await fetch('/api/tnp');
        const tnpData = await tnpResponse.json();
        if (tnpData.success) {
          setTnpFeedItems(tnpData.data.map((item: any) => ({
            ...item,
            type: 'tnp'
          })));
        }
      } catch (error) {
        console.error('Error fetching feed data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if user has TNP role
  const hasTNPRole = session?.user?.role === 'ctc_student' || session?.user?.role === 'technical_lead' || session?.user?.role === 'operator' || session?.user?.role === 'admin';

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>



      <Tabs defaultValue="events" className="w-full">
        <TabsList className="w-full flex-row justify-center gap-4">
          <TabsTrigger value="events" className="flex items-center gap-2 w-full">
            <CalendarDays className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="study" className="flex items-center gap-2 w-full">
            <BookOpen className="h-4 w-4" />
            Study
          </TabsTrigger>
          {hasTNPRole && (
            <TabsTrigger value="tnp" className="flex items-center gap-2 w-full">
              <Briefcase className="h-4 w-4" />
              TNP
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Events</h2>
          </div>
          <ScrollArea className="h-[600px] rounded-md border p-4">
            <div className="flex flex-col items-center space-y-6">
              {isLoading ? (
                <p>Loading events...</p>
              ) : eventsFeedItems.length > 0 ? (
                eventsFeedItems.map((item) => (
                  <div key={item.id} className="w-full max-w-md">
                    <FeedCard item={item} />
                  </div>
                ))
              ) : (
                <p>No events found.</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="study" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Study Resources</h2>
            {((session?.user as any)?.role === 'operator' || (session?.user as any)?.role === 'admin') && (
              <Link href="/study/create">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Resource
                </Button>
              </Link>
            )}
          </div>
          <ScrollArea className="h-[600px] rounded-md border p-4">
            <div className="flex flex-col items-center space-y-6">
              {isLoading ? (
                <p>Loading study resources...</p>
              ) : studyFeedItems.length > 0 ? (
                studyFeedItems.map((item) => (
                  <div key={item.id} className="w-full max-w-md">
                    <FeedCard item={item} />
                  </div>
                ))
              ) : (
                <p>No study resources found.</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {hasTNPRole && (
          <TabsContent value="tnp" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Training & Placement</h2>
              {((session?.user as any)?.role === 'operator' || (session?.user as any)?.role === 'admin') && (
                <Link href="/tnp/create">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create TNP Post
                  </Button>
                </Link>
              )}
            </div>
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <div className="flex flex-col items-center space-y-6">
                {isLoading ? (
                  <p>Loading TNP updates...</p>
                ) : tnpFeedItems.length > 0 ? (
                  tnpFeedItems.map((item) => (
                    <div key={item.id} className="w-full max-w-md">
                      <FeedCard item={item} />
                    </div>
                  ))
                ) : (
                  <p>No TNP updates found.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
