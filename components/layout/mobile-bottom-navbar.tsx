"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Home,
  Search,
  Bell,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileBottomNavbar() {
  const pathname = usePathname();

  const mobileNavLinks = [
    { href: "/", icon: <Home size={24} />, label: "Home" },
    { href: "/explore", icon: <Search size={24} />, label: "Explore" },
    { href: "/notifications", icon: <Bell size={24} />, label: "Notifications" },
    { href: "/messages", icon: <MessageSquare size={24} />, label: "Messages" },
    { href: "/events", icon: <CalendarDays size={24} />, label: "Events" },
    { href: "/communities", icon: <Users size={24} />, label: "Communities" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t border-primary/30 bg-background/80 backdrop-blur sci-fi-border md:hidden">
      {mobileNavLinks.map((link) => (
        <Link 
          key={link.href} 
          href={link.href} 
          className={cn(
            "flex h-full flex-1 flex-col items-center justify-center relative group",
            pathname === link.href 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {pathname === link.href && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary sci-fi-glow"></div>
          )}
          {link.icon}
          <span className="mt-1 text-[10px] sci-fi-text">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
