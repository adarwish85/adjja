
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  ArrowDown,
  GraduationCap,
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { StudentStatusDropdown } from "@/components/admin/student/StudentStatusDropdown";
import { Student } from "@/hooks/useStudents";
import { useStudentCoachDetection } from "@/hooks/useStudentCoachDetection";

interface StudentsTableProps {
  students: Student[];
  filteredStudents: Student[];
  selectedStudentIds: string[];
  onCheckboxChange: (studentId: string, checked: boolean) => void;
  handleSelectAllChange: (checked: boolean) => void;
  isSuperAdmin: boolean;
  getStudentEnrolledClasses: (studentId: string) => string[];
  onStatusChange: (student: Student, nextStatus: string) => Promise<void>;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onBeltPromotion: (student: Student) => void;
  onCourseEnroll: (student: Student) => void;
  onClassEnroll: (student: Student) => void;
  onDowngradeToStudent: (student: Student) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  filteredStudents,
  selectedStudentIds,
  onCheckboxChange,
  handleSelectAllChange,
  isSuperAdmin,
  getStudentEnrolledClasses,
  onStatusChange,
  onEditStudent,
  onDeleteStudent,
  onBeltPromotion,
  onCourseEnroll,
  onClassEnroll,
  onDowngradeToStudent,
}) => {
  // Enhanced logging for StudentsTable component
  console.log('🏪 StudentsTable: Component rendered with props:');
  console.log('🏪 students prop:', students);
  console.log('🏪 filteredStudents prop:', filteredStudents);
  console.log('🏪 students count:', students?.length || 0);
  console.log('🏪 filteredStudents count:', filteredStudents?.length || 0);

  // Deep inspection of each student array
  if (students && students.length > 0) {
    console.log('🏪 StudentsTable: ALL STUDENTS prop analysis:');
    students.forEach((student, index) => {
      console.log(`📋 StudentsTable ALL Student ${index + 1}:`, {
        id: student.id,
        name: student.name,
        email: student.email,
        status: student.status
      });
    });
  }

  if (filteredStudents && filteredStudents.length > 0) {
    console.log('🏪 StudentsTable: FILTERED STUDENTS prop analysis:');
    filteredStudents.forEach((student, index) => {
      console.log(`🔍 StudentsTable FILTERED Student ${index + 1}:`, {
        id: student.id,
        name: student.name,
        email: student.email,
        status: student.status
      });
    });
  } else {
    console.log('⚠️ StudentsTable: No filtered students to render');
  }

  // Use the new coach detection hook
  const { isStudentCoach } = useStudentCoachDetection(students);

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

  return (
    <TooltipProvider>
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
                      .filter((s) => s.status === "active" && !isStudentCoach(s.id))
                      .every((s) => selectedStudentIds.includes(s.id))
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
          {filteredStudents.map((student, index) => {
            console.log(`🔄 StudentsTable: RENDERING student row ${index + 1}:`, student.name, 'ID:', student.id);
            
            const enrolledClasses = getStudentEnrolledClasses(student.id);
            const isCoach = isStudentCoach(student.id);
            
            return (
              <TableRow 
                key={student.id} 
                className={`
                  ${selectedStudentIds.includes(student.id) ? "bg-bjj-gold/10" : ""} 
                  ${isCoach ? "bg-green-50 border-l-4 border-l-green-500" : ""}
                `}
              >
                <TableCell>
                  {isSuperAdmin && !isCoach && (
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={(e) => onCheckboxChange(student.id, e.target.checked)}
                      aria-label={`Select ${student.name}`}
                      className="accent-bjj-gold scale-125"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-bjj-navy">{student.name}</span>
                      {isCoach && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold">
                              <GraduationCap className="h-3 w-3 mr-1" />
                              COACH
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This student is also a coach</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
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
                      {student.stripes} stripe{student.stripes !== 1 ? "s" : ""}
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
                  <StudentStatusDropdown
                    value={student.status as "active" | "inactive" | "on-hold"}
                    onChange={(next) => onStatusChange(student, next)}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-1 h-8 w-8" aria-label="More Actions">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-50 bg-white border rounded shadow min-w-[210px]">
                      {!isCoach && (
                        <DropdownMenuItem
                          onClick={() => onBeltPromotion(student)}
                          className="flex items-center gap-2"
                        >
                          <span className="block w-3 h-3 rounded-full bg-bjj-gold mr-2"></span>
                          Belt Promotion
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onCourseEnroll(student)}
                        className="flex items-center gap-2"
                      >
                        <span className="block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        Enroll to Online Course
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onClassEnroll(student)}
                        className="flex items-center gap-2"
                      >
                        <span className="block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                        Enroll to Class
                      </DropdownMenuItem>
                      {isCoach && (
                        <DropdownMenuItem
                          onClick={() => onDowngradeToStudent(student)}
                          className="flex items-center gap-2"
                        >
                          <ArrowDown className="h-4 w-4 rotate-180" />
                          Downgrade to Student
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onEditStudent(student)}
                        className="flex items-center gap-2"
                      >
                        <EditIcon className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteStudent(student)}
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
          {filteredStudents.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                🔍 INVESTIGATION: No students found to display
                <br />
                <small>Original students: {students?.length || 0} | Filtered: {filteredStudents.length}</small>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};
