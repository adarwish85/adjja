
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Users, CheckCircle } from "lucide-react";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ManualCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Student {
  id: string;
  name: string;
  email: string;
  belt: string;
  attendance_rate: number;
}

interface Class {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
}

export const ManualCheckInModal = ({ open, onOpenChange }: ManualCheckInModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const { manualCheckIn, isCheckingIn } = useSmartAttendance();

  // Fetch students
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students-for-checkin', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('students')
        .select('id, name, email, belt, attendance_rate')
        .eq('status', 'active');

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;
      return data as Student[];
    }
  });

  // Fetch classes
  const { data: classes = [] } = useQuery({
    queryKey: ['classes-for-checkin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, instructor, schedule')
        .eq('status', 'Active');

      if (error) throw error;
      return data as Class[];
    }
  });

  const handleStudentToggle = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedClass || selectedStudents.length === 0) {
      toast.error("Please select a class and at least one student");
      return;
    }

    try {
      await manualCheckIn({
        studentIds: selectedStudents,
        classId: selectedClass
      });

      // Reset form and close modal
      setSelectedStudents([]);
      setSelectedClass("");
      setSearchTerm("");
      onOpenChange(false);
    } catch (error) {
      console.error('Manual check-in error:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-bjj-red" />
            Manual Check-In
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Class Selection */}
          <div>
            <Label htmlFor="class-select">Select Class</Label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bjj-red"
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.instructor} ({cls.schedule})
                </option>
              ))}
            </select>
          </div>

          {/* Student Search */}
          <div>
            <Label htmlFor="student-search">Search Students</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="student-search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all">
                Select All ({filteredStudents.length} students)
              </Label>
            </div>
            <Badge variant="secondary">
              {selectedStudents.length} selected
            </Badge>
          </div>

          {/* Students List */}
          <div className="border rounded-lg max-h-60 overflow-y-auto">
            {studentsLoading ? (
              <div className="p-4 text-center text-gray-500">Loading students...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No students found</div>
            ) : (
              <div className="divide-y">
                {filteredStudents.map(student => (
                  <div key={student.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => handleStudentToggle(student.id, !!checked)}
                      />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{student.belt}</Badge>
                      <span className="text-sm text-gray-500">
                        {student.attendance_rate}% attendance
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
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
              {isCheckingIn ? (
                <>Checking In...</>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Check In {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
