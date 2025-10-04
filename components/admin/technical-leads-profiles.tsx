"use client";

import { useState, useEffect } from "react";
import { Shield, Users, TrendingUp, Calendar, Award, Trophy, ExternalLink, Eye, Mail, MapPin, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface TechnicalLead {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinedDate: string;
    lastActive?: string;
    statistics: {
        totalReferrals: number;
        thisMonth: number;
        thisWeek: number;
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
        monthlyBreakdown: Array<{
            month: string;
            referrals: number;
        }>;
    };
}

interface TLProfilesData {
    technicalLeads: TechnicalLead[];
    summary: {
        totalTLs: number;
        activeTLs: number;
        totalReferrals: number;
        thisMonthReferrals: number;
    };
}

export default function TechnicalLeadsProfiles() {
    const [data, setData] = useState<TLProfilesData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedTL, setExpandedTL] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'referrals' | 'recent' | 'name'>('referrals');

    useEffect(() => {
        fetchTLProfiles();
    }, []);

    const fetchTLProfiles = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/technical-leads/profiles');

            if (response.ok) {
                const profilesData = await response.json();
                setData(profilesData);
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Failed to fetch TL profiles:', response.status, errorData);
            }
        } catch (error) {
            console.error('Error fetching TL profiles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths}mo ago`;
    };

    const sortedTLs = data?.technicalLeads.sort((a, b) => {
        switch (sortBy) {
            case 'referrals':
                return b.statistics.totalReferrals - a.statistics.totalReferrals;
            case 'recent':
                return new Date(b.lastActive || b.joinedDate).getTime() - new Date(a.lastActive || a.joinedDate).getTime();
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    }) || [];

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Technical Leads Profiles
                    </CardTitle>
                    <CardDescription>Comprehensive view of all Technical Lead profiles and performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.technicalLeads.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Technical Leads Profiles
                    </CardTitle>
                    <CardDescription>Comprehensive view of all Technical Lead profiles and performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No Technical Leads found</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{data.summary.totalTLs}</div>
                        <div className="text-sm text-muted-foreground">Total TLs</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{data.summary.activeTLs}</div>
                        <div className="text-sm text-muted-foreground">Active TLs</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{data.summary.totalReferrals}</div>
                        <div className="text-sm text-muted-foreground">Total Referrals</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{data.summary.thisMonthReferrals}</div>
                        <div className="text-sm text-muted-foreground">This Month</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main TL Profiles */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Technical Leads Profiles ({data.technicalLeads.length})
                            </CardTitle>
                            <CardDescription>Detailed profiles and performance metrics for all Technical Leads</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="text-sm border rounded px-2 py-1"
                            >
                                <option value="referrals">Referrals</option>
                                <option value="recent">Recent Activity</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sortedTLs.map((tl) => (
                            <Collapsible key={tl.id} open={expandedTL === tl.id} onOpenChange={(open) => setExpandedTL(open ? tl.id : null)}>
                                <CollapsibleTrigger asChild>
                                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={tl.avatar || undefined} />
                                                        <AvatarFallback>{getInitials(tl.name)}</AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold">{tl.name}</h3>
                                                            <Badge variant="secondary">
                                                                <Shield className="mr-1 h-3 w-3" />
                                                                TL
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{tl.email}</p>
                                                        {tl.bio && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{tl.bio}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-primary">{tl.statistics.totalReferrals}</div>
                                                        <div className="text-xs text-muted-foreground">Total</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-green-600">{tl.statistics.thisMonth}</div>
                                                        <div className="text-xs text-muted-foreground">This Month</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs text-muted-foreground">Joined</div>
                                                        <div className="text-sm font-medium">{new Date(tl.joinedDate).toLocaleDateString()}</div>
                                                    </div>
                                                    {expandedTL === tl.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <Card className="mt-2 border-l-4 border-l-primary">
                                        <CardContent className="p-6">
                                            <Tabs defaultValue="overview" className="w-full">
                                                <TabsList className="grid w-full grid-cols-4">
                                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                                    <TabsTrigger value="performance">Performance</TabsTrigger>
                                                    <TabsTrigger value="events">Top Events</TabsTrigger>
                                                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="overview" className="mt-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Profile Info */}
                                                        <div>
                                                            <h4 className="font-semibold mb-3">Profile Information</h4>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-sm">{tl.email}</span>
                                                                </div>
                                                                {tl.location && (
                                                                    <div className="flex items-center gap-2">
                                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-sm">{tl.location}</span>
                                                                    </div>
                                                                )}
                                                                {tl.website && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                                                        <a href={tl.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                                            {new URL(tl.website).hostname}
                                                                        </a>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-sm">Joined {new Date(tl.joinedDate).toLocaleDateString()}</span>
                                                                </div>
                                                                {tl.lastActive && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-sm">Last active {getTimeAgo(tl.lastActive)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Quick Stats */}
                                                        <div>
                                                            <h4 className="font-semibold mb-3">Quick Statistics</h4>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="text-center p-3 bg-muted/50 rounded-lg">
                                                                    <div className="text-xl font-bold text-primary">{tl.statistics.totalReferrals}</div>
                                                                    <div className="text-xs text-muted-foreground">Total Referrals</div>
                                                                </div>
                                                                <div className="text-center p-3 bg-muted/50 rounded-lg">
                                                                    <div className="text-xl font-bold text-green-600">{tl.statistics.thisMonth}</div>
                                                                    <div className="text-xs text-muted-foreground">This Month</div>
                                                                </div>
                                                                <div className="text-center p-3 bg-muted/50 rounded-lg">
                                                                    <div className="text-xl font-bold text-blue-600">{tl.statistics.thisWeek}</div>
                                                                    <div className="text-xs text-muted-foreground">This Week</div>
                                                                </div>
                                                                <div className="text-center p-3 bg-muted/50 rounded-lg">
                                                                    <div className="text-xl font-bold text-purple-600">{tl.statistics.topEvents.length}</div>
                                                                    <div className="text-xs text-muted-foreground">Events Promoted</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="performance" className="mt-4">
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold">Monthly Performance</h4>
                                                        {tl.statistics.monthlyBreakdown.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {tl.statistics.monthlyBreakdown.map((month, index) => (
                                                                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                                        <span className="font-medium">{month.month}</span>
                                                                        <Badge variant="secondary">{month.referrals} referrals</Badge>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-muted-foreground">No performance data available</p>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="events" className="mt-4">
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold">Top Performing Events</h4>
                                                        {tl.statistics.topEvents.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {tl.statistics.topEvents.map((event, index) => (
                                                                    <div key={event.eventId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                                                                                {index + 1}
                                                                            </div>
                                                                            <Link
                                                                                href={`/events/${event.eventId}`}
                                                                                className="hover:underline font-medium"
                                                                            >
                                                                                {event.eventTitle}
                                                                            </Link>
                                                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                                        </div>
                                                                        <Badge variant="secondary">{event.referrals} referrals</Badge>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-muted-foreground">No events with referrals yet</p>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="activity" className="mt-4">
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold">Recent Referrals</h4>
                                                        {tl.statistics.recentReferrals.length > 0 ? (
                                                            <div className="rounded-md border overflow-x-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Student</TableHead>
                                                                            <TableHead className="hidden sm:table-cell">Event</TableHead>
                                                                            <TableHead className="text-right">When</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {tl.statistics.recentReferrals.slice(0, 5).map((referral) => (
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
                                                                                    <Link
                                                                                        href={`/events/${referral.eventId}`}
                                                                                        className="hover:underline flex items-center gap-1"
                                                                                    >
                                                                                        {referral.eventTitle}
                                                                                        <ExternalLink className="h-3 w-3" />
                                                                                    </Link>
                                                                                </TableCell>
                                                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                                                    {getTimeAgo(referral.createdAt)}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        ) : (
                                                            <p className="text-muted-foreground">No recent referrals</p>
                                                        )}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}