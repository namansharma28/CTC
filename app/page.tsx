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
      <section className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Pattern - More subtle diagonal lines like in the image */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.03) 2px,
                rgba(255, 255, 255, 0.03) 4px
              )
            `
          }}></div>
        </div>

        {/* Top Banner */}
        <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-white/10 z-20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span>Our startup program is live — enjoy 50% off today!</span>
            </div>
            <button className="text-white/60 hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        

        {/* Main Content - Centered like in the image */}
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-screen text-center pt-10">

          {/* Main Heading - Larger and more prominent */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-12 leading-tight max-w-5xl">
            Simplify and optimize
            <br />
            your <span className="italic text-white/90 font-light">coding journey.</span>
          </h1>

          {/* Code Editor Icons Row */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-white/60 text-sm font-mono">P</span>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-white/60 text-sm">◀</span>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-white/60 text-sm">▶</span>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-white/60 text-sm">⚙</span>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-white/60 text-sm">V</span>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-white/60 text-sm">⌘</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            {session ? (
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-medium transition-all hover:scale-105">
                <Link href="/home">Try for Free</Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-medium transition-all hover:scale-105">
                <Link href="/auth/signup">Try for Free</Link>
              </Button>
            )}
            <Button size="lg" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5 px-10 py-4 rounded-lg text-lg font-medium transition-all">
              Learn More
            </Button>
          </div>

          {/* Company Logos - Positioned at bottom like in image */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center justify-center gap-12 opacity-30">
              <span className="text-white/60 text-lg font-medium">Evernote</span>
              <span className="text-white/60 text-lg font-medium">PayPal</span>
              <span className="text-white/60 text-lg font-medium">amazon</span>
              <span className="text-white/60 text-lg font-medium">Framer</span>
              <span className="text-white/60 text-lg font-medium">XXX</span>
            </div>
          </div>

          {/* Side Code Editor - Positioned like in the image */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden xl:block">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/5 p-4 font-mono text-xs max-w-xs">
              <div className="space-y-1 text-white/60">
                <div className="flex">
                  <span className="text-white/30 w-6 text-right mr-3">1</span>
                  <span className="text-purple-400">const</span>
                  <span className="text-white/80 ml-2">learn = () =&gt; {'{'}</span>
                </div>
                <div className="flex">
                  <span className="text-white/30 w-6 text-right mr-3">2</span>
                  <span className="text-white/80 ml-4">console.log(</span>
                  <span className="text-green-400">'Start coding!'</span>
                  <span className="text-white/80">)</span>
                </div>
                <div className="flex">
                  <span className="text-white/30 w-6 text-right mr-3">3</span>
                  <span className="text-white/80">{'}'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side stats */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden xl:block">
            <div className="space-y-4">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">5K+</div>
                <div className="text-white/60 text-xs">Students</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">95%</div>
                <div className="text-white/60 text-xs">Success Rate</div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* Company Section */}
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

        <div className="container mx-auto relative z-10">
          {/* Main Description */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              At CodingThinker, we redefine identity and access management with a
              <span className="text-gray-400"> scalable, modular platform tailored for seamless UX and
                deployment adaptability. Our pay-as-you-go model
                ensures you get exactly what you need.</span>
            </h2>
          </div>

          {/* Company Logos */}
          <div className="mb-20">
            {/* First Row */}
            <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 mb-8 opacity-40">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
                <span className="text-white text-lg font-medium">Evernote</span>
              </div>
              <span className="text-white text-lg font-medium">PayPal</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-medium">amazon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span className="text-white text-lg font-medium">Framer</span>
              </div>
              <span className="text-white text-lg font-medium">XXX</span>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 opacity-40">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-medium">TESLA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
                <span className="text-white text-lg font-medium">INTERCOM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
                <span className="text-white text-lg font-medium">Discord</span>
              </div>
              <span className="text-white text-lg font-medium">gumroad</span>
              <span className="text-white text-lg font-medium">XXX</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Reliable */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Reliable</h3>
              <p className="text-gray-400 leading-relaxed">
                CodingThinker has built scalable infrastructure to support your growth.
              </p>
            </div>

            {/* Scalable */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                <Globe className="h-8 w-8 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Scalable</h3>
              <p className="text-gray-400 leading-relaxed">
                Our failover and deduplication features make scaling easy.
              </p>
            </div>

            {/* Secure */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Secure</h3>
              <p className="text-gray-400 leading-relaxed">
                CodingThinker ensures strong security and helps you meet industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black relative overflow-hidden">
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
              Why Choose Our Platform
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the features that make our platform the perfect choice for your coding journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <div className="mb-4 p-3 rounded-full bg-blue-600/20 w-fit">
                  <div className="text-blue-400">
                    {React.cloneElement(feature.icon, { className: "h-8 w-8" })}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
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