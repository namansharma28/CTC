"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, Calendar, Plus, Loader2, Briefcase, BookOpen, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import TechnicalLeadsProfiles from "@/components/admin/technical-leads-profiles";

interface DashboardStats {
  totalUsers: number;
  totalCommunities: number;
  totalEvents: number;
  totalTNPPosts: number;
  totalStudyPosts: number;
  recentUsers: {
    id: string;
      name: string;
    email: string;
    createdAt: string;
  }[];
}

export default function OperatorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

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
      fetchStats();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session, status, router, toast]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [usersResponse, communitiesResponse, eventsResponse, tnpResponse, studyResponse] = await Promise.all([
        fetch('/api/users?limit=5'),
        fetch('/api/communities'),
        fetch('/api/events'),
        fetch('/api/tnp'),
        fetch('/api/study')
      ]);

      const [usersData, communitiesData, eventsData, tnpData, studyData] = await Promise.all([
        usersResponse.json(),
        communitiesResponse.json(),
        eventsResponse.json(),
        tnpResponse.json(),
        studyResponse.json()
      ]);

      // Safely handle different API response formats
      const communitiesArray = Array.isArray(communitiesData) ? communitiesData : (communitiesData.data || communitiesData.communities || []);
      const eventsArray = Array.isArray(eventsData) ? eventsData : (eventsData.data || eventsData.events || []);
      const tnpArray = Array.isArray(tnpData) ? tnpData : (tnpData.data || tnpData.posts || []);
      const studyArray = Array.isArray(studyData) ? studyData : (studyData.data || studyData.posts || []);

      setStats({
        totalUsers: usersData.total || 0,
        totalCommunities: communitiesArray.length || 0,
        totalEvents: eventsArray.length || 0,
        totalTNPPosts: tnpArray.length || 0,
        totalStudyPosts: studyArray.length || 0,
        recentUsers: usersData.users?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
      // Set default stats on error
      setStats({
        totalUsers: 0,
        totalCommunities: 0,
        totalEvents: 0,
        totalTNPPosts: 0,
        totalStudyPosts: 0,
        recentUsers: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Operator Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the operator control panel</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCommunities || 0}</div>
            <p className="text-xs text-muted-foreground">Active communities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">Total events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TNP Posts</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTNPPosts || 0}</div>
            <p className="text-xs text-muted-foreground">Training & Placement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudyPosts || 0}</div>
            <p className="text-xs text-muted-foreground">Study resources</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Recent users: {stats?.recentUsers.length || 0}
              </p>
              <Link href="/operator/users">
                <Button size="sm" className="w-full">Manage Users</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Communities
            </CardTitle>
            <CardDescription>Manage and create communities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total: {stats?.totalCommunities || 0} communities
              </p>
              <div className="flex gap-2">
                <Link href="/operator/communities">
                  <Button size="sm" variant="outline">View All</Button>
                </Link>
                <Link href="/communities/create">
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Create
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events
            </CardTitle>
            <CardDescription>Monitor events (created through communities)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total: {stats?.totalEvents || 0} events
              </p>
              <Link href="/operator/events">
                <Button size="sm" className="w-full">View Events</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              TNP Posts
            </CardTitle>
            <CardDescription>Manage Training & Placement posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total: {stats?.totalTNPPosts || 0} posts
              </p>
              <Link href="/operator/tnp">
                <Button size="sm" className="w-full">Manage TNP</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Study Posts
            </CardTitle>
            <CardDescription>Manage study resources and materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total: {stats?.totalStudyPosts || 0} posts
              </p>
              <Link href="/operator/study">
                <Button size="sm" className="w-full">Manage Study</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Technical Leads
            </CardTitle>
            <CardDescription>Monitor and manage Technical Lead performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Comprehensive TL monitoring
              </p>
              <Button size="sm" className="w-full" onClick={() => {
                document.getElementById('tl-profiles-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                View TL Profiles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Leads Profiles */}
      <div id="tl-profiles-section" className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Technical Leads Management</h2>
            <p className="text-muted-foreground">Comprehensive monitoring and management of Technical Leads</p>
          </div>
        </div>
        <TechnicalLeadsProfiles />
      </div>

      {/* Recent Users */}
      {stats?.recentUsers && stats.recentUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}