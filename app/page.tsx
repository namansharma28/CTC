"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Users,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LandingNavbar from "@/components/landing/landing-navbar";

export default function LandingPage() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Interactive Coding",
      description: "Learn by doing with our interactive coding challenges and real-time feedback system."
    },
    {
      icon: <CalendarDays className="h-8 w-8 text-primary" />,
      title: "Project-Based Learning",
      description: "Build real-world projects that you can add to your portfolio and showcase to employers."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Support",
      description: "Join a thriving community of developers who help each other grow and succeed."
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "AI-Powered Learning",
      description: "Personalized learning paths adapted to your skill level and learning style."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Live Sessions",
      description: "Weekly live coding sessions and Q&A with industry experts and mentors."
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Certification",
      description: "Earn industry-recognized certificates upon completing course milestones."
    }
  ];

  const stats = [
    { number: "5K+", label: "Students Enrolled" },
    { number: "50+", label: "Expert Mentors" },
    { number: "100+", label: "Projects Built" },
    { number: "95%", label: "Success Rate" }
  ];

  const courses = [
    {
      title: "MERN Stack - Web Development Course",
      description: "Master both frontend and backend development. Build complete web applications from scratch using modern technologies and best practices.",
      technologies: ["MongoDB", "Express.js", "React", "Node.js"],
      level: "Beginner to Advanced",
      duration: "6 months"
    },
    {
      title: "Data Analytics",
      description: "Learn to analyze and visualize data using Python, SQL, and modern analytics tools. Make data-driven decisions.",
      technologies: ["Python", "SQL", "Pandas", "Matplotlib"],
      level: "Intermediate",
      duration: "4 months"
    },
    {
      title: "Java + DSA",
      description: "Master Java programming and Data Structures & Algorithms. Perfect for technical interviews and competitive programming.",
      technologies: ["Java", "Algorithms", "Data Structures", "Problem Solving"],
      level: "Beginner to Advanced",
      duration: "5 months"
    },
    {
      title: "Python Programming",
      description: "Learn Python from basics to advanced concepts. Build automation scripts, web applications, and data analysis tools.",
      technologies: ["Python", "Django", "Flask", "Automation"],
      level: "Beginner",
      duration: "3 months"
    },
    {
      title: "C/C++",
      description: "Master the fundamentals of programming with C/C++. Build a strong foundation for system programming and competitive coding.",
      technologies: ["C", "C++", "Memory Management", "System Programming"],
      level: "Beginner",
      duration: "4 months"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-black to-blue-950 relative overflow-hidden pt-5">
        {/* Background Pattern - Code-like grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Animated code particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 top-1/4 w-2 h-2 rounded-full bg-blue-500 opacity-50 animate-pulse"></div>
          <div className="absolute left-1/4 top-1/3 w-3 h-3 rounded-full bg-purple-500 opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute right-1/4 top-1/2 w-2 h-2 rounded-full bg-green-500 opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute right-1/3 bottom-1/4 w-2 h-2 rounded-full bg-yellow-500 opacity-30 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Top Banner */}
        <div className="absolute top-0 left-0 right-0 bg-blue-950/80 backdrop-blur-sm border-b border-blue-800/30 z-20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span>🚀 New courses added! Enroll now and get 50% off</span>
            </div>
            <button className="text-white/60 hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-screen text-center pt-10">

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight max-w-5xl">
            Master <span className="text-blue-400">coding</span> with
            <br />
            expert <span className="text-blue-400 font-bold">guidance</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl">
            Join thousands of students learning to code through interactive projects, 
            live sessions, and a supportive community.
          </p>

          {/* Code Editor Icons Row */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-900/30 rounded-lg border border-blue-700/30 flex items-center justify-center hover:bg-blue-800/40 transition-colors cursor-pointer">
              <span className="text-blue-400 text-sm font-mono">{ '{' }</span>
            </div>
            <div className="w-10 h-10 bg-blue-900/30 rounded-lg border border-blue-700/30 flex items-center justify-center hover:bg-blue-800/40 transition-colors cursor-pointer">
              <span className="text-blue-400 text-sm font-mono">[ ]</span>
            </div>
            <div className="w-10 h-10 bg-blue-900/30 rounded-lg border border-blue-700/30 flex items-center justify-center hover:bg-blue-800/40 transition-colors cursor-pointer">
              <span className="text-blue-400 text-sm font-mono">&lt;/&gt;</span>
            </div>
            <div className="w-10 h-10 bg-blue-900/30 rounded-lg border border-blue-700/30 flex items-center justify-center hover:bg-blue-800/40 transition-colors cursor-pointer">
              <span className="text-blue-400 text-sm font-mono">( )</span>
            </div>
            <div className="w-10 h-10 bg-blue-900/30 rounded-lg border border-blue-700/30 flex items-center justify-center hover:bg-blue-800/40 transition-colors cursor-pointer">
              <span className="text-blue-400 text-sm font-mono">= &gt;</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            {session ? (
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-lg text-lg font-medium transition-all hover:scale-105 shadow-lg shadow-blue-600/20">
                <Link href="/home">Start Learning Now</Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-lg text-lg font-medium transition-all hover:scale-105 shadow-lg shadow-blue-600/20">
                <Link href="/auth/signup">Start Learning Now</Link>
              </Button>
            )}
          </div>

          {/* Tech Stack Logos */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <p className="text-blue-400/60 text-sm mb-4">TECHNOLOGIES YOU'LL MASTER</p>
            <div className="flex items-center justify-center gap-8 md:gap-12">
              <div className="text-white/60 text-lg font-medium hover:text-blue-400 transition-colors">React</div>
              <div className="text-white/60 text-lg font-medium hover:text-blue-400 transition-colors">Node.js</div>
              <div className="text-white/60 text-lg font-medium hover:text-blue-400 transition-colors">Python</div>
              <div className="text-white/60 text-lg font-medium hover:text-blue-400 transition-colors">Java</div>
              <div className="text-white/60 text-lg font-medium hover:text-blue-400 transition-colors">C++</div>
            </div>
          </div>

          {/* Side Code Editor */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden xl:block">
            <div className="bg-blue-950/40 backdrop-blur-sm rounded-lg border border-blue-800/20 p-4 font-mono text-xs max-w-xs shadow-xl shadow-blue-900/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-blue-400/60 text-xs">main.js</div>
              </div>
              <div className="space-y-1 text-white/80">
                <div className="flex">
                  <span className="text-blue-400/50 w-6 text-right mr-3">1</span>
                  <span className="text-purple-400">function</span>
                  <span className="text-blue-300 ml-2">learnToCode</span>
                  <span className="text-white/80">()</span>
                  <span className="text-white/80 ml-1">{'{'}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400/50 w-6 text-right mr-3">2</span>
                  <span className="text-white/80 ml-4">const</span>
                  <span className="text-blue-300 ml-2">skills</span>
                  <span className="text-white/80 ml-2">=</span>
                  <span className="text-white/80 ml-2">[</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400/50 w-6 text-right mr-3">3</span>
                  <span className="text-green-400 ml-8">'React'</span>
                  <span className="text-white/80">,</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400/50 w-6 text-right mr-3">4</span>
                  <span className="text-green-400 ml-8">'Node.js'</span>
                  <span className="text-white/80">,</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400/50 w-6 text-right mr-3">5</span>
                  <span className="text-green-400 ml-8">'Python'</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400/50 w-6 text-right mr-3">6</span>
                  <span className="text-white/80 ml-4">];</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400/50 w-6 text-right mr-3">7</span>
                  <span className="text-white/80 ml-4">return</span>
                  <span className="text-white/80 ml-2">skills;</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400/50 w-6 text-right mr-3">8</span>
                  <span className="text-white/80">{'}'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side stats */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden xl:block">
            <div className="space-y-4">
              <div className="bg-blue-950/40 backdrop-blur-sm rounded-lg border border-blue-800/20 p-4 text-center shadow-xl shadow-blue-900/20">
                <div className="text-2xl font-bold text-blue-400 mb-1">5K+</div>
                <div className="text-white/80 text-xs">Students</div>
              </div>
              <div className="bg-blue-950/40 backdrop-blur-sm rounded-lg border border-blue-800/20 p-4 text-center shadow-xl shadow-blue-900/20">
                <div className="text-2xl font-bold text-blue-400 mb-1">95%</div>
                <div className="text-white/80 text-xs">Success Rate</div>
              </div>
              <div className="bg-blue-950/40 backdrop-blur-sm rounded-lg border border-blue-800/20 p-4 text-center shadow-xl shadow-blue-900/20">
                <div className="text-2xl font-bold text-blue-400 mb-1">50+</div>
                <div className="text-white/80 text-xs">Expert Mentors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-blue-950 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 bg-gray-900/30 rounded-full text-blue-400 text-sm font-medium mb-4">
              SUCCESS STORIES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              From students to <span className="text-blue-400">professional developers</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Hear from our graduates who have successfully transitioned into tech careers after completing our programs.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-blue-950/20 backdrop-blur-sm rounded-xl border border-blue-800/20 p-8 shadow-xl shadow-blue-900/10 hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                  JS
                </div>
                <div>
                  <h4 className="text-white font-semibold">Jessica Smith</h4>
                  <p className="text-blue-400 text-sm">Frontend Developer @ Netflix</p>
                </div>
              </div>
              <p className="text-white/70 mb-6">
                "The MERN Stack course completely changed my career trajectory. I went from working retail to landing a six-figure developer job in just 8 months. The project-based curriculum gave me real-world experience that impressed interviewers."
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-blue-950/20 backdrop-blur-sm rounded-xl border border-blue-800/20 p-8 shadow-xl shadow-blue-900/10 hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="text-white font-semibold">Michael Johnson</h4>
                  <p className="text-blue-400 text-sm">Backend Engineer @ Stripe</p>
                </div>
              </div>
              <p className="text-white/70 mb-6">
                "The Java + DSA course was exactly what I needed to ace technical interviews. The instructors broke down complex algorithms in a way that finally made sense to me. I received three job offers within a month of completing the program."
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-blue-950/20 backdrop-blur-sm rounded-xl border border-blue-800/20 p-8 shadow-xl shadow-blue-900/10 hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                  AP
                </div>
                <div>
                  <h4 className="text-white font-semibold">Aisha Patel</h4>
                  <p className="text-blue-400 text-sm">Data Analyst @ Google</p>
                </div>
              </div>
              <p className="text-white/70 mb-6">
                "As someone with no prior tech experience, I was worried about transitioning careers. The Data Analytics course provided the perfect foundation. The hands-on projects using real datasets prepared me for my current role analyzing user behavior."
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
              Join Our Next Cohort
            </Button>
            <p className="text-white/50 mt-4 text-sm">
              Limited spots available. Next cohort starts in 2 weeks.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-950 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 bg-black/30 rounded-full text-blue-400 text-sm font-medium mb-4">
              WHY CHOOSE US
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              What makes <span className="text-blue-400">CodingThinker</span> different?
            </h2>
            <p className="text-lg text-white/70">
              We combine cutting-edge curriculum with personalized mentorship and a supportive community
              to ensure your success in the tech industry.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-blue-950/20 backdrop-blur-sm rounded-xl border border-blue-800/20 p-6 hover:transform hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-blue-900/10">
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Tools Section */}
      <section id="integrations" className="py-20 px-4 bg-gradient-to-b from-black to-blue-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 bg-blue-900/30 rounded-full text-blue-400 text-sm font-medium mb-4">
              DEVELOPER ECOSYSTEM
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Master the tools that power <span className="text-blue-400">modern development</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Our curriculum integrates with the most popular development tools and platforms, 
              ensuring you learn industry-standard workflows and technologies.
            </p>
          </div>

          {/* Integration Grid - Now with actual coding tools */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {/* Row 1 - Popular coding tools */}
              <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg border border-blue-800/20 p-4 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group">
                <div className="text-white text-3xl mb-2 group-hover:text-blue-400">
                  <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </div>
                <div className="text-white/80 text-sm font-medium group-hover:text-blue-400">VS Code</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">GitHub</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">React</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">Node.js</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">MongoDB</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
                    <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                    <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                    <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                    <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                    <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">Python</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">Docker</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-4V3H8v7H4l7 7 7-7z"></path>
                    <path d="M18 17v4H6v-4"></path>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">Git</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">Jest</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">TypeScript</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-700/30 p-5 flex flex-col items-center justify-center hover:transform hover:scale-105 transition-all duration-300 aspect-square group shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20">
                <div className="text-blue-400 text-3xl mb-3 group-hover:text-blue-300 transform group-hover:-translate-y-1 transition-all">
                  <svg viewBox="0 0 24 24" width="42" height="42" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <div className="text-white text-sm font-medium group-hover:text-blue-300">AWS</div>
              </div>
            </div>

            {/* Feature Highlight */}
            <div className="mt-16 bg-blue-950/20 backdrop-blur-sm rounded-xl border border-blue-800/20 p-8 shadow-xl shadow-blue-900/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block px-3 py-1 bg-blue-900/30 rounded-full text-blue-400 text-sm font-medium mb-4">
                    INDUSTRY STANDARD
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Learn the tools used by professionals</h3>
                  <p className="text-white/70 mb-6">
                    Our curriculum is designed to teach you the exact tools and workflows used by professional developers at top tech companies. 
                    You'll graduate with practical experience in the technologies employers are looking for.
                  </p>
                </div>
                <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg border border-blue-800/20 p-6 font-mono text-sm">
                  <div className="space-y-2 text-white/80">
                    <div className="flex">
                      <span className="text-blue-400 mr-2">$</span>
                      <span>npm install -g create-react-app</span>
                    </div>
                    <div className="flex">
                      <span className="text-blue-400 mr-2">$</span>
                      <span>npx create-react-app my-project</span>
                    </div>
                    <div className="flex">
                      <span className="text-blue-400 mr-2">$</span>
                      <span>cd my-project</span>
                    </div>
                    <div className="flex">
                      <span className="text-blue-400 mr-2">$</span>
                      <span>npm start</span>
                    </div>
                    <div className="text-green-400">
                      Starting the development server...
                    </div>
                    <div className="text-green-400">
                      Compiled successfully!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.02) 2px,
                rgba(255, 255, 255, 0.02) 4px
              )
            `
          }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Master Your Skills
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Choose from our comprehensive selection of courses designed to take you from beginner to professional.
              Each course includes hands-on projects and personalized mentoring.
            </p>
            <Button variant="outline" size="lg" className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white">
              Explore all courses
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {courses.slice(0, 3).map((course, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">{course.level}</Badge>
                  <span className="text-sm text-gray-400">{course.duration}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{course.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} className="text-xs bg-white/10 text-white/80 border-white/20">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More
                </Button>
              </div>
            ))}
          </div>

          {/* Additional courses row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            {courses.slice(3).map((course, index) => (
              <div key={index + 3} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">{course.level}</Badge>
                  <span className="text-sm text-gray-400">{course.duration}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{course.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} className="text-xs bg-white/10 text-white/80 border-white/20">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.02) 2px,
                rgba(255, 255, 255, 0.02) 4px
              )
            `
          }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Built for the Future of Learning
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Our platform combines cutting-edge technology with proven teaching methodologies
                to create an unparalleled learning experience. Join thousands of students who have
                transformed their careers with us.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Industry-expert mentors and instructors</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Hands-on projects and real-world applications</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Personalized learning paths and AI assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Career support and job placement assistance</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Ready to Code?</h3>
                  <p className="text-gray-400">
                    Join thousands of students already learning with us
                  </p>
                  <div className="mt-6 flex justify-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">95%</div>
                      <div className="text-xs text-gray-400">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">5K+</div>
                      <div className="text-xs text-gray-400">Students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.02) 2px,
                rgba(255, 255, 255, 0.02) 4px
              )
            `
          }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of students who have already started their coding journey with us.
              Get access to expert mentorship, hands-on projects, and a supportive community.
            </p>
            {session ? (
              <Button size="lg" asChild className="text-lg px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/home">
                  Enter Platform <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/auth/signup">
                    Start Learning Today <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            )}

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">100+</div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">50+</div>
                <div className="text-sm text-gray-400">Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">95%</div>
                <div className="text-sm text-gray-400">Success</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-4 bg-black border-t border-white/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                CTC - Coding Thinker
              </h3>
              <p className="text-gray-400 mb-4">
                Transform your future with our innovative coding education platform.
                Learn from industry experts and join a community of passionate developers
                who are shaping the future of technology.
              </p>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-400 ml-2">
                  Rated 5/5 by 5,000+ students
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Courses</h4>
              <div className="space-y-2">
                <div><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">MERN Stack</a></div>
                <div><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Data Analytics</a></div>
                <div><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Java + DSA</a></div>
                <div><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Python</a></div>
                <div><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">C/C++</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <div className="space-y-2">
                <div><a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</a></div>
                <div><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Help Center</a></div>
                <div><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Community</a></div>
                <div><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Career Support</a></div>
                <div><Link href="/auth/signup" className="text-gray-400 hover:text-blue-400 transition-colors">Join Now</Link></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CTC - Coding Thinker. Empowering the next generation of developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}