"use client";

import { useState, useEffect } from "react";
import { Shield, Users, TrendingUp, Calendar, Award, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface TechnicalLead {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  lastActive: string;
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
  };
}

interface TLMonitoringData {
  technicalLeads: TechnicalLead[];
  summary: {
    totalTLs: number;
    activeTLs: number;
    totalReferrals: number;
    thisMonthReferrals: number;
  };
}

export default function TechnicalLeadsMonitor() {
  const { toast } = useToast();
  const [data, setData] = useState<TLMonitoringData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTLs, setExpandedTLs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTLData();
  }, []);

  const fetchTLData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/technical-leads');
      
      if (response.ok) {
        const tlData = await response.json();
        setData(tlData);
      } else {
        throw new Error('Failed to fetch TL data');
      }
    } catch (error) {
      console.error('Error fetching TL data:', error);
      toast({
        title: "Error",
        description: "Failed to load Technical Leads data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (tlId: string) => {
    const newExpanded = new Set(expandedTLs);
    if (newExpanded.has(tlId)) {
      newExpanded.delete(tlId);
    } else {
      newExpanded.add(tlId);
    }
    setExpandedTLs(newExpanded);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load Technical Leads data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total TLs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalTLs}</div>
            <p className="text-xs text-muted-foreground">Technical Leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active TLs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.activeTLs}</div>
            <p className="text-xs text-muted-foreground">With referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.thisMonthReferrals}</div>
            <p className="text-xs text-muted-foreground">New referrals</p>
          </CardContent>
        </Card>
      </div>

      {/* Technical Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Leads Performance</CardTitle>
          <CardDescription>Monitor and track Technical Lead referral activities</CardDescription>
        </CardHeader>
        <CardContent>
          {data.technicalLeads.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No Technical Leads found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.technicalLeads.map((tl) => (
                <Collapsible key={tl.id}>
                  <Card className="border-l-4 border-l-primary/20">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={tl.avatar || undefined} />
                              <AvatarFallback>{getInitials(tl.name)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{tl.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  <Shield className="mr-1 h-3 w-3" />
                                  TL
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{tl.email}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Joined {formatDate(tl.joinedDate)}</span>
                                <span>•</span>
                                <span>Last active {getTimeAgo(tl.lastActive)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{tl.statistics.totalReferrals}</div>
                              <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{tl.statistics.thisMonth}</div>
                              <div className="text-xs text-muted-foreground">This Month</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{tl.statistics.thisWeek}</div>
                              <div className="text-xs text-muted-foreground">This Week</div>
                            </div>
                            
                            <Button variant="ghost" size="sm">
                              {expandedTLs.has(tl.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Top Events */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Top Performing Events
                            </h4>
                            {tl.statistics.topEvents.length > 0 ? (
                              <div className="space-y-2">
                                {tl.statistics.topEvents.map((event, index) => (
                                  <div key={event.eventId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                                        {index + 1}
                                      </div>
                                      <Link href={`/events/${event.eventId}`} className="text-sm hover:underline">
                                        {event.eventTitle}
                                      </Link>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {event.referrals} referrals
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No events with referrals yet</p>
                            )}
                          </div>
                          
                          {/* Recent Referrals */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Recent Referrals
                            </h4>
                            {tl.statistics.recentReferrals.length > 0 ? (
                              <div className="space-y-2">
                                {tl.statistics.recentReferrals.map((referral) => (
                                  <div key={referral.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                    <div>
                                      <p className="text-sm font-medium">{referral.userName}</p>
                                      <p className="text-xs text-muted-foreground">{referral.eventTitle}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {getTimeAgo(referral.createdAt)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No recent referrals</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}