"use client";

import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from '@/components/providers/session-provider';
import { NotificationProvider } from '@/components/notifications/notification-provider';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import BottomNavbar from '@/components/layout/bottom-navbar';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Don't render layout components for auth pages and landing page
  if (pathname?.startsWith('/auth') || pathname === '/') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen w-full bg-background modern-gradient">
              <main className="w-full">
                {children}
                <Toaster />
              </main>
            </div>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <NotificationProvider>
          <div className="flex min-h-screen w-full bg-background modern-gradient">
            <Navbar />
            <div className="flex w-full mt-16 md:mt-14">
              {/* Desktop sidebar - always visible on large screens */}
              {!isMobile && (
                <div className="md:block w-[68px] xl:w-[275px] flex-shrink-0">
                  <Sidebar />
                </div>
              )}
              
              {/* Main content area */}
              <main className="flex-1 w-full overflow-auto pb-16 md:pb-0">
                <div className="mx-auto w-full h-full border-x border-border/20">
                  {children}
                </div>
              </main>
            </div>
            
            {/* Mobile bottom navbar */}
            {isMobile && <BottomNavbar />}
            <Toaster />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}