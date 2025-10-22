"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, DollarSign, Clock, Building, ArrowLeft, ExternalLink, FileText, User, Briefcase } from "lucide-react";
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
  content?: string;
  company: string;
  location: string;
  type: 'internship' | 'job' | 'both' | 'placement';
  salary?: string;
  deadline: string;
  requirements?: string[];
  applicationLink?: string;
  tags?: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    email: string;
  };
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
      case 'internship': return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'job': return 'bg-green-500 hover:bg-green-600 text-white';
      case 'placement': return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'both': return 'bg-orange-500 hover:bg-orange-600 text-white';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
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
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">TNP Post Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'The TNP post you are looking for does not exist.'}
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
          Back to TNP Posts
        </Button>
          
        {/* Cover Image */}
        {post.image && (
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6 modern-card-hover">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getTypeColor(post.type)}>
                  {post.type === 'both' ? 'Job & Internship' : 
                   post.type === 'placement' ? 'Placement' :
                   post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
                {deadlinePassed && (
                  <Badge variant="destructive">Deadline Passed</Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{post.title}</h1>
              <p className="text-white/90">{post.company} • {post.location}</p>
            </div>
          </div>
        )}
        
        {/* Header without image */}
        {!post.image && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getTypeColor(post.type)}>
                {post.type === 'both' ? 'Job & Internship' : 
                 post.type === 'placement' ? 'Placement' :
                 post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </Badge>
              {deadlinePassed && (
                <Badge variant="destructive">Deadline Passed</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-lg text-muted-foreground">{post.company} • {post.location}</p>
          </div>
        )}
        
        {/* Author and Meta Info */}
        <Card className="mb-6 modern-card modern-card-hover">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {post.author?.name || 'TNP Team'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.salary && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {post.salary}
                  </Badge>
                )}
                <Badge variant={deadlinePassed ? "destructive" : "outline"} className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Deadline: {new Date(post.deadline).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="modern-card modern-card-hover">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {post.content ? post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                )) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No description available for this opportunity.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {post.requirements && Array.isArray(post.requirements) && post.requirements.length > 0 && (
            <Card className="modern-card modern-card-hover">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
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
            <Card className="modern-card modern-card-hover border-primary/20">
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
                <CardDescription>
                  Don't miss this opportunity! Apply before the deadline.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {post.applicationLink ? (
                  <Button asChild className="w-full silver-hover">
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
          <Card className="modern-card modern-card-hover">
            <CardHeader>
              <CardTitle>Quick Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium">{post.company}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{post.location}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Type</span>
                <Badge className={getTypeColor(post.type)}>
                  {post.type === 'both' ? 'Job & Internship' : 
                   post.type === 'placement' ? 'Placement' :
                   post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
              </div>
              {post.salary && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Salary</span>
                  <Badge variant="outline">{post.salary}</Badge>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Deadline</span>
                <span className={`font-medium ${deadlinePassed ? "text-destructive" : ""}`}>
                  {new Date(post.deadline).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <Card className="modern-card modern-card-hover">
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
          <Card className="modern-card modern-card-hover">
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <Building className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.company}</p>
                  <p className="text-sm text-muted-foreground">{post.location}</p>
                </div>
              </div>
              <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
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