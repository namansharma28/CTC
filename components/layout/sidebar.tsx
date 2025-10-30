"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Shield,
  UserPlus,
  Briefcase,
  BookOpen,
  Phone,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { usePWAInstall } from "@/components/pwa/pwa-installer";

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
      "flex items-center gap-3 rounded-full px-4 py-3 text-base font-medium  hover:bg-accent/50",
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
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

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

  const userRole = (session?.user as any)?.role;
  const isOperatorOrAdmin = userRole === 'operator' || userRole === 'admin';
  const isTechnicalLead = userRole === 'technical_lead';
  const isCTCStudent = userRole === 'ctc_student';

  const sidebarLinks = [
    { href: "/home", icon: <Home size={24} />, label: "Home" },
    { href: "/explore", icon: <Users size={24} />, label: "Communities" },
    { href: "/events", icon: <CalendarDays size={24} />, label: "Events" },
    { href: "/calendar", icon: <CalendarDays size={24} />, label: "Calendar" },
    { href: "/following", icon: <Heart size={24} />, label: "Following" },
    ...(isCTCStudent ? [{ href: "/tnp", icon: <Briefcase size={24} />, label: "TNP" }] : []),
    { href: "/profile", icon: <User size={24} />, label: "Profile" },
    { href: "/settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  const operatorLinks = [
    { href: "/operator/dashboard", icon: <Shield size={24} />, label: "Operator Dashboard" },
    { href: "/operator/users", icon: <UserPlus size={24} />, label: "Manage Users" },
    { href: "/operator/communities", icon: <Users size={24} />, label: "Manage Communities" },
    { href: "/operator/events", icon: <CalendarDays size={24} />, label: "Manage Events" },
    { href: "/operator/tnp", icon: <Briefcase size={24} />, label: "Manage TNP" },
    { href: "/operator/study", icon: <BookOpen size={24} />, label: "Manage Study" },
  ];

  const technicalLeadLinks = [
    { href: "/technical-lead/dashboard", icon: <Shield size={24} />, label: "TL Dashboard" },
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] fixed top-14 flex flex-col py-2 px-2 overflow-y-auto">
      <div className="flex flex-col w-full">
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
        
        {/* WhatsApp Connect Button - Hidden for operators */}
        {session?.user?.role !== 'operator' && (
          <a 
            href="https://wa.me/+919876543210" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 rounded-full px-4 py-3 text-base font-medium bg-green-500 hover:bg-green-600 text-white mt-2",
            )}
          >
            <div className="text-white">
              <Phone size={24} />
            </div>
            {!isSmallScreen && <span>Connect on WhatsApp</span>}
          </a>
        )}
        
        {/* PWA Install Button */}
        {isInstallable && !isInstalled && (
          <button
            onClick={installApp}
            className={cn(
              "flex items-center gap-3 rounded-full px-4 py-3 text-base font-medium bg-primary hover:bg-primary/90 text-white mt-2",
            )}
          >
            <div className="text-white">
              <Download size={24} />
            </div>
            {!isSmallScreen && <span>Install App</span>}
          </button>
        )}

        {/* Operator/Admin only links */}
        {isOperatorOrAdmin && (
          <>
            {!isSmallScreen && <Separator className="my-1" />}
            {operatorLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname === link.href}
                collapsed={isSmallScreen}
              />
            ))}
          </>
        )}

        {/* Technical Lead only links */}
        {isTechnicalLead && (
          <>
            {!isSmallScreen && <Separator className="my-1" />}
            {technicalLeadLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname === link.href}
                collapsed={isSmallScreen}
              />
            ))}
          </>
        )}
      </div>



      {/* Community creation button removed - only available for operators/admins */}

      {session && !isSmallScreen && (
        <div className="mt-3 flex items-center gap-3 p-3 rounded-full cursor-pointer">
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