
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useStudentAnalytics } from "@/hooks/useStudentAnalytics";
import { CalendarIcon, Users, TrendingUp, UserMinus, Clock } from "lucide-react";
import { format } from "date-fns";

export const StudentAnalyticsComponent = () => {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    end: new Date()
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const { growthData, retentionData, beltDistribution, metrics, isLoading } = useStudentAnalytics(dateRange);

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
              <p className="text-sm font-medium text-bjj-gray">Total Students</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {metrics?.totalStudents.toLocaleString()}
              </h3>
              <p className="text-xs text-bjj-gray">
                {metrics?.activeStudents.toLocaleString()} active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Retention Rate</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {metrics?.retentionRate.toFixed(1)}%
              </h3>
              <p className="text-xs text-green-600">
                Stay longer, learn more
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-4">
              <UserMinus className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Churn Rate</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {metrics?.churnRate.toFixed(1)}%
              </h3>
              <p className="text-xs text-red-600">
                {metrics?.inactiveStudents.toLocaleString()} inactive students
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Avg. Lifetime</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {metrics?.averageLifetimeMonths.toFixed(1)} months
              </h3>
              <p className="text-xs text-bjj-gray">
                {metrics?.averageLifetimeDays.toFixed(0)} days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <Tabs defaultValue="growth">
        <TabsList className="mb-4">
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="retention">Retention Analysis</TabsTrigger>
          <TabsTrigger value="distribution">Student Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Student Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="new_students" 
                      name="New Students" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="active_students" 
                      name="Active Students" 
                      stroke="#82ca9d" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="growthRate" 
                      name="Growth Rate (%)" 
                      stroke="#ff7300" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>Retention by Cohort</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="total" 
                      name="Total Students" 
                      fill="#8884d8" 
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="active" 
                      name="Active Students" 
                      fill="#82ca9d" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="retention" 
                      name="Retention Rate (%)" 
                      stroke="#ff7300" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Belt Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={beltDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ belt, percent }) => `${belt} ${(percent * 100).toFixed(0)}%`}
                    >
                      {beltDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
