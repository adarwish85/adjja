import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCog, Users, GraduationCap, BarChart3, Calendar, Trophy, BookOpen, Shield } from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-bjj-gold-dark" />,
      title: "Student Management",
      description: "Comprehensive student profiles, attendance tracking, and progress monitoring"
    },
    {
      icon: <Calendar className="h-8 w-8 text-bjj-gold-dark" />,
      title: "Class Scheduling",
      description: "Organize classes, manage schedules, and track participation"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-bjj-gold-dark" />,
      title: "Performance Analytics",
      description: "Detailed insights into student progress and academy performance"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-bjj-gold-dark" />,
      title: "Learning Management",
      description: "Online courses, educational content, and skill development tracking"
    },
    {
      icon: <Trophy className="h-8 w-8 text-bjj-gold-dark" />,
      title: "Belt Progression",
      description: "Track student advancement through belt rankings and achievements"
    },
    {
      icon: <Shield className="h-8 w-8 text-bjj-gold-dark" />,
      title: "Secure Access",
      description: "Role-based permissions for admins, coaches, and students"
    }
  ];

  const userRoles = [
    {
      icon: <UserCog className="h-12 w-12 text-bjj-gold-dark" />,
      title: "Super Admin",
      description: "Complete system control",
      features: ["Manage all users", "Academy analytics", "System configuration", "Payment tracking"],
      badge: "Full Access"
    },
    {
      icon: <Users className="h-12 w-12 text-bjj-gold-dark" />,
      title: "Coach",
      description: "Student & class management",
      features: ["Track attendance", "Student progress", "Upload content", "Performance notes"],
      badge: "Instructor"
    },
    {
      icon: <GraduationCap className="h-12 w-12 text-bjj-gold-dark" />,
      title: "Student",
      description: "Personal training portal",
      features: ["Check-in to classes", "View progress", "Access courses", "Track achievements"],
      badge: "Learner"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="relative z-10 px-6 py-8 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-bjj-gold rounded-lg flex items-center justify-center">
              <Shield className="h-8 w-8 text-white font-bold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-bjj-navy">ADJJA</h1>
              <p className="text-bjj-gold-dark text-sm">Academy Management System</p>
            </div>
          </div>
          <Button variant="outline" className="border-bjj-gold text-bjj-gold hover:bg-bjj-gold hover:text-white">
            Contact Support
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 text-center animate-fade-in">
        <div className="container mx-auto max-w-4xl">
          <Badge className="mb-6 bg-bjj-gold/10 text-bjj-gold-dark border-bjj-gold/30">
            Brazilian Jiu-Jitsu Academy Management
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-bjj-navy mb-6 leading-tight">
            Manage Your BJJ Academy with
            <span className="text-bjj-gold-dark block">Excellence</span>
          </h2>
          <p className="text-xl text-bjj-gray mb-12 max-w-2xl mx-auto">
            Comprehensive student management, attendance tracking, performance analytics, and online learning platform designed specifically for martial arts academies.
          </p>
          
          {/* User Role Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {userRoles.map((role, index) => (
              <Card key={role.title} className="bg-white border-bjj-gold/20 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-bjj-gold/10 rounded-full w-fit">
                    {role.icon}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-bjj-navy text-xl">{role.title}</CardTitle>
                    <Badge variant="secondary" className="bg-bjj-gold text-white text-xs">
                      {role.badge}
                    </Badge>
                  </div>
                  <CardDescription className="text-bjj-gray">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="text-bjj-gray text-sm flex items-center">
                        <div className="h-1.5 w-1.5 bg-bjj-gold-dark rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6 bg-bjj-gold hover:bg-bjj-gold-dark text-white font-semibold"
                    onClick={() => {
                      if (role.title === "Super Admin") {
                        window.location.href = "/admin/dashboard";
                      } else if (role.title === "Coach") {
                        window.location.href = "/coach/dashboard";
                      } else if (role.title === "Student") {
                        window.location.href = "/student/dashboard";
                      }
                    }}
                  >
                    Login as {role.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-bjj-navy mb-4">Powerful Features</h3>
            <p className="text-xl text-bjj-gray max-w-2xl mx-auto">
              Everything you need to run a successful BJJ academy in one comprehensive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="bg-white border-bjj-gold/20 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-bjj-navy text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-bjj-gray">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-center bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-8 w-8 bg-bjj-gold rounded flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-bjj-navy font-semibold">ADJJA Academy Management</span>
          </div>
          <p className="text-bjj-gray">
            Empowering Brazilian Jiu-Jitsu academies with modern management tools
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
