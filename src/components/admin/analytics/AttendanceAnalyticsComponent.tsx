
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, ScatterChart, Scatter, ZAxis, ReferenceLine } from "recharts";
import { useAttendanceAnalytics } from "@/hooks/useAttendanceAnalytics";
import { CalendarIcon, Users, Clock, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const AttendanceAnalyticsComponent = () => {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const { 
    heatmapData, 
    trendsData, 
    metrics,
    isLoading 
  } = useAttendanceAnalytics(dateRange);

  const formatDateRange = () => {
    if (dateRange.start && dateRange.end) {
      return `${format(dateRange.start, "MMM dd, yyyy")} - ${format(dateRange.end, "MMM dd, yyyy")}`;
    }
    return "Select date range";
  };

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

  // Format heatmap data for visualization
  const formattedHeatmapData = DAYS.flatMap(day => 
    HOURS.map(hour => {
      const dayIndex = DAYS.indexOf(day);
      const found = heatmapData?.find(d => 
        d.day_of_week === dayIndex && d.hour_of_day === hour
      );
      return {
        day,
        hour: `${hour}:00`,
        value: found?.attendance_count || 0,
        display: found?.attendance_count ? found.attendance_count.toString() : ''
      };
    })
  );

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
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Total Attendances</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {metrics?.totalAttendances.toLocaleString() || 0}
              </h3>
              <p className="text-xs text-bjj-gray">
                In selected period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Present Rate</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {metrics?.presentPercentage.toFixed(1) || 0}%
              </h3>
              <p className="text-xs text-green-600">
                Students attending classes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-4">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">No-Show Rate</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {metrics?.noShowRate.toFixed(1) || 0}%
              </h3>
              <p className="text-xs text-red-600">
                Booked but didn't attend
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Late Rate</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {metrics?.latePercentage.toFixed(1) || 0}%
              </h3>
              <p className="text-xs text-yellow-600">
                Students arriving late
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Charts */}
      <Tabs defaultValue="trends">
        <TabsList className="mb-4">
          <TabsTrigger value="trends">Attendance Trends</TabsTrigger>
          <TabsTrigger value="heatmap">Attendance Heatmap</TabsTrigger>
          <TabsTrigger value="consistent">Consistent Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="present" 
                      name="Present" 
                      stroke="#10B981" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="absent" 
                      name="Absent" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="late" 
                      name="Late" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      name="Total" 
                      stroke="#6B7280" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Custom Heatmap Visualization */}
              <div className="overflow-x-auto pb-6">
                <div className="min-w-[1000px]">
                  <div className="grid grid-cols-[100px_repeat(24,1fr)] gap-1">
                    <div className="h-10"></div>
                    {HOURS.map(hour => (
                      <div key={hour} className="h-10 text-xs font-medium text-center">
                        {hour}:00
                      </div>
                    ))}
                    
                    {DAYS.map(day => (
                      <>
                        <div key={day} className="h-10 flex items-center font-medium">
                          {day}
                        </div>
                        {HOURS.map(hour => {
                          const data = formattedHeatmapData.find(
                            d => d.day === day && d.hour === `${hour}:00`
                          );
                          const value = data?.value || 0;
                          // Dynamic color based on value
                          const intensity = Math.min(value * 8, 255);
                          const bgColor = value 
                            ? `rgba(79, 70, 229, ${Math.min(0.1 + (value / 20), 0.9)})`
                            : 'rgba(243, 244, 246, 0.7)';
                            
                          return (
                            <div 
                              key={`${day}-${hour}`}
                              className="h-10 flex items-center justify-center rounded text-xs font-medium"
                              style={{ 
                                backgroundColor: bgColor,
                                color: intensity > 150 ? 'white' : 'black'
                              }}
                            >
                              {data?.display}
                            </div>
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center mt-6">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span className="text-xs">None</span>
                </div>
                <div className="w-16 h-2 bg-gradient-to-r from-indigo-100 to-indigo-500 mx-2 rounded"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                  <span className="text-xs">Many</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consistent">
          <Card>
            <CardHeader>
              <CardTitle>Most Consistent Students</CardTitle>
            </CardHeader>
            <CardContent>
              {metrics?.consistentStudents?.length ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {metrics.consistentStudents.map((student, index) => (
                      <Card key={student.id}>
                        <CardContent className="p-4 text-center">
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                          </div>
                          <h4 className="font-medium truncate">{student.name}</h4>
                          <p className="text-sm text-bjj-gray mt-1">
                            {student.attendances} attendances
                          </p>
                          <Badge className="mt-2 bg-blue-100 text-blue-800">
                            Top Performer
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-4">Attendance Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={metrics.consistentStudents}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendances" name="Total Attendances" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-bjj-gray mx-auto mb-2" />
                  <h3 className="text-lg font-medium mb-2">No Attendance Data</h3>
                  <p className="text-sm text-bjj-gray">Start recording attendance to see your most consistent students.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
