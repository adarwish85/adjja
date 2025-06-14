
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourses } from "@/hooks/useCourses";
import { useManualEnrollment } from "@/hooks/useManualEnrollment";
import { BookOpen } from "lucide-react";

interface SingleStudentEnrollmentProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
}

export const SingleStudentEnrollment = ({
  isOpen,
  onClose,
  studentId,
  studentName,
}: SingleStudentEnrollmentProps) => {
  const { courses, isLoading: coursesLoading } = useCourses();
  const { bulkEnrollStudents, isEnrolling } = useManualEnrollment();
  
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [note, setNote] = useState("");

  const handleEnroll = async () => {
    if (!selectedCourse) return;

    await bulkEnrollStudents.mutateAsync({
      courseId: selectedCourse,
      studentIds: [studentId],
      startDate: startDate || undefined,
      note: note || undefined,
    });

    onClose();
    setSelectedCourse("");
    setStartDate("");
    setNote("");
  };

  const publishedCourses = courses.filter(course => course.status === "Published");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-bjj-gold" />
            <span>Enroll {studentName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="course-select">Select Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                {coursesLoading ? (
                  <SelectItem value="loading" disabled>Loading courses...</SelectItem>
                ) : publishedCourses.length === 0 ? (
                  <SelectItem value="none" disabled>No published courses available</SelectItem>
                ) : (
                  publishedCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} - {course.instructor}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="start-date">Start Date (Optional)</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this enrollment..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isEnrolling}>
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={!selectedCourse || isEnrolling}
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
            >
              {isEnrolling ? "Enrolling..." : "Enroll Student"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
