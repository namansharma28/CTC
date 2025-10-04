"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Users,
  Briefcase,
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
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
              💻 Coding मतलब Coding Thinker
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Unlock Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-primary to-blue-500 bg-clip-text text-transparent">
                Coding Potential
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your future with our innovative coding education platform.
              Learn from industry experts and join a community of passionate developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {session ? (
                <Button size="lg" asChild className="text-lg px-8 py-4 rounded-full">
                  <Link href="/home">
                    Enter Platform <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="text-lg px-8 py-4 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                    <Link href="/auth/signup">
                      Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 rounded-full border-2">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border-2 border-background"></div>
              </div>
              <span className="ml-3">Join over 5,000+ students</span>
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
              <div className="bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-600/20 rounded-2xl p-8 h-96 flex items-center justify-center backdrop-blur-sm">
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
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-600/10">
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