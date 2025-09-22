"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Menu, CalendarDays, Loader2, Users, Home, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import NotificationBell from "@/components/notifications/notification-bell";
import Image from 'next/image';

interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  type: 'event' | 'community' | 'system';
  linkUrl?: string;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'event' | 'community';
  handle?: string;
  date?: string;
  image?: string;
  url: string;
}

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  // Keep focus on search input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen, searchResults]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!session?.user) return;
    
    setIsLoadingNotifications(true);
    try {
      const response = await fetch('/api/user/notifications/list');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        
        // Check if there are unread notifications
        const hasUnread = data.some((notification: Notification) => !notification.read);
        setHasNotifications(hasUnread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    if (!session?.user) return;
    
    try {
      const response = await fetch(`/api/user/notifications/${id}/read`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        
        // If all notifications are read, remove the notification dot
        if (notifications.every(n => n.id === id ? true : n.read)) {
          setHasNotifications(false);
        }

        // If notification has a link, navigate to it
        const notification = notifications.find(n => n.id === id);
        if (notification?.linkUrl) {
          setIsNotificationOpen(false);
          router.push(notification.linkUrl);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch('/api/user/notifications/read-all', {
        method: 'POST',
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setHasNotifications(false);
        
        toast({
          title: "All notifications marked as read",
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSelectSearchResult = (url: string) => {
    if (isMobile) {
      setIsSearchOpen(false);
    }
    setSearchQuery("");
    router.push(url);
  };

  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/90 backdrop-blur">
      <div className="flex h-14 items-center px-4">
        <div className="flex w-full items-center justify-between md:justify-start">
          {/* Logo - only visible on mobile */}
           <div className="md:hidden">
             <Link href="/" className="flex items-center">
               <Image src="/ctc-logo.svg" alt="CTC Logo" width={28} height={28} />
             </Link>
           </div>
           
           {/* Logo and title - visible on desktop */}
           <div className="hidden md:flex items-center gap-2 w-[68px] xl:w-[275px] justify-center xl:justify-start px-4">
             <Link href="/" className="flex items-center gap-2">
               <Image src="/ctc-logo.svg" alt="CTC Logo" width={32} height={32} />
               <span className="hidden font-bold xl:inline-block">CTC Events</span>
             </Link>
           </div>

          {/* Center section with title on mobile, search on desktop */}
          <div className="flex items-center justify-center md:flex-1">
            <div className="flex-1 flex justify-center">
              <Popover open={searchQuery.length > 1} onOpenChange={() => {}}>
                <PopoverTrigger asChild>
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events, communities..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[448px] p-0" align="start" sideOffset={5}>
                  <Command>
                    <CommandList>
                      {isSearching ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <CommandGroup heading="Events">
                            {searchResults
                              .filter(result => result.type === 'event')
                              .map(result => (
                                <CommandItem 
                                  key={result.id}
                                  onSelect={() => handleSelectSearchResult(result.url)}
                                  className="flex items-center gap-2 py-2"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <CalendarDays className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium truncate">{result.title}</p>
                                      {result.date && (
                                        <p className="text-xs text-muted-foreground truncate">{result.date}</p>
                                      )}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                          <CommandGroup heading="Communities">
                            {searchResults
                              .filter(result => result.type === 'community')
                              .map(result => (
                                <CommandItem 
                                  key={result.id}
                                  onSelect={() => handleSelectSearchResult(result.url)}
                                  className="flex items-center gap-2 py-2"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div 
                                      className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs flex-shrink-0"
                                    >
                                      {result.title.substring(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium truncate">{result.title}</p>
                                      {result.handle && (
                                        <p className="text-xs text-muted-foreground truncate">@{result.handle}</p>
                                      )}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </>
                      ) : (
                        <CommandEmpty>No results found</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Right section with user controls */}
          <div className="flex items-center gap-1">
          <NotificationBell />
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/notifications" className="cursor-pointer">
                    Notification Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => router.push("/auth/signin")}
              size="sm"
              className="h-8"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
      </div>
    </header>
  );
}