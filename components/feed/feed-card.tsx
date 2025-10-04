import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { CalendarDays, Share2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedItem } from "@/types/feed";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface FeedCardProps {
  item: FeedItem;
}

export default function FeedCard({ item }: FeedCardProps) {
  const { toast } = useToast();
  const timeAgo = formatDistanceToNow(new Date(item.date), { addSuffix: true });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleShare = () => {
    // Create the appropriate URL based on item type
    let shareUrl = `${window.location.origin}/updates/${item.id}`;
    let itemName = 'Update';
    
    if (item.type === 'event' && item.eventId) {
      shareUrl = `${window.location.origin}/events/${item.eventId}`;
      itemName = 'Event';
    } else if (item.type === 'tnp') {
      shareUrl = `${window.location.origin}/tnp/${item.id}`;
      itemName = 'TNP Post';
    } else if (item.type === 'study') {
      shareUrl = `${window.location.origin}/study/${item.id}`;
      itemName = 'Study Post';
    }
    
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: `${itemName} link copied to clipboard`,
    });
  };

  // Get all image attachments for TNP/Study posts
  const getPostImages = () => {
    const attachments = (item as any).attachments || [];
    const imageAttachments = attachments.filter((file: any) => file.type.startsWith('image/'));
    return imageAttachments.map((file: any) => file.url);
  };

  const postImages = getPostImages();
  const allImages = item.image ? [item.image, ...postImages] : postImages;
  const hasImages = allImages.length > 0;
  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image Section - Instagram style square carousel */}
      {hasImages && (
        <div className="relative w-full aspect-square bg-gray-100">
          <div 
            className="w-full h-full bg-gradient-to-b from-transparent to-black/30" 
            style={{
              backgroundImage: `url(${allImages[currentImageIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Image navigation for multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Overlay content */}
            <div className="absolute inset-0 flex items-end p-4 text-white">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`mb-1 ${
                    item.type === 'event' ? 'bg-blue-500/80' :
                    item.type === 'tnp' ? 'bg-green-500/80' :
                    item.type === 'study' ? 'bg-purple-500/80' : 'bg-primary/80'
                  }`}>
                    {item.type === 'event' ? 'Event' :
                     item.type === 'tnp' ? 'TNP' :
                     item.type === 'study' ? 'Study' : item.type}
                  </Badge>
                  <p className="text-xs text-white/80">{timeAgo}</p>
                </div>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                {item.eventDate && (
                  <p className="flex items-center gap-1 text-sm">
                    <CalendarDays size={14} /> {item.eventDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default header for posts without images */}
      {!hasImages && (
        <div className={`p-4 border-b bg-gradient-to-r ${
          item.type === 'tnp' ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' :
          item.type === 'study' ? 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20' :
          'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <Badge className={`${
              item.type === 'tnp' ? 'bg-green-500' :
              item.type === 'study' ? 'bg-purple-500' :
              'bg-blue-500'
            }`}>
              {item.type === 'tnp' ? 'TNP' :
               item.type === 'study' ? 'Study' : item.type}
            </Badge>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          <h3 className="text-lg font-bold">{item.title}</h3>
        </div>
      )}

      <CardContent className="p-3">
        {/* Community info and title for posts with images (already shown in overlay) */}
        {!hasImages && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={item.community.avatar} />
                <AvatarFallback>{item.community.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                {item.community.handle && item.community.handle !== 'unknown' ? (
                  <Link href={`/communities/${item.community.handle}`}>
                    <p className="text-sm font-medium hover:underline">{item.community.name}</p>
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">{item.community.name}</p>
                )}
                <p className="text-xs text-muted-foreground">@{item.community.handle || 'unknown'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Community info for posts with images */}
        {hasImages && (
          <div className="mb-2 flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={item.community.avatar} />
              <AvatarFallback className="text-xs">{item.community.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              {item.community.handle && item.community.handle !== 'unknown' ? (
                <Link href={`/communities/${item.community.handle}`}>
                  <p className="text-sm font-medium hover:underline">{item.community.name}</p>
                </Link>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">{item.community.name}</p>
              )}
              <p className="text-xs text-muted-foreground">@{item.community.handle || 'unknown'}</p>
            </div>
          </div>
        )}

        {item.type === "update" && <h4 className="mb-2 font-semibold">{item.title}</h4>}

        <p className="text-sm leading-relaxed">{item.content}</p>

        {item.eventId && item.type === "update" && (
          <Link href={`/events/${item.eventId}`}>
            <div className="mt-3 rounded-md border p-3">
              <p className="text-xs font-medium text-muted-foreground">Related to event:</p>
              <p className="text-sm font-medium">{item.eventTitle}</p>
            </div>
          </Link>
        )}

        {/* Display non-image attachments with download buttons */}
        {(item as any).attachments && (item as any).attachments.length > 0 && (
          <div className="mt-2">
            {/* Show non-image attachments */}
            {(item as any).attachments.filter((file: any) => !file.type.startsWith('image/')).length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-foreground">
                    📎 {(item as any).attachments.filter((file: any) => !file.type.startsWith('image/')).length} attachment(s)
                  </p>
                  {(item as any).attachments.filter((file: any) => !file.type.startsWith('image/')).length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const files = (item as any).attachments.filter((file: any) => !file.type.startsWith('image/'));
                        
                        toast({
                          title: "Downloads started",
                          description: `Downloading ${files.length} file(s)`,
                        });
                        
                        for (const file of files) {
                          try {
                            const downloadUrl = `/api/download?url=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(file.originalName)}`;
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = file.originalName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            // Add a small delay between downloads
                            await new Promise(resolve => setTimeout(resolve, 200));
                          } catch (error) {
                            console.error('Download failed:', error);
                            toast({
                              title: "Download failed",
                              description: `Failed to download ${file.originalName}`,
                              variant: "destructive",
                            });
                            // Fallback to opening in new tab
                            window.open(file.url, '_blank');
                          }
                        }
                      }}
                      className="h-7 text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download All
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {(item as any).attachments
                    .filter((file: any) => !file.type.startsWith('image/'))
                    .map((file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-card border border-border rounded-md hover:bg-accent/50 transition-all duration-200"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                        <span className="text-sm">
                          {file.type.includes('pdf') ? '📄' : 
                           file.type.includes('word') ? '📝' : 
                           file.type.includes('powerpoint') ? '📊' : 
                           file.type.includes('excel') ? '📈' : 
                           file.type.includes('zip') ? '🗜️' : '📎'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{file.originalName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)}MB • 
                          {file.type.includes('pdf') ? 'PDF Document' : 
                           file.type.includes('word') ? 'Word Document' : 
                           file.type.includes('powerpoint') ? 'PowerPoint' : 
                           file.type.includes('excel') ? 'Excel Sheet' : 
                           file.type.includes('zip') ? 'ZIP Archive' : 'File'}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              const downloadUrl = `/api/download?url=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(file.originalName)}`;
                              const link = document.createElement('a');
                              link.href = downloadUrl;
                              link.download = file.originalName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              
                              toast({
                                title: "Download started",
                                description: `Downloading ${file.originalName}`,
                              });
                            } catch (error) {
                              console.error('Download failed:', error);
                              toast({
                                title: "Download failed",
                                description: "Opening file in new tab instead",
                                variant: "destructive",
                              });
                              // Fallback to opening in new tab
                              window.open(file.url, '_blank');
                            }
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/20 p-2 px-3">
        <div className="flex w-full items-center justify-between">
          {(item.type === 'tnp' || item.type === 'study') && (
            <Link href={`/${item.type}/${item.id}`}>
              <Button variant="ghost" size="sm" className="h-8 text-primary">
                View More
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-muted-foreground"
              onClick={handleShare}
            >
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
