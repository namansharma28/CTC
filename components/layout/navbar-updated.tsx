"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Menu, CalendarDays, Loader2, Users } from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle click outside search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Fetch notifications
  useEffect(() => {
    if (session?.user) {
      // Mock notifications for demo
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'New event in Tech Community',
          description: 'AI Workshop this weekend',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false,
          type: 'event',
          linkUrl: '/events/123',
        },
        {
          id: '2',
          title: 'Community update',
          description: 'New members joined Developer Hub',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          read: true,
          type: 'community',
          linkUrl: '/communities/dev-hub',
        },
        {
          id: '3',
          title: 'System notification',
          description: 'Your account was successfully updated',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true,
          type: 'system',
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [session]);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock search results for demo
      const mockResults = [
        {
          id: '1',
          title: 'Tech Conference 2023',
          type: 'event',
          date: '2023-12-15',
          image: '/image.png',
          url: '/events/1',
        },
        {
          id: '2',
          title: 'Developer Hub',
          type: 'community',
          handle: 'dev-hub',
          image: '/image.png',
          url: '/communities/dev-hub',
        },
        {
          id: '3',
          title: 'AI Workshop',
          type: 'event',
          date: '2023-11-30',
          image: '/image.png',
          url: '/events/3',
        },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      
      // Simulate network delay
      setTimeout(() => {
        setSearchResults(mockResults as SearchResult[]);
        setIsLoading(false);
      }, 300);
      
    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <CalendarDays className="h-4 w-4 text-blue-500" />;
      case 'community':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-primary/20 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2 sci-fi-border"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Image
              src="/icons/icon-128x128.png"
              alt="CTC Logo"
              width={32}
              height={32}
              className="h-8 w-8 transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute -inset-1 bg-primary/10 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="font-bold text-lg sci-fi-text">CTC</span>
        </Link>
        
        {/* Search button */}
        <div className="ml-auto flex items-center gap-2">
          <div ref={searchRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="sci-fi-border"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            
            {/* Search popup */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-md border bg-card p-4 shadow-lg sci-fi-card">
                <div className="flex items-center">
                  <Input
                    ref={searchInputRef}
                    placeholder="Search events, communities..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                
                {/* Search results */}
                <div className="mt-2 max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : searchQuery.length > 0 ? (
                    searchResults.length > 0 ? (
                      <ul className="space-y-2">
                        {searchResults.map((result) => (
                          <li key={result.id}>
                            <Link
                              href={result.url}
                              className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <div className="h-10 w-10 rounded bg-muted flex-shrink-0">
                                {result.image && (
                                  <Image
                                    src={result.image}
                                    alt={result.title}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover rounded"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{result.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {result.type === 'event' ? (
                                    <>
                                      <CalendarDays className="inline h-3 w-3 mr-1" />
                                      {result.date}
                                    </>
                                  ) : (
                                    <>
                                      <Users className="inline h-3 w-3 mr-1" />
                                      @{result.handle}
                                    </>
                                  )}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No results found
                      </p>
                    )
                  ) : null}
                </div>
              </div>
            )}
          </div>
          
          {/* Notifications */}
          <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative sci-fi-border">
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 sci-fi-card">
              <div className="flex items-center justify-between border-b p-3">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto text-xs"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`border-b p-3 ${
                          !notification.read ? "bg-muted/50" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium">{notification.title}</p>
                              {!notification.read && (
                                <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-primary p-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              }) : 'recently'}
                            </p>
                            {notification.linkUrl && (
                              <Link
                                href={notification.linkUrl}
                                className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                                onClick={() => {
                                  markNotificationAsRead(notification.id);
                                  setIsNotificationsOpen(false);
                                }}
                              >
                                View details
                              </Link>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No notifications</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Theme toggle */}
          
          
          {/* User menu */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full sci-fi-border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback>
                      {session.user.name
                        ? session.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 sci-fi-card">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user.name && (
                      <p className="font-medium">{session.user.name}</p>
                    )}
                    {session.user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <nav className="grid gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/communities"
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Communities
            </Link>
            <Link
              href="/calendar"
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Calendar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
