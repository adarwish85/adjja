import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { MultiStepStudentForm } from "@/components/admin/student/MultiStepStudentForm";
import { useStudents, Student } from "@/hooks/useStudents";
import { useClassEnrollments } from "@/hooks/useClassEnrollments";
import { useClasses } from "@/hooks/useClasses";
import { BulkUpgradeToCoachDialog } from "@/components/admin/student/BulkUpgradeToCoachDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit as EditIcon, Trash2 as Trash2Icon, ArrowDown } from "lucide-react";
import { useToast, toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BeltPromotionModal } from "@/components/admin/student/BeltPromotionModal";
import { CourseEnrollmentModal } from "@/components/admin/student/CourseEnrollmentModal";
import { ClassEnrollmentModal } from "@/components/admin/student/ClassEnrollmentModal";
import { StudentStatusDropdown } from "@/components/admin/student/StudentStatusDropdown";
import { StudentStatsCards } from "@/components/admin/student/StudentStatsCards";
import { StudentsSearchBar } from "@/components/admin/student/StudentsSearchBar";
import { StudentsActionBar } from "@/components/admin/student/StudentsActionBar";
import { StudentsTable } from "@/components/admin/student/StudentsTable";

// Add this Belt type and array above the component or near BeltPromotionModal usage.
type Belt =
  | "White Belt"
  | "Blue Belt"
  | "Purple Belt"
  | "Brown Belt"
  | "Black Belt";

const BELT_ORDER: Belt[] = [
  "White Belt",
  "Blue Belt",
  "Purple Belt",
  "Brown Belt",
  "Black Belt",
];

