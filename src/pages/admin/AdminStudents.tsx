
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

  // Enhanced logging for AdminStudents component
  console.log('🏛️ AdminStudents COMPONENT RENDER:');
  console.log('📊 AdminStudents: Students received from hook:', students);
  console.log('📊 AdminStudents: Students count from hook:', students?.length || 0);
  console.log('📊 AdminStudents: Loading state:', loading);
  console.log('📊 AdminStudents: Enrollments:', enrollments);
  
  if (students && students.length > 0) {
    console.log('🏛️ AdminStudents: Processing students from hook:');
    students.forEach((student, index) => {
      console.log(`🎓 AdminStudents Student ${index + 1}:`, {
        id: student.id,
        name: student.name,
        email: student.email,
        status: student.status
      });
    });
  }

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

  console.log('🔍 AdminStudents: Filtered students calculation:');
  console.log('🔍 Original students array:', students);
  console.log('🔍 Search term:', searchTerm);
  console.log('🔍 Filtered result:', filteredStudents);
  console.log('🔍 Filtered count:', filteredStudents.length);

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
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              🔍 INVESTIGATION MODE: Hook students: {students?.length || 0} | Filtered: {filteredStudents.length} | Loading: {loading ? 'Yes' : 'No'}
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
                  
                  {/* Enhanced logging before passing to StudentsTable */}
                  {(() => {
                    console.log('🎭 AdminStudents: About to render StudentsTable with:');
                    console.log('🎭 students prop:', students);
                    console.log('🎭 filteredStudents prop:', filteredStudents);
                    console.log('🎭 students count:', students?.length || 0);
                    console.log('🎭 filteredStudents count:', filteredStudents.length);
                    return null;
                  })()}
                  
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
