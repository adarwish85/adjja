
import LandingPage from "@/components/LandingPage";
import { CourseCard } from "@/components/CourseCard";
import { SeedCourseData } from "@/components/SeedCourseData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: courses = [] } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .limit(3)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-bjj-navy to-bjj-navy/90">
      {/* Navigation Header */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="w-full px-0">
          <div className="flex justify-between items-center h-16 px-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-bjj-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-white text-xl font-bold">ADJJA Academy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-white hover:bg-white text-zinc-950">
                  Student Login
                </Button>
              </Link>
              <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                Admin Portal
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <LandingPage />

      {/* Featured Courses Section */}
      {courses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="w-full px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-bjj-navy mb-4">Featured Courses</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Start your Brazilian Jiu-Jitsu journey with our comprehensive courses designed for all skill levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  instructor={course.instructor}
                  level={course.level}
                  category={course.category}
                  price={course.price}
                  rating={course.rating}
                  studentCount={course.total_students}
                  thumbnailUrl={course.thumbnail_url}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Temporary seed data component for testing */}
      <SeedCourseData />
    </div>
  );
};

export default Index;
