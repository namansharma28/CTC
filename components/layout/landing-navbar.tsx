import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


export default function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Image
              src="/ctc-logo.svg"
              alt="CTC Logo"
              width={40}
              height={40}
              className="w-10 h-10 transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute -inset-1 bg-primary/10 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="font-bold text-xl sci-fi-text">CTC</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          
          <Link href="/auth/signin">
            <Button variant="outline" size="sm" className="sci-fi-border">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}