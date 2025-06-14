
import LandingPage from "@/components/LandingPage";
import { CourseCard } from "@/components/CourseCard";
import { SeedCourseData } from "@/components/SeedCourseData";
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
      {/* Main Content */}
      <LandingPage />

      {/* Featured Courses Section */}
      {courses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="w-full">
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
