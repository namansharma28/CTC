"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Users, Calendar, Share2, Copy, Eye, UserPlus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatDateWithFallback } from "@/lib/date-utils";
import Link from "next/link";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    community: {
        name: string;
        handle: string;
    };
    registrations: number;
    maxCapacity?: number;
}

interface ReferralStats {
    totalReferrals: number;
    thisMonth: number;
    topEvents: Array<{
        eventId: string;
        eventTitle: string;
        referrals: number;
    }>;
    recentReferrals: Array<{
        id: string;
        eventTitle: string;
        eventId: string;
        userName: string;
        createdAt: string;
        formTitle: string;
    }>;
}

export default function TechnicalLeadDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [events, setEvents] = useState<Event[]>([]);
    const [referralStats, setReferralStats] = useState<ReferralStats>({
        totalReferrals: 0,
        thisMonth: 0,
        topEvents: [],
        recentReferrals: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Check if user is a technical lead
        if (status === "authenticated") {
            const userRole = (session?.user as any)?.role;
            if (userRole !== "technical_lead") {
                toast({
                    title: "Access Denied",
                    description: "Only Technical Leads can access this page",
                    variant: "destructive",
                });
                router.push("/home");
                return;
            }
            fetchEvents();
            fetchReferralStats();
        } else if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [session, status, router, toast]);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/events');
            if (response.ok) {
                const data = await response.json();
                const eventsArray = Array.isArray(data) ? data : (data.data || data.events || []);
                setEvents(eventsArray);
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
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReferralStats = async () => {
        try {
            const response = await fetch('/api/technical-lead/referrals');
            if (response.ok) {
                const data = await response.json();
                setReferralStats({
                    totalReferrals: data.totalReferrals,
                    thisMonth: data.thisMonth,
                    topEvents: data.topEvents,
                    recentReferrals: data.recentReferrals || []
                });
            } else {
                throw new Error('Failed to fetch referral stats');
            }
        } catch (error) {
            console.error('Error fetching referral stats:', error);
            toast({
                title: "Error",
                description: "Failed to load referral statistics",
                variant: "destructive",
            });
        }
    };

    const generateReferralLink = (eventId: string) => {
        const userId = session?.user?.id;
        if (!userId) return "";

        const baseUrl = window.location.origin;
        const referralCode = btoa(userId).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
        return `${baseUrl}/events/${eventId}?ref=${referralCode}&tlId=${userId}`;
    };

    const copyReferralLink = (eventId: string, eventTitle: string) => {
        const link = generateReferralLink(eventId);
        navigator.clipboard.writeText(link);
        toast({
            title: "Link copied!",
            description: `Referral link for "${eventTitle}" copied to clipboard`,
        });
    };

    const shareReferralLink = async (eventId: string, eventTitle: string) => {
        const link = generateReferralLink(eventId);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Join ${eventTitle}`,
                    text: `Check out this amazing event: ${eventTitle}`,
                    url: link,
                });
            } catch (error) {
                // Fallback to copy if share fails
                copyReferralLink(eventId, eventTitle);
            }
        } else {
            copyReferralLink(eventId, eventTitle);
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.community?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4 px-4 sm:py-8 space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Technical Lead Dashboard</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">Share events and track your referrals</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
                        <p className="text-xs text-muted-foreground">All time referrals</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{referralStats.thisMonth}</div>
                        <p className="text-xs text-muted-foreground">New referrals this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{events.length}</div>
                        <p className="text-xs text-muted-foreground">Events you can share</p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performing Events */}
            {referralStats.topEvents.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Events</CardTitle>
                        <CardDescription>Events with the most referrals from you</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {referralStats.topEvents.map((event, index) => (
                                <div key={event.eventId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium">{event.eventTitle}</span>
                                    </div>
                                    <Badge variant="secondary">{event.referrals} referrals</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Events List */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Share Events</CardTitle>
                            <CardDescription>Generate referral links for events and track registrations</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery ? "No events found matching your search" : "No events available"}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[200px]">Event</TableHead>
                                        <TableHead className="min-w-[120px] hidden sm:table-cell">Date</TableHead>
                                        <TableHead className="min-w-[100px] hidden md:table-cell">Status</TableHead>
                                        <TableHead className="min-w-[120px] hidden lg:table-cell">Community</TableHead>
                                        <TableHead className="text-right min-w-[200px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEvents.map((event) => {
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
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatDateWithFallback(event.date, 'TBD')} • {event.time}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground lg:hidden">
                                                                {event.community?.name || 'Community'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="text-sm">
                                                        <p>{formatDateWithFallback(event.date, 'TBD')}</p>
                                                        <p className="text-muted-foreground">{event.time}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant={eventStatus.variant}>
                                                        {eventStatus.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="text-sm">
                                                        <p className="font-medium">{event.community?.name || 'Community'}</p>
                                                        <p className="text-muted-foreground">@{event.community?.handle || 'unknown'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 sm:gap-2 justify-end">
                                                        <Link href={`/events/${event.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => copyReferralLink(event.id, event.title)}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => shareReferralLink(event.id, event.title)}
                                                        >
                                                            <Share2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
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

            {/* Recent Referrals */}
            {referralStats.recentReferrals.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Referrals</CardTitle>
                        <CardDescription>Latest people you've referred to events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[150px]">User</TableHead>
                                        <TableHead className="min-w-[200px] hidden sm:table-cell">Event</TableHead>
                                        <TableHead className="min-w-[120px] hidden md:table-cell">Form</TableHead>
                                        <TableHead className="text-right min-w-[100px]">When</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referralStats.recentReferrals.map((referral) => (
                                        <TableRow key={referral.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{referral.userName}</p>
                                                    <p className="text-sm text-muted-foreground sm:hidden">
                                                        {referral.eventTitle}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Link href={`/events/${referral.eventId}`} className="hover:underline">
                                                    {referral.eventTitle}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <span className="text-sm text-muted-foreground">{referral.formTitle}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDateWithFallback(referral.createdAt, 'Unknown')}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* How it Works */}
            <Card>
                <CardHeader>
                    <CardTitle>How Referral Tracking Works</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Share2 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">1. Share Your Link</h3>
                            <p className="text-sm text-muted-foreground">
                                Generate and share referral links for events with your unique identifier
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <UserPlus className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">2. Users Register</h3>
                            <p className="text-sm text-muted-foreground">
                                When users register through your link, their forms include your email as reference
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">3. Track Performance</h3>
                            <p className="text-sm text-muted-foreground">
                                Monitor your referral statistics and see which events perform best
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}