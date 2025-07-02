
import { useState } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentsTable } from "@/components/admin/student/StudentsTable";
import { AddStudentForm } from "@/components/admin/AddStudentForm";
import { StudentStatsCards } from "@/components/admin/student/StudentStatsCards";
import { StudentsSearchBar } from "@/components/admin/student/StudentsSearchBar";
import { PaymentAlertsCard } from "@/components/admin/student/PaymentAlertsCard";
import { StudentPaymentSection } from "@/components/admin/student/StudentPaymentSection";
import { useStudents } from "@/hooks/useStudents";
import { useClassEnrollments } from "@/hooks/useClassEnrollments";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminStudents = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { students } = useStudents();
  const { enrollments } = useClassEnrollments();

  if (selectedStudent) {
    return (
      <SuperAdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedStudent(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Button>
            <h1 className="text-3xl font-bold text-bjj-navy">
              {selectedStudent.name} - Payment Management
            </h1>
          </div>
          
          <StudentPaymentSection student={selectedStudent} />
        </div>
      </SuperAdminLayout>
    );
  }

  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bjj-navy">Student Management</h1>
          <p className="text-bjj-gray">Manage student accounts, enrollment, and progress</p>
        </div>
        
        <StudentStatsCards students={students || []} enrollments={enrollments || []} />
        <PaymentAlertsCard />

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">All Students</TabsTrigger>
            <TabsTrigger value="add">Add Student</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <StudentsSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                  {students && (
                    <StudentsTable 
                      students={students}
                      filteredStudents={filteredStudents}
                      selectedStudentIds={[]}
                      onCheckboxChange={() => {}}
                      handleSelectAllChange={() => {}}
                      isSuperAdmin={true}
                      getStudentEnrolledClasses={() => []}
                      onStatusChange={async () => {}}
                      onEditStudent={() => {}}
                      onDeleteStudent={() => {}}
                      onBeltPromotion={() => {}}
                      onCourseEnroll={() => {}}
                      onClassEnroll={() => {}}
                      onDowngradeToStudent={() => {}}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Student</CardTitle>
              </CardHeader>
              <CardContent>
                <AddStudentForm onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminStudents;
