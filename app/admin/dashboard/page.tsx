"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, CheckCircle, XCircle, Loader2, LogOut, Calendar, BarChart, PlusCircle, Trash2, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleApiResponse } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TechnicalLeadsMonitor from "@/components/admin/technical-leads-monitor";
import TechnicalLeadsProfiles from "@/components/admin/technical-leads-profiles";

interface PendingCommunity {
  id: string;
  name: string;
  handle: string;
  description: string;
  avatar: string;
  banner: string;
  creatorId: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalCommunities: number;
  totalEvents: number;
  totalRegistrations: number;
  recentUsers: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }[];
  monthlyGrowth: {
    month: string;
    users: number;
  }[];
}

interface CommunityStats {
  totalCommunities: number;
  pendingCommunities: number;
  activeCommunities: number;
  rejectedCommunities: number;
  recentCommunities: {
    id: string;
    name: string;
    handle: string;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingCommunities, setPendingCommunities] = useState<PendingCommunity[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch('/api/admin/check-auth', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        const data = await handleApiResponse<{ isAdmin: boolean }>(response, {
          router,
          toast,
          errorMessage: {
            title: "Error",
            description: "Authentication failed"
          },
          redirectOnAuthError: true
        });

        if (!data) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }

        if (!data.isAdmin) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }

