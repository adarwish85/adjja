
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useStudents } from "@/hooks/useStudents";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const AttendanceManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { classes, loading: classesLoading } = useClasses();
  const { students, loading: studentsLoading } = useStudents();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use centralized settings
  const { 
    enableInstructorValidation, 
    lateThresholdMinutes, 
    autoAbsenceMinutes,
    defaultAttendanceBuffer 
  } = useAppSettings();

  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Load attendance records when date or class changes
  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadAttendanceRecords();
    }
  }, [selectedClass, selectedDate]);

  const loadAttendanceRecords = async () => {
    if (!selectedClass) return;
    
    setLoadingAttendance(true);
    try {
      // Format the date for the query
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          id, 
          status, 
          marked_at,
          student_id,
          profiles(id, name, email)
        `)
        .eq('class_id', selectedClass)
        .eq('attendance_date', formattedDate);
      
      if (error) throw error;
      
      setAttendanceRecords(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive",
      });
      console.error("Error loading attendance:", error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const markAttendance = async (studentId: string, status: string) => {
    if (!selectedClass || !selectedDate || !user) return;
    
    // Check if instructor validation is required and user is not an instructor
    if (enableInstructorValidation && user.role !== 'Coach' && user.role !== 'Admin' && user.role !== 'Super Admin') {
      toast({
        title: "Access Denied",
        description: "Only instructors can mark attendance when instructor validation is enabled",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check if record already exists
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      const { data: existingRecord } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('student_id', studentId)
        .eq('class_id', selectedClass)
        .eq('attendance_date', formattedDate)
        .single();
      
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('attendance_records')
          .update({ 
            status,
            marked_by: user.id,
            marked_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);
          
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('attendance_records')
          .insert({
            student_id: studentId,
            class_id: selectedClass,
            attendance_date: formattedDate,
            status,
            marked_by: user.id
          });
          
        if (error) throw error;
      }
      
      // Refresh attendance records
      loadAttendanceRecords();
      
      toast({
        title: "Success",
        description: `Student marked as ${status}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive",
      });
      console.error("Error marking attendance:", error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedStudents.length === 0) return;
    
    try {
      for (const studentId of selectedStudents) {
        await markAttendance(studentId, bulkAction);
      }
      
      setSelectedStudents([]);
      setBulkAction(null);
      
      toast({
        title: "Success",
        description: `Updated attendance for ${selectedStudents.length} students`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendance for some students",
        variant: "destructive",
      });
    }
  };

  const getStudentAttendanceStatus = (studentId: string) => {
    const record = attendanceRecords.find(record => record.student_id === studentId);
    return record ? record.status : null;
  };

  // Helper to determine if student should be marked as late or absent based on settings
  const getAutoStatus = (classStartTime: Date) => {
    const now = new Date();
    const minutesLate = (now.getTime() - classStartTime.getTime()) / (1000 * 60);
    
    if (minutesLate > autoAbsenceMinutes) return 'absent';
    if (minutesLate > lateThresholdMinutes) return 'late';
    return 'present';
  };

  const isLoading = classesLoading || studentsLoading || loadingAttendance;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance Management</CardTitle>
        <div className="text-sm text-gray-500 space-y-1">
          <p>Settings: Late threshold: {lateThresholdMinutes} min, Auto-absence: {autoAbsenceMinutes} min</p>
          {enableInstructorValidation && <p>Instructor validation is enabled</p>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Date Selector */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date || new Date());
                  setDatePickerOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Class Selector */}
          <Select value={selectedClass || undefined} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-md flex items-center justify-between">
            <span>{selectedStudents.length} students selected</span>
            <div className="flex items-center gap-2">
              <Select value={bulkAction || undefined} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Bulk action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Mark Present</SelectItem>
                  <SelectItem value="absent">Mark Absent</SelectItem>
                  <SelectItem value="late">Mark Late</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                disabled={!bulkAction}
                onClick={handleBulkAction}
              >
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* Student List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center p-4 border rounded-md">
                <div className="h-6 w-6 bg-gray-200 rounded-md mr-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="ml-auto h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : selectedClass ? (
          <div className="space-y-2">
            {filteredStudents?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No students found matching your search
              </div>
            ) : (
              filteredStudents.map((student) => {
                const attendanceStatus = getStudentAttendanceStatus(student.id);
                
                return (
                  <div 
                    key={student.id} 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      selectedStudents.includes(student.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 h-4 w-4"
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                          }
                        }}
                      />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {attendanceStatus && (
                        <Badge className={`
                          ${attendanceStatus === 'present' ? 'bg-green-100 text-green-800' : 
                            attendanceStatus === 'absent' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}
                        `}>
                          {attendanceStatus === 'present' ? 'Present' : 
                           attendanceStatus === 'absent' ? 'Absent' : 'Late'}
                        </Badge>
                      )}
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => markAttendance(student.id, 'present')}
                          title="Mark as present"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => markAttendance(student.id, 'absent')}
                          title="Mark as absent"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                          onClick={() => markAttendance(student.id, 'late')}
                          title="Mark as late"
                        >
                          <Clock className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select a class to manage attendance
          </div>
        )}
      </CardContent>
    </Card>
  );
};
