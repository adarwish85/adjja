
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, TrendingUp, Award, Clock, UserPlus } from "lucide-react";
import { useCourseEnrollments } from "@/hooks/useCourseEnrollments";
import { useStudents } from "@/hooks/useStudents";
import { Progress } from "@/components/ui/progress";
import { SingleStudentEnrollment } from "./SingleStudentEnrollment";

export const StudentProgress = () => {
  const { enrollments, isLoading } = useCourseEnrollments();
  const { students } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null);

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.students?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.courses?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Active": return "bg-blue-100 text-blue-800";
      case "Dropped": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const averageProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) / enrollments.length)
    : 0;

  const completedCourses = enrollments.filter(e => e.status === "Completed").length;
  const activeCourses = enrollments.filter(e => e.status === "Active").length;

  const handleEnrollStudent = (studentId: string, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName });
    setEnrollmentModalOpen(true);
  };

  // Get unique students for quick enrollment
  const uniqueStudents = students.filter(student => 
    student.status === 'active' && 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Show top 5 for quick access

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              Average Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{averageProgress}%</div>
            <div className="mt-2">
              <Progress value={averageProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              Completed Courses
            </CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{completedCourses}</div>
            <p className="text-xs text-bjj-gray">Total completions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray">
              Active Enrollments
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{activeCourses}</div>
            <p className="text-xs text-bjj-gray">Currently learning</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Enrollment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Quick Student Enrollment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {uniqueStudents.map((student) => (
              <Button
                key={student.id}
                variant="outline"
                size="sm"
                onClick={() => handleEnrollStudent(student.id, student.name)}
                className="border-bjj-gold text-bjj-gold hover:bg-bjj-gold hover:text-white"
              >
                Enroll {student.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Student Progress Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-bjj-gray" />
              <Input
                placeholder="Search students or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Loading progress data...
                      </TableCell>
                    </TableRow>
                  ) : filteredEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No enrollment data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-bjj-navy">
                              {enrollment.students?.name}
                            </div>
                            <div className="text-sm text-bjj-gray">
                              {enrollment.students?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-bjj-navy">
                              {enrollment.courses?.title}
                            </div>
                            <div className="text-sm text-bjj-gray">
                              by {enrollment.courses?.instructor}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-bjj-gray">
                          {new Date(enrollment.enrollment_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-bjj-gray">
                                {enrollment.progress_percentage || 0}%
                              </span>
                            </div>
                            <Progress 
                              value={enrollment.progress_percentage || 0} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(enrollment.status || "Active")}>
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-bjj-gray">
                          {enrollment.completion_date 
                            ? new Date(enrollment.completion_date).toLocaleDateString()
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEnrollStudent(enrollment.student_id, enrollment.students?.name || "Student")}
                            title="Enroll in Another Course"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedStudent && (
        <SingleStudentEnrollment
          isOpen={enrollmentModalOpen}
          onClose={() => {
            setEnrollmentModalOpen(false);
            setSelectedStudent(null);
          }}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
        />
      )}
    </div>
  );
};
