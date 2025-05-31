
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { AddStudentForm } from "@/components/admin/AddStudentForm";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  belt: string;
  stripes: number;
  coach: string;
  status: "active" | "inactive" | "on-hold";
  membershipType: "monthly" | "yearly" | "unlimited";
  attendanceRate: number;
  joinedDate: string;
  lastAttended: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alex Thompson",
    email: "alex@email.com",
    phone: "+1 (555) 123-4567",
    branch: "Downtown",
    belt: "Blue Belt",
    stripes: 2,
    coach: "Marcus Silva",
    status: "active",
    membershipType: "monthly",
    attendanceRate: 85,
    joinedDate: "2023-01-15",
    lastAttended: "2024-05-30",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria@email.com",
    phone: "+1 (555) 987-6543",
    branch: "Westside",
    belt: "White Belt",
    stripes: 3,
    coach: "Ana Rodriguez",
    status: "active",
    membershipType: "yearly",
    attendanceRate: 92,
    joinedDate: "2024-02-10",
    lastAttended: "2024-05-31",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james@email.com",
    phone: "+1 (555) 456-7890",
    branch: "North Valley",
    belt: "Purple Belt",
    stripes: 1,
    coach: "David Chen",
    status: "on-hold",
    membershipType: "monthly",
    attendanceRate: 45,
    joinedDate: "2022-08-20",
    lastAttended: "2024-04-15",
  },
];

const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.coach.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (newStudent: Omit<Student, "id">) => {
    const student: Student = {
      ...newStudent,
      id: Date.now().toString(),
    };
    setStudents([...students, student]);
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = (updatedStudent: Student) => {
    setStudents(students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(student => student.id !== studentId));
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

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Students</h1>
            <p className="text-bjj-gray">Manage academy students and memberships</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's information to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <AddStudentForm onSubmit={handleAddStudent} />
            </DialogContent>
          </Dialog>
        </div>

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
                {Math.round(students.reduce((sum, student) => sum + student.attendanceRate, 0) / students.length)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {new Set(students.map(s => s.branch)).size}
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
                    placeholder="Search students..."
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
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Branch & Coach</TableHead>
                  <TableHead>Belt & Stripes</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-bjj-navy">{student.name}</div>
                        <div className="text-sm text-bjj-gray">
                          Joined {new Date(student.joinedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-bjj-gray" />
                          {student.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-bjj-gray" />
                          {student.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">{student.branch}</Badge>
                        <div className="text-sm text-bjj-gray">Coach: {student.coach}</div>
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
                        {student.membershipType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{student.attendanceRate}%</div>
                        <div className="flex items-center text-xs text-bjj-gray">
                          <Calendar className="h-3 w-3 mr-1" />
                          Last: {new Date(student.lastAttended).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Student Dialog */}
        <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Update the student's information.
              </DialogDescription>
            </DialogHeader>
            {editingStudent && (
              <AddStudentForm 
                student={editingStudent} 
                onSubmit={handleEditStudent}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminStudents;
