
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock, Users } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const StudentCheckIn = () => {
  const { user } = useAuth();
  const { students } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);

  // Fetch available classes
  React.useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase
        .from('classes')
        .select('*')
        .eq('status', 'Active');
      setClasses(data || []);
    };
    fetchClasses();
  }, []);

  const handleCheckIn = async () => {
    if (!selectedStudent || !selectedClass || !user?.id) {
      toast.error("Please select both student and class");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('process_attendance_checkin', {
        p_student_id: selectedStudent,
        p_class_id: selectedClass,
        p_checked_in_by: user.id,
        p_source: 'coach'
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        toast.success(result.message);
        setSelectedStudent("");
        setSelectedClass("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error("Failed to check in student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Student Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Student</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{student.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {student.belt}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose class..." />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{cls.name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{cls.schedule}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleCheckIn} 
          disabled={!selectedStudent || !selectedClass || loading}
          className="w-full"
        >
          {loading ? "Checking In..." : "Check In Student"}
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>Quick check-in validates quotas and prevents duplicates</span>
        </div>
      </CardContent>
    </Card>
  );
};
