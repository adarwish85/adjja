
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClasses } from "@/hooks/useClasses";
import { useClassEnrollments } from "@/hooks/useClassEnrollments";
import { toast } from "@/hooks/use-toast";

interface ClassEnrollmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  onEnrolled?: () => void;
}

export const ClassEnrollmentModal: React.FC<ClassEnrollmentModalProps> = ({
  open,
  onOpenChange,
  studentId,
  onEnrolled,
}) => {
  const { classes, loading } = useClasses();
  const { enrollStudent, enrollments } = useClassEnrollments();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const studentEnrollments = enrollments.filter(
    (enr) => enr.student_id === studentId && enr.status === "active"
  );
  const enrolledClassIds = studentEnrollments.map((e) => e.class_id);

  const handleEnroll = async () => {
    if (!selectedClassId) return;
    setSubmitting(true);
    enrollStudent.mutate(
      { studentId, classId: selectedClassId },
      {
        onSuccess: () => {
          toast({
            title: "Class Enrollment Success",
            description: "Student enrolled in class.",
          });
          onOpenChange(false);
          if (onEnrolled) onEnrolled();
        },
        onError: (err: any) => {
          toast({
            title: "Class Enrollment failed",
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
      setSelectedClassId(null);
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll in Class</DialogTitle>
          <DialogDescription>
            Select a class to enroll this student.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-4 text-center text-bjj-gray">Loading...</div>
        ) : (
          <div className="space-y-4">
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedClassId ?? ""}
              onChange={e => setSelectedClassId(e.target.value || null)}
            >
              <option value="">-- Select Class --</option>
              {classes
                .filter(cls => !enrolledClassIds.includes(cls.id))
                .map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.level}) — {cls.schedule}
                  </option>
                ))}
            </select>
            {selectedClassId && (
              <div className="text-sm text-bjj-gray bg-bjj-navy/5 p-2 rounded">
                <strong>Class details:</strong>
                <div>
                  {classes.find(cls => cls.id === selectedClassId)?.description || "No description"}
                </div>
              </div>
            )}
            <Button
              type="button"
              className="bg-bjj-gold text-bjj-navy w-full"
              onClick={handleEnroll}
              disabled={!selectedClassId || submitting}
            >
              {submitting ? "Enrolling..." : "Enroll Student"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
