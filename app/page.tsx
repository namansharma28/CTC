"use client";

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
    <div className="min-h-screen bg-background">
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
        <div className="absolute top-16 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white font-semibold text-lg">CodingThinker</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-1 text-white/80 hover:text-white cursor-pointer">
                <span>Courses</span>
                <span className="text-xs">+</span>
              </div>
              <div className="flex items-center gap-1 text-white/80 hover:text-white cursor-pointer">
                <span>Programs</span>
                <span className="text-xs">+</span>
              </div>
              <span className="text-white/80 hover:text-white cursor-pointer">Mentors</span>
              <span className="text-white/80 hover:text-white cursor-pointer">Pricing</span>
            </nav>

            <div className="flex items-center gap-4">
              {session ? (
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  <Link href="/home">Enter Platform</Link>
                </Button>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-white/80 hover:text-white">Login</Link>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    <Link href="/auth/signup">Request a Demo</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Centered like in the image */}
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-screen text-center pt-32">
          {/* NEW Badge */}
          <Badge className="mb-8 bg-blue-600/20 text-blue-400 border-blue-600/30 px-4 py-2 text-sm font-medium">
            NEW v1.2 Beta is available
          </Badge>

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

      {/* Stats Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why Choose Our Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the features that make our platform the perfect choice for your coding journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Master Your Skills
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose from our comprehensive selection of courses designed to take you from beginner to professional.
              Each course includes hands-on projects and personalized mentoring.
            </p>
            <Button variant="outline" size="lg" className="rounded-full">
              Explore all courses
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {courses.slice(0, 3).map((course, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{course.level}</Badge>
                    <span className="text-sm text-muted-foreground">{course.duration}</span>
                  </div>
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4 leading-relaxed">
                    {course.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full rounded-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional courses row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            {courses.slice(3).map((course, index) => (
              <Card key={index + 3} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{course.level}</Badge>
                    <span className="text-sm text-muted-foreground">{course.duration}</span>
                  </div>
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4 leading-relaxed">
                    {course.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full rounded-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for the Future of Learning
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform combines cutting-edge technology with proven teaching methodologies
                to create an unparalleled learning experience. Join thousands of students who have
                transformed their careers with us.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Industry-expert mentors and instructors</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Hands-on projects and real-world applications</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Personalized learning paths and AI assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Career support and job placement assistance</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 via-muted/10 to-silver/20 rounded-2xl p-8 h-96 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Code?</h3>
                  <p className="text-muted-foreground">
                    Join thousands of students already learning with us
                  </p>
                  <div className="mt-6 flex justify-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">95%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">5K+</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-muted/10 to-silver/10">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have already started their coding journey with us.
              Get access to expert mentorship, hands-on projects, and a supportive community.
            </p>
            {session ? (
              <Button size="lg" asChild className="text-lg px-8 py-4 rounded-full bg-gradient-to-r from-primary to-blue-600">
                <Link href="/home">
                  Enter Platform <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8 py-4 rounded-full bg-gradient-to-r from-primary to-blue-600">
                  <Link href="/auth/signup">
                    Start Learning Today <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 rounded-full border-2">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            )}

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">100+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Success</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-4 bg-muted/50 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                CTC - Coding Thinker
              </h3>
              <p className="text-muted-foreground mb-4">
                Transform your future with our innovative coding education platform.
                Learn from industry experts and join a community of passionate developers
                who are shaping the future of technology.
              </p>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground ml-2">
                  Rated 5/5 by 5,000+ students
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Courses</h4>
              <div className="space-y-2">
                <div><a href="#" className="text-muted-foreground hover:text-primary">MERN Stack</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-primary">Data Analytics</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-primary">Java + DSA</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-primary">Python</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-primary">C/C++</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <div><a href="#contact" className="text-muted-foreground hover:text-primary">Contact Us</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-primary">Help Center</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-primary">Community</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-primary">Career Support</a></div>
                <div><Link href="/auth/signup" className="text-muted-foreground hover:text-primary">Join Now</Link></div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CTC - Coding Thinker. Empowering the next generation of developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}