"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, Plus, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

interface Community {
  id: string;
  name: string;
  handle: string;
  description: string;
  avatar: string;
  members: string[];
  status: string;
  createdAt: string;
  isVerified: boolean;
}

export default function OperatorCommunities() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
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
      fetchCommunities();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session, status, router, toast]);

  useEffect(() => {
    // Filter communities based on debounced search query
    if (debouncedSearchQuery.trim() === "") {
      setFilteredCommunities(communities);
    } else {
      const filtered = communities.filter(community =>
        community.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        community.handle.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredCommunities(filtered);
    }
  }, [debouncedSearchQuery, communities]);

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/communities');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        const communitiesArray = Array.isArray(data) ? data : (data.data || data.communities || []);
        setCommunities(communitiesArray);
        setFilteredCommunities(communitiesArray);
      } else {
        throw new Error('Failed to fetch communities');
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
      // Set empty arrays on error
      setCommunities([]);
      setFilteredCommunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading communities...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Community Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage and oversee all communities</p>
          </div>
        </div>
        <Link href="/communities/create">
          <Button className="self-start sm:self-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Community
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Communities ({filteredCommunities.length})</CardTitle>
          <CardDescription>
            All communities on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCommunities.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No communities found matching your search" : "No communities found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Community</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Handle</TableHead>
                    <TableHead className="min-w-[80px] hidden md:table-cell">Members</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredCommunities || []).map((community) => (
                    <TableRow key={community.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={community.avatar} />
                            <AvatarFallback>
                              {community.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{community.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                              {community.description}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">@{community.handle}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">@{community.handle}</TableCell>
                      <TableCell className="hidden md:table-cell">{community.members?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={
                            community.status === 'active' ? 'default' :
                            community.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {community.status || 'active'}
                          </Badge>
                          {community.isVerified && (
                            <Badge variant="outline" className="text-xs">Verified</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(community.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/communities/${community.handle}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
