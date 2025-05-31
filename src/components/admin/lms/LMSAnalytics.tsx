
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, BookOpen, DollarSign } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useCourseEnrollments } from "@/hooks/useCourseEnrollments";

export const LMSAnalytics = () => {
  const { courses } = useCourses();
  const { enrollments } = useCourseEnrollments();

  // Course enrollment data
  const courseEnrollmentData = courses.map(course => ({
    name: course.title.substring(0, 15) + "...",
    enrollments: enrollments.filter(e => e.course_id === course.id).length,
    revenue: course.price * (course.total_students || 0),
  }));

  // Progress distribution data
  const progressData = [
    { name: "0-25%", value: enrollments.filter(e => (e.progress_percentage || 0) <= 25).length },
    { name: "26-50%", value: enrollments.filter(e => (e.progress_percentage || 0) > 25 && (e.progress_percentage || 0) <= 50).length },
    { name: "51-75%", value: enrollments.filter(e => (e.progress_percentage || 0) > 50 && (e.progress_percentage || 0) <= 75).length },
    { name: "76-100%", value: enrollments.filter(e => (e.progress_percentage || 0) > 75).length },
  ];

  // Status distribution data
  const statusData = [
    { name: "Active", value: enrollments.filter(e => e.status === "Active").length, color: "#3B82F6" },
    { name: "Completed", value: enrollments.filter(e => e.status === "Completed").length, color: "#10B981" },
    { name: "Dropped", value: enrollments.filter(e => e.status === "Dropped").length, color: "#EF4444" },
  ];

  // Monthly enrollment trend (mock data)
  const monthlyTrend = [
    { month: "Jan", enrollments: 45 },
    { month: "Feb", enrollments: 52 },
    { month: "Mar", enrollments: 48 },
    { month: "Apr", enrollments: 61 },
    { month: "May", enrollments: 55 },
    { month: "Jun", enrollments: 67 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

  const totalRevenue = courses.reduce((acc, course) => acc + (course.price || 0) * (course.total_students || 0), 0);
  const completionRate = enrollments.length > 0 
    ? Math.round((enrollments.filter(e => e.status === "Completed").length / enrollments.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">
              ${totalRevenue.toFixed(0)}
            </div>
            <p className="text-xs text-bjj-gray">From all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{completionRate}%</div>
            <p className="text-xs text-bjj-gray">Course completions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">
              {enrollments.filter(e => e.status === "Active").length}
            </div>
            <p className="text-xs text-bjj-gray">Currently learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              Popular Course
            </CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-bjj-navy">
              {courses.sort((a, b) => (b.total_students || 0) - (a.total_students || 0))[0]?.title.substring(0, 12) + "..." || "None"}
            </div>
            <p className="text-xs text-bjj-gray">Most enrolled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseEnrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Monthly Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Enrollment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
