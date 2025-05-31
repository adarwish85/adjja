
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, BookOpen, DollarSign } from "lucide-react";
import { useLMSAnalytics } from "@/hooks/useLMSAnalytics";

export const LMSAnalytics = () => {
  const { data: lmsData, isLoading } = useLMSAnalytics();

  if (isLoading) {
    return <div className="p-6 text-center">Loading LMS analytics...</div>;
  }

  // Course enrollment data
  const courseEnrollmentData = lmsData?.courseStats?.slice(0, 6).map(course => ({
    name: course.title.substring(0, 15) + "...",
    enrollments: course.enrollmentCount,
    completion: course.completionRate,
  })) || [];

  // Progress distribution data
  const progressData = [
    { name: "0-25%", value: Math.floor((lmsData?.totalEnrollments || 0) * 0.2) },
    { name: "26-50%", value: Math.floor((lmsData?.totalEnrollments || 0) * 0.25) },
    { name: "51-75%", value: Math.floor((lmsData?.totalEnrollments || 0) * 0.3) },
    { name: "76-100%", value: Math.floor((lmsData?.totalEnrollments || 0) * 0.25) },
  ];

  // Status distribution data
  const statusData = [
    { name: "Active", value: lmsData?.activeStudents || 0, color: "#3B82F6" },
    { name: "Completed", value: lmsData?.completedCourses || 0, color: "#10B981" },
    { name: "Paused", value: Math.floor((lmsData?.totalEnrollments || 0) * 0.1), color: "#EF4444" },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

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
              ${lmsData?.totalRevenue?.toFixed(0) || '0'}
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
            <div className="text-2xl font-bold text-bjj-navy">{lmsData?.completionRate?.toFixed(1) || '0.0'}%</div>
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
              {lmsData?.activeStudents || 0}
            </div>
            <p className="text-xs text-bjj-gray">Currently learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">
              {lmsData?.totalCourses || 0}
            </div>
            <p className="text-xs text-bjj-gray">Available courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseEnrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#8884d8" name="Enrollments" />
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
              <LineChart data={lmsData?.enrollmentTrends || []}>
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
