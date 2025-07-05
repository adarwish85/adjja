
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
import { SessionDebugPanel } from "@/components/admin/SessionDebugPanel";
import { useStudents } from "@/hooks/useStudents";
import { useClassEnrollments } from "@/hooks/useClassEnrollments";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminStudents = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDebugPanel, setShowDebugPanel] = useState(true); // Force show debug panel
  const { students, loading } = useStudents();
  const { enrollments } = useClassEnrollments();

  // Add comprehensive logging
  console.log('🔍 AdminStudents Debug Information:');
  console.log('📊 Students data:', students);
  console.log('📊 Students count:', students?.length || 0);
  console.log('📊 Loading state:', loading);
  console.log('📊 Enrollments:', enrollments);
  console.log('📊 Raw students array:', JSON.stringify(students, null, 2));

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

  console.log('🔍 Filtered students:', filteredStudents);
  console.log('🔍 Search term:', searchTerm);

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

        {/* Always show debug panel for investigation */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              🔍 Investigation Mode: Debug panel is shown to help find missing students.
              Current count: {students?.length || 0} students found.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebugPanel(!showDebugPanel)}
            >
              {showDebugPanel ? 'Hide' : 'Show'} Debug Panel
            </Button>
          </AlertDescription>
        </Alert>

        {showDebugPanel && <SessionDebugPanel />}
        
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
                <CardTitle>
                  Students ({filteredStudents.length}) 
                  {students && filteredStudents.length !== students.length && (
                    <span className="text-sm font-normal text-gray-500">
                      - Filtered from {students.length} total
                    </span>
                  )}
                </CardTitle>
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
                  {loading && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold mx-auto"></div>
                      <p className="mt-2 text-bjj-gray">Loading students...</p>
                    </div>
                  )}
                  {!loading && (!students || students.length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-bjj-gray">No students found in the database.</p>
                    </div>
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
