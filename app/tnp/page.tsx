"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Calendar, MapPin, ExternalLink, Search, Filter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface TNPPost {
  id: string;
  title: string;
  company: string;
  content: string; // API uses 'content' instead of 'description'
  location: string;
  salary?: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract' | 'job'; // API uses 'type' instead of 'jobType'
  requirements: string[];
  deadline: string; // API uses 'deadline' instead of 'applicationDeadline'
  applicationLink?: string;
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TNPPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<TNPPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/tnp");
      return;
    }

    const userRole = (session?.user as any)?.role;
    if (userRole !== "ctc_student") {
      toast({
        title: "Access Denied",
        description: "This page is only accessible to CTC students",
        variant: "destructive",
      });
      router.push("/home");
      return;
    }

    fetchTNPPosts();
  }, [session, status, router, toast]);

  const fetchTNPPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tnp');
      
      if (response.ok) {
        const result = await response.json();
        // Handle the API response structure
        const postsData = result.success && result.data ? result.data : result;
        // Ensure data is an array
        setPosts(Array.isArray(postsData) ? postsData : []);
      } else {
        throw new Error('Failed to fetch TNP posts');
      }
    } catch (error) {
      console.error('Error fetching TNP posts:', error);
      toast({
        title: "Error",
        description: "Failed to load TNP posts",
        variant: "destructive",
      });
      setPosts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || post.type === filterType;
    
    return matchesSearch && matchesFilter;
  }) : [];

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case 'full-time':
      case 'job':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'part-time':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'internship':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contract':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'TBD';
    }
  };

  const isDeadlineNear = (deadline: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-200px)] flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading TNP opportunities...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Training & Placement</h1>
            <p className="text-muted-foreground">Discover career opportunities and internships</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Types</option>
              <option value="job">Job</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* TNP Posts */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Check back later for new opportunities"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <Badge className={getJobTypeColor(post.type)}>
                        {post.type.replace('-', ' ')}
                      </Badge>
                      {post.deadline && isDeadlineNear(post.deadline) && (
                        <Badge variant="destructive">Deadline Soon</Badge>
                      )}
                    </div>
                    <CardDescription className="text-lg font-medium text-primary">
                      {post.company}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{post.location}</span>
                    </div>
                    {post.salary && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{post.salary}</span>
                      </div>
                    )}
                    {post.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {formatDate(post.deadline)}</span>
                      </div>
                    )}
                  </div>

                  {post.requirements && Array.isArray(post.requirements) && post.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {post.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-4">
                    {post.applicationLink && (
                      <Button asChild>
                        <a href={post.applicationLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Apply Now
                        </a>
                      </Button>
                    )}
                    {post.contactEmail && (
                      <Button variant="outline" asChild>
                        <a href={`mailto:${post.contactEmail}`}>
                          Contact HR
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Posted on {formatDate(post.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}