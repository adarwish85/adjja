
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/hooks/useCourses";
import { useCourseEnrollment } from "@/hooks/useCourseEnrollment";
import { toast } from "@/hooks/use-toast";

interface CourseEnrollmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  onEnrolled?: () => void;
}

export const CourseEnrollmentModal: React.FC<CourseEnrollmentModalProps> = ({
  open,
  onOpenChange,
  studentId,
  onEnrolled,
}) => {
  const { courses, isLoading } = useCourses();
  const { enrollInCourse } = useCourseEnrollment();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEnroll = async () => {
    if (!selectedCourseId) return;
    setSubmitting(true);
    enrollInCourse.mutate(
      { courseId: selectedCourseId, studentId },
      {
        onSuccess: () => {
          toast({
            title: "Enrolled",
            description: "Student enrolled in the course.",
          });
          onOpenChange(false);
          if (onEnrolled) onEnrolled();
        },
        onError: (err: any) => {
          toast({
            title: "Enrollment failed",
            description: err?.message || "Could not enroll student.",
            variant: "destructive",
          });
        },
        onSettled: () => setSubmitting(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={v => {
      onOpenChange(v);
      setSelectedCourseId(null);
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll in Course</DialogTitle>
          <DialogDescription>
            Select a course to enroll this student.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-4 text-center text-bjj-gray">Loading...</div>
        ) : (
          <div className="space-y-4">
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedCourseId ?? ""}
              onChange={e => setSelectedCourseId(e.target.value || null)}
            >
              <option value="">-- Select Course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>
            {selectedCourseId && (
              <div className="text-sm text-bjj-gray bg-bjj-navy/5 p-2 rounded">
                <strong>Course summary:</strong>
                <div>
                  {courses.find(c => c.id === selectedCourseId)?.description || "No description"}
                </div>
              </div>
            )}
            <Button 
              type="button" 
              className="bg-bjj-gold text-bjj-navy w-full" 
              onClick={handleEnroll} 
              disabled={!selectedCourseId || submitting}
            >
              {submitting ? "Enrolling..." : "Enroll Student"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
