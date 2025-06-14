
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChartIcon, 
  Users, 
  Calendar, 
  DollarSign, 
  Award,
  Download,
  FileText,
  Share2
} from "lucide-react";
import { StudentAnalyticsComponent } from "./StudentAnalyticsComponent";
import { RevenueAnalyticsComponent } from "./RevenueAnalyticsComponent";
import { AttendanceAnalyticsComponent } from "./AttendanceAnalyticsComponent";
import { ClassAnalyticsComponent } from "./ClassAnalyticsComponent";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useToast } from "@/hooks/use-toast";

export const AnalyticsDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { students, classes, revenue, enrollmentTrends, isLoading } = useAnalytics();
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics data is being prepared for export.",
    });
    // In a real implementation, we would trigger an actual export here
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generation",
      description: "Your custom report is being generated.",
    });
    // In a real implementation, we would trigger report generation
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
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-bjj-navy">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Total Students</p>
              <h3 className="text-3xl font-bold text-bjj-navy">{students?.total}</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-600">+{students?.newThisMonth} this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Active Classes</p>
              <h3 className="text-3xl font-bold text-bjj-navy">{classes?.active}</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-bjj-gray">{classes?.utilization.toFixed(1)}% utilization</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Monthly Revenue</p>
              <h3 className="text-3xl font-bold text-bjj-navy">${revenue?.monthly}</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-600">{revenue?.activeSubscriptions} active subscriptions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-amber-100 rounded-full mr-4">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Attendance Rate</p>
              <h3 className="text-3xl font-bold text-bjj-navy">
                {students?.averageAttendance.toFixed(1)}%
              </h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-bjj-gray">Average student attendance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Students
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Calendar className="h-4 w-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <DollarSign className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="classes">
            <Award className="h-4 w-4 mr-2" />
            Classes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Student Growth Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {enrollmentTrends ? (
                  <div className="h-full">
                    <RevenueAnalyticsComponent />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-bjj-gray">No enrollment data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <AttendanceAnalyticsComponent />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <StudentAnalyticsComponent />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceAnalyticsComponent />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalyticsComponent />
        </TabsContent>

        <TabsContent value="classes">
          <ClassAnalyticsComponent />
        </TabsContent>
      </Tabs>

      {/* Insights Section */}
      <Card className="bg-gradient-to-r from-bjj-navy to-bjj-navy-dark text-white">
        <CardHeader>
          <CardTitle className="text-white">AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <TrendingUpIcon className="h-5 w-5 mr-2" /> Student Retention Opportunity
              </h3>
              <p className="text-sm opacity-90">
                We've detected that students who attend at least 3 classes per week have a 78% higher retention rate. 
                Consider implementing a "3x Weekly Challenge" to boost attendance and retention.
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" /> Revenue Growth Potential
              </h3>
              <p className="text-sm opacity-90">
                The "Quarterly" subscription plan has the highest renewal rate at 92%. Promoting this plan could 
                increase your average revenue per student by up to 15%.
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <Calendar className="h-5 w-5 mr-2" /> Schedule Optimization
              </h3>
              <p className="text-sm opacity-90">
                Tuesday and Thursday evenings have the highest attendance rates. Consider adding more advanced 
                classes during these peak times to maximize instructor utilization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TrendingUpIcon = Award;
