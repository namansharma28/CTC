
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Download, ArrowLeft, FileText, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

interface StudyPost {
  _id: string;
  title: string;
  content?: string;
  tags?: string[];
  image?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    originalName: string;
  }>;
  createdAt: string;
  updatedAt: string;
  type: string;
  subject?: string;
  semester?: string;
  difficulty?: string;
  author?: {
    name: string;
    email: string;
  };
}

export default function StudyPostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<StudyPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/study/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setError('Study post not found');
      }
    } catch (error) {
      console.error('Error fetching study post:', error);
      setError('Failed to load study post');
    } finally {
      setIsLoading(false);
    }
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
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Study Post Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'The study post you are looking for does not exist.'}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Study Posts
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
              <Badge className="mb-2 bg-silver">
                Study Material
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{post.title}</h1>
            </div>
          </div>
        )}

        {/* Header without image */}
        {!post.image && (
          <div className="mb-6">
            <Badge className="mb-3 bg-silver">
              Study Material
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h1>
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
                    {post.author?.name || 'Study Team'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.subject && (
                  <Badge variant="outline">
                    {post.subject}
                  </Badge>
                )}
                {post.semester && (
                  <Badge variant="outline">
                    Semester {post.semester}
                  </Badge>
                )}
                {post.difficulty && (
                  <Badge variant="outline">
                    {post.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="modern-card modern-card-hover">
            <CardContent className="p-6">
              <div className="prose max-w-none">
                {post.content ? post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                )) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No content available for this study material.</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-3">Tags</h3>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attachments - Exclude cover image */}
          {post.attachments && Array.isArray(post.attachments) && post.attachments.filter(att => att.url !== post.image).length > 0 && (
            <Card className="modern-card modern-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloads ({post.attachments.filter(att => att.url !== post.image).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {post.attachments.filter(att => att.url !== post.image).map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg transition-all hover:shadow-md hover:border-primary/30 bg-card">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {attachment.originalName || attachment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.type.split('/')[1]?.toUpperCase() || 'File'}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild className="ml-3 silver-hover">
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Study Information */}
          <Card className="modern-card modern-card-hover">
            <CardHeader>
              <CardTitle>Study Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {post.subject && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subject</span>
                  <Badge variant="outline">{post.subject}</Badge>
                </div>
              )}
              {post.semester && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Semester</span>
                  <span className="font-medium">{post.semester}</span>
                </div>
              )}
              {post.difficulty && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge variant="outline">{post.difficulty}</Badge>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Published</span>
                <span className="font-medium">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              {post.updatedAt !== post.createdAt && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}