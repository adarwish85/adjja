
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
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign,
  BookOpen,
  Activity,
  Target,
  Download,
  RefreshCw
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export const AnalyticsOverview = () => {
  const { students, classes, revenue, enrollmentTrends, isLoading } = useAnalytics();

  if (isLoading) {
    return <div className="p-6 text-center">Loading analytics...</div>;
  }

  const kpiMetrics = [
    {
      title: "Total Students",
      value: students?.total?.toString() || "0",
      change: students?.newThisMonth ? `+${students.newThisMonth}` : "+0",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      period: "new this month"
    },
    {
      title: "Monthly Revenue",
      value: `$${revenue?.thisMonth?.toFixed(2) || '0.00'}`,
      change: "+18.2%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      period: "vs last month"
    },
    {
      title: "Active Classes",
      value: classes?.active?.toString() || "0",
      change: "+5.1%",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      period: "vs last month"
    },
    {
      title: "Class Utilization",
      value: `${classes?.utilization?.toFixed(1) || '0.0'}%`,
      change: classes?.utilization && classes.utilization > 85 ? "+2.1%" : "-2.1%",
      changeType: classes?.utilization && classes.utilization > 85 ? "positive" as const : "negative" as const,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      period: "vs last month"
    }
  ];

  const performanceData = [
    { name: 'Student Retention', value: 92, color: '#3B82F6' },
    { name: 'Class Completion', value: 87, color: '#10B981' },
    { name: 'Payment Success', value: 96, color: '#F59E0B' },
    { name: 'Avg Attendance', value: Math.round(students?.averageAttendance || 0), color: '#8B5CF6' },
  ];

  const topPerformers = [
    { name: "Bruno Silva", category: "Instructor", metric: "98% satisfaction", badge: "top" },
    { name: "Main Branch", category: "Branch", metric: `${students?.active || 0} students`, badge: "growth" },
    { name: "Fundamentals", category: "Class", metric: "95% completion", badge: "popular" },
    { name: "Kids Program", category: "Program", metric: "89% retention", badge: "retention" },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "top": return "bg-yellow-100 text-yellow-800";
      case "growth": return "bg-green-100 text-green-800";
      case "popular": return "bg-blue-100 text-blue-800";
      case "retention": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy">Analytics Dashboard</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric) => (
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
              <div className="flex items-center text-xs">
                {metric.changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={metric.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                  {metric.change}
                </span>
                <span className="text-bjj-gray ml-1">{metric.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Growth Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Enrollment Trends</CardTitle>
            <p className="text-sm text-bjj-gray">Student enrollment over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enrollmentTrends?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="new" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="New Students"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Performance Metrics</CardTitle>
            <p className="text-sm text-bjj-gray">Key performance indicators</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top Performers
          </CardTitle>
          <p className="text-sm text-bjj-gray">Highlighting exceptional performance across categories</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={getBadgeColor(performer.badge)}>
                    {performer.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-bjj-navy">{performer.name}</h3>
                <p className="text-sm text-bjj-gray">{performer.category}</p>
                <p className="text-sm font-medium text-bjj-gold-dark mt-1">
                  {performer.metric}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
