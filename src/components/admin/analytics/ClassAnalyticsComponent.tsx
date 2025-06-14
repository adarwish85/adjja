
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
         LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useClassAnalytics } from "@/hooks/useClassAnalytics";
import { CalendarIcon, Users, Award, TrendingUp, BarChart as BarChartIcon } from "lucide-react";
import { format } from "date-fns";

export const ClassAnalyticsComponent = () => {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    end: new Date()
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const { 
    classPerformanceData, 
    instructorData, 
    utilizationTrends,
    isLoading 
  } = useClassAnalytics(dateRange);

  const formatDateRange = () => {
    if (dateRange.start && dateRange.end) {
      return `${format(dateRange.start, "MMM dd, yyyy")} - ${format(dateRange.end, "MMM dd, yyyy")}`;
    }
    return "Select date range";
  };

  // Calculate overall metrics
  const avgUtilization = classPerformanceData?.reduce(
    (total, cls) => total + (cls.utilization_percentage || 0), 0
  ) / (classPerformanceData?.length || 1);
  
  const totalClasses = classPerformanceData?.length || 0;
  
  const totalAttendance = classPerformanceData?.reduce(
    (total, cls) => total + (cls.total_attendances || 0), 0
  ) || 0;
  
  const totalInstructors = Array.from(
    new Set(instructorData?.map(i => i.instructor))
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-end">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal w-[240px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.start}
              selected={{ from: dateRange.start, to: dateRange.end }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ start: range.from, end: range.to });
                  setDatePickerOpen(false);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <BarChartIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Avg. Utilization</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {avgUtilization.toFixed(1)}%
              </h3>
              <p className="text-xs text-bjj-gray">
                Across {totalClasses} classes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Total Attendance</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {totalAttendance.toLocaleString()}
              </h3>
              <p className="text-xs text-bjj-gray">
                Class check-ins
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Instructors</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {totalInstructors}
              </h3>
              <p className="text-xs text-bjj-gray">
                Active instructors
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-amber-100 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Most Popular</p>
              <h3 className="text-xl font-bold text-bjj-navy truncate max-w-[150px]">
                {classPerformanceData?.sort((a, b) => b.utilization_percentage - a.utilization_percentage)[0]?.class_name || 'N/A'}
              </h3>
              <p className="text-xs text-bjj-gray">
                Highest utilization class
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Analytics Tabs */}
      <Tabs defaultValue="classes">
        <TabsList className="mb-4">
          <TabsTrigger value="classes">Class Performance</TabsTrigger>
          <TabsTrigger value="instructors">Instructor Analytics</TabsTrigger>
          <TabsTrigger value="utilization">Utilization Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={classPerformanceData?.slice(0, 10)}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis 
                      type="category" 
                      dataKey="class_name" 
                      width={150} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Utilization']}
                    />
                    <Legend />
                    <Bar dataKey="utilization_percentage" name="Utilization %" fill="#8884d8" />
                    <Bar dataKey="attendanceRate" name="Attendance Rate %" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {classPerformanceData && classPerformanceData.length > 10 && (
                <div className="text-center mt-4 text-sm text-bjj-gray">
                  Showing top 10 of {classPerformanceData.length} classes by utilization
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instructors">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={instructorData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="instructor" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar 
                      name="Utilization Rate" 
                      dataKey="utilizationRate" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Radar 
                      name="Attendance Rate" 
                      dataKey="attendanceRate" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6} 
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2 font-semibold">Instructor</th>
                      <th className="pb-2 font-semibold text-right">Classes</th>
                      <th className="pb-2 font-semibold text-right">Total Students</th>
                      <th className="pb-2 font-semibold text-right">Utilization</th>
                      <th className="pb-2 font-semibold text-right">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructorData?.map((instructor) => (
                      <tr key={instructor.instructor} className="border-b">
                        <td className="py-3 font-medium">{instructor.instructor}</td>
                        <td className="py-3 text-right">{instructor.totalClasses}</td>
                        <td className="py-3 text-right">{instructor.totalEnrolled}</td>
                        <td className="py-3 text-right">
                          <Badge className={instructor.utilizationRate > 80 ? "bg-green-100 text-green-800" : 
                                          instructor.utilizationRate > 60 ? "bg-blue-100 text-blue-800" : 
                                          "bg-amber-100 text-amber-800"}>
                            {instructor.utilizationRate.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Badge className={instructor.attendanceRate > 80 ? "bg-green-100 text-green-800" : 
                                          instructor.attendanceRate > 60 ? "bg-blue-100 text-blue-800" : 
                                          "bg-amber-100 text-amber-800"}>
                            {instructor.attendanceRate.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="utilization">
          <Card>
            <CardHeader>
              <CardTitle>Class Utilization Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={utilizationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Utilization']} />
                    <Legend />
                    {Object.keys(utilizationTrends?.[0] || {})
                      .filter(key => key !== 'month')
                      .map((className, index) => (
                        <Line 
                          key={className}
                          type="monotone" 
                          dataKey={className} 
                          name={className} 
                          stroke={index % 2 === 0 ? '#8884d8' : '#82ca9d'} 
                          strokeDasharray={index % 3 === 0 ? "5 5" : ""}
                          activeDot={{ r: 8 }} 
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
