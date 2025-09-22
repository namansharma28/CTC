"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Heart,
  Home,
  Plus,
  Settings,
  User,
  Users,
  Loader2,
  Search,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

interface Community {
  name: string;
  handle: string;
  avatar: string;
  description: string;
  members: string[];
  isVerified: boolean;
}

const SidebarLink = ({
  href,
  icon,
  label,
  active,
  collapsed = false,
  onClick,
}: SidebarLinkProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-full px-4 py-3 text-base font-medium transition-all hover:bg-accent/50",
      active ? "font-bold text-foreground" : "text-muted-foreground"
    )}
    onClick={onClick}
  >
    <div className={active ? "text-foreground" : "text-muted-foreground"}>
      {icon}
    </div>
    {!collapsed && <span>{label}</span>}
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1280);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!session?.user) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/communities/user');
        if (response.ok) {
          const data = await response.json();
          setUserCommunities(data);
        }
      } catch (error) {
        console.error('Error fetching user communities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCommunities();
  }, [session]);

  const sidebarLinks = [
    { href: "/", icon: <Home size={24} />, label: "Home" },
    { href: "/explore", icon: <Users size={24} />, label: "Communities" },
    { href: "/events", icon: <CalendarDays size={24} />, label: "Events" },
    { href: "/calendar", icon: <CalendarDays size={24} />, label: "Calendar" },
    { href: "/following", icon: <Heart size={24} />, label: "Following" },
    { href: "/profile", icon: <User size={24} />, label: "Profile" },
    { href: "/settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] fixed top-14 flex flex-col py-2 px-2 overflow-y-auto">
      <div className="flex flex-col gap-1 w-full">
        {sidebarLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            active={pathname === link.href}
            collapsed={isSmallScreen}
          />
        ))}
      </div>

      {!isSmallScreen && (
        <>
          <Separator className="my-4" />
          <div className="text-base font-bold px-4 py-2">Your Communities</div>
          <div className="flex flex-col gap-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : userCommunities.length > 0 ? (
              userCommunities.map((community) => (
                <SidebarLink
                  key={community.handle}
                  href={`/communities/${community.handle}`}
                  icon={
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      {community.name.substring(0, 2)}
                    </span>
                  }
                  label={community.name}
                  active={pathname === `/communities/${community.handle}`}
                />
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-muted-foreground">No communities yet</p>
            )}
          </div>
        </>
      )}

      <div className="mt-auto px-2">
        <Link href="/communities/create">
          <Button className="w-full gap-2 rounded-full" variant="default">
            <Plus size={20} />
            {!isSmallScreen && "New Community"}
          </Button>
        </Link>
      </div>

      {session && !isSmallScreen && (
        <div className="mt-6 flex items-center gap-3 p-3 rounded-full hover:bg-accent/50 cursor-pointer">
          <Avatar>
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback>
              {session.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{session.user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}