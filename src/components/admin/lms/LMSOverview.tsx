
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Play, Award, TrendingUp, DollarSign } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useCourseEnrollments } from "@/hooks/useCourseEnrollments";
import { useContentLibrary } from "@/hooks/useContentLibrary";

export const LMSOverview = () => {
  const { courses, isLoading: coursesLoading } = useCourses();
  const { enrollments, isLoading: enrollmentsLoading } = useCourseEnrollments();
  const { contentItems, isLoading: contentLoading } = useContentLibrary();

  const stats = [
    {
      title: "Total Courses",
      value: courses.length.toString(),
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      loading: coursesLoading,
    },
    {
      title: "Active Students",
      value: enrollments.filter(e => e.status === "Active").length.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      loading: enrollmentsLoading,
    },
    {
      title: "Content Items",
      value: contentItems.length.toString(),
      icon: Play,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      loading: contentLoading,
    },
    {
      title: "Completions",
      value: enrollments.filter(e => e.status === "Completed").length.toString(),
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      loading: enrollmentsLoading,
    },
    {
      title: "Avg Progress",
      value: enrollments.length > 0 
        ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) / enrollments.length) + "%"
        : "0%",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      loading: enrollmentsLoading,
    },
    {
      title: "Revenue",
      value: "$" + courses.reduce((acc, c) => acc + (c.price || 0) * (c.total_students || 0), 0).toFixed(0),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      loading: coursesLoading,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">
                {stat.title}
              </CardTitle>
              <div className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {stat.loading ? "..." : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Recent Course Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrollments.slice(0, 5).map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-bjj-navy">{enrollment.students?.name}</h4>
                    <p className="text-sm text-bjj-gray">{enrollment.courses?.title}</p>
                    <p className="text-xs text-bjj-gray">
                      Progress: {enrollment.progress_percentage || 0}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      enrollment.status === "Active" ? "bg-green-100 text-green-800" :
                      enrollment.status === "Completed" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {enrollment.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Popular Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses
                .sort((a, b) => (b.total_students || 0) - (a.total_students || 0))
                .slice(0, 5)
                .map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-bjj-navy">{course.title}</h4>
                      <p className="text-sm text-bjj-gray">by {course.instructor}</p>
                      <p className="text-xs text-bjj-gray">
                        {course.total_students} students • {course.rating}/5 ⭐
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-bjj-navy">${course.price}</div>
                      <div className="text-xs text-bjj-gray">{course.level}</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
