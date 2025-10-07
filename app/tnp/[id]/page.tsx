"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Briefcase, Calendar, MapPin, DollarSign, Clock, Building, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface TNPPost {
  _id: string;
  title: string;
  content: string;
  company: string;
  location: string;
  type: 'internship' | 'job' | 'both';
  salary?: string;
  deadline: string;
  requirements: string[];
  applicationLink?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TNPPostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<TNPPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/tnp/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setError('Job posting not found');
      }
    } catch (error) {
      console.error('Error fetching TNP post:', error);
      setError('Failed to load job posting');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship': return 'bg-blue-100 text-blue-800';
      case 'job': return 'bg-green-100 text-green-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Job Posting Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'The job posting you are looking for does not exist.'}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed(post.deadline);

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              {deadlinePassed && (
                <Badge variant="destructive">Deadline Passed</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span className="font-medium">{post.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{post.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getTypeColor(post.type)}>
                {post.type === 'both' ? 'Job & Internship' : post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </Badge>
              {post.salary && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {post.salary}
                </Badge>
              )}
              <Badge variant={deadlinePassed ? "destructive" : "secondary"} className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Deadline: {new Date(post.deadline).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {post.requirements && post.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {post.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Application */}
          {!deadlinePassed && (
            <Card>
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
                <CardDescription>
                  Don't miss this opportunity! Apply before the deadline.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {post.applicationLink ? (
                  <Button asChild className="w-full">
                    <a href={post.applicationLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply on Company Website
                    </a>
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Contact the TNP office or the company directly to apply for this position.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">{post.company}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span>{post.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <Badge className={getTypeColor(post.type)} variant="outline">
                  {post.type === 'both' ? 'Job & Internship' : post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
              </div>
              {post.salary && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Salary:</span>
                  <span className="font-medium">{post.salary}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deadline:</span>
                <span className={deadlinePassed ? "text-red-600 font-medium" : ""}>
                  {new Date(post.deadline).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium">{post.company}</p>
                  <p className="text-sm text-muted-foreground">{post.location}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                <p>Posted: {new Date(post.createdAt).toLocaleDateString()}</p>
                {post.updatedAt !== post.createdAt && (
                  <p>Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}