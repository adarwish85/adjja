
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClasses } from "@/hooks/useClasses";
import { useClassEnrollments } from "@/hooks/useClassEnrollments";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface StudentClassEnrollmentManagerProps {
  studentId: string;
  studentName: string;
}

export const StudentClassEnrollmentManager = ({ studentId, studentName }: StudentClassEnrollmentManagerProps) => {
  const { classes } = useClasses();
  const { enrollments, enrollStudent, unenrollStudent } = useClassEnrollments();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  
  // Filter classes to show only active ones
  const activeClasses = classes.filter(cls => cls.status === "Active");
  
  // Get student's current enrollments
  const studentEnrollments = enrollments.filter(
    enrollment => enrollment.student_id === studentId && enrollment.status === "active"
  );

  // Get classes that student is not enrolled in
  const enrolledClassIds = studentEnrollments.map(enrollment => enrollment.class_id);
  const availableClasses = activeClasses.filter(
    cls => !enrolledClassIds.includes(cls.id)
  );

  const handleEnroll = async () => {
    if (!selectedClassId) {
      toast.error("Please select a class to enroll in");
      return;
    }

    try {
      await enrollStudent.mutateAsync({
        studentId,
        classId: selectedClassId
      });
      setSelectedClassId("");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleUnenroll = async (classId: string) => {
    try {
      await unenrollStudent.mutateAsync({
        studentId,
        classId
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Class Enrollments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Enrollments */}
        <div>
          <h4 className="font-medium mb-2">Current Classes</h4>
          {studentEnrollments.length > 0 ? (
            <div className="space-y-2">
              {studentEnrollments.map((enrollment) => {
                const classInfo = classes.find(cls => cls.id === enrollment.class_id);
                if (!classInfo) return null;
                
                return (
                  <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{classInfo.name}</div>
                      <div className="text-sm text-gray-600">
                        {classInfo.instructor} • {classInfo.schedule}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnenroll(enrollment.class_id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={unenrollStudent.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No current class enrollments</p>
          )}
        </div>

        {/* Add New Enrollment */}
        {availableClasses.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Enroll in New Class</h4>
            <div className="flex gap-2">
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.instructor} ({cls.schedule})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleEnroll}
                disabled={!selectedClassId || enrollStudent.isPending}
                className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Enroll
              </Button>
            </div>
          </div>
        )}

        {availableClasses.length === 0 && studentEnrollments.length > 0 && (
          <p className="text-gray-500 text-sm">Student is enrolled in all available classes</p>
        )}
      </CardContent>
    </Card>
  );
};
