import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCog, Users, GraduationCap, BarChart3, Calendar, Trophy, BookOpen, Shield, Star, Award, Target, Heart, ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  const programs = [
    {
      title: "Beginner Program",
      description: "Perfect for those new to BJJ. Learn fundamentals in a supportive environment.",
      level: "Beginner",
      duration: "3-6 months"
    }, {
      title: "Advanced Training",
      description: "Refine your technique and compete at higher levels.",
      level: "Advanced",
      duration: "Ongoing"
    }, {
      title: "Kids BJJ",
      description: "Safe, fun classes that build confidence and discipline in children.",
      level: "Kids",
      duration: "Age-appropriate"
    }
  ];
  
  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-bjj-gold" />,
      title: "Self-Defense",
      description: "Learn practical techniques to protect yourself and your loved ones"
    }, {
      icon: <Heart className="h-8 w-8 text-bjj-gold" />,
      title: "Physical Fitness",
      description: "Build strength, flexibility, and cardiovascular endurance"
    }, {
      icon: <Users className="h-8 w-8 text-bjj-gold" />,
      title: "Community",
      description: "Join a supportive family of martial artists and lifelong friends"
    }, {
      icon: <Target className="h-8 w-8 text-bjj-gold" />,
      title: "Mental Discipline",
      description: "Develop focus, patience, and problem-solving skills"
    }
  ];
  
  const achievements = ["15+ Years of Teaching Excellence", "500+ Students Trained", "Multiple Competition Champions", "Family-Friendly Environment"];
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Ahmed Darwish Academy transformed my life. The instructors are patient, knowledgeable, and truly care about each student's progress.",
      belt: "Blue Belt"
    }, {
      name: "Michael Chen",
      text: "My kids love their classes here. They've gained so much confidence and discipline. Highly recommend!",
      belt: "Parent"
    }, {
      name: "Alex Rodriguez",
      text: "The structured curriculum and progress tracking keep me motivated. Best BJJ academy in the area!",
      belt: "Purple Belt"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-sm shadow-sm sticky top-0">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-bjj-gold rounded-lg flex items-center justify-center">
              <Shield className="h-8 w-8 text-white font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-bjj-navy">Ahmed Darwish Academy</h1>
              <p className="text-bjj-gold text-sm">Brazilian Jiu-Jitsu</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-bjj-gold text-bjj-gold hover:bg-bjj-gold hover:text-white" 
              onClick={() => navigate("/login?mode=login")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Member Login
            </Button>
            <Button 
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white" 
              onClick={() => navigate("/login?mode=signup")}
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-bjj-navy via-bjj-navy/95 to-bjj-navy/90">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544844179-ac0aeebb4333?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }} />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <Badge className="mb-6 bg-bjj-gold/20 text-bjj-gold border-bjj-gold/30 text-lg px-4 py-2">
            Empowering Students On & Off the Mat
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to
            <span className="block text-bjj-gold">Ahmed Darwish</span>
            <span className="block text-3xl md:text-5xl">Jiu-Jitsu Academy</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Master the art of Brazilian Jiu-Jitsu while building confidence, strength, and lifelong friendships. 
            Join our academy and discover the transformative power of martial arts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white font-semibold px-8 py-4 text-lg" 
              onClick={() => navigate("/login?mode=signup")}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login?mode=login")} 
              className="border-white hover:bg-white font-semibold px-8 py-4 text-lg text-slate-950"
            >
              <Shield className="w-5 h-5 mr-2" />
              Member Login
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-white">
                <div className="text-2xl md:text-3xl font-bold text-bjj-gold mb-2">
                  {achievement.split(' ')[0]}
                </div>
                <div className="text-sm md:text-base opacity-90">
                  {achievement.split(' ').slice(1).join(' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-bjj-gold/10 text-bjj-gold border-bjj-gold/30">
                About Our Academy
              </Badge>
              <h2 className="text-4xl font-bold text-bjj-navy mb-6">
                Meet Ahmed Darwish
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">With over 10 years of experience in Brazilian Jiu-Jitsu, Ahmed Darwish founded this academy with a vision to create a welcoming environment where students of all levels can learn, grow, and achieve their personal goals.</p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our academy emphasizes not just physical technique, but also mental discipline, respect, 
                and the development of character. We believe that Brazilian Jiu-Jitsu is more than just 
                a martial art—it's a way of life that builds confidence and resilience.
              </p>
              <div className="flex items-center space-x-4">
                <Award className="w-8 h-8 text-bjj-gold" />
                <div>
                  <div className="font-semibold text-bjj-navy">Purple Belt</div>
                  <div className="text-gray-600">Brazilian Jiu-Jitsu</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img alt="Ahmed Darwish training" src="/lovable-uploads/1625486b-41bd-49fa-8925-02e609371239.jpg" className="rounded-lg shadow-2xl object-contain" />
              <div className="absolute -bottom-6 -right-6 bg-bjj-gold text-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">10+</div>
                <div className="text-sm">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-bjj-gold/10 text-bjj-gold border-bjj-gold/30">
              Training Programs
            </Badge>
            <h2 className="text-4xl font-bold text-bjj-navy mb-4">Choose Your Path</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer structured programs designed to meet you where you are and take you where you want to go.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={program.title} className="border-bjj-gold/20 hover:shadow-lg transition-all duration-300 hover:border-bjj-gold/40">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-bjj-gold text-bjj-gold">
                      {program.level}
                    </Badge>
                    <GraduationCap className="w-6 h-6 text-bjj-gold" />
                  </div>
                  <CardTitle className="text-bjj-navy">{program.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 mb-4">
                    Duration: {program.duration}
                  </div>
                  <Button className="w-full bg-bjj-gold hover:bg-bjj-gold-dark">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-bjj-gold/10 text-bjj-gold border-bjj-gold/30">
              Why Choose BJJ?
            </Badge>
            <h2 className="text-4xl font-bold text-bjj-navy mb-4">Transform Your Life</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Brazilian Jiu-Jitsu offers benefits that extend far beyond the mat.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={benefit.title} className="text-center border-bjj-gold/20 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-bjj-gold/10 rounded-full w-fit">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-bjj-navy text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-bjj-gold/10 text-bjj-gold border-bjj-gold/30">
              Student Success Stories
            </Badge>
            <h2 className="text-4xl font-bold text-bjj-navy mb-4">What Our Students Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-bjj-gold/20 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-bjj-gold text-bjj-gold" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-bjj-navy">{testimonial.name}</div>
                  <div className="text-sm text-bjj-gold">{testimonial.belt}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-bjj-navy to-bjj-navy/90">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Join the Ahmed Darwish Academy family today and discover the transformative power of Brazilian Jiu-Jitsu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white font-semibold px-8 py-4 text-lg" 
              onClick={() => navigate("/login?mode=signup")}
            >
              <Play className="w-5 h-5 mr-2" />
              Get Started Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login?mode=login")} 
              className="border-white hover:bg-white font-semibold px-8 py-4 text-lg text-zinc-950"
            >
              <Shield className="w-5 h-5 mr-2" />
              Member Login
            </Button>
          </div>
          
          <p className="text-gray-300 mt-8">
            New students start with our comprehensive profile wizard to personalize your training experience.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-bjj-navy text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-8 w-8 bg-bjj-gold rounded flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Ahmed Darwish Academy</span>
          </div>
          <p className="text-gray-300 mb-4">
            Empowering students on and off the mat with the art of Brazilian Jiu-Jitsu
          </p>
          <p className="text-gray-400 text-sm">
            © 2024 Ahmed Darwish Jiu-Jitsu Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
