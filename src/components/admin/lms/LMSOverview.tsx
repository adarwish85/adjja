
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  PlayCircle, 
  Award, 
  TrendingUp, 
  Clock,
  Plus,
  Upload,
  BarChart3
} from "lucide-react";

export const LMSOverview = () => {
  const kpiData = [
    {
      title: "Total Courses",
      value: "45",
      change: "+5",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Students",
      value: "1,247",
      change: "+89",
      changeType: "positive" as const,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Videos Watched",
      value: "8,934",
      change: "+234",
      changeType: "positive" as const,
      icon: PlayCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Certificates Issued",
      value: "312",
      change: "+28",
      changeType: "positive" as const,
      icon: Award,
      color: "text-bjj-gold-dark",
      bgColor: "bg-yellow-100",
    },
  ];

  const recentActivity = [
    { action: "New course 'Advanced Guard Passing' published", time: "2 hours ago", type: "course" },
    { action: "Student John Doe completed 'Basic Positions'", time: "4 hours ago", type: "completion" },
    { action: "Video 'Kimura from Guard' uploaded", time: "6 hours ago", type: "upload" },
    { action: "Certificate issued to Maria Silva", time: "1 day ago", type: "certificate" },
    { action: "Course 'Competition Prep' updated", time: "2 days ago", type: "update" },
  ];

  const popularCourses = [
    { name: "BJJ Fundamentals", students: 234, rating: 4.9, revenue: "$2,340" },
    { name: "Guard Passing System", students: 189, rating: 4.8, revenue: "$1,890" },
    { name: "Submission Defense", students: 156, rating: 4.7, revenue: "$1,560" },
    { name: "Competition Preparation", students: 123, rating: 4.9, revenue: "$1,230" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{kpi.value}</div>
              <p className="text-xs text-green-600">
                +{kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Content
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline">
              <Award className="h-4 w-4 mr-2" />
              Issue Certificate
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${
                    activity.type === 'course' ? 'bg-blue-100' :
                    activity.type === 'completion' ? 'bg-green-100' :
                    activity.type === 'upload' ? 'bg-purple-100' :
                    activity.type === 'certificate' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-bjj-navy">{activity.action}</p>
                    <p className="text-xs text-bjj-gray">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-bjj-navy text-sm">{course.name}</h4>
                    <div className="flex items-center space-x-3 text-xs text-bjj-gray mt-1">
                      <span>{course.students} students</span>
                      <span>⭐ {course.rating}</span>
                      <Badge variant="outline" className="text-xs">
                        {course.revenue}
                      </Badge>
                    </div>
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
