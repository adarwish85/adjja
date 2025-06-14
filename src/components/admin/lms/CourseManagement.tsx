
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Eye, Users } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { CreateCourseWizard } from "./CreateCourseWizard";
import { EnrollStudentsModal } from "./EnrollStudentsModal";

export const CourseManagement = () => {
  const { courses, isLoading, deleteCourse } = useCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<{id: string, title: string} | null>(null);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourse.mutate(id);
    }
  };

  const handleEdit = (course: any) => {
    setSelectedCourse(course);
    setIsEditMode(true);
    setIsWizardOpen(true);
  };

  const handleViewCourse = (courseId: string) => {
    const courseUrl = `${window.location.origin}/course/${courseId}`;
    window.open(courseUrl, '_blank');
  };

  const handleCourseNameClick = (courseId: string) => {
    const courseUrl = `${window.location.origin}/course/${courseId}`;
    window.open(courseUrl, '_blank');
  };

  const handleEnrollStudents = (course: any) => {
    setSelectedCourseForEnrollment({ id: course.id, title: course.title });
    setEnrollModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      case "Archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy">Course Management</CardTitle>
            <Button 
              onClick={() => {
                setSelectedCourse(null);
                setIsEditMode(false);
                setIsWizardOpen(true);
              }}
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-bjj-gray" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        Loading courses...
                      </TableCell>
                    </TableRow>
                  ) : filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No courses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div 
                              className="font-semibold text-bjj-navy cursor-pointer hover:text-bjj-gold transition-colors"
                              onClick={() => handleCourseNameClick(course.id)}
                            >
                              {course.title}
                            </div>
                            <div className="text-sm text-bjj-gray truncate max-w-xs">
                              {course.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-bjj-gray">{course.instructor}</TableCell>
                        <TableCell className="text-bjj-gray">{course.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-bjj-navy">
                            {course.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-bjj-navy font-semibold">
                          ${course.price}
                        </TableCell>
                        <TableCell className="text-bjj-gray">
                          {course.total_students || 0}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(course.status || "Draft")}>
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEnrollStudents(course)}
                              title="Enroll Students"
                              className="text-bjj-gold hover:text-bjj-gold-dark"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCourse(course.id)}
                              title="View Course"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(course)}
                              title="Edit Course"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(course.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete Course"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-full h-[90vh] overflow-auto">
          <CreateCourseWizard 
            onClose={() => {
              setIsWizardOpen(false);
              setSelectedCourse(null);
              setIsEditMode(false);
            }}
            course={selectedCourse}
            isEditMode={isEditMode}
          />
        </DialogContent>
      </Dialog>

      {selectedCourseForEnrollment && (
        <EnrollStudentsModal
          isOpen={enrollModalOpen}
          onClose={() => {
            setEnrollModalOpen(false);
            setSelectedCourseForEnrollment(null);
          }}
          courseId={selectedCourseForEnrollment.id}
          courseTitle={selectedCourseForEnrollment.title}
        />
      )}
    </div>
  );
};
