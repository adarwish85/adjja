
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  PlayCircle,
  Calendar
} from "lucide-react";

export const LMSAnalytics = () => {
  const revenueData = [
    { month: "Jan", revenue: 12450, subscriptions: 89, oneTime: 156 },
    { month: "Feb", revenue: 15680, subscriptions: 145, oneTime: 203 },
    { month: "Mar", revenue: 18920, subscriptions: 178, oneTime: 267 },
    { month: "Apr", revenue: 22340, subscriptions: 234, oneTime: 298 },
    { month: "May", revenue: 19875, subscriptions: 198, oneTime: 276 },
    { month: "Jun", revenue: 25600, subscriptions: 267, oneTime: 334 },
  ];

  const engagementMetrics = [
    { metric: "Average Session Duration", value: "24 minutes", change: "+12%", trend: "up" },
    { metric: "Course Completion Rate", value: "78%", change: "+5%", trend: "up" },
    { metric: "Student Retention (30 days)", value: "85%", change: "+3%", trend: "up" },
    { metric: "Video Watch Rate", value: "92%", change: "-2%", trend: "down" },
  ];

  const topCourses = [
    { name: "BJJ Fundamentals", revenue: "$12,450", students: 234, rating: 4.9, completion: 89 },
    { name: "Advanced Guard System", revenue: "$8,920", students: 156, rating: 4.8, completion: 76 },
    { name: "Competition Preparation", revenue: "$6,780", students: 123, rating: 4.7, completion: 82 },
    { name: "Submission Defense", revenue: "$5,340", students: 98, rating: 4.6, completion: 71 },
  ];

  const instructorPerformance = [
    { name: "Master Silva", courses: 8, students: 567, revenue: "$28,450", rating: 4.9 },
    { name: "Coach Roberto", courses: 5, students: 345, revenue: "$17,250", rating: 4.8 },
    { name: "Coach Ana", courses: 4, students: 234, revenue: "$11,700", rating: 4.7 },
    { name: "Coach Maria", courses: 3, students: 189, revenue: "$9,450", rating: 4.6 },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-bjj-navy">$115K</p>
                      <p className="text-sm text-bjj-gray">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-bjj-navy">$25.6K</p>
                      <p className="text-sm text-bjj-gray">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-bjj-navy">267</p>
                      <p className="text-sm text-bjj-gray">New Subscribers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-bjj-gold-dark" />
                    <div>
                      <p className="text-2xl font-bold text-bjj-navy">$96</p>
                      <p className="text-sm text-bjj-gray">Avg Revenue/Student</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy">Monthly Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-bjj-navy w-12">{data.month}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm text-bjj-gray">Subscriptions: {data.subscriptions}</span>
                            <span className="text-sm text-bjj-gray">One-time: {data.oneTime}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-bjj-gold h-2 rounded-full" 
                              style={{ width: `${(data.revenue / 30000) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-bjj-navy">${data.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy">Top Revenue Generating Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-bjj-gold rounded-full flex items-center justify-center text-bjj-navy font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-bjj-navy">{course.name}</h4>
                          <div className="flex items-center space-x-3 text-sm text-bjj-gray">
                            <span>{course.students} students</span>
                            <span>⭐ {course.rating}</span>
                            <span>{course.completion}% completion</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-bjj-navy">{course.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="space-y-6">
            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {engagementMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-bjj-gray">{metric.metric}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-bjj-navy">{metric.value}</p>
                        <span className={`text-sm ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Weekly Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy">Weekly Engagement Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                    const engagement = [85, 92, 88, 95, 82, 67, 74][index];
                    return (
                      <div key={day} className="flex items-center space-x-4">
                        <span className="w-20 text-bjj-navy font-medium">{day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-bjj-gold h-3 rounded-full" 
                            style={{ width: `${engagement}%` }}
                          />
                        </div>
                        <span className="text-bjj-gray text-sm">{engagement}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            {/* Instructor Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy">Instructor Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instructorPerformance.map((instructor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-bjj-gold rounded-full flex items-center justify-center">
                          <span className="text-bjj-navy font-semibold text-sm">
                            {instructor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-bjj-navy">{instructor.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-bjj-gray">
                            <span>{instructor.courses} courses</span>
                            <span>{instructor.students} students</span>
                            <span>⭐ {instructor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-bjj-navy">{instructor.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy">Course Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses.map((course, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-bjj-navy">{course.name}</span>
                        <span className="text-sm text-bjj-gray">{course.completion}% completion</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-bjj-gold h-2 rounded-full" 
                          style={{ width: `${course.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="space-y-6">
            {/* Growth Trends */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-bjj-navy">Student Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-green-600">+23%</p>
                      <p className="text-sm text-green-700">Monthly Growth Rate</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-bjj-navy">1,247</p>
                        <p className="text-sm text-bjj-gray">Total Students</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-bjj-navy">234</p>
                        <p className="text-sm text-bjj-gray">New This Month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-bjj-navy">Content Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <PlayCircle className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-blue-600">12.4K</p>
                      <p className="text-sm text-blue-700">Hours Watched This Month</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-bjj-navy">24m</p>
                        <p className="text-sm text-bjj-gray">Avg Session</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-bjj-navy">8.9</p>
                        <p className="text-sm text-bjj-gray">Videos/Session</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Peak Usage Times */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Peak Usage Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-medium text-bjj-navy mb-2">Peak Day</h4>
                    <p className="text-2xl font-bold text-bjj-gold">Wednesday</p>
                    <p className="text-sm text-bjj-gray">35% of weekly traffic</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-bjj-navy mb-2">Peak Hour</h4>
                    <p className="text-2xl font-bold text-bjj-gold">7-8 PM</p>
                    <p className="text-sm text-bjj-gray">22% of daily traffic</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-bjj-navy mb-2">Most Popular</h4>
                    <p className="text-2xl font-bold text-bjj-gold">Technique Videos</p>
                    <p className="text-sm text-bjj-gray">68% of content views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
