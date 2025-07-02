
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Plus, Download, Activity } from "lucide-react";
import { useAttendanceAnalytics } from "@/hooks/useAttendanceAnalytics";
import { ManualCheckInModal } from "@/components/attendance/ManualCheckInModal";
import { AttendanceRecordsTable } from "./AttendanceRecordsTable";
import { QuickAttendanceActions } from "./QuickAttendanceActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";

export const AttendanceManager = () => {
  const [showManualCheckIn, setShowManualCheckIn] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [classId, setClassId] = useState<string | undefined>(undefined);
  const [branchId, setBranchId] = useState<string | undefined>(undefined);
  
  // Convert DateRange to the format expected by useAttendanceAnalytics
  const analyticsDateRange = dateRange ? {
    start: dateRange.from,
    end: dateRange.to
  } : undefined;
  
  const { metrics, isLoading } = useAttendanceAnalytics(analyticsDateRange, classId, branchId);

  // Handler for DatePicker that properly types the callback
  const handleDateRangeChange = (date: Date | DateRange | undefined) => {
    if (date && typeof date === 'object' && 'from' in date) {
      // It's a DateRange
      setDateRange(date as DateRange);
    } else if (date instanceof Date) {
      // It's a single Date, convert to DateRange
      setDateRange({ from: date, to: date });
    } else {
      // It's undefined
      setDateRange(undefined);
    }
  };

  const handleAttendanceMarked = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-bjj-navy">Attendance Management</h2>
          <p className="text-bjj-gray">Track and manage class attendance efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowManualCheckIn(true)}
            className="bg-bjj-red hover:bg-bjj-red/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Manual Check-In
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Check-ins</p>
                <p className="text-2xl font-bold text-bjj-navy">
                  {metrics?.totalAttendances || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-bjj-red" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics?.presentPercentage?.toFixed(1) || 0}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late Arrivals</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics?.latePercentage?.toFixed(1) || 0}%
                </p>
              </div>
              <Badge variant="secondary" className="text-orange-600">
                Late
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No Shows</p>
                <p className="text-2xl font-bold text-red-600">
                  {metrics?.noShowRate?.toFixed(1) || 0}%
                </p>
              </div>
              <Badge variant="destructive">
                Absent
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="quick-actions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick-actions">
            <Activity className="h-4 w-4 mr-2" />
            Quick Actions
          </TabsTrigger>
          <TabsTrigger value="records">
            <Users className="h-4 w-4 mr-2" />
            Attendance Records
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Calendar className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-actions" className="mt-6">
          <QuickAttendanceActions onAttendanceMarked={handleAttendanceMarked} />
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <AttendanceRecordsTable refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Date Range</p>
              <DatePicker
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Class</p>
              <Select onValueChange={setClassId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class1">Class 1</SelectItem>
                  <SelectItem value="class2">Class 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Branch</p>
              <Select onValueChange={setBranchId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branch1">Branch 1</SelectItem>
                  <SelectItem value="branch2">Branch 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attendance Analytics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-red"></div>
                </div>
              ) : (
                <p>Advanced attendance analytics and charts will be displayed here.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Manual Check-In Modal */}
      <ManualCheckInModal 
        open={showManualCheckIn}
        onOpenChange={setShowManualCheckIn}
        onAttendanceMarked={handleAttendanceMarked}
      />
    </div>
  );
};
