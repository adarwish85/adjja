
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  Activity, 
  Users, 
  Clock,
  Star,
  Target,
  TrendingUp,
  Download,
  Filter
} from "lucide-react";

export const PerformanceAnalytics = () => {
  const performanceMetrics = [
    { title: "Class Utilization", value: "87.3%", change: "+2.1%", icon: Activity, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Instructor Rating", value: "4.8/5", change: "+0.2", icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { title: "Avg. Class Size", value: "18.5", change: "+1.2", icon: Users, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "On-time Rate", value: "94.2%", change: "+3.1%", icon: Clock, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  const classPerformance = [
    { class: 'Fundamentals', attendance: 92, satisfaction: 4.7, completion: 88 },
    { class: 'Advanced', attendance: 85, satisfaction: 4.9, completion: 95 },
    { class: 'Competition', attendance: 78, satisfaction: 4.6, completion: 82 },
    { class: 'Kids Program', attendance: 89, satisfaction: 4.8, completion: 91 },
    { class: 'Women Only', attendance: 94, satisfaction: 4.9, completion: 96 },
    { class: 'No-Gi', attendance: 81, satisfaction: 4.5, completion: 79 },
  ];

  const instructorPerformance = [
    { name: 'Bruno Silva', rating: 4.9, classes: 48, retention: 95 },
    { name: 'Carlos Santos', rating: 4.8, classes: 42, retention: 92 },
    { name: 'Ana Costa', rating: 4.7, classes: 38, retention: 88 },
    { name: 'Roberto Lima', rating: 4.6, classes: 35, retention: 85 },
    { name: 'Maria Oliveira', rating: 4.8, classes: 41, retention: 90 },
  ];

  const overallPerformance = [
    { metric: 'Student Satisfaction', value: 85, fullMark: 100 },
    { metric: 'Class Attendance', value: 87, fullMark: 100 },
    { metric: 'Retention Rate', value: 92, fullMark: 100 },
    { metric: 'Payment Success', value: 96, fullMark: 100 },
    { metric: 'Instructor Quality', value: 88, fullMark: 100 },
    { metric: 'Facility Usage', value: 82, fullMark: 100 },
  ];

  const weeklyTrends = [
    { week: 'Week 1', attendance: 85, satisfaction: 4.6 },
    { week: 'Week 2', attendance: 87, satisfaction: 4.7 },
    { week: 'Week 3', attendance: 89, satisfaction: 4.8 },
    { week: 'Week 4', attendance: 91, satisfaction: 4.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
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
            <CardTitle className="text-bjj-navy">Performance Analytics</CardTitle>
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
        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Class Performance</CardTitle>
            <p className="text-sm text-bjj-gray">Attendance and satisfaction by class type</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#3B82F6" name="Attendance %" />
                <Bar dataKey="completion" fill="#10B981" name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Performance Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Overall Performance</CardTitle>
            <p className="text-sm text-bjj-gray">Multi-dimensional performance overview</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={overallPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#D4AF37"
                  fill="#D4AF37"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Weekly Performance Trends</CardTitle>
            <p className="text-sm text-bjj-gray">Attendance and satisfaction trends</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Attendance %"
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  name="Satisfaction (1-5)"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Instructors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Top Performing Instructors</CardTitle>
            <p className="text-sm text-bjj-gray">Instructor performance metrics</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instructorPerformance.map((instructor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-bjj-navy">{instructor.name}</h4>
                    <p className="text-sm text-bjj-gray">{instructor.classes} classes this month</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                      {instructor.retention}% retention
                    </Badge>
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
