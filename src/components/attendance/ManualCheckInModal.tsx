
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { toast } from "sonner";
import { Search, User, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface Student {
  id: string;
  name: string;
  email: string;
  belt: string;
  status: string;
}

interface Class {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
}

interface ManualCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttendanceMarked?: () => void;
}

export const ManualCheckInModal = ({ open, onOpenChange, onAttendanceMarked }: ManualCheckInModalProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { manualCheckIn, isCheckingIn } = useSmartAttendance();

  // Fetch all active classes
  const { data: classes } = useQuery({
    queryKey: ['classes-for-checkin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('status', 'Active')
        .order('name');
      
      if (error) throw error;
      return data as Class[];
    },
    enabled: open
  });

  // Fetch all active students
  const { data: students } = useQuery({
    queryKey: ['students-for-checkin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data as Student[];
    },
    enabled: open
  });

  // Get today's attendance for selected class
  const { data: todayAttendance } = useQuery({
    queryKey: ['today-attendance-modal', selectedClass],
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
    enabled: !!selectedClass && open
  });

  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const isStudentCheckedIn = (studentId: string) => {
    return todayAttendance?.some(record => record.student_id === studentId && record.status === 'present');
  };

  const handleCheckIn = async () => {
    if (!selectedClass || selectedStudents.length === 0) {
      toast.error("Please select a class and at least one student");
      return;
    }

    try {
      manualCheckIn({ studentIds: selectedStudents, classId: selectedClass });
      
      // Reset form
      setSelectedStudents([]);
      setSelectedClass("");
      setSearchTerm("");
      
      // Close modal and trigger refresh
      onOpenChange(false);
      onAttendanceMarked?.();
      
    } catch (error) {
      console.error('Error during manual check-in:', error);
    }
  };

  const selectedClass_ = classes?.find(c => c.id === selectedClass);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Manual Student Check-In
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Class Selection */}
          <div>
            <Label className="text-base font-medium">Select Class</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {classes?.map((class_) => (
                <div
                  key={class_.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedClass === class_.id 
                      ? 'border-bjj-red bg-bjj-red/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedClass(class_.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{class_.name}</h4>
                      <p className="text-sm text-gray-600">{class_.instructor}</p>
                      <p className="text-sm text-gray-500">{class_.schedule}</p>
                    </div>
                    {selectedClass === class_.id && (
                      <CheckCircle className="h-5 w-5 text-bjj-red" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Class Info */}
          {selectedClass_ && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedClass_.name}</h3>
                  <p className="text-gray-600">Instructor: {selectedClass_.instructor}</p>
                  <p className="text-sm text-gray-500">
                    Date: {format(new Date(), 'EEEE, MMMM do, yyyy')}
                  </p>
                </div>
                <Badge variant="outline" className="text-bjj-red border-bjj-red">
                  {selectedStudents.length} selected
                </Badge>
              </div>
            </div>
          )}

          {/* Student Selection */}
          {selectedClass && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Select Students</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const availableStudents = filteredStudents
                        .filter(student => !isStudentCheckedIn(student.id))
                        .map(student => student.id);
                      setSelectedStudents(availableStudents);
                    }}
                  >
                    Select All Available
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudents([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Students List */}
              <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No students found</p>
                ) : (
                  filteredStudents.map((student) => {
                    const isCheckedIn = isStudentCheckedIn(student.id);
                    const isSelected = selectedStudents.includes(student.id);
                    
                    return (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isCheckedIn 
                            ? 'bg-green-50 border-green-200' 
                            : isSelected
                              ? 'bg-bjj-red/5 border-bjj-red/20'
                              : 'hover:bg-gray-50 border-gray-100'
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
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{student.belt}</Badge>
                          {isCheckedIn && (
                            <Badge className="bg-green-500 text-white">
                              Already Checked In
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckIn}
              disabled={!selectedClass || selectedStudents.length === 0 || isCheckingIn}
              className="bg-bjj-red hover:bg-bjj-red/90"
            >
              {isCheckingIn ? 'Checking in...' : `Check In ${selectedStudents.length} Student(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