const AdminStudents = () => {
  const { students, loading, addStudent, updateStudent, deleteStudent, refetch } = useStudents();
  const { enrollments, enrollStudent, unenrollStudent } = useClassEnrollments();
  const { classes } = useClasses();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isBulkUpgradeOpen, setIsBulkUpgradeOpen] = useState(false);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getStudentEnrolledClasses(student.id).some(className => 
        className.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStudentEnrolledClasses = (studentId: string) => {
    const studentEnrollments = enrollments.filter(
      enrollment => enrollment.student_id === studentId && enrollment.status === "active"
    );
    
    return studentEnrollments.map(enrollment => {
      const classInfo = classes.find(cls => cls.id === enrollment.class_id);
      return classInfo ? classInfo.name : "Unknown Class";
    });
  };

  const handleAddStudent = async (newStudent: Omit<Student, "id" | "created_at" | "updated_at">, classIds?: string[]) => {
    try {
      await addStudent(newStudent, classIds);
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleEditStudent = async (updatedStudent: Omit<Student, "id" | "created_at" | "updated_at">, classIds?: string[]) => {
    if (!editingStudent) return;
    
    try {
      console.log("AdminStudents: Preparing update for student:", editingStudent.id);
      console.log("AdminStudents: Update data:", updatedStudent);
      console.log("AdminStudents: Class IDs:", classIds);
      
      // Remove read-only fields and ensure proper data types
      const updateData = {
        ...updatedStudent,
        phone: updatedStudent.phone || null,
        last_attended: updatedStudent.last_attended || null,
      };
      
      // Remove any undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });
      
      console.log("AdminStudents: Clean update data:", updateData);
      
      // Update the student data
      await updateStudent(editingStudent.id, updateData);
      
      // Handle class enrollment changes if provided
      if (classIds !== undefined) {
        console.log("AdminStudents: Handling class enrollment updates");
        
        // Get current enrollments
        const currentEnrollments = enrollments.filter(
          enrollment => enrollment.student_id === editingStudent.id && enrollment.status === "active"
        );
        const currentClassIds = currentEnrollments.map(e => e.class_id);
        
        // Find classes to enroll and unenroll
        const classesToEnroll = classIds.filter(id => !currentClassIds.includes(id));
        const classesToUnenroll = currentClassIds.filter(id => !classIds.includes(id));
        
        console.log("AdminStudents: Classes to enroll:", classesToEnroll);
        console.log("AdminStudents: Classes to unenroll:", classesToUnenroll);
        
        // Enroll in new classes
        for (const classId of classesToEnroll) {
          try {
            await enrollStudent.mutateAsync({
              studentId: editingStudent.id,
              classId: classId
            });
          } catch (error) {
            console.error("AdminStudents: Error enrolling in class:", classId, error);
          }
        }
        
        // Unenroll from removed classes
        for (const classId of classesToUnenroll) {
          try {
            await unenrollStudent.mutateAsync({
              studentId: editingStudent.id,
              classId: classId
            });
          } catch (error) {
            console.error("AdminStudents: Error unenrolling from class:", classId, error);
          }
        }
      }
      
      setEditingStudent(null);
    } catch (error) {
      console.error("AdminStudents: Update error:", error);
      // Error is already handled in the hook
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteStudent(studentId);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const getBeltColor = (belt: string) => {
    switch (belt.toLowerCase()) {
      case "black belt":
        return "bg-black text-white";
      case "brown belt":
        return "bg-yellow-800 text-white";
      case "purple belt":
        return "bg-purple-600 text-white";
      case "blue belt":
        return "bg-blue-600 text-white";
      case "white belt":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isSuperAdmin = true; // TODO: Use your role logic here - only show if user is Super Admin

  const eligibleStudents = students.filter(s => s.status === "active" && s.belt && s.membership_type && s.email && s.coach !== "Coach");
  const selectedStudentNames = students
    .filter(student => selectedStudentIds.includes(student.id))
    .map(student => student.name);

  const handleCheckboxChange = (studentId: string, checked: boolean) => {
    setSelectedStudentIds(prev => checked
      ? [...prev, studentId]
      : prev.filter(id => id !== studentId)
    );
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      const selectable = filteredStudents
        .filter(student => student.status === "active" && student.coach !== "Coach")
        .map(student => student.id);
      setSelectedStudentIds(selectable);
    } else {
      setSelectedStudentIds([]);
    }
  };

  // Add a handler for single-student upgrade dialog
  const [singleUpgradeDialogStudent, setSingleUpgradeDialogStudent] = useState<Student | null>(null);

  // New handler for downgrading coach to student
  const handleDowngradeToStudent = async (student: Student) => {
    try {
      const { error } = await supabase.rpc("downgrade_coach_to_student", {
        p_user_id: student.id,
      });
      if (error) throw error;
      toast({
        title: `"${student.name}" downgraded to Student`,
        description: "The user now has student privileges.",
      });
      // Refetch students to update status
      if (typeof refetch === "function") refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to downgrade ${student.name}`,
        description: (error as Error).message || "Unknown error",
      });
    }
  };

  // State for belt promotion modal
  const [beltPromotionStudent, setBeltPromotionStudent] = useState<Student | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

  // --- Handler to promote student ---
  const handlePromoteBelt = async (student: Student, newBelt: string, newStripes: number, note?: string) => {
    setIsPromoting(true);
    try {
      // Only allow promotion upwards
      await updateStudent(student.id, { belt: newBelt, stripes: newStripes });
      toast({
        title: `Student promoted!`,
        description: `${student.name} is now a ${newBelt} (${newStripes} stripe${newStripes !== 1 ? "s" : ""}).`
      });
      setBeltPromotionStudent(null);
      if (typeof refetch === "function") refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Promotion failed",
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsPromoting(false);
    }
  };

  // Add modal state hooks for dialogs just below beltPromotionStudent
  const [courseEnrollmentModal, setCourseEnrollmentModal] = useState<{ open: boolean; studentId: string | null }>({ open: false, studentId: null });
  const [classEnrollmentModal, setClassEnrollmentModal] = useState<{ open: boolean; studentId: string | null }>({ open: false, studentId: null });

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="p-6 space-y-6">
          <div className="text-center">Loading students...</div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Students</h1>
            <p className="text-bjj-gray">Manage academy students and class enrollments</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's information using the multi-step wizard.
                </DialogDescription>
              </DialogHeader>
              <MultiStepStudentForm onSubmit={handleAddStudent} />
            </DialogContent>
          </Dialog>
        </div>

        {/* ACTION BAR */}
        {isSuperAdmin && selectedStudentIds.length > 0 && (
          <StudentsActionBar
            selectedStudentCount={selectedStudentIds.length}
            onUpgradeClick={() => setIsBulkUpgradeOpen(true)}
            onClearSelection={() => setSelectedStudentIds([])}
          />
        )}

        {/* Stats Cards */}
        <StudentStatsCards students={students} enrollments={enrollments} />

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Students</CardTitle>
              <StudentsSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </CardHeader>
          <CardContent>
            <StudentsTable
              students={students}
              filteredStudents={filteredStudents}
              selectedStudentIds={selectedStudentIds}
              onCheckboxChange={handleCheckboxChange}
              handleSelectAllChange={handleSelectAllChange}
              isSuperAdmin={isSuperAdmin}
              getStudentEnrolledClasses={getStudentEnrolledClasses}
              onStatusChange={async (student, nextStatus) => {
                // Ensure nextStatus is of proper type
                if (student.status === nextStatus) return;
                try {
                  await updateStudent(student.id, { status: nextStatus });
                  toast({
                    title: `Student status updated`,
                    description: `${student.name} is now "${nextStatus.replace('-', ' ')}".`
                  });
                  if (typeof refetch === "function") refetch();
                } catch (e) {
                  toast({
                    variant: "destructive",
                    title: "Failed to update status",
                    description: e instanceof Error ? e.message : "Unknown error"
                  });
                }
              }}
              onEditStudent={setEditingStudent}
              onDeleteStudent={(student) => {
                if (
                  window.confirm(
                    `Are you sure you want to delete "${student.name}"? This cannot be undone.`
                  )
                ) {
                  handleDeleteStudent(student.id);
                }
              }}
              onBeltPromotion={setBeltPromotionStudent}
              onCourseEnroll={student => setCourseEnrollmentModal({ open: true, studentId: student.id })}
              onClassEnroll={student => setClassEnrollmentModal({ open: true, studentId: student.id })}
              onDowngradeToStudent={student => {
                if (window.confirm(`Downgrade "${student.name}" to Student?`)) {
                  handleDowngradeToStudent(student);
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Edit Student Dialog */}
        <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Update the student's information using the multi-step wizard.
              </DialogDescription>
            </DialogHeader>
            {editingStudent && (
              <MultiStepStudentForm 
                student={editingStudent} 
                onSubmit={handleEditStudent}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
        {/* Bulk Upgrade Dialog */}
        <BulkUpgradeToCoachDialog 
          open={isBulkUpgradeOpen} 
          onOpenChange={(v) => {
            setIsBulkUpgradeOpen(v);
            if (!v) setSelectedStudentIds([]);
          }}
          studentIds={selectedStudentIds}
          studentNames={selectedStudentNames}
          onSuccess={() => {
            setIsBulkUpgradeOpen(false);
            setSelectedStudentIds([]);
            // Optionally, refetch students data
          }}
        />

        {/* Single student upgrade dialog */}
        <BulkUpgradeToCoachDialog
          open={!!singleUpgradeDialogStudent}
          onOpenChange={(open) => setSingleUpgradeDialogStudent(open ? singleUpgradeDialogStudent : null)}
          studentIds={singleUpgradeDialogStudent ? [singleUpgradeDialogStudent.id] : []}
          studentNames={singleUpgradeDialogStudent ? [singleUpgradeDialogStudent.name] : []}
          onSuccess={() => {
            setSingleUpgradeDialogStudent(null);
            if (typeof refetch === "function") refetch();
          }}
        />

      {/* Render the modal outside the Table for selected student */}
      <BeltPromotionModal
        open={!!beltPromotionStudent}
        onOpenChange={open => {
          if (!open) setBeltPromotionStudent(null);
        }}
        currentBelt={
          BELT_ORDER.includes(
            (beltPromotionStudent?.belt ?? "") as Belt
          )
            ? (beltPromotionStudent?.belt as Belt)
            : "White Belt"
        }
        currentStripes={beltPromotionStudent?.stripes || 0}
        onPromote={(belt, stripes, note) => {
          if (beltPromotionStudent) {
            handlePromoteBelt(beltPromotionStudent, belt, stripes, note);
          }
        }}
        loading={isPromoting}
      />

      {/* Course Enrollment Modal (single student) */}
      <CourseEnrollmentModal
        open={courseEnrollmentModal.open}
        studentId={courseEnrollmentModal.studentId || ""}
        onOpenChange={open => setCourseEnrollmentModal(v => ({ ...v, open }))}
        onEnrolled={() => {
          setCourseEnrollmentModal({ open: false, studentId: null });
          if (typeof refetch === "function") refetch();
        }}
      />
      {/* Class Enrollment Modal (single student) */}
      <ClassEnrollmentModal
        open={classEnrollmentModal.open}
        studentId={classEnrollmentModal.studentId || ""}
        onOpenChange={open => setClassEnrollmentModal(v => ({ ...v, open }))}
        onEnrolled={() => {
          setClassEnrollmentModal({ open: false, studentId: null });
          if (typeof refetch === "function") refetch();
        }}
      />
      </div>
    </SuperAdminLayout>
  );
};

export default AdminStudents;
