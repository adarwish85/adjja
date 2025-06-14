
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, AlertCircle } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ManualCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualCheckInModal = ({ open, onOpenChange }: ManualCheckInModalProps) => {
  const { students } = useStudents();
  const { classes } = useClasses();
  const { manualCheckIn, isCheckingIn } = useSmartAttendance();
  
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClasses = classes.filter(c => c.status === 'Active');

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleCheckIn = () => {
    if (selectedClass && selectedStudents.length > 0) {
      manualCheckIn({
        classId: selectedClass,
        studentIds: selectedStudents
      });
      onOpenChange(false);
      setSelectedStudents([]);
      setSelectedClass("");
      setSearchTerm("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-bjj-red" />
            Manual Check-In
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Class Selection */}
          <div className="space-y-2">
            <Label>Select Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class for check-in" />
              </SelectTrigger>
              <SelectContent>
                {activeClasses.map(classItem => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{classItem.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {classItem.instructor} • {classItem.enrolled}/{classItem.capacity}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Search */}
          <div className="space-y-2">
            <Label>Search Students</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
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
              <Label htmlFor="select-all" className="text-sm">
                Select all ({filteredStudents.length})
              </Label>
            </div>
            <Badge variant="outline">
              {selectedStudents.length} selected
            </Badge>
          </div>

          {/* Students List */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No students found</p>
              </div>
            ) : (
              filteredStudents.map(student => (
                <Card
                  key={student.id}
                  className={`cursor-pointer transition-all ${
                    selectedStudents.includes(student.id)
                      ? 'ring-2 ring-bjj-red border-bjj-red bg-bjj-red/5'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleStudentToggle(student.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        readOnly
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{student.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={student.status === 'active' ? 'default' : 'secondary'}
                              className={student.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {student.belt}
                            </Badge>
                            {student.payment_status === 'overdue' && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Branch: {student.branch}
                          </span>
                          {student.membership_type !== 'unlimited' && (
                            <span className="text-xs text-gray-500">
                              • Attendance: {student.attendance_rate}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-bjj-red hover:bg-bjj-red/90"
              onClick={handleCheckIn}
              disabled={!selectedClass || selectedStudents.length === 0 || isCheckingIn}
              loading={isCheckingIn}
            >
              Check In {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
