"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";

interface UploadedFile {
  originalName: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  cloudinaryId?: string;
}

export default function EditStudyPost() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "announcement" as 'notes' | 'assignment' | 'resource' | 'announcement',
    subject: "",
    semester: "",
    tags: "",
    difficulty: "",
    estimatedTime: "",
    prerequisites: "",
    learningOutcomes: ""
  });

  useEffect(() => {
    // Check if user has permission
    const userRole = (session?.user as any)?.role;
    const canEdit = userRole === 'operator' || userRole === 'admin';
    
    if (session && !canEdit) {
      toast({
        title: "Unauthorized",
        description: "Only operators and admins can edit study posts",
        variant: "destructive",
      });
      router.push('/');
      return;
    }

    if (params.id) {
      fetchPost();
    }
  }, [params.id, session]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/study/${params.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || "",
          content: data.content || "",
          type: data.type || "announcement",
          subject: data.subject || "",
          semester: data.semester || "",
          tags: data.tags || "",
          difficulty: data.difficulty || "",
          estimatedTime: data.estimatedTime || "",
          prerequisites: data.prerequisites || "",
          learningOutcomes: data.learningOutcomes || ""
        });
        setUploadedFiles(data.attachments || []);
      } else {
        throw new Error('Failed to fetch post');
      }
    } catch (error) {
      console.error('Error fetching study post:', error);
      toast({
        title: "Error",
        description: "Failed to load study post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/study/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          attachments: uploadedFiles
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Study post updated successfully",
        });
        router.push(`/study/${params.id}`);
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update study post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Post
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Study Resource</h1>
          <p className="text-muted-foreground">Update your study material</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic details of your study resource
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter resource title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'notes' | 'assignment' | 'resource' | 'announcement' }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Description *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter detailed description of the study material"
                className="min-h-[120px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Details</CardTitle>
            <CardDescription>
              Update the academic context and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester/Year</Label>
                <Input
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                  placeholder="e.g., Semester 1, Year 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Time</Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  placeholder="e.g., 2 hours, 1 week"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                value={formData.prerequisites}
                onChange={(e) => setFormData(prev => ({ ...prev, prerequisites: e.target.value }))}
                placeholder="What should students know before using this resource?"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningOutcomes">Learning Outcomes</Label>
              <Textarea
                id="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={(e) => setFormData(prev => ({ ...prev, learningOutcomes: e.target.value }))}
                placeholder="What will students learn from this resource?"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cover Image</CardTitle>
            <CardDescription>
              Update the cover image for your study material
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesUploaded={(files) => {
                const imageFiles = files.filter(file => file.type.startsWith('image/'));
                const otherFiles = uploadedFiles.filter(file => !file.type.startsWith('image/'));
                setUploadedFiles([...imageFiles.slice(0, 1), ...otherFiles]);
              }}
              maxFiles={1}
              acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Materials & Documents</CardTitle>
            <CardDescription>
              Update files, documents, or other study materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesUploaded={(files) => {
                const imageFiles = uploadedFiles.filter(file => file.type.startsWith('image/'));
                const documentFiles = files.filter(file => !file.type.startsWith('image/'));
                setUploadedFiles([...imageFiles, ...documentFiles]);
              }}
              maxFiles={15}
              acceptedTypes={[
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
                'application/zip'
              ]}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Study Resource
          </Button>
        </div>
      </form>
    </div>
  );
}