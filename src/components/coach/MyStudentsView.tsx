
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentCard } from "./StudentCard";
import { StudentDetailsModal } from "./StudentDetailsModal";
import { useCoachStudents } from "@/hooks/useCoachStudents";
import { Student } from "@/hooks/useStudents";
import { Search, Users, UserCheck, TrendingUp, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const MyStudentsView = () => {
  const { students, loading, stats, refetch } = useCoachStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [beltFilter, setBeltFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesBelt = beltFilter === "all" || student.belt === beltFilter;
    
    return matchesSearch && matchesStatus && matchesBelt;
  });

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleAddNote = (student: Student) => {
    toast.info(`Add note functionality for ${student.name} - Coming soon!`);
  };

  const handleCheckIn = (student: Student) => {
    toast.info(`Check-in functionality for ${student.name} - Coming soon!`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success("Student list refreshed");
    } catch (error) {
      toast.error("Failed to refresh student list");
    } finally {
      setRefreshing(false);
    }
  };

  const belts = ["White", "Blue", "Purple", "Brown", "Black"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{stats.activeStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{stats.todayAttendance}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg. Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bjj-navy">{stats.averageAttendance}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Students ({filteredStudents.length})
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={beltFilter} onValueChange={setBeltFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by belt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Belts</SelectItem>
                {belts.map(belt => (
                  <SelectItem key={belt} value={belt}>{belt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Students Grid */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm || statusFilter !== "all" || beltFilter !== "all" 
                  ? "No students match your filters" 
                  : "No students assigned yet"
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all" || beltFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Students will appear here once they are assigned to you or enrolled in your classes"
                }
              </p>
              {!searchTerm && statusFilter === "all" && beltFilter === "all" && (
                <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2 mx-auto">
                  <RefreshCw className="h-4 w-4" />
                  Refresh to check for new students
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onViewDetails={handleViewDetails}
                  onAddNote={handleAddNote}
                  onCheckIn={handleCheckIn}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
