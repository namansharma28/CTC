"use client";

import { useState, useEffect } from "react";
import { Shield, Users, TrendingUp, Calendar, Award, Trophy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

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
  technicalLeadEmail: string;
}

interface ProfileReferralStatsProps {
  userRole: string;
}

export default function ProfileReferralStats({ userRole }: ProfileReferralStatsProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userRole === 'technical_lead') {
      fetchReferralStats();
    } else {
      setIsLoading(false);
    }
  }, [userRole]);

  const fetchReferralStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/technical-lead/referrals');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: 'Access denied' }));
        console.error('Access denied for TL referrals:', errorData);
        setError('Access denied');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to fetch referral stats:', response.status, errorData);
        throw new Error('Failed to fetch referral stats');
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      setError('Failed to load referral statistics');
    } finally {
      setIsLoading(false);
    }
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

  // Don't render anything if user is not a technical lead
  if (userRole !== 'technical_lead') {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Technical Lead Performance
          </CardTitle>
          <CardDescription>Your referral statistics and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Technical Lead Performance
          </CardTitle>
          <CardDescription>Your referral statistics and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{error || 'Failed to load referral data'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Technical Lead Performance
              </CardTitle>
              <CardDescription>Your referral statistics and achievements</CardDescription>
            </div>
            <Link href="/technical-lead/dashboard">
              <Button variant="outline" size="sm">
                View Dashboard
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{stats.totalReferrals}</div>
                  <div className="text-sm text-muted-foreground">Total Referrals</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.thisMonth}</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>
              
              {stats.totalReferrals > 0 && (
                <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Active TL
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    You've successfully referred {stats.totalReferrals} {stats.totalReferrals === 1 ? 'student' : 'students'} to events!
                  </div>
                </div>
              )}
            </div>
            
            {/* Top Events */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Top Performing Events
              </h4>
              {stats.topEvents.length > 0 ? (
                <div className="space-y-2">
                  {stats.topEvents.slice(0, 3).map((event, index) => (
                    <div key={event.eventId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <Link 
                          href={`/events/${event.eventId}`}
                          className="text-sm hover:underline truncate max-w-[150px]"
                        >
                          {event.eventTitle}
                        </Link>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {event.referrals} referrals
                      </Badge>
                    </div>
                  ))}
                  {stats.topEvents.length > 3 && (
                    <div className="text-center pt-2">
                      <Link href="/technical-lead/dashboard">
                        <Button variant="ghost" size="sm" className="text-xs">
                          View all events
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No events with referrals yet</p>
                  <Link href="/technical-lead/dashboard">
                    <Button variant="ghost" size="sm" className="text-xs mt-2">
                      Start sharing events
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      {stats.recentReferrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Referrals
            </CardTitle>
            <CardDescription>Your latest referral activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Student</TableHead>
                    <TableHead className="min-w-[200px] hidden sm:table-cell">Event</TableHead>
                    <TableHead className="text-right min-w-[100px]">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentReferrals.slice(0, 5).map((referral) => (
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
            {stats.recentReferrals.length > 5 && (
              <div className="text-center mt-4">
                <Link href="/technical-lead/dashboard">
                  <Button variant="outline" size="sm">
                    View All Referrals
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}