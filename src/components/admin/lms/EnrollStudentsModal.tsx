
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Users, AlertCircle, CheckCircle } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { useManualEnrollment } from "@/hooks/useManualEnrollment";
import type { EnrollmentResult } from "@/hooks/useManualEnrollment";

interface EnrollStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export const EnrollStudentsModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: EnrollStudentsModalProps) => {
  const { students, loading: studentsLoading } = useStudents();
  const { bulkEnrollStudents, isEnrolling } = useManualEnrollment();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [note, setNote] = useState("");
  const [filterBelt, setFilterBelt] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [enrollmentResults, setEnrollmentResults] = useState<EnrollmentResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStudents([]);
      setSearchTerm("");
      setStartDate("");
      setNote("");
      setFilterBelt("");
      setFilterStatus("");
      setEnrollmentResults([]);
      setShowResults(false);
    }
  }, [isOpen]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBelt = !filterBelt || student.belt === filterBelt;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesBelt && matchesStatus;
  });

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleEnroll = async () => {
    if (selectedStudents.length === 0) return;

    const results = await bulkEnrollStudents.mutateAsync({
      courseId,
      studentIds: selectedStudents,
      startDate: startDate || undefined,
      note: note || undefined,
    });

    setEnrollmentResults(results);
    setShowResults(true);
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || "Unknown Student";
  };

  const belts = [...new Set(students.map(s => s.belt))];
  const statuses = [...new Set(students.map(s => s.status))];

  if (showResults) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enrollment Results</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-bjj-gray">
              Enrollment results for <strong>{courseTitle}</strong>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {enrollmentResults.map((result) => (
                <div
                  key={result.studentId}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{getStudentName(result.studentId)}</span>
                  </div>
                  <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.message}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Enroll Students in {courseTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-bjj-gray" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="belt-filter">Filter by Belt</Label>
              <select
                id="belt-filter"
                value={filterBelt}
                onChange={(e) => setFilterBelt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Belts</option>
                {belts.map(belt => (
                  <option key={belt} value={belt}>{belt}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Select Students ({selectedStudents.length} selected)</span>
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={studentsLoading || filteredStudents.length === 0}
              >
                {selectedStudents.length === filteredStudents.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {studentsLoading ? (
                <div className="p-4 text-center text-bjj-gray">Loading students...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-4 text-center text-bjj-gray">No students found</div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => handleStudentToggle(student.id)}
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-bjj-navy">{student.name}</div>
                        <div className="text-sm text-bjj-gray">{student.email}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{student.belt}</Badge>
                        <Badge className={student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enrollment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date (Optional)</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note about this enrollment..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isEnrolling}>
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={selectedStudents.length === 0 || isEnrolling}
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
            >
              {isEnrolling ? "Enrolling..." : `Enroll ${selectedStudents.length} Student(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
