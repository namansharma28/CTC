"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Home,
  Users,
  CalendarDays,
  User,
  MoreHorizontal,
  Shield,
  Briefcase,
  Settings,
  BookOpen,
  UserPlus,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function BottomNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  
  const userRole = (session?.user as any)?.role;
  const isOperatorOrAdmin = userRole === 'operator' || userRole === 'admin';
  const isTechnicalLead = userRole === 'technical_lead';
  const isCTCStudent = userRole === 'ctc_student';

  // Main navigation links (always visible)
  const mainNavLinks = [
    { href: "/home", icon: <Home size={20} />, label: "Home" },
    { href: "/explore", icon: <Users size={20} />, label: "Communities" },
    { href: "/events", icon: <CalendarDays size={20} />, label: "Events" },
    { href: "/profile", icon: <User size={20} />, label: "Profile" },
  ];



  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t border-primary/30 bg-background/90 backdrop-blur md:hidden">
      {/* Main Navigation Links */}
      {mainNavLinks.map((link) => (
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
          <span className="mt-1 text-[10px] font-medium">{link.label}</span>
        </Link>
      ))}

      {/* More Menu */}
      <DropdownMenu open={isMoreOpen} onOpenChange={setIsMoreOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex h-full flex-1 flex-col items-center justify-center relative group p-0 hover:bg-transparent",
              isMoreOpen 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {isMoreOpen && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
            <div className="relative">
              <MoreHorizontal size={20} />
              {(isTechnicalLead || isOperatorOrAdmin || isCTCStudent) && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
            <span className="mt-1 text-[10px] font-medium">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          side="top" 
          className="w-56 mb-2"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Quick Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Common items */}
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/following" className="flex items-center gap-2 cursor-pointer">
              <Users size={16} />
              <span>Following</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/calendar" className="flex items-center gap-2 cursor-pointer">
              <CalendarDays size={16} />
              <span>Calendar</span>
            </Link>
          </DropdownMenuItem>

          {/* CTC Student specific */}
          {isCTCStudent && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-blue-600">
                Student Portal
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/tnp" className="flex items-center gap-2 cursor-pointer">
                  <Briefcase size={16} />
                  <span>TNP Portal</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {/* Technical Lead specific */}
          {isTechnicalLead && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-green-600">
                Technical Lead
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/technical-lead/dashboard" className="flex items-center gap-2 cursor-pointer">
                  <Shield size={16} />
                  <span>TL Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {/* Operator/Admin specific */}
          {isOperatorOrAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-purple-600">
                {userRole === 'admin' ? 'Administration' : 'Operations'}
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/operator/dashboard" className="flex items-center gap-2 cursor-pointer">
                  <BarChart3 size={16} />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/operator/users" className="flex items-center gap-2 cursor-pointer">
                  <UserPlus size={16} />
                  <span>Manage Users</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/operator/tnp" className="flex items-center gap-2 cursor-pointer">
                  <Briefcase size={16} />
                  <span>Manage TNP</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/operator/study" className="flex items-center gap-2 cursor-pointer">
                  <BookOpen size={16} />
                  <span>Manage Study</span>
                </Link>
              </DropdownMenuItem>
              {userRole === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <Shield size={16} />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </>
          )}
          
          {session && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