        // If we get here, we're authenticated as admin
        setIsAdmin(true);
        await fetchData();
      } catch (error) {
        console.error('Error checking admin auth:', error);
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    };

    checkAdminAuth();
  }, [router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        router.push('/admin/login');
        return;
      }

      const [pendingResponse, statsResponse, communityStatsResponse] = await Promise.all([
        fetch('/api/admin/communities/pending', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }),
        fetch('/api/admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }),
        fetch('/api/admin/communities/stats', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        })
      ]);

      // Check for authentication errors in any response
      if (pendingResponse.status === 401 || statsResponse.status === 401 || communityStatsResponse.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      // Process each response individually
      const pendingData = await handleApiResponse<PendingCommunity[]>(pendingResponse, {
        router,
        toast,
        errorMessage: {
          title: "Error",
          description: "Failed to fetch pending communities"
        },
        redirectOnAuthError: true
      });

      const statsData = await handleApiResponse<DashboardStats>(statsResponse, {
        router,
        toast,
        errorMessage: {
          title: "Error",
          description: "Failed to fetch dashboard stats"
        },
        redirectOnAuthError: true
      });

      const communityStatsData = await handleApiResponse<CommunityStats>(communityStatsResponse, {
        router,
        toast,
        errorMessage: {
          title: "Error",
          description: "Failed to fetch community stats"
        },
        redirectOnAuthError: true
      });

      if (pendingData && statsData && communityStatsData) {
        setPendingCommunities(pendingData as PendingCommunity[]);
        setDashboardStats(statsData);
        setCommunityStats(communityStatsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveCommunity = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(`/api/admin/communities/approve/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const success = await handleApiResponse(response, {
        router,
        toast,
        successMessage: {
          title: "Community Approved",
          description: "The community has been approved and is now public"
        },
        errorMessage: {
          title: "Error",
          description: "Failed to approve community"
        },
        redirectOnAuthError: true
      });

      if (success) {
        // Update the UI
        setPendingCommunities(prev => prev.filter(community => community.id !== id));

        // Refresh stats
        fetchData();
      }
    } catch (error) {
      console.error('Error approving community:', error);
      toast({
        title: "Error",
        description: "Failed to approve community",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (id: string) => {
    setSelectedCommunityId(id);
    setRejectionReason("");
    setIsRejectionDialogOpen(true);
  };

  const handleRejectCommunity = async () => {
    if (!selectedCommunityId) return;

    setProcessingId(selectedCommunityId);
    setIsRejectionDialogOpen(false);

    try {
      const response = await fetch(`/api/admin/communities/reject/${selectedCommunityId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      const success = await handleApiResponse(response, {
        router,
        toast,
        successMessage: {
          title: "Community Rejected",
          description: "The community has been rejected"
        },
        errorMessage: {
          title: "Error",
          description: "Failed to reject community"
        },
        redirectOnAuthError: true
      });

      if (success) {
        // Update the UI
        setPendingCommunities(prev => prev.filter(community => community.id !== selectedCommunityId));

        // Refresh stats
        fetchData();
      }
    } catch (error) {
      console.error('Error rejecting community:', error);
      toast({
        title: "Error",
        description: "Failed to reject community",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
      setSelectedCommunityId(null);
    }
  };

  const openDeleteDialog = (community: { id: string; name: string }) => {
    setCommunityToDelete(community);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCommunity = async () => {
    if (!communityToDelete) return;

    setProcessingId(communityToDelete.id);
    setIsDeleteDialogOpen(false);

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/communities/delete/${communityToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const success = await handleApiResponse(response, {
        router,
        toast,
        successMessage: {
          title: "Community Deleted",
          description: `The community "${communityToDelete.name}" has been permanently deleted`
        },
        errorMessage: {
          title: "Error",
          description: "Failed to delete community"
        },
        redirectOnAuthError: true
      });

      if (success) {
        // Refresh data to update the UI
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting community:', error);
      toast({
        title: "Error",
        description: "Failed to delete community",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
      setCommunityToDelete(null);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear admin token
      localStorage.removeItem('adminToken');

      // Call logout API to clear cookies
      const response = await fetch('/api/admin/logout', { method: 'POST' });

      await handleApiResponse(response, {
        router,
        toast,
        successMessage: {
          title: "Logged Out",
          description: "You have been logged out of the admin dashboard"
        },
        errorMessage: {
          title: "Error",
          description: "Failed to log out"
        },
        redirectOnAuthError: false
      });

      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-200px)] flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This will trigger the useEffect to redirect to login
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage community approvals and platform settings</p>
            </div>
          </div>

          {/* Mobile: Stack buttons vertically, Desktop: Horizontal */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => router.push('/admin/users')} className="w-full sm:w-auto">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Manage Users</span>
              <span className="sm:hidden">Users</span>
            </Button>
            <Button variant="outline" onClick={() => router.push('/communities/create')} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create Community</span>
              <span className="sm:hidden">Create</span>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle className="text-xl">{dashboardStats?.totalUsers || 0}</CardTitle>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle className="text-xl">{communityStats?.totalCommunities || 0}</CardTitle>
            <p className="text-sm text-muted-foreground">Communities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle className="text-xl">{dashboardStats?.totalEvents || 0}</CardTitle>
            <p className="text-sm text-muted-foreground">Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart className="h-8 w-8 text-orange-500 mb-2" />
            <CardTitle className="text-xl">{dashboardStats?.totalRegistrations || 0}</CardTitle>
            <p className="text-sm text-muted-foreground">Registrations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full flex-row mb-6 ">
          <TabsTrigger value="communities" className="w-full">Communities</TabsTrigger>
          <TabsTrigger value="technical-leads" className="w-full">Technical Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="communities">
          <Card>
            <CardHeader>
              <CardTitle>Community Management</CardTitle>
              <CardDescription>
                Overview of all communities on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{communityStats?.totalCommunities || 0}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold">{communityStats?.activeCommunities || 0}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Rejected</p>
                        <p className="text-2xl font-bold">{communityStats?.rejectedCommunities || 0}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Handle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communityStats?.recentCommunities?.map((community) => (
                      <TableRow key={community.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{community.name}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">@{community.handle}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">@{community.handle}</TableCell>
                        <TableCell>
                          {community.status === 'active' ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : community.status === 'pending' ? (
                            <Badge variant="outline" className="border-yellow-300 text-yellow-600">Pending</Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-300 text-red-600">Rejected</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{new Date(community.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={processingId === community.id}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog({ id: community.id, name: community.name })}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Community
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical-leads">
          <div className="space-y-6">
            <TechnicalLeadsMonitor />
            <TechnicalLeadsProfiles />
          </div>
        </TabsContent>

      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Community</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this community. This will be sent to the community creator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectCommunity}
              disabled={!rejectionReason.trim()}
            >
              Reject Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Community</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the community "{communityToDelete?.name}"?
              This action cannot be undone and will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Delete all community data</li>
                <li>Delete all associated events</li>
                <li>Delete all community updates</li>
                <li>Remove the community from all members' profiles</li>
                <li>Notify all community members</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCommunity}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Community
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
