
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { toast } from "sonner";
import { Users, Calendar, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface Class {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  belt: string;
  status: string;
}

interface QuickAttendanceActionsProps {
  onAttendanceMarked?: () => void;
}

export const QuickAttendanceActions = ({ onAttendanceMarked }: QuickAttendanceActionsProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { manualCheckIn, isCheckingIn } = useSmartAttendance();

  // Fetch today's active classes
  const { data: todayClasses } = useQuery({
    queryKey: ['today-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('status', 'Active')
        .order('name');
      
      if (error) throw error;
      return data as Class[];
    }
  });

  // Fetch students enrolled in selected class
  const { data: classStudents } = useQuery({
    queryKey: ['class-students', selectedClass],
    queryFn: async () => {
      if (!selectedClass) return [];
      
      const { data, error } = await supabase
        .from('class_enrollments')
        .select(`
          students!inner(
            id,
            name,
            email,
            belt,
            status
          )
        `)
        .eq('class_id', selectedClass)
        .eq('status', 'active')
        .eq('students.status', 'active');
      
      if (error) throw error;
      return data.map(enrollment => enrollment.students) as Student[];
    },
    enabled: !!selectedClass
  });

  // Get today's attendance for selected class
  const { data: todayAttendance } = useQuery({
    queryKey: ['today-attendance', selectedClass],
    queryFn: async () => {
      if (!selectedClass) return [];
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('student_id, status')
        .eq('class_id', selectedClass)
        .eq('attendance_date', today);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedClass
  });

  const handleQuickCheckIn = async (studentId: string) => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }

    try {
      manualCheckIn({ studentIds: [studentId], classId: selectedClass });
      onAttendanceMarked?.();
    } catch (error) {
      console.error('Error checking in student:', error);
    }
  };

  const handleBulkCheckIn = async () => {
    if (!selectedClass || selectedStudents.length === 0) {
      toast.error("Please select a class and students");
      return;
    }

    try {
      manualCheckIn({ studentIds: selectedStudents, classId: selectedClass });
      setSelectedStudents([]);
      onAttendanceMarked?.();
    } catch (error) {
      console.error('Error bulk checking in students:', error);
    }
  };

  const isStudentCheckedIn = (studentId: string) => {
    return todayAttendance?.some(record => record.student_id === studentId && record.status === 'present');
  };

  const getAttendanceStats = () => {
    const totalStudents = classStudents?.length || 0;
    const checkedInCount = todayAttendance?.filter(record => record.status === 'present').length || 0;
    const lateCount = todayAttendance?.filter(record => record.status === 'late').length || 0;
    
    return { totalStudents, checkedInCount, lateCount };
  };

  const { totalStudents, checkedInCount, lateCount } = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Today's Classes Quick Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayClasses?.slice(0, 6).map((class_) => (
              <div key={class_.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-semibold">{class_.name}</h4>
                <p className="text-sm text-gray-600">{class_.instructor}</p>
                <p className="text-sm text-gray-500">{class_.schedule}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline">
                    {class_.enrolled}/{class_.capacity} students
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedClass(class_.id)}
                    className="ml-auto"
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Check-in Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quick Check-in Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Class Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class for attendance" />
              </SelectTrigger>
              <SelectContent>
                {todayClasses?.map((class_) => (
                  <SelectItem key={class_.id} value={class_.id}>
                    {class_.name} - {class_.instructor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Stats */}
          {selectedClass && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-bjj-navy">{totalStudents}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{checkedInCount}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{lateCount}</div>
                <div className="text-sm text-gray-600">Late</div>
              </div>
            </div>
          )}

          {/* Student List for Quick Check-in */}
          {selectedClass && classStudents && classStudents.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Students</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const notCheckedIn = classStudents
                        .filter(student => !isStudentCheckedIn(student.id))
                        .map(student => student.id);
                      setSelectedStudents(notCheckedIn);
                    }}
                  >
                    Select All Remaining
                  </Button>
                  {selectedStudents.length > 0 && (
                    <Button
                      size="sm"
                      onClick={handleBulkCheckIn}
                      disabled={isCheckingIn}
                      className="bg-bjj-red hover:bg-bjj-red/90"
                    >
                      Check In Selected ({selectedStudents.length})
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {classStudents.map((student) => {
                  const isCheckedIn = isStudentCheckedIn(student.id);
                  const isSelected = selectedStudents.includes(student.id);
                  
                  return (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        isCheckedIn ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isCheckedIn}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                            }
                          }}
                          className="rounded"
                        />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.belt} belt</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isCheckedIn ? (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Checked In
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickCheckIn(student.id)}
                            disabled={isCheckingIn}
                          >
                            Check In
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
