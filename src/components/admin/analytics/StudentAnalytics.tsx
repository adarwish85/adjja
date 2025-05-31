
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  UserPlus, 
  UserMinus,
  GraduationCap,
  Calendar,
  TrendingUp,
  Filter,
  Download
} from "lucide-react";

export const StudentAnalytics = () => {
  const studentMetrics = [
    { title: "Total Enrolled", value: "2,847", change: "+12.5%", icon: Users, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "New This Month", value: "284", change: "+8.3%", icon: UserPlus, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Dropouts", value: "23", change: "-15.2%", icon: UserMinus, color: "text-red-600", bgColor: "bg-red-100" },
    { title: "Graduations", value: "45", change: "+22.1%", icon: GraduationCap, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  const enrollmentData = [
    { month: 'Jul', new: 180, dropouts: 25, net: 155 },
    { month: 'Aug', new: 220, dropouts: 30, net: 190 },
    { month: 'Sep', new: 195, dropouts: 18, net: 177 },
    { month: 'Oct', new: 240, dropouts: 22, net: 218 },
    { month: 'Nov', new: 275, dropouts: 28, net: 247 },
    { month: 'Dec', new: 284, dropouts: 23, net: 261 },
  ];

  const ageDistribution = [
    { age: '5-12', count: 485, color: '#3B82F6' },
    { age: '13-17', count: 342, color: '#10B981' },
    { age: '18-25', count: 628, color: '#F59E0B' },
    { age: '26-35', count: 789, color: '#8B5CF6' },
    { age: '36-45', count: 423, color: '#EF4444' },
    { age: '46+', count: 180, color: '#6B7280' },
  ];

  const retentionData = [
    { period: '1 Month', rate: 95 },
    { period: '3 Months', rate: 87 },
    { period: '6 Months', rate: 78 },
    { period: '1 Year', rate: 65 },
    { period: '2 Years', rate: 52 },
  ];

  const topPrograms = [
    { name: "Adult Fundamentals", students: 689, growth: "+15%" },
    { name: "Kids Program", students: 485, growth: "+22%" },
    { name: "Competition Team", students: 234, growth: "+8%" },
    { name: "Women's Only", students: 198, growth: "+31%" },
    { name: "No-Gi Classes", students: 167, growth: "+12%" },
  ];

  return (
    <div className="space-y-6">
      {/* Student Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentMetrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{metric.value}</div>
              <p className="text-xs text-green-600">{metric.change} vs last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy">Student Analytics</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Enrollment Trends</CardTitle>
            <p className="text-sm text-bjj-gray">Monthly new enrollments vs dropouts</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="new" fill="#10B981" name="New Students" />
                <Bar dataKey="dropouts" fill="#EF4444" name="Dropouts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Age Distribution</CardTitle>
            <p className="text-sm text-bjj-gray">Student demographics by age group</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ age, count }) => `${age}: ${count}`}
                >
                  {ageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Retention Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Student Retention</CardTitle>
            <p className="text-sm text-bjj-gray">Retention rates over time periods</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  name="Retention Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Programs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Popular Programs</CardTitle>
            <p className="text-sm text-bjj-gray">Most enrolled programs and growth</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPrograms.map((program, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-bjj-navy">{program.name}</h4>
                    <p className="text-sm text-bjj-gray">{program.students} students</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {program.growth}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
