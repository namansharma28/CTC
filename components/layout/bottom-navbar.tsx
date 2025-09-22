"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNavbar() {
  const pathname = usePathname();
  
  const navLinks = [
    { href: "/", icon: <Home size={24} />, label: "Home" },
    { href: "/explore", icon: <Search size={24} />, label: "Explore" },
    { href: "/notifications", icon: <Bell size={24} />, label: "Notifications" },
    { href: "/messages", icon: <MessageSquare size={24} />, label: "Messages" },
    { href: "/profile", icon: <User size={24} />, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t border-primary/30 bg-background/90 backdrop-blur md:hidden">
      {navLinks.map((link) => (
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
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary"></div>
          )}
          {link.icon}
          <span className="mt-1 text-[10px]">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}