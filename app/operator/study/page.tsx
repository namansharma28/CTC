"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Search, Loader2, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";



interface StudyPost {
  id: string;
  title: string;
  content: string;
  type: 'notes' | 'assignment' | 'resource' | 'announcement';
  subject?: string;
  semester?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function OperatorStudy() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<StudyPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<StudyPost[]>([]);
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
      fetchPosts();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session, status, router, toast]);

  useEffect(() => {
    // Filter posts based on debounced search query
    if (debouncedSearchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        post.subject?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        post.semester?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [debouncedSearchQuery, posts]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/study');
      if (response.ok) {
        const data = await response.json();
        const postsArray = Array.isArray(data) ? data : (data.data || data.posts || []);
        setPosts(postsArray);
        setFilteredPosts(postsArray);
      } else {
        throw new Error('Failed to fetch study posts');
      }
    } catch (error) {
      console.error('Error fetching study posts:', error);
      toast({
        title: "Error",
        description: "Failed to load study posts",
        variant: "destructive",
      });
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setIsLoading(false);
    }
  };



  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/study/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(prev => prev.filter(post => post.id !== postId));
        toast({
          title: "Success",
          description: "Study post deleted successfully",
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete study post",
        variant: "destructive",
      });
    }
  };



  const getTypeColor = (type: string) => {
    switch (type) {
      case 'notes': return 'bg-blue-100 text-blue-800';
      case 'assignment': return 'bg-red-100 text-red-800';
      case 'resource': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading study posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Study Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage study resources and materials</p>
          </div>
        </div>
        <Link href="/study/create">
          <Button className="self-start sm:self-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Study Post
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search study posts..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study Posts ({filteredPosts.length})</CardTitle>
          <CardDescription>
            All study resources and materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No study posts found matching your search" : "No study posts found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[100px]">Type</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Subject</TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">Semester</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredPosts || []).map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                            {post.content}
                          </p>
                          <div className="flex gap-2 mt-1 sm:hidden">
                            {post.subject && (
                              <span className="text-xs text-muted-foreground">{post.subject}</span>
                            )}
                            {post.semester && (
                              <span className="text-xs text-muted-foreground">• {post.semester}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(post.type)}>
                          {post.type ? post.type.charAt(0).toUpperCase() + post.type.slice(1) : 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{post.subject || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">{post.semester || '-'}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 sm:gap-2 justify-end">
                          <Link href={`/study/${post.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
