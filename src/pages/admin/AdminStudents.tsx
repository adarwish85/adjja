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
          <div className="bg-bjj-gold/10 border border-bjj-gold rounded-lg px-4 py-2 mb-2 flex items-center justify-between">
            <span className="text-bjj-navy font-medium">
              {selectedStudentIds.length} student{selectedStudentIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button
                className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
                disabled={selectedStudentIds.length === 0}
                onClick={() => setIsBulkUpgradeOpen(true)}
              >
                Upgrade to Coach
              </Button>
              <Button variant="outline" onClick={() => setSelectedStudentIds([])}>Clear Selection</Button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {students.filter(s => s.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Avg Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.attendance_rate, 0) / students.length) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {enrollments.filter(e => e.status === "active").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Students</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students or classes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {isSuperAdmin && (
                      <input
                        type="checkbox"
                        checked={
                          filteredStudents.length > 0 &&
                          filteredStudents
                            .filter(s => s.status === "active" && s.coach !== "Coach")
                            .every(s => selectedStudentIds.includes(s.id))
                        }
                        onChange={(e) => handleSelectAllChange(e.target.checked)}
                        aria-label="Select all"
                        className="accent-bjj-gold scale-125"
                      />
                    )}
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Enrolled Classes</TableHead>
                  <TableHead>Belt & Stripes</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const enrolledClasses = getStudentEnrolledClasses(student.id);
                  const isCoach = student.coach === "Coach";

                  return (
                    <TableRow key={student.id} className={selectedStudentIds.includes(student.id) ? "bg-bjj-gold/10" : ""}>
                      <TableCell>
                        {isSuperAdmin && !isCoach && (
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(student.id)}
                            onChange={(e) => handleCheckboxChange(student.id, e.target.checked)}
                            aria-label={`Select ${student.name}`}
                            className="accent-bjj-gold scale-125"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-bjj-navy">{student.name}</div>
                          <div className="text-sm text-bjj-gray">
                            Joined {new Date(student.joined_date).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-bjj-gray" />
                            {student.email}
                          </div>
                          {student.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1 text-bjj-gray" />
                              {student.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {enrolledClasses.length > 0 ? (
                            enrolledClasses.map((className, index) => (
                              <Badge key={index} variant="outline" className="mr-1 mb-1">
                                {className}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No classes</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getBeltColor(student.belt)}>
                            {student.belt}
                          </Badge>
                          <div className="text-sm text-bjj-gray">
                            {student.stripes} stripe{student.stripes !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {student.membership_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{student.attendance_rate}%</div>
                          {student.last_attended && (
                            <div className="flex items-center text-xs text-bjj-gray">
                              <Calendar className="h-3 w-3 mr-1" />
                              Last: {new Date(student.last_attended).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* Student status dropdown */}
                        <StudentStatusDropdown
                          value={student.status}
                          onChange={async (nextStatus) => {
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
                        />
                      </TableCell>
                      <TableCell>
                        {/* DROPDOWN MENU FOR ACTIONS */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="p-1 h-8 w-8" aria-label="More Actions">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="z-50 bg-white border rounded shadow min-w-[210px]">
                            {/* Belt Promotion menu item */}
                            {!isCoach && (
                              <DropdownMenuItem
                                onClick={() => setBeltPromotionStudent(student)}
                                className="flex items-center gap-2"
                              >
                                <span className="block w-3 h-3 rounded-full bg-bjj-gold mr-2"></span>
                                Belt Promotion
                              </DropdownMenuItem>
                            )}
                            {/* New: Online Course Enrollment */}
                            <DropdownMenuItem
                              onClick={() => setCourseEnrollmentModal({ open: true, studentId: student.id })}
                              className="flex items-center gap-2"
                            >
                              <span className="block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                              Enroll to Online Course
                            </DropdownMenuItem>
                            {/* New: Academy Class Enrollment */}
                            <DropdownMenuItem
                              onClick={() => setClassEnrollmentModal({ open: true, studentId: student.id })}
                              className="flex items-center gap-2"
                            >
                              <span className="block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                              Enroll to Class
                            </DropdownMenuItem>
                            {/* Existing items */}
                            {isCoach && (
                              <DropdownMenuItem
                                onClick={() => {
                                  if (window.confirm(`Downgrade "${student.name}" to Student?`)) {
                                    handleDowngradeToStudent(student);
                                  }
                                }}
                                className="flex items-center gap-2"
                              >
                                <ArrowDown className="h-4 w-4 rotate-180" />
                                Downgrade to Student
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setEditingStudent(student)}
                              className="flex items-center gap-2"
                            >
                              <EditIcon className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete "${student.name}"? This cannot be undone.`
                                  )
                                ) {
                                  handleDeleteStudent(student.id);
                                }
                              }}
                              className="flex items-center gap-2 text-red-600"
                            >
                              <Trash2Icon className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
